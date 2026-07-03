import mongoose from "mongoose";

import {
  PAYMENT_GATEWAYS,
  PAYMENT_STATUS,
  BOOKING_STATUS,
  PAYMENT_MODULES,
} from "../constants/payment.constants.js";

const paymentTransactionSchema = new mongoose.Schema(
  {
    transactionNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    module: {
      type: String,
      enum: Object.values(PAYMENT_MODULES),
      required: true,
      index: true,
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "INR",
    },

    gateway: {
      type: String,
      enum: Object.values(PAYMENT_GATEWAYS),
      default: PAYMENT_GATEWAYS.RAZORPAY,
    },

    gatewayOrderId: String,

    gatewayPaymentId: String,

    gatewaySignature: String,

    receipt: String,

    invoiceNumber: String,

    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
      index: true,
    },

    bookingStatus: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.CREATED,
    },

    paymentDate: Date,

    remarks: String,

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

paymentTransactionSchema.index({
  user: 1,
  createdAt: -1,
});

paymentTransactionSchema.index({
  module: 1,
  moduleId: 1,
});

paymentTransactionSchema.index({
  paymentStatus: 1,
  bookingStatus: 1,
});

export const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema,
);
