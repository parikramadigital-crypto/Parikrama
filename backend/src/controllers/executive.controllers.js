import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UploadImages, DeleteImage } from "../utils/imageKit.io.js";
import { Admin } from "../models/admin.models.js";
import { Executive } from "../models/executive.models.js";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";
import Jwt from "jsonwebtoken";
import { Facilitator } from "../models/facilitator.models.js";
import { FoodCourt } from "../models/foodCourt.models.js";
import {
  sendFacilitatorRegistrationSMS,
  sendOtpSMS,
} from "../workers/sms.workers.js";

const sanitizeFolderName = (value = "") => {
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
};

const createExecutive = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  if (!adminId) throw new ApiError(400, "Invalid request");
  const {
    name,
    contactNumber,
    alternateContactNumber,
    email,
    employeeId,
    password,
    otherCity,
    otherCityName,
    city,
    otherState,
    otherStateName,
    state,
  } = req.body;

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Not a valid admin");

  let uploadedImage = null;
  if (req.file) {
    uploadedImage = await UploadImages(req?.file?.filename, {
      folderStructure: `profileImage/executive/${sanitizeFolderName(name)}`,
    });
  }

  const newExecutive = await Executive.create({
    name,
    contactNumber,
    alternateContactNumber,
    email,
    employeeId,
    image: { url: uploadedImage.url, fileId: uploadedImage.fileId },
    password,
    otherCity,
    otherCityName,
    city,
    otherState,
    otherStateName,
    state,
    admin: adminId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { newExecutive, password }, "Created Successfully"),
    );
});

const loginExecutive = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await Executive.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user._id,
    "Executive",
  );

  return res.status(200).json(
    new ApiResponse(200, {
      user,
      tokens: {
        AccessToken,
        RefreshToken,
      },
    }),
  );
});

const regenerateExecutiveRefreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await Executive.findById(decoded._id).select("-password");
  if (!user) throw new ApiError(401, "Invalid refresh token");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user._id,
    "Executive",
  );

  return res.status(201).json(
    new ApiResponse(201, {
      user: user,
      tokens: { AccessToken, RefreshToken },
    }),
  );
});

const deleteExecutive = asyncHandler(async (req, res) => {
  const { adminId, executiveId } = req.params;
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(400, "Invalid request");
  }

  if (admin.restrictedAccess === true) {
    throw new ApiError(403, "You are not authorized to delete an executive");
  }
  const executive = await Executive.findById(executiveId);
  if (!executive) {
    throw new ApiError(400, "Unable to process request, please try again!");
  }

  if (executive?.image?.fileId) {
    await DeleteImage(executive.image.fileId);
  }

  await Executive.findByIdAndDelete(executiveId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Executive deleted successfully"));
});

const createFoodCourtExecutive = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    email,
    specialFood,
    category,
    lat,
    lng,
    place,
    city,
    state,
    establishment,
    markAsVerified,
  } = req.body;
  const { executiveId } = req.params;
  console.log("markAsVerified", markAsVerified);
  const executive = await Executive.findById(executiveId);
  if (!executive) return new ApiError(400, "Invalid request from executive");

  if (
    !name ||
    !contactNumber ||
    // !email ||
    !specialFood ||
    !category ||
    !lat ||
    !lng ||
    !place ||
    !city ||
    !state ||
    !establishment ||
    !executiveId
  )
    throw new ApiError(400, "Data are missing for registering new Food Court");

  //checking for existing store
  //in future we will add new branch option for registered food courts
  const existing = await FoodCourt.findOne({
    $or: [{ contactNumber }, ...(email ? [{ email }] : [])],
  });
  if (existing) {
    throw new ApiError(
      409,
      "Food court already exists with this phone or email !",
    );
  }

  const specialFoodList = specialFood
    ? specialFood.split(",").map((s) => s.trim())
    : [];

  // this sanitize function is for only using in the folder structure we upload images in
  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/\s+/g, "-");
  const safeName = sanitize(name);
  const safePhone = sanitize(contactNumber);

  //   storing the images of store
  let storeImages = [];
  if (req.files?.storeImages?.length) {
    for (const doc of req.files.storeImages) {
      const uploaded = await UploadImages(doc.filename, {
        folderStructure: `foodCourt/store-images/${safeName}-${safePhone}`,
      });

      storeImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }
  //   storing the images of food items of that store
  let foodImages = [];
  if (req.files?.foodImages?.length) {
    for (const doc of req.files.foodImages) {
      const uploaded = await UploadImages(doc.filename, {
        folderStructure: `foodCourt/food-images/${safeName}-${safePhone}`,
      });

      foodImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }
  //   storing the images of menu of the store
  let menuImages = [];
  if (req.files?.menuImages?.length) {
    for (const doc of req.files.menuImages) {
      const uploaded = await UploadImages(doc.filename, {
        folderStructure: `foodCourt/menu-images/${safeName}-${safePhone}`,
      });

      menuImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }

  const newFoodCourt = await FoodCourt.create({
    name,
    contactNumber,
    email,
    specialFood: specialFoodList,
    category,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
    place,
    city,
    state,
    executive,
    storeImages: storeImages,
    foodImages: foodImages,
    menuImages: menuImages,
    establishment,
    active: true,
    verified: markAsVerified === "on" ? true : false,
  });

  executive.foodPlace.push(newFoodCourt);
  await executive.save();

  res
    .status(201)
    .json(
      new ApiResponse(201, newFoodCourt, "Food court registered successfully"),
    );
});

const createFacilitatorExecutive = asyncHandler(async (req, res) => {
  const { name, phone, password, role, otherRole, city, state } = req.body;
  const { executiveId } = req.params;

  const executive = await Executive.findById(executiveId);
  if (!executive) return new ApiError(400, "Invalid request from executive");

  if (!name || !phone || !password) {
    throw new ApiError(400, "Required fields missing");
  }

  const existing = await Facilitator.findOne({ phone: phone });

  if (existing) {
    throw new ApiError(409, "This facilitator is already registered");
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

  const facilitator = await Facilitator.create({
    name,
    phone,
    password,
    role,
    otherRole,
    images: profileImages,
    city,
    state,
  });
  // await sendOtpSMS(phone, otp);
  // await sendFacilitatorRegistrationSMS(phone);

  executive.facilitator.push(facilitator);
  await executive.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        facilitator,
        "Registration complete ! Now please enter OTP to complete the verificaiton.",
      ),
    );
});

const dashboardData = asyncHandler(async (req, res) => {
  const { executiveId } = req.params;
  if (!executiveId) throw new ApiError(400, "Invalid request");

  const dataForDashBoard = await Executive.findById(executiveId)
    .populate({
      path: "foodPlace",
      select: "name",
    })
    .populate({
      path: "facilitator",
      select: "name",
    });
  if (!dataForDashBoard) throw new ApiError(400, "No data found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, dataForDashBoard, "Data fetched successfully !"),
    );
});

export {
  createExecutive,
  loginExecutive,
  regenerateExecutiveRefreshToken,
  deleteExecutive,
  createFacilitatorExecutive,
  createFoodCourtExecutive,
  dashboardData,
};
