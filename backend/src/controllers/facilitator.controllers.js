import { Facilitator } from "../models/facilitator.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages } from "../utils/imageKit.io.js";
import Jwt from "jsonwebtoken";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";
import { Admin } from "../models/admin.models.js";

const registerFacilitator = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    place,
    city,
    state,
    experienceYears,
    bio,
    languages,
    documentNumber,
  } = req.body;

  console.log(
    name,
    email,
    phone,
    password,
    role,
    place,
    city,
    state,
    experienceYears,
    bio,
    languages,
    documentNumber,
  );
  if (!name || !phone || !password || !role || !place || !city || !state) {
    throw new ApiError(400, "Required fields missing");
  }

  const existing = await Facilitator.findOne({
    $or: [{ phone }, ...(email ? [{ email }] : [])],
  });

  if (existing) {
    throw new ApiError(409, "Facilitator already exists");
  }
  // Must be at least 8 characters, contain 1 uppercase, 1 lowercase, 1 digit, and 1 special character
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
      password,
    )
  ) {
    throw new ApiError(400, "Invalid password");
  }

  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/\s+/g, "-");

  const safeName = sanitize(name);
  const safePhone = sanitize(phone);

  /* ---------------- PROFILE IMAGE ---------------- */
  let profileImages = [];
  if (req.files?.profileImage?.length) {
    const img = req.files.profileImage[0];
    const uploaded = await UploadImages(img.filename, {
      folderStructure: `facilitators/${safeName}-${safePhone}/profile`,
    });

    profileImages.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
    });
  }

  /* ---------------- DOCUMENT IMAGES ---------------- */
  let documents = [];
  if (req.files?.documentImage?.length) {
    for (const doc of req.files.documentImage) {
      const uploaded = await UploadImages(doc.filename, {
        folderStructure: `facilitators/${safeName}-${safePhone}/documents`,
      });

      documents.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const facilitator = await Facilitator.create({
    name,
    email,
    phone,
    password,
    role,
    place,
    city,
    state,
    experienceYears: Number(experienceYears) || 0,
    languages: languages ? languages.split(",").map((l) => l.trim()) : [],
    images: profileImages,
    bio,
    languages,
    verification: {
      documentNumber,
      documents: documents,
    },
    otp,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      // { otp },
      { facilitator, otp },
      "Facilitator registered successfully",
    ),
  );
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { facilitatorId, otp } = req.body;

  if (!facilitatorId || !otp) {
    throw new ApiError(400, "Facilitator ID and OTP are required");
  }

  // Find facilitator
  const facilitator = await Facilitator.findById(facilitatorId);

  if (!facilitator) {
    throw new ApiError(
      404,
      "Facilitator not found please restart registration !",
    );
  }

  // Compare OTP
  if (String(facilitator.otp) !== String(otp)) {
    // Delete wrong registration
    await Facilitator.findByIdAndDelete(facilitatorId);

    throw new ApiError(
      401,
      "Invalid OTP. Registration cancelled. Please register again.",
    );
  }

  // OTP MATCHED
  facilitator.isVerified = true;
  facilitator.otp = undefined; // remove otp
  facilitator.otpExpiresAt = undefined;

  await facilitator.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        facilitator,
        "OTP verified successfully. Registration completed.",
      ),
    );
});

const loginFacilitator = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    throw new ApiError(400, "Email/Phone and password required");
  }

  // Find facilitator WITH relations
  const facilitator = await Facilitator.findOne({
    ...(email ? { email } : { phone }),
  })
    .select("+password +refreshToken")
    .populate("state city place");

  if (!facilitator) {
    throw new ApiError(404, "Facilitator not found");
  }

  if (!facilitator.isActive) {
    throw new ApiError(403, "Account disabled");
  }

  const isMatch = await facilitator.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = facilitator.generateAccessToken();
  const refreshToken = facilitator.generateRefreshToken();

  facilitator.refreshToken = refreshToken;
  facilitator.lastLoginAt = new Date();
  await facilitator.save();

  // Remove password before sending
  facilitator.password = undefined;
  facilitator.refreshToken = undefined;

  console.log(facilitator);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        facilitator,
        tokens: { accessToken, refreshToken },
      },
      "Login successful",
    ),
  );
});

const logoutFacilitator = asyncHandler(async (req, res) => {
  const facilitatorId = req.user._id;

  await Facilitator.findByIdAndUpdate(facilitatorId, {
    $unset: { refreshToken: 1 },
  });

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

const refreshFacilitatorToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const facilitator = await Facilitator.findById(decoded._id)
    .select("-password")
    .populate("state city place");
  if (!facilitator) throw new ApiError(401, "Invalid refresh token");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    facilitator._id,
    "Facilitator",
  );

  return res.status(201).json(
    new ApiResponse(201, {
      user: facilitator,
      tokens: { AccessToken, RefreshToken },
    }),
  );
});

const getCurrentFacilitator = asyncHandler(async (req, res) => {
  const { facilitatorId } = req.params;
  const facilitator =
    await Facilitator.findById(facilitatorId).populate("state city place");

  if (!facilitator) {
    throw new ApiError(404, "Facilitator not found");
  }

  res.status(200).json(new ApiResponse(200, facilitator));
});

const facilitatorDashboard = asyncHandler(async (req, res) => {
  const { facilitatorId } = req.params;
  console.log(facilitatorId);
  if (!facilitatorId) return new ApiError(404, "Id not valid");

  const facilitator =
    await Facilitator.findById(facilitatorId).populate("state city place");

  if (!facilitator) throw new ApiError(404, "Facilitator not found");

  res.status(200).json(new ApiResponse(200, facilitator));
});

const updateFacilitatorProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "bio", "experienceYears", "languages"];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const facilitator = await Facilitator.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true },
  );

  res.status(200).json(new ApiResponse(200, facilitator, "Profile updated"));
});

const addFacilitatorSlots = asyncHandler(async (req, res) => {
  const { slots } = req.body;

  if (!Array.isArray(slots) || slots.length === 0) {
    throw new ApiError(400, "Slots array required");
  }

  const facilitator = await Facilitator.findById(req.user._id);

  slots.forEach((slot) => {
    facilitator.slots.push({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
  });

  await facilitator.save();

  res.status(200).json(new ApiResponse(200, facilitator.slots, "Slots added"));
});

const bookFacilitatorSlot = asyncHandler(async (req, res) => {
  const { facilitatorId, slotId } = req.body;

  const facilitator = await Facilitator.findById(facilitatorId);
  if (!facilitator || !facilitator.isVerified) {
    throw new ApiError(404, "Facilitator unavailable");
  }

  const slot = facilitator.slots.id(slotId);
  if (!slot || slot.isBooked) {
    throw new ApiError(400, "Slot unavailable");
  }

  slot.isBooked = true;

  facilitator.bookings.push({
    user: req.user._id,
    slotId,
    bookingDate: new Date(),
    status: "Confirmed",
  });

  facilitator.totalBookings += 1;
  await facilitator.save();

  res.status(200).json(new ApiResponse(200, null, "Slot booked successfully"));
});

const verifyFacilitator = asyncHandler(async (req, res) => {
  const { facilitatorId, status, remarks } = req.body;

  const facilitator = await Facilitator.findById(facilitatorId);
  if (!facilitator) {
    throw new ApiError(404, "Facilitator not found");
  }

  facilitator.verification.status = status;
  facilitator.verification.remarks = remarks;
  facilitator.verification.verifiedBy = req.user._id;
  facilitator.verification.verifiedAt = new Date();
  facilitator.isVerified = status === "Approved";

  await facilitator.save();

  res
    .status(200)
    .json(new ApiResponse(200, facilitator, "Verification updated"));
});

const addFacilitatorReview = asyncHandler(async (req, res) => {
  const { facilitatorId } = req.params;

  const {
    customerName,
    customerPhone,
    communication,
    knowledge,
    behaviour,
    comment,
  } = req.body;

  /* ---------- VALIDATION ---------- */

  if (
    !customerName ||
    !customerPhone ||
    communication == null ||
    knowledge == null ||
    behaviour == null
  ) {
    throw new ApiError(400, "All rating fields are required");
  }

  if (
    communication < 0 ||
    communication > 5 ||
    knowledge < 0 ||
    knowledge > 5 ||
    behaviour < 0 ||
    behaviour > 5
  ) {
    throw new ApiError(400, "Ratings must be between 0 and 5");
  }

  const facilitator = await Facilitator.findById(facilitatorId);

  if (!facilitator) {
    throw new ApiError(404, "Facilitator not found");
  }

  /* ---------- DUPLICATE CHECK ---------- */

  const alreadyReviewed = facilitator.reviews.find(
    (r) => r.customerPhone === customerPhone,
  );

  if (alreadyReviewed) {
    throw new ApiError(409, "You already reviewed this facilitator");
  }

  /* ---------- PUSH REVIEW ---------- */

  facilitator.reviews.push({
    customerName,
    customerPhone,
    communication,
    knowledge,
    behaviour,
    comment,
  });

  /* ---------- RECALCULATE AVERAGES ---------- */

  const total = facilitator.reviews.length;

  let commSum = 0;
  let knowSum = 0;
  let behSum = 0;

  facilitator.reviews.forEach((r) => {
    commSum += r.communication;
    knowSum += r.knowledge;
    behSum += r.behaviour;
  });

  facilitator.ratings.communicationAvg = Number((commSum / total).toFixed(1));

  facilitator.ratings.knowledgeAvg = Number((knowSum / total).toFixed(1));

  facilitator.ratings.behaviourAvg = Number((behSum / total).toFixed(1));

  facilitator.ratings.overallAvg = Number(
    (
      (facilitator.ratings.communicationAvg +
        facilitator.ratings.knowledgeAvg +
        facilitator.ratings.behaviourAvg) /
      3
    ).toFixed(1),
  );

  facilitator.ratings.totalReviews = total;

  await facilitator.save();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        ratings: facilitator.ratings,
        latestReview: facilitator.reviews[facilitator.reviews.length - 1],
      },
      "Review added successfully",
    ),
  );
});

const activateFacilitator = asyncHandler(async (req, res) => {
  const { adminId, facilitatorId } = req.params;
  if (!adminId || !facilitatorId) throw new ApiError(400, "Invalid request");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Not a valid admin");

  const facilitator = await Facilitator.findByIdAndUpdate(facilitatorId, {
    isVerified: true,
  });
  if (!facilitator) throw new ApiError(400, "Not a valid facilitator");

  res
    .status(201)
    .json(new ApiResponse(201, facilitator, "Activated successfully"));
});

const deactivateFacilitator = asyncHandler(async (req, res) => {
  const { adminId, facilitatorId } = req.params;
  if (!adminId || !facilitatorId) throw new ApiError(400, "Invalid request");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Not a valid admin");

  const facilitator = await Facilitator.findByIdAndUpdate(facilitatorId, {
    isVerified: false,
  });
  if (!facilitator) throw new ApiError(400, "Not a valid facilitator");

  res
    .status(201)
    .json(new ApiResponse(201, facilitator, "Deactivated successfully"));
});

const AcceptDocumentVerification = asyncHandler(async (req, res) => {
  const { adminId, facilitatorId } = req.params;

  if (!adminId || !facilitatorId) {
    throw new ApiError(400, "Invalid request");
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(403, "Not a valid admin");
  }

  const facilitator = await Facilitator.findByIdAndUpdate(
    facilitatorId,
    {
      "verification.status": "Approved",
      "verification.verifiedBy": adminId,
      "verification.verifiedAt": Date.now(),
      // isVerified: true,
    },
    { new: true },
  );

  if (!facilitator) {
    throw new ApiError(404, "Not a valid facilitator");
  }

  res
    .status(200)
    .json(new ApiResponse(200, facilitator, "Documents verified successfully"));
});

const RejectDocumentVerification = asyncHandler(async (req, res) => {
  const { adminId, facilitatorId } = req.params;

  if (!adminId || !facilitatorId) {
    throw new ApiError(400, "Invalid request");
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(403, "Not a valid admin");
  }

  const facilitator = await Facilitator.findByIdAndUpdate(
    facilitatorId,
    {
      "verification.status": "Rejected",
      "verification.verifiedBy": adminId,
      "verification.verifiedAt": Date.now(),
      // isVerified: true,
    },
    { new: true },
  );

  if (!facilitator) {
    throw new ApiError(404, "Not a valid facilitator");
  }

  res
    .status(200)
    .json(new ApiResponse(200, facilitator, "Documents rejected successfully"));
});

const deleteFacilitator = asyncHandler(async (req, res) => {
  const { adminId, facilitatorId } = req.params;

  if (!adminId || !facilitatorId) {
    throw new ApiError(400, "Invalid request");
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(403, "Not a valid admin");
  }

  const facilitator = await Facilitator.findByIdAndDelete(facilitatorId);
  if (!facilitator) {
    throw new ApiError(404, "Not a valid facilitator");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, facilitator, "Facilitator deleted successfully"),
    );
});

export {
  registerFacilitator,
  verifyOTP,
  loginFacilitator,
  logoutFacilitator,
  refreshFacilitatorToken,
  getCurrentFacilitator,
  facilitatorDashboard,
  updateFacilitatorProfile,
  addFacilitatorSlots,
  bookFacilitatorSlot,
  verifyFacilitator,
  addFacilitatorReview,
  activateFacilitator,
  deactivateFacilitator,
  AcceptDocumentVerification,
  RejectDocumentVerification,
  deleteFacilitator,
};
