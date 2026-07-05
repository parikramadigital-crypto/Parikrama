import mongoose from "mongoose";

const bookedVehicleSchema = new mongoose.Schema(
  {
    vehicleType: { type: String, required: true },
    maxPersons: { type: Number },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const cityDarshanBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
      index: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      index: true,
    },

    cityDarshan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CityDarshan",
      required: true,
      index: true,
    },

    vehicle: {
      vehicleType: String,
      maxPersons: Number,
      price: Number,
    },

    adults: { type: Number, required: true, min: 1 },

    children: Number,

    travelDate: {
      type: Date,
      required: true,
    },

    pickupLocation: String,

    pickupTime: String,

    specialInstructions: String,

    totalAmount: Number,

    totalTravellers: {
      type: Number,
      default: 1,
    },

    vehicle: {
      type: bookedVehicleSchema,
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: ["Created", "Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Created",
        "Pending",
        "Authorized",
        "Captured",
        "Failed",
        "Cancelled",
        "Refunded",
        "Refund Initiated",
        "Expired",
      ],
      default: "Created",
      index: true,
    },

    paymentTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentTransaction",
      default: null,
    },

    paymentGateway: {
      type: String,
      default: "Razorpay",
    },

    gatewayOrderId: {
      type: String,
      default: null,
    },

    gatewayPaymentId: {
      type: String,
      default: null,
    },

    gatewaySignature: {
      type: String,
      default: null,
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

cityDarshanBookingSchema.index({ user: 1, createdAt: -1 });
cityDarshanBookingSchema.index({ cityDarshan: 1, travelDate: 1 });

export const CityDarshanBooking = mongoose.model(
  "CityDarshanBooking",
  cityDarshanBookingSchema,
);
