import { Admin } from "../models/admin.models.js";
import { City } from "../models/city.models.js";
import { State } from "../models/state.models.js";
import { Country } from "../models/country.models.js";
import { Club } from "../models/club.models.js";
import { UserSchema } from "../models/user.models.js";
import { Hotels } from "../models/hotel.models.js";
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

const computeRoomTotals = (rooms = []) => {
  if (!Array.isArray(rooms)) return { totalRooms: 0, availableRooms: 0 };
  const totalRooms = rooms.reduce(
    (sum, room) => sum + (normalizeNumber(room.totalRooms) || 0),
    0,
  );
  const availableRooms = rooms.reduce(
    (sum, room) => sum + (normalizeNumber(room.availableRooms) || 0),
    0,
  );
  return { totalRooms, availableRooms };
};

const recalcHotelRatings = (hotel) => {
  const distribution = {
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  };

  hotel.reviews.forEach((review) => {
    switch (Math.round(review.rating)) {
      case 1:
        distribution.oneStar += 1;
        break;
      case 2:
        distribution.twoStar += 1;
        break;
      case 3:
        distribution.threeStar += 1;
        break;
      case 4:
        distribution.fourStar += 1;
        break;
      case 5:
        distribution.fiveStar += 1;
        break;
      default:
        break;
    }
  });

  const count = hotel.reviews.length;
  const totalRating = hotel.reviews.reduce(
    (sum, review) => sum + (normalizeNumber(review.rating) || 0),
    0,
  );

  hotel.ratings = {
    average: count > 0 ? Number((totalRating / count).toFixed(1)) : 0,
    count,
    distribution,
  };
};

const loadCountry = async () => {
  const india = await Country.findOne({ name: /india/i });
  return india ? india._id : undefined;
};

const buildLocation = (lat, lng) => ({
  type: "Point",
  coordinates: [Number(lng), Number(lat)],
});

const createHotel = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(403, "Only admins can create hotels");
  }

  // 🔥 Normalize numbers
  const lat = normalizeNumber(req.body.lat);
  const lng = normalizeNumber(req.body.lng);
  let starRating = normalizeNumber(req.body.starRating);

  if (
    !req.body.name ||
    !req.body.cityId ||
    !req.body.stateId ||
    lat == null ||
    lng == null
  ) {
    throw new ApiError(400, "Required hotel fields are missing");
  }

  // 🔥 Clamp star rating
  if (starRating > 5) starRating = 5;
  if (starRating < 0) starRating = 0;

  const city = await City.findById(req.body.cityId);
  const state = await State.findById(req.body.stateId);
  const country = req.body.countryId
    ? await Country.findById(req.body.countryId)
    : await loadCountry();

  if (!city) throw new ApiError(404, "City not found");
  if (!state) throw new ApiError(404, "State not found");

  let partnerClub;
  if (req.body.partnerClubId) {
    partnerClub = await Club.findById(req.body.partnerClubId);
    if (!partnerClub) throw new ApiError(404, "Partner club not found");
  }

  // 🔥 Parse arrays safely
  const parseCommaArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    return field
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const amenities = parseCommaArray(req.body.amenities);
  const services = parseCommaArray(req.body.services);
  const category = parseCommaArray(req.body.category);
  const tags = parseCommaArray(req.body.tags);
  const featuredFacilities = parseCommaArray(req.body.featuredFacilities);

  // 🔥 Parse nested objects (FormData safe)
  const parsedPricing = parseJsonField(req.body.pricing) || {};

  let parsedPolicies = parseJsonField(req.body.policies) || {};

  // ✅ FIX CHECKBOXES
  parsedPolicies = {
    ...parsedPolicies,
    petsAllowed: req.body["policies[petsAllowed]"] === "on",
    childrenAllowed: req.body["policies[childrenAllowed]"] === "on",
    smokingAllowed: req.body["policies[smokingAllowed]"] === "on",
  };

  const parsedRooms = parseJsonField(req.body.rooms) || [];
  const parsedNearbyAttractions =
    parseJsonField(req.body.nearbyAttractions) || [];
  const parsedNearestTransport =
    parseJsonField(req.body.nearestTransport) || [];

  // 🔥 Upload images
  const coverFile = req.files?.cover?.[0];
  const galleryFiles = req.files?.gallery || [];

  const uploadedCover = coverFile
    ? await UploadImages(coverFile.filename, {
        folderStructure: `hotels/${generateSlug(req.body.name)}/cover`,
      })
    : null;

  const uploadedGallery = [];
  for (const file of galleryFiles) {
    const uploaded = await UploadImages(file.filename, {
      folderStructure: `hotels/${generateSlug(req.body.name)}/gallery`,
    });
    uploadedGallery.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
      caption: file.originalname,
    });
  }

  const roomTotals = computeRoomTotals(parsedRooms);

  const hotel = await Hotels.create({
    name: req.body.name.trim(),
    slug: generateSlug(req.body.name),
    description: req.body.description,
    shortDescription: req.body.shortDescription,
    propertyType: req.body.propertyType,
    starRating,

    category,
    tags,

    address: {
      line1: req.body.line1,
      line2: req.body.line2,
      locality: req.body.locality,
      landmark: req.body.landmark,
      pincode: req.body.pincode,
      city: city._id,
      state: state._id,
    },

    location: buildLocation(lat, lng),

    contact: {
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website,
      bookingUrl: req.body.bookingUrl,
    },

    images: {
      cover: uploadedCover
        ? { url: uploadedCover.url, fileId: uploadedCover.fileId }
        : undefined,
      gallery: uploadedGallery,
    },

    amenities,
    services,
    featuredFacilities,

    rooms: parsedRooms,
    pricing: parsedPricing,
    policies: parsedPolicies,

    nearbyAttractions: parsedNearbyAttractions,
    nearestTransport: parsedNearestTransport,

    partnerClub: partnerClub?._id,
    listedBy: req.body.listedBy,
    createdBy: admin._id,

    isActive: true,
    isVerified: req.body.isVerified === "true" || req.body.isVerified === true,
    isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,

    popularityScore: normalizeNumber(req.body.popularityScore) || 0,

    totalRooms: roomTotals.totalRooms,
    availableRooms: roomTotals.availableRooms,

    awards: parseCommaArray(req.body.awards),
    certifications: parseCommaArray(req.body.certifications),

    externalReferences: parseJsonField(req.body.externalReferences) || {},
  });

  res
    .status(201)
    .json(new ApiResponse(201, hotel, "Hotel created successfully"));
});

const getAllHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotels.find({ isActive: true })
    .populate(
      "address.city address.state address.country partnerClub listedBy createdBy",
    )
    .sort({ popularityScore: -1, starRating: -1 });

  res.status(200).json(new ApiResponse(200, hotels));
});

const getFeaturedHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotels.find({ isActive: true, isFeatured: true })
    .populate("address.city address.state address.country partnerClub")
    .sort({ popularityScore: -1, starRating: -1 });

  res.status(200).json(new ApiResponse(200, hotels));
});

const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotels.findById(req.params.id)
    .populate(
      "address.city address.state address.country partnerClub listedBy createdBy",
    )
    .lean();

  if (!hotel || !hotel.isActive) {
    throw new ApiError(404, "Hotel not found");
  }

  res.status(200).json(new ApiResponse(200, hotel));
});

const getHotelsByCity = asyncHandler(async (req, res) => {
  const { query } = req.params;
  if (!query) {
    throw new ApiError(400, "City identifier is required");
  }

  const city =
    (await City.findOne({ name: { $regex: `^${query}$`, $options: "i" } })) ||
    (await City.findById(query));

  if (!city) {
    throw new ApiError(404, "City not found");
  }

  const hotels = await Hotels.find({
    "address.city": city._id,
    isActive: true,
  }).populate("address.city address.state address.country partnerClub");

  res.status(200).json(new ApiResponse(200, hotels));
});

const getHotelsByState = asyncHandler(async (req, res) => {
  const { query } = req.params;
  if (!query) {
    throw new ApiError(400, "State identifier is required");
  }

  const state =
    (await State.findOne({ name: { $regex: `^${query}$`, $options: "i" } })) ||
    (await State.findById(query));

  if (!state) {
    throw new ApiError(404, "State not found");
  }

  const hotels = await Hotels.find({
    "address.state": state._id,
    isActive: true,
  }).populate("address.city address.state address.country partnerClub");

  res.status(200).json(new ApiResponse(200, hotels));
});

const searchHotels = asyncHandler(async (req, res) => {
  const query = req.query.q;
  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const regex = new RegExp(query, "i");
  const hotels = await Hotels.find({
    isActive: true,
    $or: [
      { name: regex },
      { description: regex },
      { shortDescription: regex },
      { category: regex },
      { tags: regex },
      { "address.locality": regex },
      { "address.line1": regex },
      { "address.line2": regex },
    ],
  }).populate("address.city address.state address.country partnerClub");

  res.status(200).json(new ApiResponse(200, hotels));
});

const updateHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;
  const { adminId } = req.body;

  if (!adminId) {
    throw new ApiError(403, "Admin identifier is required");
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(403, "Only admins can update hotels");
  }

  const hotel = await Hotels.findById(hotelId);
  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  const updatableFields = [
    "name",
    "description",
    "shortDescription",
    "propertyType",
    "starRating",
    "category",
    "tags",
    "amenities",
    "services",
    "featuredFacilities",
    "pricing",
    "policies",
    "nearbyAttractions",
    "nearestTransport",
    "partnerClub",
    "listedBy",
    "isVerified",
    "isFeatured",
    "popularityScore",
    "awards",
    "certifications",
    "externalReferences",
    "isActive",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (
        [
          "category",
          "tags",
          "amenities",
          "services",
          "featuredFacilities",
          "awards",
          "certifications",
        ].includes(field)
      ) {
        hotel[field] = parseArrayField(req.body[field]);
      } else if (
        field === "pricing" ||
        field === "policies" ||
        field === "externalReferences"
      ) {
        hotel[field] = parseJsonField(req.body[field]);
      } else if (field === "popularityScore" || field === "starRating") {
        hotel[field] = normalizeNumber(req.body[field]);
      } else {
        hotel[field] = req.body[field];
      }
    }
  });

  if (req.body.cityId) {
    const city = await City.findById(req.body.cityId);
    if (!city) throw new ApiError(404, "City not found");
    hotel.address.city = city._id;
  }
  if (req.body.stateId) {
    const state = await State.findById(req.body.stateId);
    if (!state) throw new ApiError(404, "State not found");
    hotel.address.state = state._id;
  }
  if (req.body.countryId) {
    const country = await Country.findById(req.body.countryId);
    if (!country) throw new ApiError(404, "Country not found");
    hotel.address.country = country._id;
  }

  ["line1", "line2", "locality", "landmark", "pincode"].forEach((field) => {
    if (req.body[field] !== undefined) {
      hotel.address[field] = req.body[field];
    }
  });

  if (req.body.lat !== undefined && req.body.lng !== undefined) {
    const lat = normalizeNumber(req.body.lat);
    const lng = normalizeNumber(req.body.lng);
    if (lat == null || lng == null) {
      throw new ApiError(400, "Invalid latitude or longitude");
    }
    hotel.location = buildLocation(lat, lng);
  }

  const removedGalleryImages = parseArrayField(req.body.removedImages);
  if (removedGalleryImages.length) {
    await DeleteBulkImage(removedGalleryImages);
    hotel.images.gallery = hotel.images.gallery.filter(
      (image) => !removedGalleryImages.includes(image.fileId),
    );
  }

  if (req.body.removeCover === "true" || req.body.removeCover === true) {
    if (hotel.images.cover?.fileId) {
      await DeleteBulkImage([hotel.images.cover.fileId]);
    }
    hotel.images.cover = undefined;
  }

  hotel.images = hotel.images || {};
  hotel.images.gallery = hotel.images.gallery || [];

  const coverFile = req.files?.cover?.[0];
  if (coverFile) {
    const uploaded = await UploadImages(coverFile.filename, {
      folderStructure: `hotels/${generateSlug(hotel.name)}/cover`,
    });
    hotel.images.cover = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }

  const galleryFiles = req.files?.gallery || [];
  for (const file of galleryFiles) {
    const uploaded = await UploadImages(file.filename, {
      folderStructure: `hotels/${generateSlug(hotel.name)}/gallery`,
    });
    hotel.images.gallery.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
      caption: file.originalname,
    });
  }

  if (req.body.rooms !== undefined) {
    hotel.rooms = parseJsonField(req.body.rooms) || hotel.rooms;
    const totals = computeRoomTotals(hotel.rooms);
    hotel.totalRooms = totals.totalRooms;
    hotel.availableRooms = totals.availableRooms;
  }

  if (req.body.name) {
    hotel.slug = generateSlug(req.body.name);
  }

  await hotel.save();

  res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel updated successfully"));
});

const deleteHotel = asyncHandler(async (req, res) => {
  const { adminId, hotelId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(403, "Only admins can delete hotels");
  }

  const hotel = await Hotels.findById(hotelId);
  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  const fileIds = [
    hotel.images?.cover?.fileId,
    ...(hotel.images?.gallery || []).map((image) => image.fileId),
  ].filter(Boolean);

  if (fileIds.length) {
    await DeleteBulkImage(fileIds);
  }

  await hotel.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel deleted successfully"));
});

const getInactiveHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotels.findById(req.params.hotelId)
    .populate("address.city address.state address.country partnerClub")
    .lean();

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  res.status(200).json(new ApiResponse(200, hotel));
});

const activateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotels.findByIdAndUpdate(
    req.params.hotelId,
    { isActive: true },
    { new: true },
  );

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel activated successfully"));
});

const addHotelReview = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;
  const { userId, rating, title, comment } = req.body;

  if (!userId || !rating) {
    throw new ApiError(400, "userId and rating are required");
  }

  const hotel = await Hotels.findById(hotelId);
  if (!hotel || !hotel.isActive) {
    throw new ApiError(404, "Hotel not found");
  }

  const user = await UserSchema.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const numericRating = normalizeNumber(rating);
  if (numericRating == null || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "Rating must be a number between 1 and 5");
  }

  const existingReview = hotel.reviews.find(
    (review) => review.user?.toString() === userId.toString(),
  );

  if (existingReview) {
    existingReview.rating = numericRating;
    existingReview.title = title || existingReview.title;
    existingReview.comment = comment || existingReview.comment;
    existingReview.createdAt = new Date();
  } else {
    hotel.reviews.push({
      user: user._id,
      rating: numericRating,
      title,
      comment,
    });
  }

  recalcHotelRatings(hotel);
  await hotel.save();

  res
    .status(201)
    .json(new ApiResponse(201, hotel.reviews, "Review added successfully"));
});

const getHotelReviews = asyncHandler(async (req, res) => {
  const hotel = await Hotels.findById(req.params.hotelId)
    .populate({
      path: "reviews.user",
      select: "name email contactNumber",
    })
    .lean();

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  res.status(200).json(new ApiResponse(200, hotel.reviews));
});

export {
  createHotel,
  getAllHotels,
  getFeaturedHotels,
  getHotelById,
  getHotelsByCity,
  getHotelsByState,
  searchHotels,
  updateHotel,
  deleteHotel,
  getInactiveHotelById,
  activateHotel,
  addHotelReview,
  getHotelReviews,
};
