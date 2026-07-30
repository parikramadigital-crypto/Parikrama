import { Router } from "express";
import {
  createPricingModel,
  markAsActive,
  markAsInactive,
  deletePricingModel,
  getAllPricingModel,
  getPricingModelById,
} from "../controllers/pricing.controllers.js";

const router = Router();

router.route("/create/pricing-model/:adminId").post(createPricingModel);
router
  .route("/update/mark-activate/pricing-model/:adminId/:pricingModelId")
  .post(markAsActive);
router
  .route("/update/mark-inactivate/pricing-model/:adminId/:pricingModelId")
  .post(markAsInactive);
router
  .route("/remove/pricing-model/:adminId/:pricingModelId")
  .delete(deletePricingModel);
router.route("/get/pricing-model/all").get(getAllPricingModel);
router.route("/get/pricing-model/by-id").get(getPricingModelById);

export default router;
