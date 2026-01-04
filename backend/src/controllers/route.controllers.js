import { Place } from "../models/place.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GENERATE OPTIMIZED ROUTE
 */
export const generateRoute = asyncHandler(async (req, res) => {
  const { cityId, startLat, startLng } = req.body;

  const places = await Place.find({
    city: cityId,
    isActive: true,
  });

  let current = { lat: startLat, lng: startLng };
  const route = [];

  const remaining = [...places];

  while (remaining.length) {
    let nearestIndex = 0;
    let minDist = Infinity;

    remaining.forEach((p, i) => {
      const [lng, lat] = p.location.coordinates;
      const dist = Math.hypot(lat - current.lat, lng - current.lng);
      if (dist < minDist) {
        minDist = dist;
        nearestIndex = i;
      }
    });

    const next = remaining.splice(nearestIndex, 1)[0];
    route.push(next);

    current = {
      lat: next.location.coordinates[1],
      lng: next.location.coordinates[0],
    };
  }

  res
    .status(200)
    .json(new ApiResponse(200, route, "Route generated successfully"));
});
