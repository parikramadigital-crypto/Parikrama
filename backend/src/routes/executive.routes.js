import { Router } from "express";
import { createExecutive } from "../controllers/executive.controllers.js";

const router = Router();

router.route("/add/register/new-executive").post(createExecutive);

export default router;
