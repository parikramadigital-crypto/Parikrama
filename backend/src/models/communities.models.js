import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { stringify } from "querystring";

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
      socialLinks: [{ platformName: String, url: String }],
      contactNumber: { type: String, required: true, unique: true },
      pan: { type: String },
      aadhar: { type: String },
      soloTraveler: { type: String, default: "No" },
      travelerInfo: { type: String },
      password: { type: String, required: true, select: false }, // "select:false" is a condition which will not allow the controller to send password with the whole object
    },
    communityDetails: {
      communityName: { type: String },
      gst: { type: String },
      communityContactNumber: { type: String },
      communityEmail: {
        type: String,
        lowercase: true,
        trim: true,
        // unique: true,
      },
      profession: { type: String, trim: true },
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
    members: [
      {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        contactNumber: { type: String, trim: true },
        address: { type: String },
        city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
        state: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
      },
    ],
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

    // follow requests
    userFollowRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
      },
    ],
    communityFollowRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
      },
    ],

    // accepted requests
    acceptedRequestsUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
      },
    ],
    acceptedRequestsCommunity: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
      },
    ],

    // rejected requests
    rejectedRequestsUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
      },
    ],
    rejectedRequestsCommunity: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
      },
    ],
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
