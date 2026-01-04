import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middleware.js";
import {
  createState,
  getAllStates,
  getStateById,
  updateState,
  deleteState,
} from "../controllers/state.controllers.js";

const router = Router();

/* Public routes */
router.route("/").get(getAllStates);
router.route("/:id").get(getStateById);

/* Admin routes */
router.route("/").post(VerifyUser, createState);
router.route("/:id").post(VerifyUser, updateState);
router.route("/:id").delete(VerifyUser, deleteState);

export default router;
