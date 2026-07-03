import { PaymentTransaction } from "../models/paymentTransaction.models.js";
import { generateTransactionNumber } from "../utils/generateTransactionNumber.js";
import {
  PAYMENT_STATUS,
  BOOKING_STATUS,
  PAYMENT_GATEWAYS,
} from "../constants/payment.constants.js";

/**
 * Create a new payment transaction
 */
export const createTransaction = async ({
  module,
  moduleId,
  user,
  amount,
  currency = "INR",
  gateway = PAYMENT_GATEWAYS.RAZORPAY,
  metadata = {},
}) => {
  return PaymentTransaction.create({
    transactionNumber: generateTransactionNumber(),
    module,
    moduleId,
    user,
    amount,
    currency,
    gateway,
    paymentStatus: PAYMENT_STATUS.CREATED,
    bookingStatus: BOOKING_STATUS.CREATED,
    metadata,
  });
};

/**
 * Save Razorpay order details
 */
export const updateGatewayOrder = async (
  transactionId,
  { orderId, receipt, amount, currency, notes = {} },
) => {
  return PaymentTransaction.findByIdAndUpdate(
    transactionId,
    {
      gatewayOrderId: orderId,
      receipt,
      amount,
      currency,
      paymentStatus: PAYMENT_STATUS.PENDING,
      metadata: {
        ...(notes || {}),
      },
    },
    { new: true },
  );
};

/**
 * Mark payment success
 */
export const markPaymentSuccess = async (
  transactionId,
  {
    paymentId,
    signature,
    paymentDate = new Date(),
    remarks = "Payment captured successfully",
    gatewayPayload = null,
  },
) => {
  return PaymentTransaction.findByIdAndUpdate(
    transactionId,
    {
      gatewayPaymentId: paymentId,
      gatewaySignature: signature,
      paymentDate,
      paymentStatus: PAYMENT_STATUS.CAPTURED,
      bookingStatus: BOOKING_STATUS.CONFIRMED,
      remarks,
      ...(gatewayPayload
        ? {
            metadata: {
              gatewayPayload,
            },
          }
        : {}),
    },
    { new: true },
  );
};

/**
 * Mark payment failed
 */
export const markPaymentFailed = async (
  transactionId,
  remarks = "Payment failed",
  gatewayPayload = null,
) => {
  return PaymentTransaction.findByIdAndUpdate(
    transactionId,
    {
      paymentStatus: PAYMENT_STATUS.FAILED,
      remarks,
      ...(gatewayPayload
        ? {
            metadata: {
              gatewayPayload,
            },
          }
        : {}),
    },
    { new: true },
  );
};

/**
 * Mark payment refunded
 */
export const markPaymentRefunded = async (
  transactionId,
  remarks = "Payment refunded",
  gatewayPayload = null,
) => {
  return PaymentTransaction.findByIdAndUpdate(
    transactionId,
    {
      paymentStatus: PAYMENT_STATUS.REFUNDED,
      remarks,
      ...(gatewayPayload
        ? {
            metadata: {
              gatewayPayload,
            },
          }
        : {}),
    },
    { new: true },
  );
};

/**
 * Mark payment cancelled
 */
export const markPaymentCancelled = async (
  transactionId,
  remarks = "Payment cancelled",
) => {
  return PaymentTransaction.findByIdAndUpdate(
    transactionId,
    {
      paymentStatus: PAYMENT_STATUS.CANCELLED,
      remarks,
    },
    { new: true },
  );
};

/**
 * Get transaction by DB id
 */
export const getTransactionById = async (transactionId) => {
  return PaymentTransaction.findById(transactionId).populate(
    "user",
    "name email contactNumber",
  );
};

/**
 * Get transaction by transaction number
 */
export const getTransactionByNumber = async (transactionNumber) => {
  return PaymentTransaction.findOne({ transactionNumber }).populate(
    "user",
    "name email contactNumber",
  );
};

/**
 * Get transaction by Razorpay order id
 */
export const getTransactionByOrderId = async (gatewayOrderId) => {
  return PaymentTransaction.findOne({ gatewayOrderId }).populate(
    "user",
    "name email contactNumber",
  );
};

/**
 * Get transaction by Razorpay payment id
 */
export const getTransactionByPaymentId = async (gatewayPaymentId) => {
  return PaymentTransaction.findOne({ gatewayPaymentId }).populate(
    "user",
    "name email contactNumber",
  );
};

/**
 * Retry payment eligibility
 */
export const isRetryableTransaction = (transaction) => {
  return [
    PAYMENT_STATUS.CREATED,
    PAYMENT_STATUS.PENDING,
    PAYMENT_STATUS.FAILED,
    PAYMENT_STATUS.CANCELLED,
    PAYMENT_STATUS.EXPIRED,
  ].includes(transaction.paymentStatus);
};
