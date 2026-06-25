import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  DeleteBulkImage,
  UploadImages,
  DeleteImage,
} from "../utils/imageKit.io.js";
import { TravelPackages } from "../models/package.models.js";
import { Admin } from "../models/admin.models.js";

const createTravelPackage = asyncHandler(async (req, res) => {
  const {
    name,
    state,
    country,
    description,
    durationNight,
    durationDay,
    days,
    price,
    numberOfPerson,
    tags,
    priority,
    onlyForAdults,
  } = req.body;

  if (
    !name ||
    !state ||
    !country ||
    !description ||
    !durationNight ||
    !durationDay ||
    !days ||
    !price ||
    !numberOfPerson ||
    !tags ||
    !onlyForAdults ||
    !priority
  ) {
    throw new ApiError(400, "Package details are missing !");
  }

  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/\s+/g, "-");

  const safeName = sanitize(name);

  let image = [];

  if (req.file) {
    const uploaded = await UploadImages(req.file.filename, {
      folderStructure: `travelPackages/${safeName}`,
    });

    image.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
    });
  }

  const travelPackage = await TravelPackages.create({
    name,
    state,
    country,
    description,
    durationNight,
    durationDay,
    days,
    price,
    numberOfPerson,
    tags,
    priority,
    onlyForAdults,
    image: image,
    isVerified: true,
    isActive: true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, travelPackage, "Package created successfully"));
});

const getAllTravelPackages = asyncHandler(async (req, res) => {
  const packages = await TravelPackages.find()
    .populate("state city")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, packages, "Packages fetched successfully"));
});

const getPackageByCountry = asyncHandler(async (req, res) => {
  const { query } = req.params;
  if (!query || query.trim() === "") {
    const packages = await TravelPackages.find();
    return res
      .status(200)
      .json(new ApiResponse(200, packages, "Packages fetched successfully ! "));
  }
  const packages = await TravelPackages.aggregate({
    $match: { country: query },
  });

  await TravelPackages.populate(packages, [
    { path: "state" },
    { path: country },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, packages, "Packages fetched successfully !"));
});

const getPackageByPriority = asyncHandler(async (req, res) => {
  const hotDeals = await TravelPackages.find({
    priority: "hotDeals",
    isActive: true,
    isVerified: true,
  }).populate([
    { path: "state", select: "name" },
    { path: "country", select: "name" },
  ]);
  const trendingDeals = await TravelPackages.find({
    priority: "trendingDeals",
    isActive: true,
    isVerified: true,
  }).populate([
    { path: "state", select: "name" },
    { path: "country", select: "name" },
  ]);
  const exclusiveDeals = await TravelPackages.find({
    priority: "exclusiveDeals",
    isActive: true,
    isVerified: true,
  }).populate([
    { path: "state", select: "name" },
    { path: "country", select: "name" },
  ]);
  const lastMomentPackage = await TravelPackages.find({
    priority: "lastMomentPackage",
    isActive: true,
    isVerified: true,
  }).populate([
    { path: "state", select: "name" },
    { path: "country", select: "name" },
  ]);
  if (!hotDeals || !trendingDeals || !exclusiveDeals || !lastMomentPackage)
    throw new ApiError(
      400,
      "Unable to fetch packages, Please try again later.",
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        hotDeals,
        trendingDeals,
        exclusiveDeals,
        lastMomentPackage,
      },
      "Packages fetched successfully !",
    ),
  );
});

const getTravelPackageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const travelPackage = await TravelPackages.findById(id);
  // const travelPackage = await TravelPackages.findById(id).populate("place");

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
    // place,
    city,
    state,
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
  // travelPackage.place = place ?? travelPackage.place;
  travelPackage.state = place ?? travelPackage.state;
  travelPackage.city = place ?? travelPackage.city;
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

  // Extract valid ImageKit fileIds
  const fileIds =
    travelPackage.image?.map((img) => img.fileId).filter(Boolean) || [];

  // Delete images from ImageKit
  if (fileIds.length > 0) {
    await DeleteBulkImage(fileIds);
  }

  // Delete package from database
  await TravelPackages.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Package deleted successfully"));
});

const lastMomentPackage = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const {
    name,
    place,
    description,
    durationNight,
    durationDay,
    days,
    price,
    tags,
    numberOfPerson,
  } = req.body;
  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid request");

  let images = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await UploadImages(file.filename, {
        folderStructure: "travelPackages-lastMoment",
      });

      images.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }
  // admin checkup
  const newPackage = await TravelPackages.create({
    name: name,
    place: place,
    description: description,
    durationNight: durationNight,
    durationDay: durationDay,
    days: days,
    price: price,
    tags: tags,
    numberOfPerson: numberOfPerson,
    image: images,
  });

  await TravelPackages.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newPackage, "Package created"));
});

const approvePackage = asyncHandler(async (req, res) => {
  const { adminId, packageId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid admin");

  if (admin.role === "SubAdmin") {
    throw new ApiError(
      400,
      "You cannot approve this package, only admins can!",
    );
  }

  const verifyPackage = await TravelPackages.findByIdAndUpdate(packageId, {
    isVerified: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Package verified successfully!"));
});

const markAsInactive = asyncHandler(async (req, res) => {
  const { adminId, packageId } = req.params;
  if (!adminId || !packageId) throw new ApiError(400, "Invalid request");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Admin not found");

  const packages = await TravelPackages.findByIdAndUpdate(packageId, {
    isActive: false,
  });
  if (!packages) throw new ApiError(400, "Package not found");

  return res
    .status(200)
    .json(new ApiResponse(200, packages, "Package marked as inactive !"));
});

const markAsActive = asyncHandler(async (req, res) => {
  const { adminId, packageId } = req.params;
  if (!adminId || !packageId) throw new ApiError(400, "Invalid request");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Admin not found");

  const packages = await TravelPackages.findByIdAndUpdate(packageId, {
    isActive: true,
  });
  if (!packages) throw new ApiError(400, "Package not found");

  return res
    .status(200)
    .json(new ApiResponse(200, packages, "Package marked as active !"));
});

const editPackage = asyncHandler(async (req, res) => {
  const { adminId, packageId } = req.params;
  const {
    name,
    place,
    description,
    durationNight,
    durationDay,
    days,
    price,
    tags,
    numberOfPerson,
    priority,
  } = req.body;

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid admin");
  const adminType = admin.role === "Admin";

  const updatePackage = await TravelPackages.findByIdAndUpdate(packageId, {
    name: name,
    place: place,
    description: description,
    durationNight: durationNight,
    durationDay: durationDay,
    days: days,
    price: price,
    tags: tags,
    numberOfPerson: numberOfPerson,
    priority: priority,
    isVerified: adminType ? true : false,
  });

  return (
    res.status(200),
    json(new ApiResponse(200, updatePackage, "Package updated successfully!"))
  );
});

export {
  createTravelPackage,
  getAllTravelPackages,
  getTravelPackageById,
  getPackageByCountry,
  getPackageByPriority,
  updateTravelPackage,
  deleteTravelPackage,
  lastMomentPackage,
  approvePackage,
  markAsInactive,
  markAsActive,
  editPackage,
};
