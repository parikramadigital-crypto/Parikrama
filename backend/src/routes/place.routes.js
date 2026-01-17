import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middlewares.js";
import {
  createPlace,
  getAllPlaces,
  getPlacesByCity,
  getPlaceById,
  updatePlace,
  deletePlace,
} from "../controllers/place.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

/* Public routes */
router.route("/").get(getAllPlaces);
router.route("/:id").get(getPlaceById);
router.route("/city/:cityId").get(getPlacesByCity);
router.route("/related-places/:query").get(getPlacesByCity);

/* Admin routes */
// router.route("/register-new-place").post(VerifyUser, createPlace);
router
  .route("/register-new-place/:adminId")
  .post(upload.array("images", 5), createPlace);
router.route("/update/:placeId").post(upload.array("images", 5), updatePlace);
router.route("/delete-place/:adminId/:id").delete(deletePlace);

export default router;
