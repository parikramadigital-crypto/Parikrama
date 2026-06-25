import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middlewares.js";

import {
  createTravelPackage,
  getAllTravelPackages,
  getTravelPackageById,
  updateTravelPackage,
  deleteTravelPackage,
  getPackageByCountry,
  getPackageByPriority,
  markAsInactive,
  markAsActive,
} from "../controllers/package.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/").get(getAllTravelPackages);

router.route("/:id").get(getTravelPackageById);

router.route("/filter-country/:query").get(getPackageByCountry);
router.route("/by-priority/status").get(getPackageByPriority);

router.route("/mark-as/inactive/:adminId/:packageId").post(markAsInactive);
router.route("/mark-as/active/:adminId/:packageId").post(markAsActive);

router
  .route("/register-package/:adminId")
  .post(upload.single("image"), createTravelPackage);

router.route("/:id").post(VerifyUser, updateTravelPackage);

router.route("/delete-package/:adminId/:id").delete(deleteTravelPackage);

export default router;
