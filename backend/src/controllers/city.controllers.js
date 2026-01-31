import { Admin } from "../models/admin.models.js";
import { City } from "../models/city.models.js";
import { Place } from "../models/place.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCity = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  /**
   * 🔹 BULK INSERT
   * Expected body:
   * {
   *   "cities": [
   *     { "name": "Indore", "stateId": "...", "lat": 22.7, "lng": 75.8 }
   *   ]
   * }
   */
  if (Array.isArray(req.body.cities)) {
    const cities = req.body.cities;

    if (!cities.length) {
      throw new ApiError(400, "Cities array cannot be empty");
    }

    const formattedCities = cities.map((city) => {
      const { name, stateId, lat, lng } = city;

      if (!name || !stateId || lat == null || lng == null) {
        throw new ApiError(400, "Each city must have name, stateId, lat, lng");
      }

      return {
        name: name.trim(),
        state: stateId,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };
    });

    const insertedCities = await City.insertMany(formattedCities, {
      ordered: false, // ✅ skip duplicates, continue insert
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          insertedCount: insertedCities.length,
          cities: insertedCities,
        },
        "Cities added successfully",
      ),
    );
  }

  /**
   * 🔹 SINGLE INSERT (OLD BEHAVIOR)
   */
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return new ApiError(403, "Only admins can create states");
  }
  const { name, stateId, lat, lng } = req.body;

  if (!name || !stateId || lat == null || lng == null) {
    throw new ApiError(400, "All fields are required");
  }

  const city = await City.create({
    name: name.trim(),
    state: stateId,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
  });

  res
    .status(201)
    .json(new ApiResponse(201, city, "City Registered successfully !"));
});

const getAllCities = asyncHandler(async (req, res) => {
  const cities = await City.find().populate("state").sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, cities));
});

const getCitiesByState = asyncHandler(async (req, res) => {
  const cities = await City.find({ state: req.params.stateId })
    .populate("state")
    .sort({ name: 1 });

  res.status(200).json(new ApiResponse(200, cities));
});

const getCityById = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id).populate("state");
  if (!city) throw new ApiError(404, "City not found");

  res.status(200).json(new ApiResponse(200, city));
});

const updateCity = asyncHandler(async (req, res) => {
  const updated = await City.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new ApiError(404, "City not found");

  res.status(200).json(new ApiResponse(200, updated, "City updated"));
});

const deleteCity = asyncHandler(async (req, res) => {
  const { adminId, id: cityId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  await Place.deleteMany({ city: cityId });

  const deletedCity = await City.findByIdAndDelete(cityId);
  if (!deletedCity) {
    throw new ApiError(404, "City not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "City and related places deleted successfully",
      ),
    );
});

const createCityByPlace = asyncHandler(async (req, res) => {
  const { adminId, placeId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    return new ApiError(403, "Only admins can create states");
  }

  const { name, stateId, lat, lng } = req.body;

  if (!name || !stateId || lat == null || lng == null) {
    throw new ApiError(400, "All fields are required");
  }

  const city = await City.create({
    name: name.trim(),
    state: stateId,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
  });

  const place = await Place.findByIdAndUpdate(placeId, {
    customCity: "",
    city: city,
  });
  if (!place) {
    return new ApiError(403, "Place not found");
  }

  res
    .status(201)
    .json(new ApiResponse(201, city, "City Registered successfully !"));
});

export {
  createCity,
  getAllCities,
  getCitiesByState,
  getCityById,
  updateCity,
  deleteCity,
  createCityByPlace,
};
