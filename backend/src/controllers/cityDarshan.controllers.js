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

const updateCityDarshanPackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid package id",
      });
    }

    const cityDarshan = await CityDarshan.findById(id);

    if (!cityDarshan) {
      return res.status(404).json({
        success: false,
        message: "City Darshan package not found",
      });
    }

    const parseJSON = (value, fallback) => {
      try {
        if (value === undefined || value === null || value === "") {
          return fallback;
        }
        return JSON.parse(value);
      } catch (err) {
        return fallback;
      }
    };

    const {
      name,
      description,
      country,
      state,
      city,
      numberOfAdults,
      numberOfChildren,
      totalDistance,
      totalHours,
      pickupTime,
      dropTime,
      priority,
      isActive,
      isVerified,
    } = req.body;

    const placesToCover = parseJSON(req.body.placesToCover, []);
    const inclusions = parseJSON(req.body.inclusions, []);
    const exclusions = parseJSON(req.body.exclusions, []);
    const vehicles = parseJSON(req.body.vehicles, []);
    const existingImages = parseJSON(req.body.existingImages, []);
    const removedImageFileIds = parseJSON(req.body.removedImageFileIds, []);

    // ================= VALIDATIONS =================
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Package name is required",
      });
    }

    if (!country || !mongoose.Types.ObjectId.isValid(country)) {
      return res.status(400).json({
        success: false,
        message: "Valid country is required",
      });
    }

    if (!state || !mongoose.Types.ObjectId.isValid(state)) {
      return res.status(400).json({
        success: false,
        message: "Valid state is required",
      });
    }

    if (!city || !mongoose.Types.ObjectId.isValid(city)) {
      return res.status(400).json({
        success: false,
        message: "Valid city is required",
      });
    }

    const allowedPriorities = ["featured", "recommended", "popular", "normal"];

    const allowedVehicleTypes = [
      "Mini (Hatchback)",
      "Sedan",
      "SUV",
      "MUV",
      "Tempo Traveller",
      "Luxury Sedan",
      "Luxury SUV",
    ];

    if (!Array.isArray(vehicles)) {
      return res.status(400).json({
        success: false,
        message: "Vehicles must be an array",
      });
    }

    for (const vehicle of vehicles) {
      if (!allowedVehicleTypes.includes(vehicle?.vehicleType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid vehicle type: ${vehicle?.vehicleType || ""}`,
        });
      }

      if (
        vehicle?.maxPersons === undefined ||
        vehicle?.maxPersons === null ||
        Number(vehicle.maxPersons) < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Each vehicle must have a valid maxPersons value",
        });
      }

      if (
        vehicle?.price === undefined ||
        vehicle?.price === null ||
        Number(vehicle.price) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Each vehicle must have a valid price",
        });
      }
    }

    // ================= IMAGE DELETION =================
    if (Array.isArray(removedImageFileIds) && removedImageFileIds.length > 0) {
      try {
        await DeleteBulkImage(
          removedImageFileIds.filter(
            (id) => typeof id === "string" && id.trim(),
          ),
        );
      } catch (err) {
        console.error("Error deleting removed package images:", err);
      }
    }

    // ================= IMAGE UPLOAD =================
    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImg = await UploadImages(
          file.filename,
          {
            folderStructure: "/city-darshan/packages",
          },
          ["city-darshan", "package"],
        );

        uploadedImages.push({
          url: uploadedImg.url,
          fileId: uploadedImg.fileId,
        });
      }
    }

    // ================= FINAL IMAGE ARRAY =================
    const sanitizedExistingImages = Array.isArray(existingImages)
      ? existingImages
          .filter((img) => img && img.url)
          .map((img) => ({
            url: img.url,
            fileId: img.fileId || "",
          }))
      : [];

    const finalImages = [...sanitizedExistingImages, ...uploadedImages];

    // ================= UPDATE PACKAGE =================
    cityDarshan.name = name.trim();
    cityDarshan.description = description || "";
    cityDarshan.country = country;
    cityDarshan.state = state;
    cityDarshan.city = city;

    cityDarshan.numberOfAdults =
      numberOfAdults !== undefined && numberOfAdults !== ""
        ? Number(numberOfAdults)
        : 2;

    cityDarshan.numberOfChildren =
      numberOfChildren !== undefined && numberOfChildren !== ""
        ? Number(numberOfChildren)
        : 0;

    cityDarshan.placesToCover = Array.isArray(placesToCover)
      ? placesToCover.map((item) => String(item).trim()).filter(Boolean)
      : [];

    cityDarshan.totalDistance =
      totalDistance !== undefined && totalDistance !== ""
        ? Number(totalDistance)
        : undefined;

    cityDarshan.totalHours =
      totalHours !== undefined && totalHours !== ""
        ? Number(totalHours)
        : undefined;

    cityDarshan.pickupTime = pickupTime || "";
    cityDarshan.dropTime = dropTime || "";

    cityDarshan.vehicles = vehicles.map((vehicle) => ({
      vehicleType: vehicle.vehicleType,
      maxPersons: Number(vehicle.maxPersons),
      price: Number(vehicle.price),
    }));

    cityDarshan.inclusions = Array.isArray(inclusions)
      ? inclusions.map((item) => String(item).trim()).filter(Boolean)
      : [];

    cityDarshan.exclusions = Array.isArray(exclusions)
      ? exclusions.map((item) => String(item).trim()).filter(Boolean)
      : [];

    cityDarshan.priority = allowedPriorities.includes(priority)
      ? priority
      : "normal";

    cityDarshan.isActive =
      isActive === true || isActive === "true" || isActive === "1";

    cityDarshan.isVerified =
      isVerified === true || isVerified === "true" || isVerified === "1";

    cityDarshan.images = finalImages;

    await cityDarshan.save();

    const updatedPackage = await CityDarshan.findById(cityDarshan._id)
      .populate("country", "name")
      .populate("state", "name")
      .populate("city", "name");

    return res.status(200).json({
      success: true,
      message: "City Darshan package updated successfully",
      data: updatedPackage,
    });
  } catch (error) {
    console.error("updateCityDarshanPackage error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update City Darshan package",
      error: error.message,
    });
  }
};

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
  updateCityDarshanPackage,
  markAsActive,
  markAsInactive,
  getAllCityDarshanPackages,
  getCityDarshanById,
};
