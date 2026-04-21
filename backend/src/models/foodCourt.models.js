import mongoose from "mongoose";

const foodCourtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
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
    storeImages: [{ url: String, fileId: String }],
    foodImages: [{ url: String, fileId: String }],
    menuImages: [{ url: String, fileId: String }],
    establishment: { type: String },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
        comment: { String },
        rating: { type: Number, default: 0 },
      },
    ],
    active: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const FoodCourt = mongoose.model("FoodCourt", foodCourtSchema);
