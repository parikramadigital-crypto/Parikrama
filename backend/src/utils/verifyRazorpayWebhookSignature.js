import crypto from "crypto";

export const verifyRazorpayWebhookSignature = (payload, signature) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
};