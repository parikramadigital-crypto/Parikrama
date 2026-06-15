import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";
import { Place } from "../models/place.models.js";
import { FoodCourt } from "../models/foodCourt.models.js";
import { DeleteBulkImage, UploadImages } from "../utils/imageKit.io.js";
import { getIo } from "../socket.js";

const createFoodCourtAdmin = asyncHandler(async (req, res) => {
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
  } = req.body;
  const { adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) return new ApiError(400, "Invalid request from admin");

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
    !adminId
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
    admin,
    storeImages: storeImages,
    foodImages: foodImages,
    menuImages: menuImages,
    establishment,
    active: true,
    verified: true,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, newFoodCourt, "Food court registered successfully"),
    );
});

const createFoodCourt = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    email,
    specialFood,
    category,
    // lat,
    // lng,
    place,
    city,
    state,
    establishment,
  } = req.body;

  if (
    !name ||
    !contactNumber ||
    // !email ||
    !specialFood ||
    !category ||
    !place ||
    !city ||
    !state
    // !establishment
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
    // location: {
    //   type: "Point",
    //   coordinates: [lng, lat],
    // },
    place,
    city,
    state,
    storeImages: storeImages,
    foodImages: foodImages,
    menuImages: menuImages,
    establishment,
    active: false,
    // verified: true,
  });

  try {
    getIo()
      .to("admins")
      .emit("new-food-place", {
        _id: newFoodCourt._id,
        name: newFoodCourt.name,
        contactNumber: newFoodCourt.contactNumber,
        email: newFoodCourt.email,
        place: newFoodCourt.place,
        city: newFoodCourt.city,
        state: newFoodCourt.state,
        createdAt: newFoodCourt.createdAt,
        message: `New food place registered: ${newFoodCourt.name}`,
      });
  } catch (socketError) {
    console.warn("Socket emit failed:", socketError.message);
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newFoodCourt,
        "Food court registered successfully! Our team will review the details and get back to you.",
      ),
    );
});

const getAllFoodCourts = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const admin = await Admin.findById(adminId);
  if (!admin) return new ApiError(400, "Invalid request from admin");

  const activeCourts = await FoodCourt.find({ active: true }).populate(
    "place city state admin",
  );
  const inactiveCourts = await FoodCourt.find({ active: false }).populate(
    "place city state admin",
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { activeCourts, inactiveCourts },
        "Food courts fetched successfully",
      ),
    );
});

const foodCourtFeed = asyncHandler(async (req, res) => {
  const foodCourts = await FoodCourt.find({ active: true })
    .populate({
      path: "place",
      select: "name",
    })
    .populate({
      path: "city",
      select: "name",
    })
    .populate({
      path: "state",
      select: "name",
    });

  res
    .status(201)
    .json(new ApiResponse(201, foodCourts, "Data fetched successfully !"));
});

const getFoodCourtById = asyncHandler(async (req, res) => {
  const { foodCourtId } = req.params;

  const foodCourt = await FoodCourt.findById(foodCourtId).populate(
    "state city place admin",
  );
  if (!foodCourt) throw new ApiError(400, "Data not found");

  res
    .status(201)
    .json(new ApiResponse(201, foodCourt, "Data fetched successfully"));
});

const getFoodCourtByPlaceId = asyncHandler(async (req, res) => {
  const { placeId } = req.params;
  const place = await Place.findById(placeId);
  if (!place) return new ApiError(400, "Place not found");

  const foodCourts = await FoodCourt.find({ place: placeId })
    .populate("place")
    .populate("city")
    .populate("state")
    .populate("admin");
  if (!foodCourts) throw new ApiError(400, "No data found");

  res
    .status(201)
    .json(new ApiResponse(201, foodCourts, "Data fetched successfully"));
});

const updateFoodCourt = asyncHandler(async (req, res) => {
  const { foodCourtId } = req.params;

  const foodCourt = await FoodCourt.findById(foodCourtId);
  if (!foodCourt) throw new ApiError(404, "Food Court not found");

  const {
    name,
    contactNumber,
    email,
    specialFood,
    category,
    location,
    place,
    city,
    state,
    establishment,
    active,
    verified,
  } = req.body;

  if (name) foodCourt.name = name;
  if (contactNumber) foodCourt.contactNumber = contactNumber;
  if (email) foodCourt.email = email;
  if (specialFood) foodCourt.specialFood = specialFood;
  if (category) foodCourt.category = category;
  if (location) foodCourt.location = location;
  if (place) foodCourt.place = place;
  if (city) foodCourt.city = city;
  if (state) foodCourt.state = state;
  if (establishment) foodCourt.establishment = establishment;
  if (typeof active === "boolean") foodCourt.active = active;
  if (typeof verified === "boolean") foodCourt.verified = verified;

  // Helper function to process images
  const handleImageUpdate = async (newImages, existingImages) => {
    if (!newImages || newImages.length === 0) return existingImages;

    const oldFileIds = existingImages.map((img) => img.fileId).filter(Boolean);
    if (oldFileIds.length > 0) {
      try {
        await DeleteBulkImage(oldFileIds);
      } catch (err) {
        // console.error("Error deleting old images:", err);
      }
    }

    const uploadedImages = [];
    for (const img of newImages) {
      const uploaded = await UploadImages(img, {
        folderStructure: "foodCourt",
      });
      uploadedImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }

    return uploadedImages;
  };

  if (req.body.storeImages) {
    foodCourt.storeImages = await handleImageUpdate(
      req.body.storeImages,
      foodCourt.storeImages || [],
    );
  }

  if (req.body.foodImages) {
    foodCourt.foodImages = await handleImageUpdate(
      req.body.foodImages,
      foodCourt.foodImages || [],
    );
  }

  if (req.body.menuImages) {
    foodCourt.menuImages = await handleImageUpdate(
      req.body.menuImages,
      foodCourt.menuImages || [],
    );
  }

  await foodCourt.save();

  res
    .status(200)
    .json(new ApiResponse(200, foodCourt, "Food Court updated successfully"));
});

const deleteFoodCourt = asyncHandler(async (req, res) => {
  const { foodCourtId, adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) return new ApiError(400, "Invalid request");

  const foodCourt = await FoodCourt.findById(foodCourtId);
  if (!foodCourt) throw new ApiError(400, "Food Court not found");

  const storeImageIds = foodCourt.storeImages?.map((img) => img.fileId) || [];
  const foodImageIds = foodCourt.foodImages?.map((img) => img.fileId) || [];
  const menuImageIds = foodCourt.menuImages?.map((img) => img.fileId) || [];

  const allImageIds = [
    ...storeImageIds,
    ...foodImageIds,
    ...menuImageIds,
  ].filter(Boolean);

  if (allImageIds.length > 0) {
    try {
      await DeleteBulkImage(allImageIds);
    } catch (error) {
      // console.error("Error deleting images:", error);
    }
  }

  await FoodCourt.findByIdAndDelete(foodCourtId);

  res.status(200).json(new ApiResponse(200, "Food Court deleted successfully"));
});

const markAsActive = asyncHandler(async (req, res) => {
  const { foodCourtId, adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) return new ApiError(400, "Invalid request");

  const foodCourt = await FoodCourt.findByIdAndUpdate(foodCourtId, {
    active: true,
  });

  await foodCourt.save();
  if (!foodCourt) throw new ApiError(400, "Food Court not found");

  res
    .status(201)
    .json(new ApiResponse(201, foodCourt, "Activated successfully !"));
});

const verifyByAdmin = asyncHandler(async (req, res) => {
  const { foodCourtId, adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) return new ApiError(400, "Invalid request");

  const foodCourt = await FoodCourt.findByIdAndUpdate(foodCourtId, {
    verified: true,
  });

  await foodCourt.save();
  if (!foodCourt) throw new ApiError(400, "Food Court not found");

  res
    .status(201)
    .json(new ApiResponse(201, foodCourt, "Verified successfully !"));
});

const cancelVerificationByAdmin = asyncHandler(async (req, res) => {
  const { foodCourtId, adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) return new ApiError(400, "Invalid request");

  const foodCourt = await FoodCourt.findByIdAndUpdate(foodCourtId, {
    verified: false,
  });

  await foodCourt.save();
  if (!foodCourt) throw new ApiError(400, "Food Court not found");

  res
    .status(201)
    .json(new ApiResponse(201, foodCourt, "Marked as non-verified !"));
});

const markAsInactiveAndNonVerified = asyncHandler(async (req, res) => {
  const { foodCourtId, adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) return new ApiError(400, "Invalid request");

  const foodCourt = await FoodCourt.findByIdAndUpdate(foodCourtId, {
    verified: false,
    active: false,
  });

  await foodCourt.save();
  if (!foodCourt) throw new ApiError(400, "Food Court not found");

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        foodCourt,
        "This food court has been marked as inactive and non verified",
      ),
    );
});

const addFoodPlaceReview = asyncHandler(async (req, res) => {
  const { foodPlaceId } = req.params;

  const { customerName, customerPhone, hygiene, food, behaviour, comment } =
    req.body;

  /* ---------- VALIDATION ---------- */

  if (
    !customerName ||
    !customerPhone ||
    hygiene == null ||
    food == null ||
    behaviour == null
  ) {
    throw new ApiError(400, "All rating fields are required");
  }

  if (
    hygiene < 0 ||
    hygiene > 5 ||
    food < 0 ||
    food > 5 ||
    behaviour < 0 ||
    behaviour > 5
  ) {
    throw new ApiError(400, "Ratings must be between 0 and 5");
  }

  const foodPlace = await FoodCourt.findById(foodPlaceId);

  if (!foodPlace) {
    throw new ApiError(404, "Facilitator not found");
  }

  /* ---------- DUPLICATE CHECK ---------- */

  const alreadyReviewed = foodPlace.reviews.find(
    (r) => r.customerPhone === customerPhone,
  );

  if (alreadyReviewed) {
    throw new ApiError(409, "You already reviewed this facilitator");
  }

  /* ---------- PUSH REVIEW ---------- */

  foodPlace.reviews.push({
    customerName,
    customerPhone,
    hygiene,
    food,
    behaviour,
    comment,
  });

  /* ---------- RECALCULATE AVERAGES ---------- */

  const total = foodPlace.reviews.length;

  let hygSum = 0;
  let foodSum = 0;
  let behSum = 0;

  foodPlace.reviews.forEach((r) => {
    hygSum += r.hygiene;
    foodSum += r.food;
    behSum += r.behaviour;
  });

  foodPlace.ratings.hygieneAvg = Number((hygSum / total).toFixed(1));

  foodPlace.ratings.foodAvg = Number((foodSum / total).toFixed(1));

  foodPlace.ratings.behaviourAvg = Number((behSum / total).toFixed(1));

  foodPlace.ratings.overallAvg = Number(
    (
      (foodPlace.ratings.hygieneAvg +
        foodPlace.ratings.foodAvg +
        foodPlace.ratings.behaviourAvg) /
      3
    ).toFixed(1),
  );

  foodPlace.ratings.totalReviews = total;

  await foodPlace.save();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        ratings: foodPlace.ratings,
        latestReview: foodPlace.reviews[foodPlace.reviews.length - 1],
      },
      "Review added successfully",
    ),
  );
});

export {
  // create
  createFoodCourtAdmin,
  createFoodCourt,
  // read
  getAllFoodCourts,
  getFoodCourtById,
  getFoodCourtByPlaceId,
  // update
  updateFoodCourt,
  // delete
  deleteFoodCourt,
  // extras
  foodCourtFeed,
  verifyByAdmin,
  markAsActive,
  cancelVerificationByAdmin,
  markAsInactiveAndNonVerified,
  addFoodPlaceReview,
};
