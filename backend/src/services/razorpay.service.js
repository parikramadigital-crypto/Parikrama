import razorpay from "../config/razorpay.config.js";

export const createRazorpayOrder = async ({
  amount,
  receipt,
  currency = "INR",
  notes = {},
}) => {
  return razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt,
    notes,
  });
};

export const fetchRazorpayPayment = async (paymentId) => {
  return razorpay.payments.fetch(paymentId);
};

export const fetchRazorpayOrder = async (orderId) => {
  return razorpay.orders.fetch(orderId);
};

export const refundRazorpayPayment = async (paymentId, amount = null) => {
  return razorpay.payments.refund(paymentId, {
    amount: amount ? Math.round(Number(amount) * 100) : undefined,
  });
};