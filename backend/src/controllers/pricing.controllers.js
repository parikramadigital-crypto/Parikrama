import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";
import { Pricing } from "../models/pricing.models.js";

const createPricingModel = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const {
    modelFor,
    modelName,
    tagline,
    mrp,
    discount,
    sellingPrice,
    planDuration,
    customModelFor,
  } = req.body;

  if (
    !modelFor ||
    !modelName ||
    !tagline ||
    !mrp ||
    !discount ||
    !sellingPrice ||
    !planDuration
  )
    throw new ApiError(400, "All fields are required");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid request");

  const { features, faqs } = JSON.parse(req.body.arrayData);

  if (admin.restrictedAccess === true) {
    const pricingModel = await Pricing.create({
      admin: adminId,
      modelFor,
      customModelFor,
      modelName,
      tagline,
      price: { mrp: mrp, discount: discount, sellingPrice: sellingPrice },
      planDuration,
      features: features,
      faqs: faqs,
      isActive: false,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, pricingModel, "Created successfully !"));
  }
  if (admin.restrictedAccess === false) {
    const pricingModel = await Pricing.create({
      admin: adminId,
      modelFor,
      customModelFor,
      modelName,
      tagline,
      price: { mrp: mrp, discount: discount, sellingPrice: sellingPrice },
      planDuration,
      features: features,
      faqs: faqs,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, pricingModel, "Created successfully !"));
  }
});

const markAsActive = asyncHandler(async (req, res) => {
  const { adminId, pricingModelId } = req.params;
  if (!adminId) throw new ApiError(400, "Invalid request");

  const pricingModel = await Pricing.findByIdAndUpdate(pricingModelId, {
    isActive: true,
  });
  if (!pricingModel)
    throw new ApiError(400, "Something went wrong, please try again later !");

  return res
    .status(200)
    .json(new ApiResponse(200, pricingModel, "Marked as active !"));
});

const markAsInactive = asyncHandler(async (req, res) => {
  const { adminId, pricingModelId } = req.params;
  if (!adminId) throw new ApiError(400, "Invalid request");

  const pricingModel = await Pricing.findByIdAndUpdate(pricingModelId, {
    isActive: false,
  });
  if (!pricingModel)
    throw new ApiError(400, "Something went wrong, please try again later !");

  return res
    .status(200)
    .json(new ApiResponse(200, pricingModel, "Marked as inactive !"));
});

const deletePricingModel = asyncHandler(async (req, res) => {
  const { adminId, pricingModelId } = req.params;
  if (!adminId || !pricingModelId) throw new ApiError(400, "Invalid request");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Unable to process request !");

  if (admin.restrictedAccess === true) {
    throw new ApiError(400, "You are not authorized for deleting this package");
  }
  if (admin.restrictedAccess === false) {
    const pricingPackage = await Pricing.findByIdAndDelete(pricingModelId);
    if (!pricingPackage)
      throw new ApiError(400, "Package deletion unsuccessful !");

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Pricing model deleted successfully !"));
  }
});

const getAllPricingModel = asyncHandler(async (req, res) => {
  const pricingModel = await Pricing.find().select(
    "madeFor modelName planDuration isActive",
  );
  if (!pricingModel) throw new ApiError(400, "No models found");

  return res
    .status(200)
    .json(new ApiResponse(200, pricingModel, "Data fetched successfully !"));
});

const getPricingModelById = asyncHandler(async (req, res) => {
  const { pricingModelId } = req.params;
  if (!pricingModelId) throw new ApiError(400, "Model Id not found !");

  const pricingModel = await Pricing.findById(pricingModelId, {
    isActive: true,
  }).select("-admin");
  if (!pricingModel) throw new ApiError(400, "No model found");

  return res
    .status(200)
    .json(new ApiResponse(200, pricingModel, "Data fetched successfully !"));
});

export {
  createPricingModel,
  markAsActive,
  markAsInactive,
  deletePricingModel,
  getAllPricingModel,
  getPricingModelById,
};
