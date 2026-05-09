import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  createClubPublic,
  createClub,
  getAllClubs,
  getClubById,
  getClubsByCity,
  getClubsByCategory,
  searchClubs,
  updateClub,
  deleteClub,
  getInactiveClubById,
  activateClub,
  addClubMember,
  addClubEvent,
  addParikramaHotel,
  followRequest,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../controllers/club.controllers.js";

const router = Router();

/* Public routes */
router.route("/").get(getAllClubs);
router.route("/register/public").post(
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  createClubPublic,
);
router.route("/search").get(searchClubs);
router.route("/:id").get(getClubById);
router.route("/city/:query").get(getClubsByCity);
router.route("/category/:category").get(getClubsByCategory);

/* Admin routes */
router.route("/create/:adminId").post(
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  createClub,
);
router.route("/update/:clubId").post(
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  updateClub,
);
router.route("/delete/:adminId/:clubId").delete(deleteClub);
router.route("/inactive/:clubId").get(getInactiveClubById);
router.route("/activate/:clubId").post(activateClub);

/* Member routes */
router.route("/:clubId/member").post(addClubMember);

/* Event routes */
router.route("/:clubId/event").post(addClubEvent);

/* Partnership routes */
router.route("/:clubId/hotel").post(addParikramaHotel);

router.route("/club/follow-request/:clubId").post(followRequest);
router
  .route("/club/accept-request/:clubId")
  .post(acceptFollowRequest);
router
  .route("/club/reject-request/:clubId")
  .post(rejectFollowRequest);

export default router;
