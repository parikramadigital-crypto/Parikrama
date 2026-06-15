import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  createFoodCourt,
  createFoodCourtAdmin,
  deleteFoodCourt,
  foodCourtFeed,
  getFoodCourtById,
  getFoodCourtByPlaceId,
  markAsActive,
  markAsInactiveAndNonVerified,
  verifyByAdmin,
  addFoodPlaceReview,
} from "../controllers/foodCourt.controllers.js";

const router = Router();

router.route("/create/new/food-court/public").post(
  upload.fields([
    { name: "storeImages", maxCount: 5 },
    { name: "menuImages", maxCount: 5 },
    { name: "foodImages", maxCount: 5 },
  ]),
  createFoodCourt,
);

router.route("/create/new/verified/food-court/:adminId").post(
  upload.fields([
    { name: "storeImages", maxCount: 5 },
    { name: "menuImages", maxCount: 5 },
    { name: "foodImages", maxCount: 5 },
  ]),
  createFoodCourtAdmin,
);

router.route("/get/food-court/by-id/:foodCourtId").get(getFoodCourtById);
router.route("/get/all/food-courts").get(foodCourtFeed);
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

router.route("/user/:foodPlaceId/reviews").post(addFoodPlaceReview);

router
  .route("/active/food-court/by-id/:foodCourtId/:adminId")
  .post(markAsActive);
router
  .route("/verify/food-court/by-id/:foodCourtId/:adminId")
  .post(verifyByAdmin);
router
  .route("/cancel-verification/food-court/by-id/:foodCourtId/:adminId")
  .post(verifyByAdmin);
router
  .route("/deactivate/food-court/by-id/:foodCourtId/:adminId")
  .post(markAsInactiveAndNonVerified);
router
  .route("/delete/food-court/by-id/:foodCourtId/:adminId")
  .delete(deleteFoodCourt);

export default router;
