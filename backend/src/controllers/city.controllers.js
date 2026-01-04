import { City } from "../models/city.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * CREATE CITY
 */
export const createCity = asyncHandler(async (req, res) => {
  const { name, stateId, lat, lng } = req.body;

  if (!name || !stateId || !lat || !lng) {
    throw new ApiError(400, "All fields are required");
  }

  const city = await City.create({
    name,
    state: stateId,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
  });

  res.status(201).json(new ApiResponse(201, city, "City created"));
});

/**
 * GET ALL CITIES
 */
export const getAllCities = asyncHandler(async (req, res) => {
  const cities = await City.find().populate("state").sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, cities));
});

/**
 * GET CITIES BY STATE
 */
export const getCitiesByState = asyncHandler(async (req, res) => {
  const cities = await City.find({ state: req.params.stateId })
    .populate("state")
    .sort({ name: 1 });

  res.status(200).json(new ApiResponse(200, cities));
});

/**
 * GET SINGLE CITY
 */
export const getCityById = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id).populate("state");
  if (!city) throw new ApiError(404, "City not found");

  res.status(200).json(new ApiResponse(200, city));
});

/**
 * UPDATE CITY
 */
export const updateCity = asyncHandler(async (req, res) => {
  const updated = await City.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new ApiError(404, "City not found");

  res.status(200).json(new ApiResponse(200, updated, "City updated"));
});

/**
 * DELETE CITY
 */
export const deleteCity = asyncHandler(async (req, res) => {
  const deleted = await City.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, "City not found");

  res.status(200).json(new ApiResponse(200, null, "City deleted"));
});
