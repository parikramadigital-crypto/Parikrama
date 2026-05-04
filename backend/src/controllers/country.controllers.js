import { Admin } from "../models/admin.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Country } from "../models/country.models.js";

const createCountry = asyncHandler(async (req, res) => {
  const { name, code, totalStates } = req.body;
  const { adminId } = req.params;
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return new ApiError(403, "Only admins can create states");
  }
  if (!name) throw new ApiError(400, "Country code is required");

  const existing = await Country.findOne({ name: name.trim() });
  if (existing) throw new ApiError(409, "Country already exists");

  const country = await Country.create({
    name: name.trim(),
    code: code?.trim() || "",
    totalStates: totalStates,
  });

  res
    .status(201)
    .json(new ApiResponse(201, country, "Country added successfully"));
});

const getAllCountry = asyncHandler(async (req, res) => {
  const country = await Country.find().sort({ name: 1 });

  res
    .status(201)
    .json(new ApiResponse(201, country, "Country fetched successfully"));
});

const deleteCountry = asyncHandler(async (req, res) => {
  const { countryId, adminId } = req.params;
  if (!countryId || !adminId)
    throw new ApiError(
      400,
      "Country and admin not found. Please try again later",
    );

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(400, "Invalid request !");
  }

  const country = await Country.findByIdAndDelete(countryId);

  res
    .status(201)
    .json(new ApiResponse(201, country, "Country deleted successfully !"));
});

export { createCountry, getAllCountry };
