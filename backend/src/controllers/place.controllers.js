import { Place } from "../models/place.models.js";
import { City } from "../models/city.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";
import { UploadImages } from "../utils/imageKit.io.js";

//  * CREATE PLACE (SINGLE + BULK)
export const createPlace = asyncHandler(async (req, res) => {
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

  const uploadedImages = [];

  for (const img of images) {
    const uploaded = await UploadImages(img.filename, {
      folderStructure: `places/${name
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

/**
 * GET ALL PLACES
 */
export const getAllPlaces = asyncHandler(async (req, res) => {
  const places = await Place.find({ isActive: true })
    .populate("city state")
    .sort({ popularityScore: -1 });

  res.status(200).json(new ApiResponse(200, places));
});

/**
 * GET PLACES BY CITY
 */
export const getPlacesByCity = asyncHandler(async (req, res) => {
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

/**
 * GET SINGLE PLACE
 */
export const getPlaceById = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id).populate("city state");
  if (!place || !place.isActive) throw new ApiError(404, "Place not found");

  res.status(200).json(new ApiResponse(200, place));
});

/**
 * UPDATE PLACE
 */
/**
 * UPDATE PLACE WITH IMAGE SUPPORT
 */
export const updatePlace = asyncHandler(async (req, res) => {
  const { placeId } = req.params;

  const place = await Place.findById(placeId);
  if (!place) {
    throw new ApiError(404, "Place not found");
  }

  /* ---------- TEXT FIELD UPDATES ---------- */
  const allowedFields = [
    "name",
    "category",
    "description",
    "averageTimeSpent",
    "entryFee",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      place[field] = req.body[field];
    }
  });

  /* ---------- IMAGE UPLOAD HANDLING ---------- */
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

/**
 * SOFT DELETE PLACE
 */
export const deletePlace = asyncHandler(async (req, res) => {
  console.log("controller reached");
  const { adminId } = req.params;
  console.log("admin", adminId);
  console.log("id", req.params.id);

  const admin = await Admin.findById(adminId);
  if (!admin) return new ApiError(404, "Invalid Admin");
  const deleted = await Place.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  console.log(deleted);

  if (!deleted) throw new ApiError(404, "Place not found");

  res.status(200).json(new ApiResponse(200, deleted, "Place removed"));
});
