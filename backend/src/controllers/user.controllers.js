import { Admin } from "../models/admin.models.js";
import { City } from "../models/city.models.js";
import { Place } from "../models/place.models.js";
import { State } from "../models/state.models.js";
import { UserSchema } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";
import Jwt from "jsonwebtoken";

const createUser = asyncHandler(async (req, res) => {
  const { contactNumber } = req.body;

  const user = await UserSchema.findOne({ contactNumber });
  if (user)
    throw new ApiError(
      400,
      "User already registered with this contact number, please login",
    );

  const newUser = await UserSchema.create({
    contactNumber,
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  newUser.otp = otp;
  await newUser.save();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        otp,
        newUser,
      },
      "User registered successfully",
    ),
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const contactNumber  = req.body;

  const user = await UserSchema.findOne(contactNumber);
  if (!user) throw new ApiError(404, "User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        otp,
        user,
      },
      "User registered successfully",
    ),
  );
});

const verifyUserOtp = asyncHandler(async (req, res) => {
  const { contactNumber, otp, userId } = req.body;

  if (!contactNumber || !otp || !userId) {
    throw new ApiError(404, "Invalid request please try again later !");
  }

  const user = await UserSchema.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found please try again");
  }

  if (String(user.otp) !== String(otp)) {
    // Delete wrong registration
    await UserSchema.findOneAndDelete(contactNumber);

    throw new ApiError(
      401,
      "Invalid OTP. Registration cancelled. Please register again.",
    );
  }

  user.otp = undefined;

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, tokens: { accessToken, refreshToken } },
        "OTP verified successfully !",
      ),
    );
});

const refreshUserToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await UserSchema.findById(decoded._id);
  console.log("before condition", decoded._id);
  if (!user) throw new ApiError(401, "Invalid refresh token");
  console.log("after condition", decoded._id);

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user._id,
    "User",
  );

  return res.status(201).json(
    new ApiResponse(201, {
      user: user,
      tokens: { AccessToken, RefreshToken },
    }),
  );
});

export { createUser, verifyUserOtp, refreshUserToken, loginUser };
