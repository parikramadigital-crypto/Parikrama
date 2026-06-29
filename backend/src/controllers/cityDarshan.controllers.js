import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CityDarshan } from "../models/cityDarshan.models.js";
import { UploadImages } from "../utils/imageKit.io.js";
import { Admin } from "../models/admin.models.js";

const registerCityDarshan = asyncHandler(async (req, res) => {
  console.log("Request console", req);
  console.log("Request body", req.body);
  const {
    name,
    description,
    country,
    state,
    city,
    numberOfAdults,
    numberOfChildren,
    placesToCover,
    totalDistance,
    totalHours,
    pickupTime,
    dropTime,
    inclusions,
    exclusions,
    vehicles,
    priority,
  } = req.body;

  if (!name || !country || !state || !city || !placesToCover || !vehicles) {
    throw new ApiError(400, "Required fields are missing.");
  }

  /* ---------------- DUPLICATE CHECK ---------------- */

  const alreadyExists = await CityDarshan.findOne({
    name: name.trim(),
  });

  if (alreadyExists) {
    throw new ApiError(409, "City Darshan package already exists.");
  }

  /* ---------------- SANITIZE ---------------- */

  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

  const folderName = sanitize(name);

  /* ---------------- UPLOAD IMAGES ---------------- */

  const images = [];

  if (req.files?.length) {
    for (const file of req.files) {
      const uploaded = await UploadImages(file.filename, {
        folderStructure: `cityDarshan/${folderName}`,
      });

      images.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }

  /* ---------------- PLACES ---------------- */

  const parsedPlaces = placesToCover
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  /* ---------------- INCLUSIONS ---------------- */

  const parsedInclusions = inclusions
    ? inclusions
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  /* ---------------- EXCLUSIONS ---------------- */

  const parsedExclusions = exclusions
    ? exclusions
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  /* ---------------- VEHICLES ---------------- */

  let parsedVehicles = [];

  try {
    parsedVehicles = JSON.parse(vehicles);
  } catch (err) {
    throw new ApiError(400, "Invalid vehicle data.");
  }

  const cityDarshan = await CityDarshan.create({
    name,
    description,

    country,
    state,
    city,

    numberOfAdults,
    numberOfChildren,

    placesToCover: parsedPlaces,

    totalDistance,
    totalHours,

    pickupTime,
    dropTime,

    vehicles: parsedVehicles,

    inclusions: parsedInclusions,
    exclusions: parsedExclusions,

    priority,

    images,

    isActive: true,
    isVerified: true,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        cityDarshan,
        "City Darshan package created successfully.",
      ),
    );
});

const editCityDarshan = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  const cityDarshan = await CityDarshan.findById(packageId);

  if (!cityDarshan) {
    throw new ApiError(404, "City Darshan package not found.");
  }

  const {
    name,
    description,
    country,
    state,
    city,
    numberOfAdults,
    numberOfChildren,
    placesToCover,
    totalDistance,
    totalHours,
    pickupTime,
    dropTime,
    inclusions,
    exclusions,
    vehicles,
    priority,
    isActive,
    isVerified,
  } = req.body;

  /* ================= IMAGE UPDATE ================= */

  let images = cityDarshan.images;

  if (req.files?.length) {
    // Delete old images
    const oldFileIds = cityDarshan.images
      ?.map((img) => img.fileId)
      .filter(Boolean);

    if (oldFileIds.length) {
      await DeleteBulkImage(oldFileIds);
    }

    const sanitize = (str = "") =>
      str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "");

    const folderName = sanitize(name || cityDarshan.name);

    images = [];

    for (const file of req.files) {
      const uploaded = await UploadImages(file.filename, {
        folderStructure: `cityDarshan/${folderName}`,
      });

      images.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }

  /* ================= ARRAY PARSING ================= */

  let parsedPlaces = cityDarshan.placesToCover;

  if (placesToCover) {
    parsedPlaces = placesToCover
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  let parsedInclusions = cityDarshan.inclusions;

  if (inclusions) {
    parsedInclusions = inclusions
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  let parsedExclusions = cityDarshan.exclusions;

  if (exclusions) {
    parsedExclusions = exclusions
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  let parsedVehicles = cityDarshan.vehicles;

  if (vehicles) {
    try {
      parsedVehicles =
        typeof vehicles === "string" ? JSON.parse(vehicles) : vehicles;
    } catch (err) {
      throw new ApiError(400, "Invalid vehicle data.");
    }
  }

  /* ================= UPDATE ================= */

  cityDarshan.name = name ?? cityDarshan.name;
  cityDarshan.description = description ?? cityDarshan.description;

  cityDarshan.country = country ?? cityDarshan.country;
  cityDarshan.state = state ?? cityDarshan.state;
  cityDarshan.city = city ?? cityDarshan.city;

  cityDarshan.numberOfAdults = numberOfAdults ?? cityDarshan.numberOfAdults;

  cityDarshan.numberOfChildren =
    numberOfChildren ?? cityDarshan.numberOfChildren;

  cityDarshan.totalDistance = totalDistance ?? cityDarshan.totalDistance;

  cityDarshan.totalHours = totalHours ?? cityDarshan.totalHours;

  cityDarshan.pickupTime = pickupTime ?? cityDarshan.pickupTime;

  cityDarshan.dropTime = dropTime ?? cityDarshan.dropTime;

  cityDarshan.priority = priority ?? cityDarshan.priority;

  cityDarshan.isActive = isActive ?? cityDarshan.isActive;

  cityDarshan.isVerified = isVerified ?? cityDarshan.isVerified;

  cityDarshan.placesToCover = parsedPlaces;
  cityDarshan.inclusions = parsedInclusions;
  cityDarshan.exclusions = parsedExclusions;
  cityDarshan.vehicles = parsedVehicles;
  cityDarshan.images = images;

  await cityDarshan.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        cityDarshan,
        "City Darshan package updated successfully.",
      ),
    );
});

const markAsActive = asyncHandler(async (req, res) => {
  const { packageId, adminId } = req.params;
  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid request");

  const cityPackage = await CityDarshan.findByIdAndUpdate(packageId, {
    isActive: true,
  });
  if (!cityPackage) throw new ApiError(400, "Invalid package");

  return res.status(200).json(new ApiResponse(200, {}, "Marked as Active"));
});

const markAsInactive = asyncHandler(async (req, res) => {
  const { packageId, adminId } = req.params;
  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid request");

  const cityPackage = await CityDarshan.findByIdAndUpdate(packageId, {
    isActive: false,
  });
  if (!cityPackage) throw new ApiError(400, "Invalid package");

  return res.status(200).json(new ApiResponse(200, {}, "Marked as Inactive"));
});

const getAllCityDarshanPackages = asyncHandler(async (req, res) => {
  const cityPackage = await CityDarshan.find({ isActive: true })
    .populate({
      path: "city",
      select: "name",
    })
    .populate({
      path: "state",
      select: "name",
    });
  if (!cityPackage) throw new ApiError(400, "No Packages found");

  return res
    .status(200)
    .json(new ApiResponse(200, cityPackage, "Packages fetched successfully !"));
});

const getCityDarshanById = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const cityPackage = await CityDarshan.findById(packageId)
    .populate({
      path: "city",
      select: "name",
    })
    .populate({
      path: "state",
      select: "name",
    });
  if (!cityPackage) throw new ApiError(400, "Package not found");

  return res
    .status(200)
    .json(new ApiResponse(200, cityPackage, "Package fetched successfully !"));
});

export {
  registerCityDarshan,
  editCityDarshan,
  markAsActive,
  markAsInactive,
  getAllCityDarshanPackages,
  getCityDarshanById,
};
