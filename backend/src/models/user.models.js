import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Invalid contact number",
      },
    },
    address: { type: String },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },
    otp: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: "User" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: "User" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

export const UserSchema = mongoose.model("UserSchema", userSchema);
