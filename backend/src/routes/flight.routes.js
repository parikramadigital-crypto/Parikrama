import { Router } from "express";
import { searchFlights } from "../controllers/flight.controllers.js";

const router = Router();

router.route("/flight-enquiry").post(searchFlights);

export default router;
