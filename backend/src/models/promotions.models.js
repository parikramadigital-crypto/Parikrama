import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ["Min", "Mid", "Max"],
      default: "Min",
    },

    images: [
      {
        fileId: { type: String, required: true },
        url: { type: String, required: true },
        altText: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export const Promotion = mongoose.model("Promotion", promotionSchema);
