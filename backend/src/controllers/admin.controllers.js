import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";
import Jwt from "jsonwebtoken";
import { State } from "../models/state.models.js";
import { City } from "../models/city.models.js";
import { Place } from "../models/place.models.js";
// import { generateUniqueEmployeePin } from "../utils/UniquePinEmployee.js";

const regenerateAdminRefreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const admin = await Admin.findById(decoded._id).select("-password");
  if (!admin) throw new ApiError(401, "Invalid refresh token");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    admin._id,
    "Admin"
  );

  return res.status(201).json(
    new ApiResponse(201, {
      user: admin,
      tokens: { AccessToken, RefreshToken },
    })
  );
});

const registerAdmin = asyncHandler(async (req, res, next) => {
  const { name, employeeId, email, phoneNumber, password } = req.body;
  //   const { adminId } = req.params;
  //   if (!adminId) {
  //     return new ApiError(400, "Invalid admin");
  //   }
  //   const validId = await Admin.findById(adminId);
  //   if (!validId) {
  //     return new ApiError(400, "Invalid admin");
  //   }

  // Validation
  if (!name || !employeeId || !email || !phoneNumber || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Check existing admin
  const existingAdmin = await Admin.findOne({
    $or: [{ email }, { employeeId }],
  });

  if (existingAdmin) {
    return next(
      new ApiError(400, "Admin with same email or employeeId already exists")
    );
  }

  // Create admin
  const admin = await Admin.create({
    name,
    employeeId,
    email,
    phoneNumber,
    password, // hashed by pre-save hook
  });

  // Remove sensitive fields
  const adminData = await Admin.findById(admin._id).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(201, adminData, "Admin registered successfully"));
});
/* =======================
   Admin LOGIN
======================= */
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ email });
  if (!admin) throw new ApiError(401, "Invalid credentials");

  const isValid = await admin.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    admin._id,
    "Admin"
  );

  return res.status(200).json(
    new ApiResponse(200, {
      admin,
      tokens: {
        AccessToken,
        RefreshToken,
      },
    })
  );
});

const dashboardData = asyncHandler(async (req, res) => {
  const state = await State.find();
  const city = await City.find().populate("state");
  const place = await Place.find().populate("city state");

  return res.status(200).json(
    new ApiResponse(200, {
      state,
      city,
      place,
    })
  );
});

export {
  loginAdmin,
  regenerateAdminRefreshToken,
  registerAdmin,
  dashboardData,
};
