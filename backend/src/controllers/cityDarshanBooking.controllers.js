import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CityDarshan } from "../models/cityDarshan.models.js";
import { UploadImages } from "../utils/imageKit.io.js";
import { UserSchema } from "../models/user.models.js";
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

export { bookCityDarshan };
