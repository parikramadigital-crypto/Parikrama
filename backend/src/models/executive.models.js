import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const executiveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true },
    alternateContactNumber: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true },
    image: { url: String, fileId: String },
    password: { type: String, required: true, trim: true },
    otherCity: { type: Boolean, default: false },
    otherCityName: String,
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    otherState: { type: Boolean, default: false },
    otherStateName: String,
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);

executiveSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

executiveSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

executiveSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Executive" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

executiveSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Executive" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

export const Executive = mongoose.model("Executive", executiveSchema);
