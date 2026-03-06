import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  DeleteBulkImage,
  UploadImages,
  DeleteImage,
} from "../utils/imageKit.io.js";
import { TravelPackages } from "../models/package.models.js";

const createTravelPackage = asyncHandler(async (req, res) => {
  const {
    name,
    place,
    description,
    durationNight,
    durationDay,
    price,
    tags,
    priority,
  } = req.body;

  if (!name || !place) {
    throw new ApiError(400, "Package name and place are required");
  }

  let images = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await UploadImages(file.filename, {
        folderStructure: "travelPackages",
      });

      images.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }

  const travelPackage = await TravelPackages.create({
    name,
    place,
    description,
    durationNight,
    durationDay,
    price,
    tags,
    priority,
    image: images,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, travelPackage, "Package created successfully"));
});

const getAllTravelPackages = asyncHandler(async (req, res) => {
  const packages = await TravelPackages.find()
    .populate("place")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, packages, "Packages fetched successfully"));
});

const getTravelPackageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const travelPackage = await TravelPackages.findById(id).populate("place");

  if (!travelPackage) {
    throw new ApiError(404, "Package not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, travelPackage, "Package fetched successfully"));
});

const updateTravelPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const travelPackage = await TravelPackages.findById(id);

  if (!travelPackage) {
    throw new ApiError(404, "Package not found");
  }

  const {
    name,
    place,
    description,
    durationNight,
    durationDay,
    price,
    tags,
    priority,
  } = req.body;

  let newImages = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await UploadImages(file.filename, {
        folderStructure: "travelPackages",
      });

      newImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }

  travelPackage.name = name ?? travelPackage.name;
  travelPackage.place = place ?? travelPackage.place;
  travelPackage.description = description ?? travelPackage.description;
  travelPackage.durationNight = durationNight ?? travelPackage.durationNight;
  travelPackage.durationDay = durationDay ?? travelPackage.durationDay;
  travelPackage.price = price ?? travelPackage.price;
  travelPackage.tags = tags ?? travelPackage.tags;
  travelPackage.priority = priority ?? travelPackage.priority;

  if (newImages.length > 0) {
    const oldFileIds = travelPackage.image.map((img) => img.fileId);

    await DeleteBulkImage(oldFileIds);

    travelPackage.image = newImages;
  }

  await travelPackage.save();

  return res
    .status(200)
    .json(new ApiResponse(200, travelPackage, "Package updated successfully"));
});

const deleteTravelPackage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const travelPackage = await TravelPackages.findById(id);

  if (!travelPackage) {
    throw new ApiError(404, "Package not found");
  }

  const fileIds = travelPackage.image.map((img) => img.fileId);

  if (fileIds.length > 0) {
    await DeleteBulkImage(fileIds);
  }

  await travelPackage.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Package deleted successfully"));
});

export {
  createTravelPackage,
  getAllTravelPackages,
  getTravelPackageById,
  updateTravelPackage,
  deleteTravelPackage,
};
