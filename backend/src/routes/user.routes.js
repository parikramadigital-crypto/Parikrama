import { Router } from "express";
import {
  createUser,
  getBookings,
  loginUser,
  refreshUserToken,
  updateProfile,
  verifyUserOtp,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/create-user").post(createUser);
router.route("/verify-user").post(verifyUserOtp);
router.route("/login-user").post(loginUser);
router.route("/update-profile/:userId").post(updateProfile);
router.route("/get-bookings/:userId").get(getBookings);

// Refresh token
router.route("/auth/refresh-tokens").post(refreshUserToken);

export default router;
