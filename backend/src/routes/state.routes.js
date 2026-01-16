import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middlewares.js";
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
router.route("/state-by-id/:id").get(getStateById);

/* Admin routes */
router.route("/add/new/state/:adminId").post(createState);
router.route("/bulk").post(createState);
router.route("/:id").post(VerifyUser, updateState);
router.route("/:id").delete(VerifyUser, deleteState);

export default router;
