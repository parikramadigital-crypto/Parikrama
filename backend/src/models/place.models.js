// use tags or keys for search engines and categories.

import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    description: String,
    category: {
      type: String,
      enum: ["Temple", "Nature", "Adventure", "Heritage", "Food", "Other"],
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      // the location coordinates are stored in indexes [0]:longitude and [1]:latitude
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    averageTimeSpent: Number, // in minutes
    bestTimeToVisit: String,
    entryFee: Number,

    images: [
      {
        url: String,
        fileId: String,
      },
    ],

    popularityScore: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

placeSchema.index({ location: "2dsphere" });

export const Place = mongoose.model("Place", placeSchema);
