import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middlewares.js";
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
router.route("/register-city/:adminId").post(createCity);
// router.route("/register-city").post(createCity);
router.route("/:id").post(VerifyUser, updateCity);
router.route("/delete-city/:adminId/:id").delete(deleteCity);

export default router;
