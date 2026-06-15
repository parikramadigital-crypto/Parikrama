import { Router } from "express";
import {
  createCorporateEnquiry,
  createEnquiry,
  deleteEnquiry,
  getEnquiriesById,
  markAsHot,
  markEnquiryAsReviewed,
} from "../controllers/enquiry.controllers.js";

const router = Router();

router.route("/guest/create-enquiry").post(createEnquiry);
router.route("/guest/corporate/create-enquiry").post(createCorporateEnquiry);
router
  .route("/admin/get/enquiry-by-id/:adminId/:enquiryId")
  .get(getEnquiriesById);

router
  .route("/mark-as-reviewed/:adminId/:enquiryId")
  .post(markEnquiryAsReviewed);
router
  .route("/mark-as-hot/:adminId/:enquiryId")
  .post(markAsHot);
router.route("/delete/enquiry/:adminId/:enquiryId").post(deleteEnquiry);

export default router;
