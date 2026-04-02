import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const communitySchema = new mongoose.Schema(
  {
    personalDetails: {
      name: { type: String, required: true },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true,
      },
      contactNumber: { type: String, required: true, unique: true },
      pan: { type: String },
      aadhar: { type: String },
      password: { type: String, required: true, select: false }, // "select:false" is a condition which will not allow the controller to send password with the whole object
    },
    communityDetails: {
      communityName: { type: String, required: true },
      gst: { type: String },
      communityContactNumber: { type: String, required: true, unique: true },
      communityEmail: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
      },
      profession: { type: String, required: true, trim: true },
      bankDetails: {
        bankName: { type: String },
        ifsc: { type: String },
        branch: { type: String },
        accountNumber: { type: String },
        accountHolderName: { type: String },
      },
    },
    communityEstablishment: { type: Number },
    about: { type: String },
    adminVerified: { type: Boolean, default: false },
    isValid: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    images: {
      profileImage: {
        url: String,
        fileId: String,
      },
      companyLogo: {
        url: String,
        fileId: String,
      },
    },
  },
  { timestamps: true },
);

communitySchema.pre("save", async function () {
  if (!this.isModified("personalDetails.password")) return;
  this.personalDetails.password = await bcrypt.hash(
    this.personalDetails.password,
    10,
  );
});

communitySchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.personalDetails.password);
};

communitySchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Community" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

communitySchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Community" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

export const Community = mongoose.model("Community", communitySchema);
