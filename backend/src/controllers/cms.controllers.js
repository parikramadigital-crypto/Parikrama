import { Admin } from "../models/admin.models.js";
import { CMSSchema } from "../models/cms.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const upsertTermsOfService = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { description, points } = req.body;
  console.log("from controller", description, points);

  if (!adminId) throw new ApiError(401, "Admin ID required");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(403, "Unauthorized admin");

  let doc = await CMSSchema.findOne();

  if (!doc) doc = new CMSSchema();

  doc.termsOfService = {
    description: description || "",
    points: points || [],
  };

  await doc.save();

  res.status(200).json(new ApiResponse(200, doc, "Terms of Service saved"));
});

const upsertPrivacyPolicy = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { description, points } = req.body;

  if (!adminId) throw new ApiError(401, "Admin ID required");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(403, "Unauthorized admin");

  let doc = await CMSSchema.findOne();
  if (!doc) doc = new CMSSchema();

  doc.privacyPolicy = {
    description: description || "",
    points: points || [],
  };

  await doc.save();

  res.status(200).json(new ApiResponse(200, doc, "Privacy Policy saved"));
});

const upsertHowSiteWork = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { description, points } = req.body;

  if (!adminId) throw new ApiError(401, "Admin ID required");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(403, "Unauthorized admin");

  let doc = await CMSSchema.findOne();
  if (!doc) doc = new CMSSchema();

  doc.howThisSiteWork = {
    description: description || "",
    points: points || [],
  };

  await doc.save();

  res.status(200).json(new ApiResponse(200, doc, "How This Site Works saved"));
});

const deleteTermsSection = asyncHandler(async (req, res) => {
  const { adminId, section } = req.params;

  if (!adminId) throw new ApiError(401, "Admin ID required");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(403, "Unauthorized admin");

  const allowed = ["termsOfService", "privacyPolicy", "howThisSiteWork"];

  if (!allowed.includes(section)) {
    throw new ApiError(400, "Invalid section name");
  }

  const doc = await CMSSchema.findOne();
  if (!doc) throw new ApiError(404, "No data found");

  doc[section] = { description: "", points: [] };

  await doc.save();

  res
    .status(200)
    .json(new ApiResponse(200, doc, `${section} deleted successfully`));
});

const getTermsAndConditions = asyncHandler(async (req, res) => {
  const doc = await CMSSchema.findOne();

  if (!doc) {
    return res.status(200).json(new ApiResponse(200, {}, "No terms available"));
  }

  res.status(200).json(new ApiResponse(200, doc));
});

export {
  upsertTermsOfService,
  upsertPrivacyPolicy,
  upsertHowSiteWork,
  deleteTermsSection,
  getTermsAndConditions,
};
