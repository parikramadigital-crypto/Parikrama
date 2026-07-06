// city-darshan/register
import { Router } from "express";
import {
  registerCityDarshan,
  markAsActive,
  markAsInactive,
  getAllCityDarshanPackages,
  getCityDarshanById,
  updateCityDarshanPackage,
} from "../controllers/cityDarshan.controllers.js";
import {
  // bookCityDarshan,
  getUserCityDarshanBookings,
  startCityDarshanBooking,
} from "../controllers/cityDarshanBooking.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/register/:adminId")
  .post(upload.array("images"), registerCityDarshan);
// router.put(
//   "/admin/update/city-darshan-package/:id",
//   upload.array("images", 20),
//   updateCityDarshanPackage,
// );
router
  .route("/update/city-darshan-package/:id")
  .post(upload.array("images", 20), updateCityDarshanPackage);
router.route("/mark-as/mark-active/:adminId/:packageId").post(markAsActive);
router.route("/mark-as/mark-inactive/:adminId/:packageId").post(markAsInactive);
router.route("/get/city-darshan-packages/:packageId").get(getCityDarshanById);
router.route("/get-all/city-darshan-packages").get(getAllCityDarshanPackages);

//booking routes
router
  .route("/booking/start/:userId/:cityDarshanId")
  .post(startCityDarshanBooking);
router.route("/booking/user/:userId").get(getUserCityDarshanBookings);
// router.route("/user-booking/book/:userId/:cityDarshanId").post(bookCityDarshan);

export default router;
