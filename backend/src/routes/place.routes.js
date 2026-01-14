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

const router = Router();

/* Public routes */
router.route("/").get(getAllPlaces);
router.route("/:id").get(getPlaceById);
router.route("/city/:cityId").get(getPlacesByCity);
router.route("/related-places/:query").get(getPlacesByCity);

/* Admin routes */
// router.route("/register-new-place").post(VerifyUser, createPlace);
router.route("/register-new-place").post(createPlace);
router.route("/:id").post(VerifyUser, updatePlace);
router.route("/:id").delete(VerifyUser, deletePlace);

export default router;
