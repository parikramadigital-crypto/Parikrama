import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Header from "./components/header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/hooks/ScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser, stopAuthLoading } from "./redux/slices/authSlice";
import { FetchData } from "./utils/FetchFromApi";

/* ================= LAZY LOADED PAGES ================= */
// HOME
const Hero = lazy(() => import("./pages/hero/hero"));
// ADMIN
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminRegistrationForm = lazy(
  () => import("./pages/admin/AdminRegistrationForm"),
);
const EditSubAdmin = lazy(() => import("./pages/admin/EditSubAdmin"));
const AddNewClub = lazy(() => import("./pages/admin/AddNewClub"));
const CityDarshanPackageCreation = lazy(
  () => import("./pages/cityDarshan/cityDarshanPackageCreation"),
);
// AUTH
const Login = lazy(() => import("./pages/authentication/login"));
const LoginRegister = lazy(
  () => import("./pages/login-register/LoginRegister"),
);
const FacilitatorAuth = lazy(
  () => import("./pages/facilitator/FacilitatorAuth"),
);
const UserRegisterLogin = lazy(() => import("./pages/user/RegisterLogin"));
const CommunityLogin = lazy(() => import("./pages/community/communityLogin"));
// SEARCH & EXPLORE
const SearchPage = lazy(() => import("./pages/searchResult/SearchResult"));
const Explore = lazy(() => import("./pages/explore/explore"));
const KidsPlace = lazy(() => import("./pages/place/KidsPlace"));
const EventFeed = lazy(() => import("./pages/club/EventFeed"));
// PLACES
const CurrentPlace = lazy(() => import("./pages/place/currentPlace"));
const AddNewPlace = lazy(() => import("./pages/place/addNewPlace"));
const EditPlace = lazy(() => import("./pages/place/editPlace"));
const GuestPlace = lazy(() => import("./pages/place/guestPlace"));
const UnderReviewPlace = lazy(() => import("./pages/place/underReviewPlace"));
// STATE CITY
const AddNewStateCity = lazy(
  () => import("./pages/state-city/addNewState-City"),
);
const CurrentStateCity = lazy(
  () => import("./pages/state-city/currentState-City"),
);
// FACILITATOR
const FacilitatorDashboard = lazy(
  () => import("./pages/facilitator/FacilitatorDashboard"),
);
const FacilitatorReview = lazy(
  () => import("./components/ui/FacilitatorReview"),
);
const CurrentFacilitator = lazy(
  () => import("./pages/facilitator/CurrentFacilitator"),
);
// CMS
const TermsOfService = lazy(() => import("./pages/cms/termsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/cms/privacyPolicy"));
const HowThisSiteWorks = lazy(() => import("./pages/cms/howThisSiteWorks"));
// TRAVEL
const FlightBus = lazy(() => import("./pages/flightBus/FlightBus"));
const CityDarshanBooking = lazy(
  () => import("./pages/cityDarshan/cityDarshanBooking"),
);
const PackagesListing = lazy(
  () => import("./pages/travelPackagesForm/PackageListing"),
);
// TELECAST
const LiveTelecast = lazy(() => import("./pages/liveTelecast/LiveTelecast"));
const CityDarshanFeed = lazy(
  () => import("./pages/cityDarshan/cityDarshanFeed"),
);
const CurrentCityDarshan = lazy(
  () => import("./pages/cityDarshan/currentCityDarshan"),
);
// USER
const UserDashboard = lazy(() => import("./pages/user/User"));
// COMMUNITY
const CommunityRegForm = lazy(
  () => import("./pages/community/communityRegForm"),
);
const CommunityDashboard = lazy(
  () => import("./pages/community/communityDashboard"),
);
const CommunityFeed = lazy(() => import("./pages/community/communityFeed"));
const CurrentCommunity = lazy(
  () => import("./pages/community/currentCommunity"),
);
// FOOD KIOSK
const CurrentFoodKiosk = lazy(() => import("./pages/kiosks/CurrentFoodKiosk"));
const FoodKiosk = lazy(() => import("./pages/kiosks/FoodKiosk"));
const FoodCourtFeed = lazy(() => import("./pages/kiosks/FoodCourtFeed"));
const FoodPlaceReview = lazy(() => import("./components/ui/FoodPlaceReview"));
// HOTELS
const HotelListing = lazy(() => import("./pages/hotel/HotelListing"));
const CurrentHotel = lazy(() => import("./pages/hotel/CurrentHotel"));
// CLUBS
const ClubListing = lazy(() => import("./pages/club/ClubListing"));
const CurrentClub = lazy(() => import("./pages/club/CurrentClub"));
const ClubUpdates = lazy(() => import("./pages/club/ClubUpdates"));
// CONTACT
const ContactUs = lazy(() => import("./pages/contactus/ContactUs"));
// CORPORATE
const CorporatePlan = lazy(() => import("./pages/corporate/CorporatePlan"));
/* ================= LOADING SCREEN ================= */

const PageLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#D5D5D7]  z-50 transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-black text-lg font-medium">Please wait ...</p>
      </div>
    </div>
  );
};

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const isHome = location.pathname === "/";
  /* ================= AUTO LOGIN ================= */

  useEffect(() => {
    const refreshToken = localStorage.getItem("RefreshToken");
    if (!refreshToken) {
      dispatch(stopAuthLoading());
      return;
    }
    const reLogin = async () => {
      try {
        const role = localStorage.getItem("role");
        const refreshToken = localStorage.getItem("RefreshToken");
        if (!role || !refreshToken) {
          throw new Error("Missing auth data");
        }

        const endpointMap = {
          Admin: "admin/auth/refresh-tokens",
          User: "users/auth/refresh-tokens",
          Facilitator: "facilitator/auth/refresh-token",
          Community: "communities/community/auth/refresh-token",
        };
        const endpoint = endpointMap[role];
        if (!endpoint) {
          throw new Error("Invalid role");
        }

        const res = await FetchData(endpoint, "post", {
          refreshToken,
        });
        const { user, tokens } = res.data.data;
        localStorage.setItem("AccessToken", tokens.AccessToken);
        localStorage.setItem("RefreshToken", tokens.RefreshToken);
        dispatch(addUser(user));
      } catch (error) {
        console.log("Re-login failed:", error?.message);
        localStorage.clear();
        dispatch(clearUser());
      } finally {
        dispatch(stopAuthLoading());
      }
    };

    reLogin();
  }, []);

  return (
    <div className="font-montserrat min-h-screen flex flex-col bg-white">
      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= MAIN ================= */}
      <main className="flex-1 pt-20">
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ================= HOME ================= */}
            <Route path="/" element={<Hero />} />
            {/* ================= EXPLORE ================= */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/search-feed/places" element={<SearchPage />} />
            <Route path="/explore/kids/place" element={<KidsPlace />} />
            <Route path="/explore/club-events" element={<EventFeed />} />
            <Route path="/live-telecasts" element={<LiveTelecast />} />
            <Route path="/city-darshan" element={<CityDarshanFeed />} />
            <Route
              path="/current/city-darshan/:id"
              element={<CurrentCityDarshan />}
            />
            {/* ================= CONTACT ================= */}
            <Route
              path="/contact-us/parikrama-global"
              element={<ContactUs />}
            />
            {/* ================= CMS ================= */}
            <Route path="/how-this-site-works" element={<HowThisSiteWorks />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* ================= CORPORATE ================= */}
            <Route path="/corporate/plans" element={<CorporatePlan />} />
            {/* ================= AUTH ================= */}
            <Route path="/authentication" element={<LoginRegister />} />
            <Route path="/login/admin" element={<Login />} />
            <Route path="/login/facilitator" element={<FacilitatorAuth />} />
            <Route
              path="/login-register/user"
              element={<UserRegisterLogin />}
            />
            <Route path="/login/community" element={<CommunityLogin />} />
            {/* ================= USER ================= */}
            <Route path="/user/dashboard" element={<UserDashboard />} />
            {/* ================= ADMIN ================= */}
            <Route
              path="/admin/register-admin"
              element={<AdminRegistrationForm />}
            />
            <Route path="/admin/register-place" element={<AddNewPlace />} />
            <Route path="/admin/edit-place/:placeId" element={<EditPlace />} />
            <Route
              path="/admin/register-city-state"
              element={<AddNewStateCity />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/current/edit-sub-admin/:adminId"
              element={<EditSubAdmin />}
            />
            <Route
              path="/package/city-darshan/creation"
              element={<CityDarshanPackageCreation />}
            />

            {/* ================= PLACES ================= */}
            <Route path="/current/place/:placeId" element={<CurrentPlace />} />
            <Route
              path="/review/current/place/:placeId"
              element={<UnderReviewPlace />}
            />
            {/* ================= STATE CITY ================= */}
            <Route
              path="/current/state-city/:stateId"
              element={<CurrentStateCity />}
            />
            {/* ================= FACILITATOR ================= */}
            <Route
              path="/current/facilitator/:facilitatorId"
              element={<CurrentFacilitator />}
            />
            <Route
              path="/facilitator/dashboard"
              element={<FacilitatorDashboard />}
            />
            <Route
              path="/facilitator/review/:facilitatorId"
              element={<FacilitatorReview />}
            />
            {/* ================= GUEST ================= */}
            <Route path="/guest/register-new-place" element={<GuestPlace />} />
            <Route
              path="/guest/register-new-food-place"
              element={<FoodKiosk />}
            />
            {/* ================= FOOD COURTS ================= */}
            <Route
              path="/current/food-court/:foodCourtId"
              element={<CurrentFoodKiosk />}
            />
            <Route path="/food/courts/feed" element={<FoodCourtFeed />} />
            <Route
              path="/foodPlace/review/:foodPlaceId"
              element={<FoodPlaceReview />}
            />
            {/* ================= TRAVEL ================= */}
            <Route path="/flights-busses/:flight" element={<FlightBus />} />
            <Route path="/travel-packages" element={<PackagesListing />} />
            <Route
              path="/city-darshan/booking/:id"
              element={<CityDarshanBooking />}
            />
            {/* ================= HOTELS ================= */}
            <Route path="/hotels" element={<HotelListing />} />
            <Route path="/hotels/:hotelId" element={<CurrentHotel />} />
            {/* ================= CLUBS ================= */}
            <Route path="/clubs" element={<ClubListing />} />
            <Route path="/clubs/register" element={<AddNewClub />} />
            <Route path="/clubs/:clubId" element={<CurrentClub />} />
            <Route path="/updates/for/club" element={<ClubUpdates />} />
            {/* ================= COMMUNITY ================= */}
            <Route path="/community/feed" element={<CommunityFeed />} />
            <Route path="/community/form" element={<CommunityRegForm />} />
            <Route
              path="/dashboard/community"
              element={<CommunityDashboard />}
            />
            <Route
              path="/current/community/:communityId"
              element={<CurrentCommunity />}
            />
            {/* ================= FALLBACK ================= */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Suspense>
      </main>
      {/* ================= FOOTER ================= */}
      {isHome && <Footer />}
    </div>
  );
}

export default App;
