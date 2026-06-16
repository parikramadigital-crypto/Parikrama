import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.models.js";
import { EnquiryDetails } from "../models/enquiry.models.js";
import {
  sendCorporateEnquirySMS,
  sendFlightEnquirySMS,
  sendHotelEnquirySMS,
  sendPackageEnquirySMS,
} from "../workers/sms.workers.js";

const createCorporateEnquiry = asyncHandler(async (req, res) => {
  const {
    enquiryType,
    companyName,
    companyEmail,
    contactPersonName,
    contactPersonDesignation,
    contactNumber,
    comments,
    reviewedByAdmin,
    cityId,
    stateId,
    placeId,
  } = req.body;

  if (!enquiryType || !companyName || !companyEmail || !contactNumber)
    throw new ApiError(400, "Invalid response, please try again later");

  // CorporateEnquiry
  await sendCorporateEnquirySMS(contactNumber);

  const enquiry = await EnquiryDetails.create({
    enquiryType: enquiryType,
    corporate: {
      contactPersonName: contactPersonName,
      companyName: companyName,
      companyEmail: companyEmail,
      contactPersonDesignation: contactPersonDesignation,
      contactNumber: contactNumber,
      comments: comments,
    },
    cityId: cityId,
    stateId: stateId,
    placeId: placeId,
  });
  if (!enquiry) throw new ApiError(400, "Unable to send request !");

  return res
    .status(201)
    .json(new ApiResponse(201, enquiry, "Response submitted successfully !"));
});

const createEnquiry = asyncHandler(async (req, res) => {
  const {
    enquiryType,
    contactPersonName,
    contactPersonPhone,
    contactPersonEmail,
    comments,
    fromCity,
    toCity,
    fromDate,
    toDate,
    numberOfPerson,
    cityId,
    stateId,
    placeId,
    reviewedByAdmin,
  } = req.body;

  if (
    !enquiryType ||
    !contactPersonName ||
    !contactPersonPhone ||
    !contactPersonEmail
  )
    throw new ApiError(400, "Invalid response, please try again later");

  // PackageEnquiryForm
  if (enquiryType === "PackageEnquiryForm") {
    await sendPackageEnquirySMS(contactPersonPhone);
  }
  // ContactUsForm
  if (enquiryType === "ContactUsForm") {
    await sendPackageEnquirySMS(contactPersonPhone);
  }

  // flightBusHotel
  if (enquiryType === "flightBusHotel") {
    await sendFlightEnquirySMS(contactPersonPhone);
    await sendHotelEnquirySMS(contactPersonPhone);
  }
  const enquiry = await EnquiryDetails.create({
    enquiryType: enquiryType,
    formDetails: {
      contactPersonName: contactPersonName,
      contactPersonEmail: contactPersonEmail,
      contactPersonPhone: contactPersonPhone,
      comments: comments,
      fromCity: fromCity,
      toCity: toCity,
      fromDate: fromDate,
      toDate: toDate,
      numberOfPerson: numberOfPerson,
    },
    cityId: cityId,
    stateId: stateId,
    placeId: placeId,
  });
  if (!enquiry) throw new ApiError(400, "Unable to send request !");

  return res
    .status(201)
    .json(new ApiResponse(201, enquiry, "Response submitted successfully !"));
});

const getEnquiriesById = asyncHandler(async (req, res) => {
  const { adminId, enquiryId } = req.params;
  if (!adminId || !enquiryId) throw new ApiError(400, "Invalid request");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid access");

  const enquiry = await EnquiryDetails.findById(enquiryId);
  if (!enquiry) throw new ApiError(400, "Enquiry not found");

  return res
    .status(201)
    .json(new ApiResponse(201, enquiry, "Data fetched successfully !"));
});

const markEnquiryAsReviewed = asyncHandler(async (req, res) => {
  const { customerFeedBack } = req.body;
  const { adminId, enquiryId } = req.params;

  console.log("from controller", customerFeedBack, adminId);

  if (!customerFeedBack || !adminId)
    throw new ApiError(400, "Not a valid request");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid admin");

  const enquiry = await EnquiryDetails.findByIdAndUpdate(enquiryId, {
    customerFeedBack: customerFeedBack,
    adminId: adminId,
    reviewedByAdmin: true,
  });
  if (!enquiry)
    throw new ApiError(400, "Something went wrong, please try again later");

  return res
    .status(201)
    .json(new ApiResponse(201, enquiry, "Enquiry marked as reviewed."));
});

const markAsHot = asyncHandler(async (req, res) => {
  const { adminId, enquiryId } = req.params;
  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid admin");

  const enquiry = await EnquiryDetails.findByIdAndUpdate(enquiryId, {
    markAsHotLead: true,
  });
  if (!enquiry) throw new ApiError(400, "Enquiry details not found");

  return res
    .status(201)
    .json(new ApiResponse(201, enquiry, "Marked as Hot enquiry"));
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const { adminId, enquiryId } = req.body;
  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Invalid admin");

  const enquiry = await EnquiryDetails.findByIdAndDelete(enquiryId);
  if (!enquiry) throw new ApiError(400, "Unable to delete the enquiry");

  return res
    .status(201)
    .json(new ApiResponse(201, enquiry, "Enquiry deleted."));
});

export {
  createCorporateEnquiry,
  createEnquiry,
  getEnquiriesById,
  markEnquiryAsReviewed,
  markAsHot,
  deleteEnquiry,
};
