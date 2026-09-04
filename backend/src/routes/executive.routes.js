import { Router } from "express";
import { createExecutive } from "../controllers/executive.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/add/register/new-executive/:adminId")
  .post(upload.single("image"), createExecutive);

export default router;
