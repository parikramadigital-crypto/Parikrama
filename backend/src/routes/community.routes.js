import { Router } from "express";
import {
  registerCommunity,
  loginCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  verifyCommunity,
  toggleCommunityStatus,
  refreshCommunityToken,
} from "../controllers/community.controllers.js";
import { VerifyAdmin } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { VerifyCommunity } from "../middlewares/community.middleware.js";

const router = Router();

router.route("/community/auth/register").post(
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  registerCommunity,
);

router.route("/community/auth/login").post(loginCommunity);

router.route("/community/details/:communityId").get(getCommunityById);

router.route("/community/all/list").get(getAllCommunities);

router.route("/community/profile/update/:communityId").patch(
  VerifyCommunity,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  updateCommunity,
);

router.route("/community/auth/refresh-token").post(refreshCommunityToken);

router
  .route("/community/admin/toggle-active-status/:adminId/:communityId")
  .patch(VerifyAdmin, toggleCommunityStatus);

router
  .route("/community/admin/verify-community/:adminId/:communityId")
  .patch(VerifyAdmin, verifyCommunity);

router
  .route("/community/admin/delete-community/:adminId/:communityId")
  .delete(VerifyAdmin, deleteCommunity);

/* ================= FUTURE SAFE ROUTES ================= */

// // Example: Community dashboard (you’ll need this soon)
// router
//   .route("/community/dashboard/:communityId")
//   .get(VerifyCommunity, (req, res) => {
//     res.send("Community dashboard route (to be implemented)");
//   });

// // Example: Community public profile
// router.route("/community/public/profile/:communityId").get((req, res) => {
//   res.send("Public community profile route (to be implemented)");
// });

export default router;
