import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middleware.js";
import { getAllStates } from "../controllers/state.controllers.js";
import { getAllCities } from "../controllers/city.controllers.js";
import { getAllPlaces } from "../controllers/place.controllers.js";

const router = Router();

/* Admin dashboard data */
router.route("/states").get(VerifyUser, getAllStates);
router.route("/cities").get(VerifyUser, getAllCities);
router.route("/places").get(VerifyUser, getAllPlaces);

export default router;
