import { Place } from "../models/place.models.js";
import { State } from "../models/state.models.js";
import { Country } from "../models/country.models.js";

export async function getDirectMatches(query) {
  return await Place.find(
    {
      $text: { $search: query },
    },
    {
      score: { $meta: "textScore" },
    },
  )
    .sort({ score: { $meta: "textScore" } })
    .select("name category images")
    .populate("city", "name")
    .populate("state", "name")
    .limit(20);
}

export async function getFuzzyMatches(query, excludeIds) {
  const terms = query.split(" ").filter((t) => t.length > 1);

  const regex = terms.map((t) => new RegExp(t, "i"));
  const matchingCountries = await Country.find({
    $or: regex.map((term) => ({ name: term })),
  }).select("_id");
  const matchingStates = matchingCountries.length
    ? await State.find({
        country: { $in: matchingCountries.map((country) => country._id) },
      }).select("_id")
    : [];

  return await Place.find({
    _id: { $nin: excludeIds },
    isActive: true,
    $or: [
      { name: { $in: regex } },
      { cityName: { $in: regex } },
      { stateName: { $in: regex } },
      ...(matchingStates.length
        ? [{ state: { $in: matchingStates.map((state) => state._id) } }]
        : []),
      { description: { $in: regex } },
      { category: { $in: regex } },
      { tags: { $in: terms } },
    ],
  })
    .select("name category images")
    .populate("city", "name")
    .populate("state", "name")
    .limit(20);
}

export async function getExpansionTags(ids) {
  return await Place.aggregate([
    { $match: { _id: { $in: ids } } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]).then((res) => res.map((t) => t._id));
}

export async function getExpandedMatches({ excludeIds, tags, limit }) {
  if (!tags.length) return [];

  return await Place.find({
    _id: { $nin: excludeIds },
    tags: { $in: tags },
    isActive: true,
  })
    .sort({ popularity: -1 })
    .select("name category images")
    .populate("city", "name")
    .populate("state", "name")
    .limit(limit);
}

export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in KM

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in KM
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

export function applyGeoBoost(results, lat, lng) {
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  return results.map((place) => {
    const obj = place.toObject ? place.toObject() : place;

    if (!obj.location?.coordinates) return obj;

    const [placeLng, placeLat] = obj.location.coordinates;

    const distance = getDistance(userLat, userLng, placeLat, placeLng);

    return {
      ...obj,
      _geoScore: 1 / (distance + 1),
    };
  });
}

export function rankResults(results) {
  return results.sort((a, b) => {
    const scoreA =
      (a.score || 0) * 3 + (a._geoScore || 0) * 2 + (a.popularity || 0);

    const scoreB =
      (b.score || 0) * 3 + (b._geoScore || 0) * 2 + (b.popularity || 0);

    return scoreB - scoreA;
  });
}

export async function getTrendingPlaces(limit) {
  return await Place.find({ isActive: true })
    .sort({ popularity: -1, createdAt: -1 })
    .select("name category images")
    .populate("city", "name")
    .populate("state", "name")
    .limit(limit);
}

export function sendResponse(
  res,
  data,
  page = 1,
  total = 0,
  limit = 20,
  strategy,
) {
  return res.json({
    results: data,
    totalResults: total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    strategy,
  });
}
