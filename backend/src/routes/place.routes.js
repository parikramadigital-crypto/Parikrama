import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middlewares.js";
import {
  createPlace,
  getAllPlaces,
  getPlacesByCity,
  getPlaceById,
  updatePlace,
  deletePlace,
  getInactivePlaceById,
  makePlaceActive,
  uploaderPlace,
  explorePlaces,
  searchPlaces,
  getHeroPlaces,
  getKidsPlace,
  getPlaceByCityID,
} from "../controllers/place.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

/* Public routes */
router.route("/").get(getAllPlaces);
router.route("/get-hero-places").get(getHeroPlaces);
router.route("/search-feed").get(searchPlaces);
router.route("/current-place/:id").get(getPlaceById);
router.route("/inactive/:placeId").get(getInactivePlaceById);
router.route("/city/:cityId").get(getPlacesByCity);
router.route("/city/by-id/:cityId").get(getPlaceByCityID);
router.route("/related-places/:query").get(getPlacesByCity);
router.route("/explore/places").get(explorePlaces);
router.route("/kids/explore/places").get(getKidsPlace);
router
  .route("/guest/register-new-place/user")
  .post(upload.array("images", 5), uploaderPlace);

/* Admin routes */
router.route("/active-new-place/:placeId").post(makePlaceActive);
router
  .route("/register-new-place/:adminId")
  .post(upload.array("images", 5), createPlace);
router.route("/update/:placeId").post(upload.array("images", 5), updatePlace);
router.route("/delete-place/:adminId/:id").delete(deletePlace);

export default router;
