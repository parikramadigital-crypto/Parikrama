import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UploadImages, DeleteImage } from "../utils/imageKit.io.js";
import { Admin } from "../models/admin.models.js";
import { Executive } from "../models/executive.models.js";

const sanitizeFolderName = (value = "") => {
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
};

const createExecutive = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  if (!adminId) throw new ApiError(400, "Invalid request");
  const {
    name,
    contactNumber,
    alternateContactNumber,
    email,
    employeeId,
    password,
    otherCity,
    otherCityName,
    city,
    otherState,
    otherStateName,
    state,
  } = req.body;

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Not a valid admin");

  let uploadedImage = null;
  if (req.file) {
    uploadedImage = await UploadImages(req?.file?.filename, {
      folderStructure: `profileImage/executive/${sanitizeFolderName(name)}`,
    });
  }

  const newExecutive = await Executive.create({
    name,
    contactNumber,
    alternateContactNumber,
    email,
    employeeId,
    image: { url: uploadedImage.url, fileId: uploadedImage.fileId },
    password,
    otherCity,
    otherCityName,
    city,
    otherState,
    otherStateName,
    state,
    admin: adminId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { newExecutive, password }, "Created Successfully"),
    );
});

export { createExecutive };
