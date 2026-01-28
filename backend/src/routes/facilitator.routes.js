import { Router } from "express";
import {
  registerFacilitator,
  loginFacilitator,
  logoutFacilitator,
  refreshFacilitatorToken,
  getCurrentFacilitator,
  updateFacilitatorProfile,
  addFacilitatorSlots,
  bookFacilitatorSlot,
  verifyFacilitator,
  addFacilitatorReview,
  facilitatorDashboard,
} from "../controllers/facilitator.controllers.js";

import { VerifyFacilitator } from "../middlewares/facilitatorAuth.middleware.js";
import { VerifyUser } from "../middlewares/auth.middlewares.js";
import { VerifyAdmin } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

/* ================= AUTH ================= */

// Register facilitator
router.route("/register").post(
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "documentImage", maxCount: 2 },
  ]),
  registerFacilitator,
);

// Login facilitator
router.route("/login").post(loginFacilitator);

// Refresh token
router.route("/auth/refresh-token").post(refreshFacilitatorToken);

// Logout facilitator
router.route("/logout").post(VerifyFacilitator, logoutFacilitator);

/* ================= PROFILE ================= */

// Get own profile
router.route("/current-facilitator/:facilitatorId").get(getCurrentFacilitator);
router
  .route("/current-facilitator/dashboard/:facilitatorId")
  .get(facilitatorDashboard);

// Update own profile
router
  .route("/update-profile")
  .patch(VerifyFacilitator, updateFacilitatorProfile);

/* ================= AVAILABILITY ================= */

// Add availability slots
router.route("/slots").post(VerifyFacilitator, addFacilitatorSlots);

/* ================= BOOKINGS ================= */

// User books a facilitator slot
router.route("/book-slot").post(VerifyUser, bookFacilitatorSlot);

/* ================= ADMIN ================= */

// Admin verifies facilitator
router.route("/admin/verify").post(VerifyAdmin, verifyFacilitator);

router.route("/user/:facilitatorId/reviews").post(addFacilitatorReview);

export default router;
