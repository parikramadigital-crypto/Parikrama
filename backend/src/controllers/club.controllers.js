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
import {
  sendClubRegistrationSMS,
  sendLoginOtpSMS,
} from "../workers/sms.workers.js";

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

const buildLocation = (lat, lng, address, city, state, country) => ({
  address,
  city,
  state,
  country,
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

  console.log(
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
  );

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

  await sendClubRegistrationSMS(phone);

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
    location: buildLocation(lat, lng, address, city, state, country),
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

  await sendClubRegistrationSMS(phone);

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
    location: buildLocation(lat, lng, address, city, state, country),
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
    .populate({
      path: "location.city",
      select: "name",
    })
    .populate({
      path: "location.state",
      select: "name",
    })
    .populate({
      path: "location.state",
      select: "name",
    })
    .populate({
      path: "location.country",
      select: "name",
    });

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

  const { name, email, contactNumber, address, city, state } = req.body;

  const club = await Club.findById(clubId);

  if (!club) throw new ApiError(404, "Club not found");

  club.members.push({
    name,
    email,
    contactNumber,
    address,
    city,
    state,
  });

  await club.save();

  res.status(201).json(new ApiResponse(201, club.members, "Member added"));
});

const removeMember = asyncHandler(async (req, res) => {
  const { clubId, memberId } = req.params;

  const club = await Club.findById(clubId);

  if (!club) throw new ApiError(404, "Club not found");

  club.members = club.members.filter((m) => String(m._id) !== String(memberId));

  await club.save();

  res.status(200).json(new ApiResponse(200, {}, "Member removed"));
});

const addClubEvent = asyncHandler(async (req, res) => {
  const { clubId } = req.params;

  const { title, validFrom, validUpto, description } = req.body;

  const club = await Club.findById(clubId);

  if (!club) throw new ApiError(404, "Club not found");

  club.events.push({
    title,
    validFrom,
    validUpto,
    description,
  });

  await club.save();

  res.status(201).json(new ApiResponse(201, club.events, "Event added"));
});

const removeEvent = asyncHandler(async (req, res) => {
  const { clubId, eventId } = req.params;

  const club = await Club.findById(clubId);

  if (!club) throw new ApiError(404, "Club not found");

  club.events = club.events.filter((e) => String(e._id) !== String(eventId));

  await club.save();

  res.status(200).json(new ApiResponse(200, {}, "Event removed"));
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

const followRequest = asyncHandler(async (req, res) => {
  const { userId, userType } = req.body;
  const { clubId } = req.params;

  if (!userId || !userType) throw new ApiError(400, "Invalid request");

  const club = await Club.findById(clubId);
  if (!club) throw new ApiError(404, "club not found");

  const isUser = userType.toLowerCase() === "user";
  const requestArray = isUser
    ? club.userFollowRequests
    : club.communityFollowRequests;

  // convert ObjectIds to string for safe comparison
  const alreadyRequested = requestArray.some((id) => id.toString() === userId);

  if (alreadyRequested) throw new ApiError(400, "Request already sent");

  requestArray.push(userId);
  await club.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Request sent successfully"));
});

const acceptFollowRequest = asyncHandler(async (req, res) => {
  const { userId, userType } = req.body;
  const { clubId } = req.params;

  const club = await Club.findById(clubId);
  if (!club) throw new ApiError(404, "club not found");

  const isUser = userType.toLowerCase() === "user";

  const requestArray = isUser
    ? club.userFollowRequests
    : club.communityFollowRequests;

  const acceptedArray = isUser
    ? club.acceptedRequestsUser
    : club.acceptedRequestsCommunity;

  const exists = requestArray.some((id) => id.toString() === userId);

  if (!exists) throw new ApiError(400, "No such request found");

  // remove from request array
  if (isUser) {
    club.userFollowRequests = club.userFollowRequests.filter(
      (id) => id.toString() !== userId,
    );
  } else {
    club.communityFollowRequests = club.communityFollowRequests.filter(
      (id) => id.toString() !== userId,
    );
  }

  // add to accepted
  acceptedArray.push(userId);

  await club.save();

  return res.status(200).json(new ApiResponse(200, {}, "Request accepted"));
});

const rejectFollowRequest = asyncHandler(async (req, res) => {
  const { userId, userType } = req.body;
  const { clubId } = req.params;

  const club = await Club.findById(clubId);
  if (!club) throw new ApiError(404, "club not found");

  const isUser = userType.toLowerCase() === "user";

  const requestArray = isUser
    ? club.userFollowRequests
    : club.communityFollowRequests;

  const rejectedArray = isUser
    ? club.rejectedRequestsUser
    : club.rejectedRequestsCommunity;

  const exists = requestArray.some((id) => id.toString() === userId);

  if (!exists) throw new ApiError(400, "No such request found");

  // remove from request list
  if (isUser) {
    club.userFollowRequests = club.userFollowRequests.filter(
      (id) => id.toString() !== userId,
    );
  } else {
    club.communityFollowRequests = club.communityFollowRequests.filter(
      (id) => id.toString() !== userId,
    );
  }

  // add to rejected
  rejectedArray.push(userId);

  await club.save();

  return res.status(200).json(new ApiResponse(200, {}, "Request rejected"));
});

const getClubByContactInfo = asyncHandler(async (req, res) => {
  const { email, contactNumber } = req.body;
  if (!contactNumber || !email)
    throw new ApiError(401, "All fields are required");

  const club = await Club.find({
    "contactDetails.phone": contactNumber,
    "contactDetails.email": email,
  }).select("clubName contactDetails.email contactDetails.phone images.logo");

  if (club.length === 0) throw new ApiError(400, "No club found !");
  if (club.length > 1) {
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          club,
          "The otp has been sent to your contact number",
        ),
      );
  }

  if (club.length === 1) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    club.otp = otp;
    await sendLoginOtpSMS(contactNumber, otp);
    await club.save();

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          club,
          "The otp has been sent to your contact number",
        ),
      );
  }
});

const otpForClubById = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const { clubName, clubEmail } = req.body;

  const club = await Club.findById(clubId).select(
    "clubName contactDetails.email contactDetails.phone images.logo",
  );
  if (!club) throw new ApiError(400, "Club not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  club.otp = otp;
  await club.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { club, otp },
        "The otp has been sent to your contact number",
      ),
    );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, contactNumber, otp } = req.body;
  const { clubId } = req.params;
  const club = await Club.findById(clubId).populate(
    "location.state location.city",
  );
  if (!club) throw new ApiError(400, "Invalid request");

  if (String(club.otp) !== String(otp)) {
    throw new ApiError(401, "Invalid OTP Please register again.");
  }

  club.otp = undefined;
  res
    .status(201)
    .json(new ApiResponse(201, club, "OTP verified successfully !"));
});

const uploadGalleryImages = asyncHandler(async (req, res) => {
  const { clubId } = req.params;

  const club = await Club.findById(clubId);

  if (!club) throw new ApiError(404, "Club not found");

  const uploadedImages = [];

  for (const file of req.files) {
    const uploaded = await UploadImages(
      file.filename,
      {
        folderStructure: `/clubs/${club.clubName}/gallery`,
      },
      ["club-gallery"],
    );

    uploadedImages.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
    });
  }

  club.images.gallery.push(...uploadedImages);

  await club.save();

  res
    .status(201)
    .json(new ApiResponse(201, club.images.gallery, "Gallery updated"));
});

const removeGalleryImage = asyncHandler(async (req, res) => {
  const { clubId, imageId } = req.params;

  const club = await Club.findById(clubId);

  if (!club) throw new ApiError(404, "Club not found");

  const image = club.images.gallery.id(imageId);

  if (!image) throw new ApiError(404, "Image not found");

  await DeleteImage(image.fileId);

  club.images.gallery = club.images.gallery.filter(
    (img) => String(img._id) !== String(imageId),
  );

  await club.save();

  res.status(200).json(new ApiResponse(200, {}, "Image removed"));
});

const guestEnquiryForEvents = asyncHandler(async (req, res) => {
  const { clubId, eventId } = req.params;
  if (!clubId || !eventId)
    throw new ApiError(400, "Something went wrong try again later");

  const { name, contactNumber, email, address } = req.body;
  if (!name || !contactNumber || !email || !address)
    throw new ApiError(400, "Please fill all details");

  const club = await Club.findById(clubId);
  if (!club) throw new ApiError(400, "Invalid club request");

  const event = club.events.id(eventId);
  if (!event) throw new ApiError(404, "Event not found");

  const alreadyJoined = event.joinedUsers.find(
    (user) => user.email === email || user.contactNumber === contactNumber,
  );
  if (alreadyJoined) throw new ApiError(400, "You already joined this event");

  event.joinedUsers.push({
    name,
    contactNumber,
    email,
    address,
  });

  await club.save();

  return res
    .status(200)
    .json(new ApiResponse(200, event.joinedUsers, "Successfully joined event"));
});

const getAllUpcomingAndOngoingEvents = asyncHandler(async (req, res) => {
  const currentDate = new Date();

  const events = await Club.aggregate([
    {
      $unwind: "$events",
    },

    {
      $match: {
        "events.validUpto": {
          $gte: currentDate,
        },
      },
    },

    {
      $project: {
        clubId: "$_id",
        clubName: 1,
        clubImage: "$images.coverImage",
        // location: "$city.name",

        eventId: "$events._id",
        title: "$events.title",
        description: "$events.description",
        validFrom: "$events.validFrom",
        validUpto: "$events.validUpto",

        totalParticipants: {
          $size: {
            $ifNull: ["$events.joinedUsers", []],
          },
        },
      },
    },

    {
      $sort: {
        validFrom: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, events, "Events fetched successfully"));
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
  removeMember,
  addClubEvent,
  removeEvent,
  addParikramaHotel,
  followRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  getClubByContactInfo,
  otpForClubById,
  verifyOtp,
  uploadGalleryImages,
  removeGalleryImage,
  guestEnquiryForEvents,
  getAllUpcomingAndOngoingEvents,
};
