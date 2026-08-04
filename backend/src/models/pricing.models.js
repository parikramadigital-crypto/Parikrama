import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    modelFor: {
      type: String,
      enum: ["user", "facilitator", "food place", "hotel", "custom"],
      default: "facilitator",
      required: true,
    },
    customModelFor: String,
    customModel: { type: Boolean, default: false },
    modelName: {
      type: String,
      enum: ["Free", "Starter", "Standard", "Professional", "Enterprise"],
      default: "Free",
    },
    tagline: String,
    price: {
      mrp: { type: Number, required: true },
      discount: Number,
      sellingPrice: Number,
    },
    planDuration: {
      type: String,
      enum: ["Quarter", "Half-Year", "Per-Year"],
      default: "Per-Year",
    },
    features: [String],
    faqs: [{ question: String, answer: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Pricing = mongoose.model("Pricing", pricingSchema);
