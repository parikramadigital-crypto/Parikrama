import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  createFoodCourtAdmin,
  deleteFoodCourt,
  getFoodCourtById,
  getFoodCourtByPlaceId,
} from "../controllers/foodCourt.controllers.js";

const router = Router();

router.route("/create/new/food-court/:adminId").post(
  upload.fields([
    { name: "storeImages", maxCount: 5 },
    { name: "menuImages", maxCount: 5 },
    { name: "foodImages", maxCount: 5 },
  ]),
  createFoodCourtAdmin,
);
router.route("/get/food-court/by-id/:foodCourtId").get(getFoodCourtById);
router
  .route("/get/food-court/by-place-id/:foodCourtId")
  .get(getFoodCourtByPlaceId);
router.route("/update/food-court/by-id/:foodCourtId").post(
  upload.fields([
    { name: "storeImages", maxCount: 5 },
    { name: "menuImages", maxCount: 5 },
    { name: "foodImages", maxCount: 5 },
  ]),
  createFoodCourtAdmin,
);
router
  .route("/delete/food-court/by-id/:adminId/:foodCourtId")
  .delete(deleteFoodCourt);

export default router;
