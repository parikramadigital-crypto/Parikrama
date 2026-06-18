import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const searchFlights = asyncHandler(async (req, res) => {
  const { from, to } = req.body;
  const response = await axios.get("http://api.aviationstack.com/v1/flights", {
    params: {
      access_key: process.env.AVIATIONSTACK_API_KEY,
      dep_iata: from,
      arr_iata: to,
    },
  });
  if (!response)
    throw new ApiError(400, "Something went wrong, please try again later");
  return res.status(200).json(new ApiResponse(200, response.data, "Success"));
});

export { searchFlights };
