import { Community } from "../models/communities.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages, DeleteImage } from "../utils/imageKit.io.js";
import { generateAccessAndRefreshTokens } from "../utils/TokenGenerator.js";

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
  } = req.body;

  if (
    !name ||
    !contactNumber ||
    !password ||
    !communityName ||
    !communityContactNumber ||
    !profession
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  const existing = await Community.findOne({
    $or: [
      { "personalDetails.email": email },
      { "personalDetails.contactNumber": contactNumber },
      { "communityDetails.communityContactNumber": communityContactNumber },
      { "communityDetails.communityEmail": communityEmail },
    ],
  });

  if (existing) {
    throw new ApiError(409, "Community already exists with provided details");
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
        AccessToken,
        RefreshToken,
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
  const { id } = req.params;

  const community = await Community.findById(id);

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, community, "Community fetched"));
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

export {
  registerCommunity,
  loginCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  verifyCommunity,
  toggleCommunityStatus,
};
