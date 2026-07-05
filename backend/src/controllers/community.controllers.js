import { CityDarshanBooking } from "../models/cityDarshanBooking.models.js";
import { Community } from "../models/communities.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages, DeleteImage } from "../utils/imageKit.io.js";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";
import Jwt from "jsonwebtoken";

const registerCommunity = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    contactNumber,
    pan,
    aadhar,
    password,
    communityName,
    gst,
    communityContactNumber,
    communityEmail,
    profession,
    bankName,
    ifsc,
    accountNumber,
    accountHolderName,
    communityEstablishment,
    bio,
    soloTraveler,
    travelerInfo,
  } = req.body;

  if (
    !name ||
    !contactNumber ||
    !password ||
    !email
    // !communityName ||
    // !communityContactNumber ||
    // !profession
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  const existing = await Community.findOne({ email });
  // const existing = await Community.findOne({
  //   $or: [
  //     { "personalDetails.email": email },
  //     { "personalDetails.contactNumber": contactNumber },
  //     { "communityDetails.communityContactNumber": communityContactNumber },
  //     { "communityDetails.communityEmail": communityEmail },
  //   ],
  // });

  if (existing) {
    throw new ApiError(409, "Community already exists with provided details");
  }

  if (!soloTraveler) {
    throw new ApiError(400, "Please select travel type");
  }
  if (soloTraveler === "No" && !travelerInfo) {
    throw new ApiError(400, "Please specify traveller category");
  }

  let profileImage = {};
  let companyLogo = {};

  if (req.files?.profileImage?.[0]) {
    const uploaded = await UploadImages(req.files.profileImage[0].filename, {
      folderStructure: "community/profile",
    });
    profileImage = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }

  if (req.files?.companyLogo?.[0]) {
    const uploaded = await UploadImages(req.files.companyLogo[0].filename, {
      folderStructure: "community/logo",
    });
    companyLogo = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }

  const community = await Community.create({
    personalDetails: {
      name,
      email,
      contactNumber,
      pan,
      aadhar,
      password,
      soloTraveler,
      travelerInfo: soloTraveler === "No" ? travelerInfo : "",
    },
    communityDetails: {
      communityName,
      gst,
      communityContactNumber,
      communityEmail,
      profession,
      bankDetails: {
        bankName,
        ifsc,
        accountNumber,
        accountHolderName,
      },
    },
    communityEstablishment,
    about: bio,
    images: {
      profileImage,
      companyLogo,
    },
  });

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    community._id,
    "Community",
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        community,
        AccessToken,
        RefreshToken,
      },
      "Community registered successfully",
    ),
  );
});

const loginCommunity = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const community = await Community.findOne({
    "personalDetails.email": email,
  }).select("+personalDetails.password");

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  const isMatch = await community.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    community._id,
    "Community",
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        community,
        tokens: { AccessToken, RefreshToken },
      },
      "Login successful",
    ),
  );
});

const getAllCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, communities, "All communities fetched"));
});

const getCommunityById = asyncHandler(async (req, res) => {
  const { communityId } = req.params;
  const community = await Community.findById(communityId);

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, community, "Community fetched"));
});

const getCommunityDashboardData = asyncHandler(async (req, res) => {
  const { communityId } = req.params;
  const community = await Community.findById(communityId)
    .populate({
      path: "userFollowRequests",
      select: "name contactNumber",
    })
    .populate({
      path: "communityFollowRequests",
      select: "personalDetails images",
    })
    .populate({
      path: "acceptedRequestsCommunity",
      select: "personalDetails images",
    })
    .populate({
      path: "acceptedRequestsUser",
      select: "name contactNumber",
    })
    .lean();

  const bookings = await CityDarshanBooking.find({ community: communityId })
    .populate({
      path: "cityDarshan",
      select: "name images placesToCover totalDistance totalHours city state",
      populate: [
        { path: "city", select: "name" },
        { path: "state", select: "name" },
      ],
    })
    .populate({
      path: "paymentTransaction",
      select:
        "transactionNumber paymentStatus bookingStatus gatewayOrderId gatewayPaymentId amount currency createdAt",
    })
    .sort({ createdAt: -1 });

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { community, bookings }, "Community fetched"));
});

const updateCommunity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const community = await Community.findById(id);

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  const { name, email, contactNumber, communityName, profession, bio } =
    req.body;

  if (name) community.personalDetails.name = name;
  if (email) community.personalDetails.email = email;
  if (contactNumber) community.personalDetails.contactNumber = contactNumber;

  if (communityName) community.communityDetails.communityName = communityName;
  if (profession) community.communityDetails.profession = profession;

  if (bio) community.about = bio;

  if (req.files?.profileImage?.[0]) {
    if (community.images?.profileImage?.fileId) {
      await DeleteImage(community.images.profileImage.fileId);
    }

    const uploaded = await UploadImages(req.files.profileImage[0].filename, {
      folderStructure: "community/profile",
    });

    community.images.profileImage = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }

  await community.save();

  return res
    .status(200)
    .json(new ApiResponse(200, community, "Community updated successfully"));
});

const completeProfile = asyncHandler(async (req, res) => {
  const { communityId } = req.params;

  const {
    bio,
    communityName,
    gst,
    communityContactNumber,
    communityEmail,
    profession,
    bankName,
    ifsc,
    accountNumber,
    accountHolderName,
    communityEstablishment,
    branch,
    pan,
    aadhar,
    socialLinks,
  } = req.body;

  /* =========================
      VALIDATION
  ========================= */

  if (!communityName || !communityContactNumber || !profession) {
    throw new ApiError(400, "Required fields are missing.");
  }

  /* =========================
      SOCIAL LINKS
  ========================= */

  let parsedSocialLinks = [];

  if (socialLinks) {
    try {
      parsedSocialLinks =
        typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;

      parsedSocialLinks = parsedSocialLinks.filter(
        (link) => link.platformName?.trim() && link.url?.trim(),
      );

      parsedSocialLinks.forEach((link) => {
        try {
          new URL(link.url);
        } catch {
          throw new ApiError(400, `Invalid URL for ${link.platformName}`);
        }
      });
    } catch (err) {
      throw new ApiError(400, "Invalid social links format");
    }
  }

  /* =========================
      FIND COMMUNITY
  ========================= */

  const community = await Community.findById(communityId);

  if (!community) {
    throw new ApiError(400, "Invalid request");
  }

  /* =========================
      HANDLE IMAGE
  ========================= */

  let companyLogo = community.images.companyLogo || {};

  if (req.files?.companyLogo?.[0]) {
    const uploaded = await UploadImages(req.files.companyLogo[0].filename, {
      folderStructure: "community/logo",
    });

    companyLogo = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }

  /* =========================
      UPDATE
  ========================= */

  const updatedCommunity = await Community.findByIdAndUpdate(
    communityId,
    {
      $set: {
        "personalDetails.socialLinks": parsedSocialLinks,

        "personalDetails.pan": pan,

        "personalDetails.aadhar": aadhar,

        "communityDetails.communityName": communityName,

        "communityDetails.gst": gst,

        "communityDetails.communityContactNumber": communityContactNumber,

        "communityDetails.communityEmail": communityEmail,

        "communityDetails.profession": profession,

        "communityDetails.bankDetails.bankName": bankName,

        "communityDetails.bankDetails.ifsc": ifsc,

        "communityDetails.bankDetails.branch": branch || "",

        "communityDetails.bankDetails.accountNumber": accountNumber,

        "communityDetails.bankDetails.accountHolderName": accountHolderName,

        communityEstablishment,

        about: bio,

        "images.companyLogo": companyLogo,
      },
    },
    {
      new: true,
    },
  );

  /* =========================
      RESPONSE
  ========================= */

  res
    .status(201)
    .json(
      new ApiResponse(201, updatedCommunity, "Profile updated successfully!"),
    );
});

const addCommunityMember = asyncHandler(async (req, res) => {
  const { communityId } = req.params;
  const { name, email, phone, address, cityId, stateId } = req.body;

  if (!communityId || !name) {
    throw new ApiError(400, "Community ID and member name are required");
  }

  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "community not found");
  }

  const member = {
    name,
    email,
    contactNumber: phone,
    address,
    city: cityId,
    state: stateId,
  };

  community.members.push(member);
  await community.save();

  res
    .status(201)
    .json(new ApiResponse(201, community.members, "Member added successfully"));
});

const deleteCommunity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const community = await Community.findById(id);

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  if (community.images?.profileImage?.fileId) {
    await DeleteImage(community.images.profileImage.fileId);
  }

  if (community.images?.companyLogo?.fileId) {
    await DeleteImage(community.images.companyLogo.fileId);
  }

  await community.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Community deleted successfully"));
});

const verifyCommunity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const community = await Community.findById(id);

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  community.adminVerified = true;
  community.isValid = true;
  community.isActive = true;

  await community.save();

  return res
    .status(200)
    .json(new ApiResponse(200, community, "Community verified successfully"));
});

const toggleCommunityStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const community = await Community.findById(id);

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  community.isActive = !community.isActive;

  await community.save();

  return res
    .status(200)
    .json(new ApiResponse(200, community, "Community status updated"));
});

const refreshCommunityToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;
  if (!token) throw new ApiError(401, "Unauthorized request");
  const decoded = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const community = await Community.findById(decoded._id);
  if (!community) throw new ApiError(401, "Invalid refresh token");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    community._id,
    "Community",
  );

  return res.status(201).json(
    new ApiResponse(201, {
      user: community,
      tokens: { AccessToken, RefreshToken },
    }),
  );
});

const followRequest = asyncHandler(async (req, res) => {
  const { userId, userType } = req.body;
  const { communityId } = req.params;

  if (!userId || !userType) throw new ApiError(400, "Invalid request");

  const community = await Community.findById(communityId);
  if (!community) throw new ApiError(404, "Community not found");

  const isUser = userType.toLowerCase() === "user";

  const requestArray = isUser
    ? community.userFollowRequests
    : community.communityFollowRequests;

  // convert ObjectIds to string for safe comparison
  const alreadyRequested = requestArray.some((id) => id.toString() === userId);

  if (alreadyRequested) throw new ApiError(400, "Request already sent");

  requestArray.push(userId);
  await community.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Request sent successfully"));
});

const acceptFollowRequest = asyncHandler(async (req, res) => {
  const { userId, userType } = req.body;
  const { communityId } = req.params;

  const community = await Community.findById(communityId);
  if (!community) throw new ApiError(404, "Community not found");

  const isUser = userType.toLowerCase() === "user";

  const requestArray = isUser
    ? community.userFollowRequests
    : community.communityFollowRequests;

  const acceptedArray = isUser
    ? community.acceptedRequestsUser
    : community.acceptedRequestsCommunity;

  const exists = requestArray.some((id) => id.toString() === userId);

  if (!exists) throw new ApiError(400, "No such request found");

  // remove from request array
  if (isUser) {
    community.userFollowRequests = community.userFollowRequests.filter(
      (id) => id.toString() !== userId,
    );
  } else {
    community.communityFollowRequests =
      community.communityFollowRequests.filter(
        (id) => id.toString() !== userId,
      );
  }

  // add to accepted
  acceptedArray.push(userId);

  await community.save();

  return res.status(200).json(new ApiResponse(200, {}, "Request accepted"));
});

const rejectFollowRequest = asyncHandler(async (req, res) => {
  const { userId, userType } = req.body;
  const { communityId } = req.params;

  const community = await Community.findById(communityId);
  if (!community) throw new ApiError(404, "Community not found");

  const isUser = userType === "user";

  const requestArray = isUser
    ? community.userFollowRequests
    : community.communityFollowRequests;

  const rejectedArray = isUser
    ? community.rejectedRequestsUser
    : community.rejectedRequestsCommunity;

  const exists = requestArray.some((id) => id.toString() === userId);

  if (!exists) throw new ApiError(400, "No such request found");

  // remove from request list
  if (isUser) {
    community.userFollowRequests = community.userFollowRequests.filter(
      (id) => id.toString() !== userId,
    );
  } else {
    community.communityFollowRequests =
      community.communityFollowRequests.filter(
        (id) => id.toString() !== userId,
      );
  }

  // add to rejected
  rejectedArray.push(userId);

  await community.save();

  return res.status(200).json(new ApiResponse(200, {}, "Request rejected"));
});

export {
  registerCommunity,
  loginCommunity,
  getAllCommunities,
  getCommunityById,
  getCommunityDashboardData,
  updateCommunity,
  completeProfile,
  addCommunityMember,
  deleteCommunity,
  verifyCommunity,
  toggleCommunityStatus,
  refreshCommunityToken,
  followRequest,
  acceptFollowRequest,
  rejectFollowRequest,
};
