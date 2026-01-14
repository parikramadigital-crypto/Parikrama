import { Place } from "../models/place.models.js";
import { City } from "../models/city.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  * CREATE PLACE (SINGLE + BULK)
export const createPlace = asyncHandler(async (req, res) => {
  /**
   * 🔹 BULK INSERT
   * Expected body:
   * {
   *   "places": [
   *     {
   *       "name": "...",
   *       "cityId": "...",
   *       "stateId": "...",
   *       "category": "...",
   *       "lat": 0,
   *       "lng": 0,
   *       "description": "...",
   *       "averageTimeSpent": 90,
   *       "entryFee": 0
   *     }
   *   ]
   * }
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
      } = p;

      if (!name || !cityId || !stateId || lat == null || lng == null) {
        throw new ApiError(
          400,
          "Each place must have name, cityId, stateId, lat, lng"
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
        "Places added successfully"
      )
    );
  }

  /**
   * 🔹 SINGLE INSERT
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
  } = req.body;

  if (!name || !cityId || !stateId || lat == null || lng == null) {
    throw new ApiError(400, "Required fields missing");
  }

  const place = await Place.create({
    name: name.trim(),
    city: cityId,
    state: stateId,
    category,
    description,
    averageTimeSpent,
    entryFee,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
  });

  res.status(201).json(new ApiResponse(201, place, "Place created"));
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
export const updatePlace = asyncHandler(async (req, res) => {
  const updated = await Place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new ApiError(404, "Place not found");

  res.status(200).json(new ApiResponse(200, updated, "Place updated"));
});

/**
 * SOFT DELETE PLACE
 */
export const deletePlace = asyncHandler(async (req, res) => {
  const deleted = await Place.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!deleted) throw new ApiError(404, "Place not found");

  res.status(200).json(new ApiResponse(200, null, "Place removed"));
});
