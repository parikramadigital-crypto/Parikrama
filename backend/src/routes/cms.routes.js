import { Router } from "express";
import {
  deleteTermsSection,
  getTermsAndConditions,
  upsertHowSiteWork,
  upsertPrivacyPolicy,
  upsertTermsOfService,
} from "../controllers/cms.controllers.js";

const router = Router();

/* ================= GET CMS ================= */
router.route("/").get(getTermsAndConditions);

/* ================= CREATE / UPDATE ================= */
/* (UPSERT style — create if not exists, update if exists) */
router.route("/termsOfService/:adminId").post(upsertTermsOfService);

router.route("/privacyPolicy/:adminId").post(upsertPrivacyPolicy);

router.route("/howThisSiteWork/:adminId").post(upsertHowSiteWork);

/* ================= DELETE SECTION ================= */
/*
  section values allowed:
  - termsOfService
  - privacyPolicy
  - howThisSiteWork
*/
router.delete("/:section/:adminId", deleteTermsSection);

export default router;
