import { Facilitator } from "../models/facilitator.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages } from "../utils/imageKit.io.js";
import Jwt from "jsonwebtoken";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";

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
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, facilitator, "Facilitator registered successfully"),
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
  const facilitator = await Facilitator.findById(req.user._id);

  if (!facilitator) {
    throw new ApiError(404, "Facilitator not found");
  }

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

export {
  registerFacilitator,
  loginFacilitator,
  logoutFacilitator,
  refreshFacilitatorToken,
  getCurrentFacilitator,
  updateFacilitatorProfile,
  addFacilitatorSlots,
  bookFacilitatorSlot,
  verifyFacilitator,
};
