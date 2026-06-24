import mongoose from "mongoose";

const travelPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    description: String,
    durationNight: Number,
    durationDay: Number,
    days: Number,
    price: Number,
    numberOfPerson: Number,
    tags: [String],
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    onlyForAdults: { type: String, enum: ["Yes", "No"], default: "No" },
    priority: {
      type: String,
      enum: [
        "hotDeals",
        "trendingDeals",
        "exclusiveDeals",
        "lastMomentPackage",
      ],
      default: "lastMomentPackage",
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
