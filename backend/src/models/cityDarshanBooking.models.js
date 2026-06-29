import mongoose from "mongoose";

const cityDarshanBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
      required: true,
    },

    cityDarshan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CityDarshan",
      required: true,
    },

    vehicle: {
      vehicleType: String,
      maxPersons: Number,
      price: Number,
    },

    adults: Number,

    children: Number,

    travelDate: {
      type: Date,
      required: true,
    },

    pickupLocation: String,

    pickupTime: String,

    specialInstructions: String,

    totalAmount: Number,

    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "Failed"],
      default: "Pending",
    },

    paymentId: String,
  },
  {
    timestamps: true,
  },
);

export const CityDarshanBooking = mongoose.model(
  "CityDarshanBooking",
  cityDarshanBookingSchema,
);
