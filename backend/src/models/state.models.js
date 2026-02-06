import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, trim: true }, // MP, RJ, etc
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
  },
  { timestamps: true },
);

export const State = mongoose.model("State", stateSchema);
