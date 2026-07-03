import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  PAYMENT_MODULES,
  PAYMENT_GATEWAYS,
  PAYMENT_STATUS,
} from "../constants/payment.constants.js";

import { verifyRazorpaySignature } from "../utils/verifyRazorpaySignature.js";
import { verifyRazorpayWebhookSignature } from "../utils/verifyRazorpayWebhookSignature.js";

import {
  createRazorpayOrder,
  fetchRazorpayPayment,
} from "../services/razorpay.service.js";

import {
  createTransaction,
  updateGatewayOrder,
  getTransactionById,
  getTransactionByOrderId,
  getTransactionByPaymentId,
  markPaymentSuccess,
  markPaymentFailed,
  markPaymentRefunded,
  isRetryableTransaction,
} from "../services/payment.service.js";

import {
  runPaymentSuccessHandler,
  runPaymentFailedHandler,
} from "../services/paymentModuleHandlers.service.js";

/**
 * CREATE PAYMENT
 */
const createPayment = asyncHandler(async (req, res) => {
  const {
    module,
    moduleId,
    user,
    amount,
    currency = "INR",
    metadata = {},
  } = req.body;

  if (!module || !moduleId || !user || !amount) {
    throw new ApiError(
      400,
      "module, moduleId, user and amount are required",
    );
  }

  if (!Object.values(PAYMENT_MODULES).includes(module)) {
    throw new ApiError(400, "Invalid payment module");
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw new ApiError(400, "Invalid amount");
  }

  const transaction = await createTransaction({
    module,
    moduleId,
    user,
    amount: numericAmount,
    currency,
    gateway: PAYMENT_GATEWAYS.RAZORPAY,
    metadata,
  });

  const razorpayOrder = await createRazorpayOrder({
    amount: numericAmount,
    currency,
    receipt: transaction.transactionNumber,
    notes: {
      transactionId: transaction._id.toString(),
      transactionNumber: transaction.transactionNumber,
      module,
      moduleId: moduleId.toString(),
      user: user.toString(),
    },
  });

  if (!razorpayOrder?.id) {
    throw new ApiError(500, "Unable to create Razorpay order");
  }

  const updatedTransaction = await updateGatewayOrder(transaction._id, {
    orderId: razorpayOrder.id,
    receipt: razorpayOrder.receipt,
    amount: razorpayOrder.amount / 100,
    currency: razorpayOrder.currency,
    notes: razorpayOrder.notes || {},
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        transaction: {
          _id: updatedTransaction._id,
          transactionNumber: updatedTransaction.transactionNumber,
          module: updatedTransaction.module,
          moduleId: updatedTransaction.moduleId,
          user: updatedTransaction.user,
          amount: updatedTransaction.amount,
          currency: updatedTransaction.currency,
          paymentStatus: updatedTransaction.paymentStatus,
          bookingStatus: updatedTransaction.bookingStatus,
          gatewayOrderId: updatedTransaction.gatewayOrderId,
          receipt: updatedTransaction.receipt,
        },
        razorpay: {
          key: process.env.RAZORPAY_KEY_ID,
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Parikrama",
          description: `${module} payment`,
        },
      },
      "Payment transaction created successfully",
    ),
  );
});

/**
 * GET SINGLE TRANSACTION
 */
const getPaymentTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    throw new ApiError(400, "Transaction id is required");
  }

  const transaction = await getTransactionById(transactionId);

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, transaction, "Transaction fetched successfully"),
    );
});

/**
 * VERIFY PAYMENT
 * This is called from frontend after Razorpay success callback
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    transactionId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !transactionId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    throw new ApiError(400, "Payment verification data is incomplete");
  }

  const transaction = await getTransactionById(transactionId);

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  if (transaction.paymentStatus === PAYMENT_STATUS.CAPTURED) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, transaction, "Payment already verified"),
      );
  }

  if (transaction.gatewayOrderId !== razorpay_order_id) {
    throw new ApiError(400, "Razorpay order mismatch");
  }

  const isValidSignature = verifyRazorpaySignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!isValidSignature) {
    await markPaymentFailed(
      transaction._id,
      "Invalid Razorpay payment signature",
    );

    await runPaymentFailedHandler(transaction);

    throw new ApiError(400, "Invalid payment signature");
  }

  /**
   * Fetch payment from Razorpay for extra validation
   */
  const payment = await fetchRazorpayPayment(razorpay_payment_id);

  if (!payment) {
    await markPaymentFailed(
      transaction._id,
      "Unable to fetch payment details from Razorpay",
    );

    await runPaymentFailedHandler(transaction);

    throw new ApiError(400, "Unable to fetch payment details");
  }

  if (payment.order_id !== razorpay_order_id) {
    await markPaymentFailed(
      transaction._id,
      "Payment order id mismatch",
      payment,
    );

    await runPaymentFailedHandler(transaction);

    throw new ApiError(400, "Payment order mismatch");
  }

  if (payment.status !== "captured" && payment.status !== "authorized") {
    await markPaymentFailed(
      transaction._id,
      `Payment status invalid: ${payment.status}`,
      payment,
    );

    await runPaymentFailedHandler(transaction);

    throw new ApiError(400, `Payment is not successful. Status: ${payment.status}`);
  }

  const updatedTransaction = await markPaymentSuccess(transaction._id, {
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    paymentDate: new Date(),
    remarks: "Payment verified successfully via frontend callback",
    gatewayPayload: payment,
  });

  await runPaymentSuccessHandler(updatedTransaction);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        transaction: updatedTransaction,
        payment,
      },
      "Payment verified successfully",
    ),
  );
});

/**
 * PAYMENT WEBHOOK
 * IMPORTANT:
 * In app.js / express, use raw body or preserve raw payload for webhook route
 */
const paymentWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  if (!signature) {
    throw new ApiError(400, "Webhook signature missing");
  }

  /**
   * IMPORTANT:
   * req.body for webhook should be raw JSON string or Buffer converted to string.
   * If your express middleware parses JSON first, signature verification may fail.
   */
  const rawBody =
    typeof req.body === "string"
      ? req.body
      : Buffer.isBuffer(req.body)
        ? req.body.toString("utf8")
        : JSON.stringify(req.body);

  const isValidWebhook = verifyRazorpayWebhookSignature(rawBody, signature);

  if (!isValidWebhook) {
    throw new ApiError(400, "Invalid webhook signature");
  }

  const payload =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const event = payload.event;
  const paymentEntity = payload?.payload?.payment?.entity;
  const orderEntity = payload?.payload?.order?.entity;

  if (!paymentEntity && !orderEntity) {
    return res.status(200).json({ success: true, message: "No action required" });
  }

  let transaction = null;

  /**
   * Prefer order_id based lookup
   */
  if (paymentEntity?.order_id) {
    transaction = await getTransactionByOrderId(paymentEntity.order_id);
  }

  /**
   * fallback: paymentId based lookup
   */
  if (!transaction && paymentEntity?.id) {
    transaction = await getTransactionByPaymentId(paymentEntity.id);
  }

  /**
   * fallback: order entity id
   */
  if (!transaction && orderEntity?.id) {
    transaction = await getTransactionByOrderId(orderEntity.id);
  }

  if (!transaction) {
    return res.status(200).json({
      success: true,
      message: "Transaction not found for webhook event",
    });
  }

  /**
   * Handle success events
   */
  if (
    event === "payment.captured" ||
    event === "payment.authorized"
  ) {
    if (transaction.paymentStatus !== PAYMENT_STATUS.CAPTURED) {
      const updatedTransaction = await markPaymentSuccess(transaction._id, {
        paymentId: paymentEntity.id,
        signature: signature,
        paymentDate: new Date(),
        remarks: `Payment updated via webhook event: ${event}`,
        gatewayPayload: payload,
      });

      await runPaymentSuccessHandler(updatedTransaction);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook payment success processed",
    });
  }

  /**
   * Handle failure events
   */
  if (event === "payment.failed") {
    await markPaymentFailed(
      transaction._id,
      "Payment failed via webhook",
      payload,
    );

    await runPaymentFailedHandler(transaction);

    return res.status(200).json({
      success: true,
      message: "Webhook payment failure processed",
    });
  }

  /**
   * Handle refund events
   */
  if (
    event === "refund.processed" ||
    event === "payment.refunded"
  ) {
    await markPaymentRefunded(
      transaction._id,
      "Payment refunded via webhook",
      payload,
    );

    return res.status(200).json({
      success: true,
      message: "Webhook refund processed",
    });
  }

  /**
   * Unhandled events — acknowledge
   */
  return res.status(200).json({
    success: true,
    message: `Webhook received for event ${event}`,
  });
});

/**
 * RETRY PAYMENT
 * Generates a fresh Razorpay order for an existing transaction
 */
const retryPayment = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    throw new ApiError(400, "Transaction id is required");
  }

  const transaction = await getTransactionById(transactionId);

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  if (!isRetryableTransaction(transaction)) {
    throw new ApiError(
      400,
      `Transaction cannot be retried in status ${transaction.paymentStatus}`,
    );
  }

  const razorpayOrder = await createRazorpayOrder({
    amount: transaction.amount,
    currency: transaction.currency || "INR",
    receipt: transaction.transactionNumber,
    notes: {
      transactionId: transaction._id.toString(),
      transactionNumber: transaction.transactionNumber,
      module: transaction.module,
      moduleId: transaction.moduleId.toString(),
      user: transaction.user?._id?.toString() || transaction.user.toString(),
      retry: "true",
    },
  });

  if (!razorpayOrder?.id) {
    throw new ApiError(500, "Unable to create retry order");
  }

  const updatedTransaction = await updateGatewayOrder(transaction._id, {
    orderId: razorpayOrder.id,
    receipt: razorpayOrder.receipt,
    amount: razorpayOrder.amount / 100,
    currency: razorpayOrder.currency,
    notes: {
      ...(transaction.metadata || {}),
      retry: true,
    },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        transaction: updatedTransaction,
        razorpay: {
          key: process.env.RAZORPAY_KEY_ID,
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Parikrama",
          description: `${transaction.module} payment retry`,
        },
      },
      "Retry payment order created successfully",
    ),
  );
});

export {
  createPayment,
  getPaymentTransaction,
  verifyPayment,
  paymentWebhook,
  retryPayment,
};