import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CityDarshan } from "../models/cityDarshan.models.js";
import { UploadImages } from "../utils/imageKit.io.js";
import { UserSchema } from "../models/user.models.js";
import { Community } from "../models/communities.models.js";
import { CityDarshanBooking } from "../models/cityDarshanBooking.models.js";

const bookCityDarshan = asyncHandler(async (req, res) => {
  const { userId, cityDarshanId } = req.params;

  const {
    vehicleType,
    adults,
    children,
    travelDate,
    pickupLocation,
    pickupTime,
    specialInstructions,
  } = req.body;

  /* ================= VALIDATION ================= */

  if (
    !userId ||
    !cityDarshanId ||
    !vehicleType ||
    !travelDate ||
    !pickupLocation
  ) {
    throw new ApiError(400, "Required fields are missing.");
  }

  /* ================= USER ================= */

  const user = await UserSchema.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  /* ================= PACKAGE ================= */

  const cityDarshan = await CityDarshan.findById(cityDarshanId);

  if (!cityDarshan) {
    throw new ApiError(404, "City Darshan package not found.");
  }

  if (!cityDarshan.isActive || !cityDarshan.isVerified) {
    throw new ApiError(400, "This package is currently unavailable.");
  }

  /* ================= VEHICLE ================= */

  const selectedVehicle = cityDarshan.vehicles.find(
    (vehicle) => vehicle.vehicleType === vehicleType,
  );

  if (!selectedVehicle) {
    throw new ApiError(404, "Selected vehicle is unavailable.");
  }

  /* ================= PERSON VALIDATION ================= */

  const totalPersons = (Number(adults) || 0) + (Number(children) || 0);

  if (totalPersons <= 0) {
    throw new ApiError(400, "At least one traveller is required.");
  }

  if (totalPersons > selectedVehicle.maxPersons) {
    throw new ApiError(
      400,
      `Maximum ${selectedVehicle.maxPersons} persons are allowed for ${selectedVehicle.vehicleType}.`,
    );
  }

  /* ================= CREATE BOOKING ================= */

  const booking = await CityDarshanBooking.create({
    user: user._id,

    cityDarshan: cityDarshan._id,

    vehicle: {
      vehicleType: selectedVehicle.vehicleType,
      maxPersons: selectedVehicle.maxPersons,
      price: selectedVehicle.price,
    },

    adults: Number(adults) || 0,

    children: Number(children) || 0,

    travelDate,

    pickupLocation,

    pickupTime,

    specialInstructions,

    totalAmount: selectedVehicle.price,

    bookingStatus: "Pending",

    paymentStatus: "Pending",
  });

  /* ================= RESPONSE ================= */

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "City Darshan booked successfully."));
});

const startCityDarshanBooking = asyncHandler(async (req, res) => {
  const { userId, cityDarshanId } = req.params;

  const {
    travelDate,
    pickupTime,
    pickupLocation,
    specialInstructions = "",
    adults,
    children = 0,
    vehicleType,
  } = req.body;

  if (!userId || !cityDarshanId) {
    throw new ApiError(400, "User id and City Darshan id are required");
  }

  if (
    !travelDate ||
    !pickupTime ||
    !pickupLocation ||
    !adults ||
    !vehicleType
  ) {
    throw new ApiError(
      400,
      "travelDate, pickupTime, pickupLocation, adults and vehicleType are required",
    );
  }

  const user = await UserSchema.findById(userId);
  const communityUser = await Community.findById(userId);

  // if (!user || !communityUser) throw new ApiError(400, "User not found");

  const cityDarshan = await CityDarshan.findById(cityDarshanId);
  if (!cityDarshan) {
    throw new ApiError(404, "City Darshan package not found");
  }

  const numericAdults = Number(adults);
  const numericChildren = Number(children || 0);

  if (Number.isNaN(numericAdults) || numericAdults < 1) {
    throw new ApiError(400, "At least 1 adult is required");
  }

  if (Number.isNaN(numericChildren) || numericChildren < 0) {
    throw new ApiError(400, "Invalid children count");
  }

  const selectedVehicle = cityDarshan.vehicles?.find(
    (vehicle) => vehicle.vehicleType === vehicleType,
  );

  if (!selectedVehicle) {
    throw new ApiError(
      404,
      "Selected vehicle is not available for this package",
    );
  }

  const totalTravellers = numericAdults + numericChildren;

  if (
    selectedVehicle.maxPersons &&
    totalTravellers > Number(selectedVehicle.maxPersons)
  ) {
    throw new ApiError(
      400,
      `Selected vehicle allows maximum ${selectedVehicle.maxPersons} travellers`,
    );
  }

  const totalAmount = Number(selectedVehicle.price);

  const booking = await CityDarshanBooking.create({
    cityDarshan: cityDarshan._id,
    user: user?._id || null,
    community: communityUser?._id || null,
    travelDate: new Date(travelDate),
    pickupTime,
    pickupLocation,
    specialInstructions,
    adults: numericAdults,
    children: numericChildren,
    totalTravellers,
    vehicle: {
      vehicleType: selectedVehicle.vehicleType,
      maxPersons: selectedVehicle.maxPersons,
      price: selectedVehicle.price,
    },
    totalAmount,
    bookingStatus: "Pending",
    paymentStatus: "Created",
    remarks: "Booking initiated. Awaiting payment.",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        booking,
        "City Darshan booking started successfully. Proceed to payment.",
      ),
    );
});

const getUserCityDarshanBookings = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id is required");
  }

  const bookings = await CityDarshanBooking.find({ user: userId })
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

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        bookings,
        "City Darshan bookings fetched successfully",
      ),
    );
});

export { startCityDarshanBooking, getUserCityDarshanBookings };
