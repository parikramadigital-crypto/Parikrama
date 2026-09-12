import mongoose from "mongoose";

const foodCourtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true },
    specialFood: [String],
    category: {
      type: String,
      enum: ["Veg", "Non-Veg", "Both"],
      default: "Veg",
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] },
      // coordinates: { type: [Number], required: true },
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    executive: { type: mongoose.Schema.Types.ObjectId, ref: "Executive" },
    storeImages: [{ url: String, fileId: String }],
    foodImages: [{ url: String, fileId: String }],
    menuImages: [{ url: String, fileId: String }],
    establishment: { type: String },
    ratings: {
      hygieneAvg: { type: Number, default: 0 },
      foodAvg: { type: Number, default: 0 },
      behaviourAvg: { type: Number, default: 0 },
      overallAvg: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
    reviews: [
      {
        customerName: { type: String },
        customerPhone: { type: String },
        hygiene: { type: Number, min: 0, max: 5 },
        food: { type: Number, min: 0, max: 5 },
        behaviour: { type: Number, min: 0, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    active: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const FoodCourt = mongoose.model("FoodCourt", foodCourtSchema);
