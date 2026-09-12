import { Router } from "express";
import {
  createExecutive,
  createFacilitatorExecutive,
  createFoodCourtExecutive,
  dashboardData,
  deleteExecutive,
  loginExecutive,
  regenerateExecutiveRefreshToken,
} from "../controllers/executive.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/add/register/new-executive/:adminId")
  .post(upload.single("image"), createExecutive);
router.route("/login/executive").post(loginExecutive);
router.route("/auth/refresh-tokens").post(regenerateExecutiveRefreshToken);
router.route("/dashboard/:executiveId").get(dashboardData);

router.route("/create/new/executive/verified/food-court/:executiveId").post(
  upload.fields([
    { name: "storeImages", maxCount: 5 },
    { name: "menuImages", maxCount: 5 },
    { name: "foodImages", maxCount: 5 },
  ]),
  createFoodCourtExecutive,
);

router
  .route("/create/new/facilitator/verified/facilitator/:executiveId")
  .post(upload.single("image"), createFacilitatorExecutive);

router.route("/delete-executive/:adminId/:executiveId").delete(deleteExecutive);

export default router;
