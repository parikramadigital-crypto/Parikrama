// city-darshan/register
import { Router } from "express";
import {
  registerCityDarshan,
  editCityDarshan,
  markAsActive,
  markAsInactive,
  getAllCityDarshanPackages,
  getCityDarshanById,
} from "../controllers/cityDarshan.controllers.js";
import { bookCityDarshan } from "../controllers/cityDarshanBooking.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/register/:adminId")
  .post(upload.array("images"), registerCityDarshan);
router.route("/edit/:adminId").post(editCityDarshan);
router.route("/mark-as/mark-active/:adminId/:packageId").post(markAsActive);
router.route("/mark-as/mark-inactive/:adminId/:packageId").post(markAsInactive);
router.route("/get/city-darshan-packages/:packageId").get(getCityDarshanById);
router.route("/get-all/city-darshan-packages").get(getAllCityDarshanPackages);
router.route("/user-booking/book/:userId/:cityDarshanId").post(bookCityDarshan);

export default router;
