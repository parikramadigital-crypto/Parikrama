import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      enum: [
        "Mini (Hatchback)",
        "Sedan",
        "SUV",
        "MUV",
        "Tempo Traveller",
        "Luxury Sedan",
        "Luxury SUV",
      ],
      required: true,
    },

    maxPersons: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cityDarshanSchema = new mongoose.Schema(
  {
    /* ================= BASIC ================= */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    /* ================= LOCATION ================= */

    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    /* ================= TOUR DETAILS ================= */

    numberOfAdults: {
      type: Number,
      default: 2,
    },

    numberOfChildren: {
      type: Number,
      default: 0,
    },

    placesToCover: [
      {
        type: String,
        trim: true,
      },
    ],

    totalDistance: Number,

    totalHours: Number,

    pickupTime: String,

    dropTime: String,

    /* ================= VEHICLES ================= */

    vehicles: [vehicleSchema],

    /* ================= PACKAGE DETAILS ================= */

    inclusions: [String],

    exclusions: [String],

    /* ================= IMAGES ================= */

    images: [
      {
        url: String,
        fileId: String,
      },
    ],

    /* ================= STATUS ================= */

    priority: {
      type: String,
      enum: [
        "featured",
        "recommended",
        "popular",
        "normal",
      ],
      default: "normal",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CityDarshan = mongoose.model(
  "CityDarshan",
  cityDarshanSchema
);