import { Admin } from "../models/admin.models.js";
import { City } from "../models/city.models.js";
import { State } from "../models/state.models.js";
import { Country } from "../models/country.models.js";
import { Club } from "../models/club.models.js";
import { Hotels } from "../models/hotel.models.js";
import { UserSchema } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages, DeleteBulkImage } from "../utils/imageKit.io.js";

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    // Not JSON, fallback to comma-separated string
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseJsonField = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const generateSlug = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeNumber = (value) => {
  if (value == null || value === "") return undefined;
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
};

const loadCountry = async () => {
  const india = await Country.findOne({ name: /india/i });
  return india ? india._id : undefined;
};

const buildLocation = (lat, lng, address) => ({
  address,
  city: "",
  state: "",
  country: "India",
  coordinates: {
    lat: Number(lat),
    lng: Number(lng),
  },
});

const createClubPublic = asyncHandler(async (req, res) => {
  const {
    clubName,
    description,
    category,
    email,
    phone,
    website,
    address,
    city,
    state,
    country,
    lat,
    lng,
    amenities,
    membershipPlans,
    foundedYear,
  } = req.body;

  if (!clubName) {
    throw new ApiError(400, "Club name is required");
  }

  const parsedAmenities = parseArrayField(amenities);
  const parsedMembershipPlans = parseJsonField(membershipPlans) || [];

  const logoFile = req.files?.logo?.[0];
  const coverFile = req.files?.coverImage?.[0];
  const galleryFiles = req.files?.gallery || [];

  let uploadedLogo = null;
  let uploadedCover = null;
  const uploadedGallery = [];

  if (logoFile) {
    uploadedLogo = await UploadImages(logoFile.filename, {
      folderStructure: `clubs/${generateSlug(clubName)}/logo`,
    });
  }

  if (coverFile) {
    uploadedCover = await UploadImages(coverFile.filename, {
      folderStructure: `clubs/${generateSlug(clubName)}/cover`,
    });
  }

  for (const file of galleryFiles) {
    const uploaded = await UploadImages(file.filename, {
      folderStructure: `clubs/${generateSlug(clubName)}/gallery`,
    });
    uploadedGallery.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
    });
  }

  const club = await Club.create({
    clubName: clubName.trim(),
    slug: generateSlug(clubName),
    description,
    category: category || "Social Club",
    contactDetails: {
      email,
      phone,
      website,
    },
    location: buildLocation(lat, lng, address),
    images: {
      logo: uploadedLogo
        ? { url: uploadedLogo.url, fileId: uploadedLogo.fileId }
        : undefined,
      coverImage: uploadedCover
        ? { url: uploadedCover.url, fileId: uploadedCover.fileId }
        : undefined,
      gallery: uploadedGallery,
    },
    amenities: parsedAmenities,
    membershipPlans: parsedMembershipPlans,
    foundedYear: normalizeNumber(foundedYear),
    adminVerified: false,
    isActive: true,
  });

  res.status(201).json(new ApiResponse(201, club, "Club created successfully"));
});

const createClub = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(403, "Only admins can create clubs");
  }

  const {
    clubName,
    description,
    category,
    email,
    phone,
    website,
    address,
    city,
    state,
    country,
    lat,
    lng,
    amenities,
    membershipPlans,
    foundedYear,
    adminVerified,
  } = req.body;

  if (!clubName) {
    throw new ApiError(400, "Club name is required");
  }

  const parsedAmenities = parseArrayField(amenities);
  const parsedMembershipPlans = parseJsonField(membershipPlans) || [];

  const logoFile = req.files?.logo?.[0];
  const coverFile = req.files?.coverImage?.[0];
  const galleryFiles = req.files?.gallery || [];

  let uploadedLogo = null;
  let uploadedCover = null;
  const uploadedGallery = [];

  if (logoFile) {
    uploadedLogo = await UploadImages(logoFile.filename, {
      folderStructure: `clubs/${generateSlug(clubName)}/logo`,
    });
  }

  if (coverFile) {
    uploadedCover = await UploadImages(coverFile.filename, {
      folderStructure: `clubs/${generateSlug(clubName)}/cover`,
    });
  }

  for (const file of galleryFiles) {
    const uploaded = await UploadImages(file.filename, {
      folderStructure: `clubs/${generateSlug(clubName)}/gallery`,
    });
    uploadedGallery.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
    });
  }

  const club = await Club.create({
    clubName: clubName.trim(),
    slug: generateSlug(clubName),
    description,
    category: category || "Social Club",
    contactDetails: {
      email,
      phone,
      website,
    },
    location: buildLocation(lat, lng, address),
    images: {
      logo: uploadedLogo
        ? { url: uploadedLogo.url, fileId: uploadedLogo.fileId }
        : undefined,
      coverImage: uploadedCover
        ? { url: uploadedCover.url, fileId: uploadedCover.fileId }
        : undefined,
      gallery: uploadedGallery,
    },
    amenities: parsedAmenities,
    membershipPlans: parsedMembershipPlans,
    foundedYear: normalizeNumber(foundedYear),
    adminVerified: adminVerified === "true" || adminVerified === true,
    createdBy: admin._id,
    isActive: true,
  });

  res.status(201).json(new ApiResponse(201, club, "Club created successfully"));
});

const getAllClubs = asyncHandler(async (req, res) => {
  const clubs = await Club.find({ isActive: true })
    .populate("createdBy")
    .sort({ ratings: -1 })
    .lean();

  res.status(200).json(new ApiResponse(200, clubs));
});

const getClubById = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id)
    .populate(
      "createdBy parikramaMembers parikramaHotels members.city members.state",
    )
    .lean();

  if (!club || !club.isActive) {
    throw new ApiError(404, "Club not found");
  }

  res.status(200).json(new ApiResponse(200, club));
});

const getClubsByCity = asyncHandler(async (req, res) => {
  const { query } = req.params;
  if (!query) {
    throw new ApiError(400, "City identifier is required");
  }

  const clubs = await Club.find({
    "location.city": { $regex: query, $options: "i" },
    isActive: true,
  }).lean();

  res.status(200).json(new ApiResponse(200, clubs));
});

const getClubsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  const clubs = await Club.find({
    category: { $regex: category, $options: "i" },
    isActive: true,
  }).lean();

  res.status(200).json(new ApiResponse(200, clubs));
});

const searchClubs = asyncHandler(async (req, res) => {
  const query = req.query.q;
  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const regex = new RegExp(query, "i");
  const clubs = await Club.find({
    isActive: true,
    $or: [
      { clubName: regex },
      { description: regex },
      { category: regex },
      { "location.address": regex },
      { "location.city": regex },
    ],
  }).lean();

  res.status(200).json(new ApiResponse(200, clubs));
});

const updateClub = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const { adminId } = req.body;

  if (!adminId) {
    throw new ApiError(403, "Admin identifier is required");
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(403, "Only admins can update clubs");
  }

  const club = await Club.findById(clubId);
  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  const updatableFields = [
    "clubName",
    "description",
    "category",
    "email",
    "phone",
    "website",
    "amenities",
    "membershipPlans",
    "foundedYear",
    "adminVerified",
    "isActive",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === "amenities") {
        club.amenities = parseArrayField(req.body[field]);
      } else if (field === "membershipPlans") {
        club.membershipPlans = parseJsonField(req.body[field]);
      } else if (field === "foundedYear") {
        club.foundedYear = normalizeNumber(req.body[field]);
      } else if (
        field === "email" ||
        field === "phone" ||
        field === "website"
      ) {
        club.contactDetails[field] = req.body[field];
      } else {
        club[field] = req.body[field];
      }
    }
  });

  if (
    req.body.lat !== undefined &&
    req.body.lng !== undefined &&
    req.body.address !== undefined
  ) {
    club.location = buildLocation(req.body.lat, req.body.lng, req.body.address);
  }

  const removedGalleryImages = parseArrayField(req.body.removedImages);
  if (removedGalleryImages.length) {
    await DeleteBulkImage(removedGalleryImages);
    club.images.gallery = club.images.gallery.filter(
      (image) => !removedGalleryImages.includes(image.fileId),
    );
  }

  if (req.body.removeLogo === "true" || req.body.removeLogo === true) {
    if (club.images.logo?.fileId) {
      await DeleteBulkImage([club.images.logo.fileId]);
    }
    club.images.logo = undefined;
  }

  if (req.body.removeCover === "true" || req.body.removeCover === true) {
    if (club.images.coverImage?.fileId) {
      await DeleteBulkImage([club.images.coverImage.fileId]);
    }
    club.images.coverImage = undefined;
  }

  club.images = club.images || {};
  club.images.gallery = club.images.gallery || [];

  const logoFile = req.files?.logo?.[0];
  if (logoFile) {
    const uploaded = await UploadImages(logoFile.filename, {
      folderStructure: `clubs/${generateSlug(club.clubName)}/logo`,
    });
    club.images.logo = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }

  const coverFile = req.files?.coverImage?.[0];
  if (coverFile) {
    const uploaded = await UploadImages(coverFile.filename, {
      folderStructure: `clubs/${generateSlug(club.clubName)}/cover`,
    });
    club.images.coverImage = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }

  const galleryFiles = req.files?.gallery || [];
  for (const file of galleryFiles) {
    const uploaded = await UploadImages(file.filename, {
      folderStructure: `clubs/${generateSlug(club.clubName)}/gallery`,
    });
    club.images.gallery.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
    });
  }

  if (req.body.clubName) {
    club.slug = generateSlug(req.body.clubName);
  }

  await club.save();

  res.status(200).json(new ApiResponse(200, club, "Club updated successfully"));
});

const deleteClub = asyncHandler(async (req, res) => {
  const { adminId, clubId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(403, "Only admins can delete clubs");
  }

  const club = await Club.findById(clubId);
  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  const fileIds = [
    club.images?.logo?.fileId,
    club.images?.coverImage?.fileId,
    ...(club.images?.gallery || []).map((image) => image.fileId),
  ].filter(Boolean);

  if (fileIds.length) {
    await DeleteBulkImage(fileIds);
  }

  await club.deleteOne();

  res.status(200).json(new ApiResponse(200, club, "Club deleted successfully"));
});

const getInactiveClubById = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.clubId).lean();

  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  res.status(200).json(new ApiResponse(200, club));
});

const activateClub = asyncHandler(async (req, res) => {
  const club = await Club.findByIdAndUpdate(
    req.params.clubId,
    { isActive: true },
    { new: true },
  );

  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, club, "Club activated successfully"));
});

const addClubMember = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const { name, email, phone, address, cityId, stateId } = req.body;

  if (!clubId || !name) {
    throw new ApiError(400, "Club ID and member name are required");
  }

  const club = await Club.findById(clubId);
  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  const member = {
    name,
    email,
    contactNumber: phone,
    address,
    city: cityId,
    state: stateId,
  };

  club.members.push(member);
  await club.save();

  res
    .status(201)
    .json(new ApiResponse(201, club.members, "Member added successfully"));
});

const addClubEvent = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const { title, date, description } = req.body;

  if (!clubId || !title) {
    throw new ApiError(400, "Club ID and event title are required");
  }

  const club = await Club.findById(clubId);
  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  const event = {
    title,
    date: date ? new Date(date) : new Date(),
    description,
  };

  club.events.push(event);
  await club.save();

  res
    .status(201)
    .json(new ApiResponse(201, club.events, "Event added successfully"));
});

const addParikramaHotel = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const { hotelId } = req.body;

  if (!clubId || !hotelId) {
    throw new ApiError(400, "Club ID and Hotel ID are required");
  }

  const club = await Club.findById(clubId);
  const hotel = await Hotels.findById(hotelId);

  if (!club) {
    throw new ApiError(404, "Club not found");
  }
  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  if (!club.parikramaHotels.includes(hotelId)) {
    club.parikramaHotels.push(hotelId);
  }

  await club.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        club.parikramaHotels,
        "Hotel added to club successfully",
      ),
    );
});

export {
  createClubPublic,
  createClub,
  getAllClubs,
  getClubById,
  getClubsByCity,
  getClubsByCategory,
  searchClubs,
  updateClub,
  deleteClub,
  getInactiveClubById,
  activateClub,
  addClubMember,
  addClubEvent,
  addParikramaHotel,
};
