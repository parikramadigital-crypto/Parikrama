import { Router } from "express";
import { searchByCityOrState } from "../controllers/search.controllers.js";

const router = Router();

/* Public search */
router.route("/").get(searchByCityOrState);

export default router;
