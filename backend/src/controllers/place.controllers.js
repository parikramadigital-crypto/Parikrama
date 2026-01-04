import { Place } from "../models/place.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * CREATE PLACE
 */
export const createPlace = asyncHandler(async (req, res) => {
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

  if (!name || !cityId || !stateId || !lat || !lng) {
    throw new ApiError(400, "Required fields missing");
  }

  const place = await Place.create({
    name,
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
  const places = await Place.find({
    city: req.params.cityId,
    isActive: true,
  }).populate("city state");

  res.status(200).json(new ApiResponse(200, places));
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
