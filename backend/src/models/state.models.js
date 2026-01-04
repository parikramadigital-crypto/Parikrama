import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, trim: true }, // MP, RJ, etc
  },
  { timestamps: true }
);

export const State = mongoose.model("State", stateSchema);
