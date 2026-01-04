import Jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const VerifyUser = (roles = []) => {
  return (req, res, next) => {
    const token =
      req.cookies?.AccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    try {
      const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        throw new ApiError(403, "Access denied");
      }

      req.user = decoded;
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }
  };
};
