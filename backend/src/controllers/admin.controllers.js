import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";
import Jwt from "jsonwebtoken";
import { State } from "../models/state.models.js";
import { City } from "../models/city.models.js";
import { Place } from "../models/place.models.js";
import { Facilitator } from "../models/facilitator.models.js";
import { Promotion } from "../models/promotions.models.js";
import { TravelPackages } from "../models/package.models.js";
import { FoodCourt } from "../models/foodCourt.models.js";
import { UserSchema } from "../models/user.models.js";
import { EnquiryDetails } from "../models/enquiry.models.js";
import { Country } from "../models/country.models.js";
import { CityDarshan } from "../models/cityDarshan.models.js";
import { CityDarshanBooking } from "../models/cityDarshanBooking.models.js";
import { Pricing } from "../models/pricing.models.js";
import { Visitor } from "../models/visitor.model.js";
import { Hotels } from "../models/hotel.models.js";
import { Club } from "../models/club.models.js";
// import { generateUniqueEmployeePin } from "../utils/UniquePinEmployee.js";

const regenerateAdminRefreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;

  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const admin = await Admin.findById(decoded._id).select("-password");
  if (!admin) throw new ApiError(401, "Invalid refresh token");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    admin._id,
    "Admin",
  );

  return res.status(201).json(
    new ApiResponse(201, {
      user: admin,
      tokens: { AccessToken, RefreshToken },
    }),
  );
});

const registerAdmin = asyncHandler(async (req, res, next) => {
  const { name, employeeId, email, phoneNumber, password } = req.body;
  const { adminId } = req.params;
  if (!adminId) return new ApiError(400, "Invalid admin");
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return new ApiError(400, "Invalid admin");
  }

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
      new ApiError(400, "Admin with same email or employeeId already exists"),
    );
  }

  // Create admin
  const createAdmin = await Admin.create({
    name,
    employeeId,
    email,
    phoneNumber,
    password, // hashed by pre-save hook
    // role: "Sub-Admin",
  });

  // Remove sensitive fields
  // const adminData = await Admin.findById(createAdmin._id);

  return res
    .status(201)
    .json(new ApiResponse(201, createAdmin, "Admin registered successfully"));
});

const createSubAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const {
    name,
    employeeId,
    email,
    phoneNumber,
    password,
    restrictedAccess,
    sectionList,
  } = req.body;

  /* =========================
      VALIDATION
  ========================= */

  if (!name || !employeeId || !email || !phoneNumber || !password) {
    throw new ApiError(400, "All fields are required");
  }

  /* =========================
      VERIFY MAIN ADMIN
  ========================= */

  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(404, "Invalid admin");
  }

  /* =========================
      CHECK DUPLICATES
  ========================= */

  const existingAdmin = await Admin.findOne({
    $or: [{ email: email.toLowerCase() }, { employeeId }, { phoneNumber }],
  });

  if (existingAdmin) {
    if (existingAdmin.email === email.toLowerCase()) {
      throw new ApiError(400, "Email already exists");
    }

    if (existingAdmin.employeeId === employeeId) {
      throw new ApiError(400, "Employee ID already exists");
    }

    if (existingAdmin.phoneNumber === phoneNumber) {
      throw new ApiError(400, "Phone number already exists");
    }
  }

  /* =========================
      VALIDATE SECTION LIST
  ========================= */

  const allowedSections = [
    "Overview",
    "Enquiries",
    "Hotels",
    "Clubs",
    "Active Places",
    "Inactive Places",
    "Food Place",
    "Users",
    "Verified Facilitator",
    "Non-Verified Facilitator",
    "Cities",
    "States",
    "Countries",
    "Packages",
    "Promotions",
  ];

  if (restrictedAccess === true || restrictedAccess === "true") {
    if (
      !sectionList ||
      !Array.isArray(sectionList) ||
      sectionList.length === 0
    ) {
      throw new ApiError(400, "Please select at least one section");
    }

    const invalidSections = sectionList.filter(
      (section) => !allowedSections.includes(section),
    );

    if (invalidSections.length > 0) {
      throw new ApiError(
        400,
        `Invalid sections: ${invalidSections.join(", ")}`,
      );
    }
  }

  /* =========================
      CREATE SUB ADMIN
  ========================= */

  const subAdmin = await Admin.create({
    name,
    employeeId,
    email: email.toLowerCase(),
    phoneNumber,
    password,

    role: "Admin",

    restrictedAccess: restrictedAccess === true || restrictedAccess === "true",

    sectionList:
      restrictedAccess === true || restrictedAccess === "true"
        ? sectionList
        : [],
  });

  /* =========================
      REMOVE PASSWORD
  ========================= */

  // const createdSubAdmin = await Admin.findById(subAdmin._id).select(
  //   "-password",
  // );

  /* =========================
      RESPONSE
  ========================= */

  res
    .status(201)
    .json(new ApiResponse(201, subAdmin, "Sub admin created successfully"));

  // 👇 this response has been commented because not to send the password to the UI, but for now i will be sending the password to UI share it to the subadmin... further when sms integration will be active then the password will be sent through the sms.

  // res
  //   .status(201)
  //   .json(
  //     new ApiResponse(201, createdSubAdmin, "Sub admin created successfully"),
  //   );
});

const updateSubAdmin = asyncHandler(async (req, res) => {
  const { subAdminId } = req.params;

  const {
    name,
    employeeId,
    email,
    phoneNumber,
    restrictedAccess,
    sectionList,
  } = req.body;

  if (!name || !employeeId || !email || !phoneNumber) {
    throw new ApiError(400, "All fields are required");
  }
  const allowedSections = [
    "Overview",
    "Enquiries",
    "Hotels",
    "Clubs",
    "Active Places",
    "Inactive Places",
    "Food Place",
    "Users",
    "Verified Facilitator",
    "Non-Verified Facilitator",
    "Cities",
    "States",
    "Countries",
    "Packages",
    "Promotions",
  ];
  const formattedSectionList = Array.isArray(sectionList)
    ? sectionList
    : sectionList
      ? [sectionList]
      : [];

  const invalidSections = formattedSectionList.filter(
    (section) => !allowedSections.includes(section),
  );

  if (invalidSections.length > 0) {
    throw new ApiError(400, `Invalid sections: ${invalidSections.join(", ")}`);
  }

  const subAdmin = await Admin.findByIdAndUpdate(
    subAdminId,
    {
      name: name,
      employeeId: employeeId,
      email: email.toLowerCase(),
      phoneNumber: phoneNumber,
      restrictedAccess: true,
      sectionList: formattedSectionList,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  // await subAdmin.save();

  res
    .status(200)
    .json(new ApiResponse(200, subAdmin, "Sub admin updated successfully"));
});

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
    "Admin",
  );

  return res.status(200).json(
    new ApiResponse(200, {
      admin,
      tokens: {
        AccessToken,
        RefreshToken,
      },
    }),
  );
});

const dashboardData = asyncHandler(async (req, res) => {
  const { query } = req.params;

  switch (query) {
    case "overview": {
      const totalVisits = await Visitor.countDocuments();
      const today = new Date().toISOString().slice(0, 10);
      const todayVisits = await Visitor.countDocuments({
        visitDate: today,
      });
      const uniqueVisitors = await Visitor.aggregate([
        {
          $group: {
            _id: "$ip",
          },
        },
        {
          $count: "uniqueVisitors",
        },
      ]);
      const placeOverview = await Place.find().select("name category");

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            totalVisits,
            todayVisits,
            uniqueVisitors: uniqueVisitors[0]?.uniqueVisitors || 0,
            placeOverview,
          },
          "Data fetched successfully",
        ),
      );
    }

    case "subAdmin": {
      const subAdmin = await Admin.find({ restrictedAccess: true }).sort({
        createdAt: -1,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, subAdmin, "Data fetched successfully"));
    }

    case "hotels": {
      const hotels = await Hotels.find({ isActive: true })
        .populate(
          "address.city address.state address.country partnerClub listedBy createdBy",
        )
        .sort({ popularityScore: -1, starRating: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, hotels, "Data fetched successfully"));
    }

    case "clubs": {
      const clubs = await Club.find({ isActive: true })
        .populate("createdBy")
        .sort({ ratings: -1 })
        .lean();

      return res
        .status(200)
        .json(new ApiResponse(200, clubs, "Data fetched successfully"));
    }

    case "state": {
      const state = await State.find()
        .populate("country")
        .sort({ createdAt: -1 });
      return res
        .status(200)
        .json(new ApiResponse(200, state, "Data fetched successfully"));
    }

    case "city": {
      const city = await City.find().populate("state").sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, city, "Data fetched successfully"));
    }

    case "country": {
      const country = await Country.find().sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, country, "Data fetched successfully"));
    }

    case "foodCourts": {
      const foodCourts = await FoodCourt.find()
        .populate("place")
        .sort({ createdAt: -1 });

      const underReviewCount = await FoodCourt.find({
        active: false,
        verified: false,
      }).select("name");

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { foodCourts, underReviewCount },
            "Data fetched successfully",
          ),
        );
    }

    case "users": {
      const users = await UserSchema.find().sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, users, "Data fetched successfully"));
    }

    case "place": {
      const place = await Place.find({ isActive: true })
        .populate("city state")
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, place, "Data fetched successfully"));
    }

    case "inactivePlace": {
      const inactivePlace = await Place.find({ isActive: false })
        .populate("city state")
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, inactivePlace, "Data fetched successfully"));
    }

    case "promotions": {
      const promotions = await Promotion.find()
        .populate("place")
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, promotions, "Data fetched successfully"));
    }

    case "packages": {
      const packages = await TravelPackages.find()
        .sort({ createdAt: -1 })
        .populate("state country");

      return res
        .status(200)
        .json(new ApiResponse(200, packages, "Data fetched successfully"));
    }

    case "enquiry": {
      const enquiry = await EnquiryDetails.find({
        reviewedByAdmin: false,
      })
        .populate("stateId cityId placeId")
        .sort({ createdAt: -1 });
      const reviewedEnquiry = await EnquiryDetails.find({
        reviewedByAdmin: true,
      })
        .populate("stateId cityId placeId")
        .sort({ createdAt: -1 });
      const hotEnquiry = await EnquiryDetails.find({
        reviewedByAdmin: true,
        markAsHotLead: true,
      })
        .populate("stateId cityId placeId")
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { enquiry, reviewedEnquiry, hotEnquiry },
            "Data fetched successfully",
          ),
        );
    }

    case "pricing": {
      const pricing = await Pricing.find()
        .select("modelFor modelName planDuration isActive")
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, pricing, "Data fetched successfully"));
    }

    case "activeFacilitator": {
      const activeFacilitator = await Facilitator.find({
        isVerified: true,
      })
        .populate("state city place")
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .json(
          new ApiResponse(200, activeFacilitator, "Data fetched successfully"),
        );
    }

    case "inactiveFacilitator": {
      const inactiveFacilitator = await Facilitator.find({
        isVerified: false,
      })
        .populate("state city place")
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            inactiveFacilitator,
            "Data fetched successfully",
          ),
        );
    }

    case "cityPackage": {
      const cityPackage = await CityDarshan.find({ isActive: true })
        .populate({ path: "city", select: "name" })
        .populate({ path: "state", select: "name" })
        .select("name vehicles priority");

      return res
        .status(200)
        .json(new ApiResponse(200, cityPackage, "Data fetched successfully"));
    }

    case "cityPackageBooking": {
      const cityPackageBooking = await CityDarshanBooking.find()
        .select("bookingStatus totalAmount totalTravellers vehicle")
        .populate({ path: "cityDarshan", select: "name city state" })
        .populate({ path: "user", select: "name contactNumber" });

      return res
        .status(200)
        .json(
          new ApiResponse(200, cityPackageBooking, "Data fetched successfully"),
        );
    }

    case "cityPackageBooking": {
      const cityPackageBooking = await CityDarshanBooking.find()
        .select("bookingStatus totalAmount totalTravellers vehicle")
        .populate({ path: "cityDarshan", select: "name city state" })
        .populate({ path: "user", select: "name contactNumber" });

      return res
        .status(200)
        .json(
          new ApiResponse(200, cityPackageBooking, "Data fetched successfully"),
        );
    }
    default:
      throw new ApiError(400, "Invalid session or query");
  }
});

const getSubAdminById = asyncHandler(async (req, res) => {
  const { subAdminId } = req.params;
  const subAdmin = await Admin.findById(subAdminId);
  if (!subAdmin) throw new ApiError(400, "Sub Admin not found");

  res
    .status(201)
    .json(new ApiResponse(201, subAdmin, "Sub admin fetched successfully !"));
});

const deActivateSubAdmin = asyncHandler(async (req, res) => {
  const { subAdminId, adminId } = req.params;
  console.log(subAdminId, adminId);
  const admin = await Admin.find({
    _id: adminId,
    restrictedAccess: false,
  });
  console.log(admin);
  if (!admin) throw new ApiError(400, "Invalid access");

  const subAdmin = await Admin.find({
    _id: subAdminId,
    restrictedAccess: true,
    isActive: true,
  });
  if (!subAdmin) throw new ApiError(400, "Invalid sub admin");

  subAdmin.isActive = false;
  await subAdmin.save();

  res.status(201).json(new ApiResponse(201, subAdmin, "Marked as Inactive"));
});

const activateSubAdmin = asyncHandler(async (req, res) => {
  const { subAdminId, adminId } = req.params;
  const admin = await Admin.find({
    _id: adminId,
    restrictedAccess: false,
  });
  if (!admin) throw new ApiError(400, "Invalid access");

  const subAdmin = await Admin.find({
    _id: subAdminId,
    restrictedAccess: true,
    isActive: false,
  });
  if (!subAdmin) throw new ApiError(400, "Invalid sub admin");

  subAdmin.isActive = true;
  await subAdmin.save();

  res.status(201).json(new ApiResponse(201, subAdmin, "Marked as Active"));
});

export {
  loginAdmin,
  regenerateAdminRefreshToken,
  createSubAdmin,
  updateSubAdmin,
  registerAdmin,
  dashboardData,
  getSubAdminById,
  activateSubAdmin,
  deActivateSubAdmin,
};
