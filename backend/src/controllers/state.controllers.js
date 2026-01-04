import { State } from "../models/state.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * CREATE STATE
 */
export const createState = asyncHandler(async (req, res) => {
  const { name, code } = req.body;

  if (!name) throw new ApiError(400, "State name is required");

  const existing = await State.findOne({ name });
  if (existing) throw new ApiError(409, "State already exists");

  const state = await State.create({ name, code });

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
  const state = await State.findById(req.params.id);
  if (!state) throw new ApiError(404, "State not found");

  res.status(200).json(new ApiResponse(200, state));
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
