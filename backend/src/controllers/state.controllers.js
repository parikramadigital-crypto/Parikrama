import { Admin } from "../models/admin.models.js";
import { City } from "../models/city.models.js";
import { Place } from "../models/place.models.js";
import { State } from "../models/state.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * CREATE STATE
 */
export const createState = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  /**
   * CASE 1: BULK INSERT
   * Expected body:
   * {
   *   "states": [{ "name": "Madhya Pradesh", "code": "MP" }, ...]
   * }
   */
  if (Array.isArray(req.body.states)) {
    const states = req.body.states;

    if (!states.length) {
      throw new ApiError(400, "States array cannot be empty");
    }

    // Normalize + validate
    const formattedStates = states
      .filter((s) => s?.name)
      .map((s) => ({
        name: s.name.trim(),
        code: s.code?.trim() || "",
      }));

    if (!formattedStates.length) {
      throw new ApiError(400, "No valid states provided");
    }

    const insertedStates = await State.insertMany(formattedStates, {
      ordered: false, // skip duplicates
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          insertedCount: insertedStates.length,
          states: insertedStates,
        },
        "States added successfully"
      )
    );
  }

  /**
   * CASE 2: SINGLE INSERT (OLD BEHAVIOR)
   * Expected body:
   * {
   *   "name": "Madhya Pradesh",
   *   "code": "MP"
   * }
   */
  const { name, code } = req.body;
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return new ApiError(403, "Only admins can create states");
  }
  if (!name) throw new ApiError(400, "State name is required");

  const existing = await State.findOne({ name: name.trim() });
  if (existing) throw new ApiError(409, "State already exists");

  const state = await State.create({
    name: name.trim(),
    code: code?.trim() || "",
  });

  res.status(201).json(new ApiResponse(201, state, "State created"));
});

/**
 * GET ALL STATES
 */
export const getAllStates = asyncHandler(async (req, res) => {
  const states = await State.find().sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, states));
});

/**
 * GET SINGLE STATE
 */
export const getStateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const state = await State.findById(id);
  if (!state) {
    throw new ApiError(404, "State not found");
  }

  const cities = await City.find({ state: id }).select("_id name location");
  const places = await Place.find({ state: id }).populate("city state");

  res.status(200).json(
    new ApiResponse(
      200,
      {
        state,
        cities,
        places,
      },
      "State with cities fetched successfully"
    )
  );
});

/**
 * UPDATE STATE
 */
export const updateState = asyncHandler(async (req, res) => {
  const updated = await State.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new ApiError(404, "State not found");

  res.status(200).json(new ApiResponse(200, updated, "State updated"));
});

/**
 * DELETE STATE
 */
export const deleteState = asyncHandler(async (req, res) => {
  const deleted = await State.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, "State not found");

  res.status(200).json(new ApiResponse(200, null, "State deleted"));
});
