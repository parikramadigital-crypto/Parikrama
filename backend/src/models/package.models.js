import mongoose from "mongoose";

const travelPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    description: String,
    durationNight: Number,
    durationDay: Number,
    price: Number,
    tags: [String],
    priority: {
      type: String,
      enum: ["hotDeals", "trendingDeals", "exclusiveDeals"],
      default: "exclusiveDeals",
    },
    image: [
      {
        url: String,
        fileId: String,
      },
    ],
  },
  { timestamps: true },
);

export const TravelPackages = mongoose.model(
  "TravelPackages",
  travelPackageSchema,
);
