import { City } from "../models/city.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.models.js";
import { Place } from "../models/place.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UploadImages, DeleteBulkImage } from "../utils/imageKit.io.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Facilitator } from "../models/facilitator.models.js";

const createPlace = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(403, "Only admins can create places");
  }

  /**
   * 🔹 BULK INSERT (NO IMAGES)
   */
  if (Array.isArray(req.body.places)) {
    const places = req.body.places;

    if (!places.length) {
      throw new ApiError(400, "Places array cannot be empty");
    }

    const formattedPlaces = places.map((p) => {
      const {
        name,
        cityId,
        stateId,
        category,
        lat,
        lng,
        description,
        averageTimeSpent,
        entryFee,
        popularityScore,
        bestTimeToVisit,
      } = p;

      if (!name || !cityId || !stateId || lat == null || lng == null) {
        throw new ApiError(
          400,
          "Each place must have name, cityId, stateId, lat, lng",
        );
      }

      return {
        name: name.trim(),
        city: cityId,
        state: stateId,
        category: category || "General",
        description: description || "",
        averageTimeSpent: averageTimeSpent || 60,
        entryFee: entryFee || 0,
        popularityScore,
        bestTimeToVisit,
        images: [], // bulk has no images
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };
    });

    const insertedPlaces = await Place.insertMany(formattedPlaces, {
      ordered: false,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          insertedCount: insertedPlaces.length,
          places: insertedPlaces,
        },
        "Places added successfully",
      ),
    );
  }

  /**
   * 🔹 SINGLE INSERT (WITH IMAGES)
   */
  const {
    name,
    cityId,
    stateId,
    category,
    lat,
    lng,
    description,
    averageTimeSpent,
    entryFee,
    popularityScore,
    bestTimeToVisit,
  } = req.body;

  if (!name || !cityId || !stateId || lat == null || lng == null) {
    throw new ApiError(400, "Required fields missing");
  }

  const images = req.files || [];

  if (images.length > 5) {
    throw new ApiError(400, "Maximum 5 images allowed per place");
  }

  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/\s+/g, "-");

  const safeName = sanitize(name);

  const uploadedImages = [];

  for (const img of images) {
    const uploaded = await UploadImages(img.filename, {
      folderStructure: `places/${safeName
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    });

    uploadedImages.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
      altText: name,
    });
  }

  const place = await Place.create({
    name: name.trim(),
    city: cityId,
    state: stateId,
    category,
    description,
    averageTimeSpent,
    entryFee,
    popularityScore,
    bestTimeToVisit,
    images: uploadedImages,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
  });

  res
    .status(201)
    .json(new ApiResponse(201, place, "Place created successfully"));
});

// const getAllPlaces = asyncHandler(async (req, res) => {
//   const LIMIT = 20; // ← change this anytime

//   const places = await Place.aggregate([
//     { $match: { isActive: true } }, // only active places
//     { $sample: { size: LIMIT } }, // random documents
//   ]);

//   // populate after aggregation
//   await Place.populate(places, [{ path: "city" }, { path: "state" }]);

//   res
//     .status(200)
//     .json(new ApiResponse(200, places, "Random places fetched successfully"));
// });

const getAllPlaces = asyncHandler(async (req, res) => {
  const places = await Place.find({ isActive: true })
    .populate("city state")
    .sort({ popularityScore: -1 });

  res.status(200).json(new ApiResponse(200, places));
});

const getPlacesByCity = asyncHandler(async (req, res) => {
  const { query } = req.params;

  if (!query) {
    throw new ApiError(400, "City name is required");
  }

  // 🔍 Find city by name (case-insensitive)
  const city = await City.findOne({
    name: { $regex: `^${query}$`, $options: "i" },
  });

  if (!city) {
    throw new ApiError(404, "City not found");
  }

  // 📍 Find places for that city
  const places = await Place.find({
    city: city._id,
    isActive: true,
  }).populate("city state");

  res
    .status(200)
    .json(new ApiResponse(200, places, "Places fetched successfully"));
});

const getPlaceById = asyncHandler(async (req, res) => {
  const placeId = req.params.id;

  /* -------- PLACE -------- */
  const place = await Place.findById(placeId).populate("city state");
  if (!place || !place.isActive) {
    throw new ApiError(404, "Place not found");
  }

  /* -------- FACILITATORS FOR THIS PLACE -------- */
  const facilitators = await Facilitator.find({
    place: placeId,
    isActive: true,
    isVerified: true,
  }).populate("city state");

  res.status(200).json(
    new ApiResponse(200, {
      place,
      facilitators,
    }),
  );
});

const updatePlace = asyncHandler(async (req, res) => {
  const { placeId } = req.params;

  const place = await Place.findById(placeId);
  if (!place) {
    throw new ApiError(404, "Place not found");
  }

  /* ================= TEXT FIELD UPDATES ================= */
  const allowedFields = [
    "name",
    "category",
    "description",
    "averageTimeSpent",
    "entryFee",
    "telecastLink",
  ];

  console.log("Line 237", req.body);

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      place[field] = req.body[field];
    }
  });

  /* ================= IMAGE DELETION ================= */

  let removedImageIds = [];

  if (req.body.removedImages) {
    // Handle single or array
    removedImageIds = Array.isArray(req.body.removedImages)
      ? req.body.removedImages
      : [req.body.removedImages];

    // Delete from ImageKit
    await DeleteBulkImage(removedImageIds);

    // Remove from DB
    place.images = place.images.filter(
      (img) => !removedImageIds.includes(img.fileId),
    );
  }

  /* ================= IMAGE UPLOAD ================= */

  if (req.files && req.files.length > 0) {
    const remainingSlots = 5 - place.images.length;

    if (remainingSlots <= 0) {
      throw new ApiError(400, "Maximum 5 images already uploaded");
    }

    if (req.files.length > remainingSlots) {
      throw new ApiError(
        400,
        `You can upload only ${remainingSlots} more image(s)`,
      );
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const uploaded = await UploadImages(file.filename, {
        folderStructure: `places/${place._id}`,
      });

      uploadedImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
        altText: place.name,
      });
    }

    place.images.push(...uploadedImages);
  }

  await place.save();

  res
    .status(200)
    .json(new ApiResponse(200, place, "Place updated successfully"));
});

const deletePlace = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) return new ApiError(404, "Invalid Admin");

  // const deleted = await Place.findByIdAndUpdate(
  //   req.params.id,
  //   { isActive: false },
  //   { new: true },
  // );
  const deleted = await Place.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, "Place not found");

  res.status(200).json(new ApiResponse(200, deleted, "Place removed"));
});

const getInactivePlaceById = asyncHandler(async (req, res) => {
  const { placeId } = req.params;

  const place = await Place.findById(placeId).populate("state city");
  if (!place) throw new ApiError(400, "Place not found");

  res.status(200).json(new ApiResponse(200, place));
});

const makePlaceActive = asyncHandler(async (req, res) => {
  const { placeId } = req.params;
  console.log("placeId", placeId);

  const place = await Place.findByIdAndUpdate(placeId, { isActive: true });
  if (!place) throw new ApiError(400, "Place not found");

  res.status(200).json(new ApiResponse(200, place, "Place Accepted !"));
});

const uploaderPlace = asyncHandler(async (req, res) => {
  const {
    customCity,
    uploaderName,
    uploaderContact,
    name,
    cityId,
    stateId,
    category,
    lat,
    lng,
    description,
    averageTimeSpent,
    entryFee,
    popularityScore,
    bestTimeToVisit,
  } = req.body;

  if (!cityId || cityId === "undefined") {
    const city = "697cb8b3be2bdf01a5326e36";
    const otherCity = await City.findById(city);

    if (
      !uploaderName ||
      !uploaderContact ||
      !name ||
      // !cityId ||
      !stateId ||
      lat == null ||
      lng == null
    ) {
      throw new ApiError(400, "Required fields missing");
    }

    const user = await Place.findOne({ uploaderContact }, { isActive: false });
    if (user)
      return new ApiError(
        500,
        "Same user cannot upload another place until the previous one gets active or verified",
      );

    const images = req.files || [];

    if (images.length > 5) {
      throw new ApiError(400, "Maximum 5 images allowed per place");
    }

    const sanitize = (str = "") =>
      str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-_]/g, "")
        .replace(/\s+/g, "-");

    const safeName = sanitize(name);

    const uploadedImages = [];

    for (const img of images) {
      const uploaded = await UploadImages(img.filename, {
        folderStructure: `places/${safeName
          .trim()
          .replace(/\s+/g, "-")
          .toLowerCase()}`,
      });

      uploadedImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
        altText: name,
      });
    }

    const place = await Place.create({
      customCity,
      uploaderName,
      uploaderContact,
      name: name.trim(),
      city: otherCity,
      state: stateId,
      category,
      description,
      averageTimeSpent,
      entryFee,
      popularityScore,
      bestTimeToVisit,
      images: uploadedImages,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      isActive: false,
    });

    res
      .status(201)
      .json(new ApiResponse(201, place, "Place created successfully"));
  }

  if (
    !uploaderName ||
    !uploaderContact ||
    !name ||
    // !cityId ||
    !stateId ||
    lat == null ||
    lng == null
  ) {
    throw new ApiError(400, "Required fields missing");
  }

  const user = await Place.findOne({ uploaderContact }, { isActive: false });
  if (user)
    return new ApiError(
      500,
      "Same user cannot upload another place until the previous one gets active or verified",
    );

  const images = req.files || [];

  if (images.length > 5) {
    throw new ApiError(400, "Maximum 5 images allowed per place");
  }

  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/\s+/g, "-");

  const safeName = sanitize(name);

  const uploadedImages = [];

  for (const img of images) {
    const uploaded = await UploadImages(img.filename, {
      folderStructure: `places/${safeName
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    });

    uploadedImages.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
      altText: name,
    });
  }

  const place = await Place.create({
    customCity,
    uploaderName,
    uploaderContact,
    name: name.trim(),
    city: cityId,
    state: stateId,
    category,
    description,
    averageTimeSpent,
    entryFee,
    popularityScore,
    bestTimeToVisit,
    images: uploadedImages,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
    isActive: false,
  });

  res
    .status(201)
    .json(new ApiResponse(201, place, "Place created successfully"));
});

const explorePlaces = asyncHandler(async (req, res) => {
  // this controller fetches places sorted by popularity score
  const places = await Place.find({ isActive: true })
    .populate("city state")
    .sort({
      popularityScore: -1, // highest first
      createdAt: -1, // fallback sorting
    });

  if (!places.length) {
    throw new ApiError(404, "No places found");
  }
  // this controller suggests places according to the categories i provide
  const IMPORTANT_CATEGORIES = [
    "temple",
    "nature",
    "beach",
    "waterfall",
    "mountain",
    "heritage",
    "historical",
    "wildlife",
    "park",
    "lake",
  ];

  const categorizedPlace = await Place.find({
    isActive: true,
    category: {
      $in: IMPORTANT_CATEGORIES.map((word) => new RegExp(word, "i")),
    },
  })
    .populate("city state")
    .sort({
      popularityScore: -1,
      createdAt: -1,
    });

  if (!categorizedPlace.length) {
    throw new ApiError(404, "No categorizedPlace found");
  }

  const enrichedPlaces = categorizedPlace.map((place, index) => {
    let label = "Low";

    if (place.popularityScore >= 5) label = "Trending";
    else if (place.popularityScore >= 4) label = "Popular";
    else if (place.popularityScore >= 3) label = "Rising";

    return {
      ...place.toObject(),

      popularity: {
        score: place.popularityScore,
        rank: index + 1,
        label,
      },
    };
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { places, enrichedPlaces },
        "Places fetched successfully (sorted by popularity)",
      ),
    );
});

export {
  createPlace,
  getAllPlaces,
  getPlaceById,
  getPlacesByCity,
  updatePlace,
  deletePlace,
  getInactivePlaceById,
  makePlaceActive,
  uploaderPlace,
  explorePlaces,
};
