import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middleware.js";
import {
  createCity,
  getAllCities,
  getCityById,
  getCitiesByState,
  updateCity,
  deleteCity,
} from "../controllers/city.controllers.js";

const router = Router();

/* Public routes */
router.route("/").get(getAllCities);
router.route("/:id").get(getCityById);
router.route("/state/:stateId").get(getCitiesByState);

/* Admin routes */
router.route("/").post(VerifyUser, createCity);
router.route("/:id").post(VerifyUser, updateCity);
router.route("/:id").delete(VerifyUser, deleteCity);

export default router;
