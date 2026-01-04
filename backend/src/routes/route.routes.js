import { Router } from "express";
import { generateRoute } from "../controllers/route.controllers.js";

const router = Router();

/* Public route generation */
router.route("/generate").post(generateRoute);

export default router;
