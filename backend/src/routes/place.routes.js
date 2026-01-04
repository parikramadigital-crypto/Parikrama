import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middleware.js";
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

/* Admin routes */
router.route("/").post(VerifyUser, createPlace);
router.route("/:id").post(VerifyUser, updatePlace);
router.route("/:id").delete(VerifyUser, deletePlace);

export default router;
