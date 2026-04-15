import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/header";
import Hero from "./pages/hero/hero";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/authentication/login";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser, stopAuthLoading } from "./redux/slices/authSlice";
import { FetchData } from "./utils/FetchFromApi";
import { useEffect } from "react";
import AdminRegistrationForm from "./pages/admin/AdminRegistrationForm";
import SearchPage from "./pages/searchResult/SearchResult";
import CurrentPlace from "./pages/place/currentPlace";
import AddNewPlace from "./pages/place/addNewPlace";
import AddNewStateCity from "./pages/state-city/addNewState-City";
import CurrentStateCity from "./pages/state-city/currentState-City";
import EditPlace from "./pages/place/editPlace";
import FacilitatorAuth from "./pages/facilitator/FacilitatorAuth";
import ScrollToTop from "./components/hooks/ScrollToTop";
import FacilitatorDashboard from "./pages/facilitator/FacilitatorDashboard";
import FacilitatorReview from "./components/ui/FacilitatorReview";
import CurrentFacilitator from "./pages/facilitator/CurrentFacilitator";
import GuestPlace from "./pages/place/guestPlace";
import UnderReviewPlace from "./pages/place/underReviewPlace";
import Explore from "./pages/explore/explore";
import Footer from "./components/Footer";
import TermsOfService from "./pages/cms/termsOfService";
import PrivacyPolicy from "./pages/cms/privacyPolicy";
import HowThisSiteWorks from "./pages/cms/howThisSiteWorks";
import FlightBus from "./pages/flightBus/FlightBus";
// import TravelPackagesForm from "./pages/travelPackagesForm/TravelPackagesForm";
// import PackagesListing from "./pages/travelPackagesForm/PackageListing";
import LiveTelecast from "./pages/liveTelecast/LiveTelecast";
import CommunityRegForm from "./pages/community/communityRegForm";
import PackagesListing from "./pages/travelPackagesForm/PackageListing";
import UserDashboard from "./pages/user/User";
import UserRegisterLogin from "./pages/user/RegisterLogin";
import CommunityLogin from "./pages/community/communityLogin";
import CommunityDashboard from "./pages/community/communityDashboard";
import CurrentFoodKiosk from "./pages/kiosks/CurrentFoodKiosk";
import HotelListing from "./pages/hotel/HotelListing";
import CurrentHotel from "./pages/hotel/CurrentHotel";
import ClubListing from "./pages/club/ClubListing";
import CurrentClub from "./pages/club/CurrentClub";
import AddNewClub from "./pages/admin/AddNewClub";

function App() {
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  // console.log(user);
  const dispatch = useDispatch();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const refreshToken = localStorage.getItem("RefreshToken");

    // No refresh token → user is logged out
    if (!refreshToken) {
      dispatch(stopAuthLoading());
      return;
    }

    // const reLogin = async () => {
    //   try {
    //     if (localStorage?.role === "Admin") {
    //       const res = await FetchData(
    //         "admin/auth/refresh-tokens", // ✅ SINGLE endpoint
    //         "post",
    //         { refreshToken },
    //       );
    //       const { user, tokens } = res.data.data;
    //       console.log(user);
    //       // Store new tokens
    //       localStorage.setItem("AccessToken", tokens.AccessToken);
    //       localStorage.setItem("RefreshToken", tokens.RefreshToken);

    //       // Update redux
    //       dispatch(addUser(user));
    //     }
    //     if (localStorage?.role === "User") {
    //       const res = await FetchData("users/auth/refresh-tokens", "post", {
    //         refreshToken,
    //       });
    //       const { user, tokens } = res.data.data;

    //       localStorage.setItem("AccessToken", tokens.AccessToken);
    //       localStorage.setItem("RefreshToken", tokens.RefreshToken);

    //       // Update redux
    //       dispatch(addUser(user));
    //     }
    //     if (localStorage?.role === "Facilitator") {
    //       const res = await FetchData(
    //         "facilitator/auth/refresh-token", // ✅ SINGLE endpoint
    //         "post",
    //         { refreshToken },
    //       );
    //       // console.log(res);

    //       const { user, tokens } = res.data.data;

    //       // Store new tokens
    //       localStorage.setItem("AccessToken", tokens.AccessToken);
    //       localStorage.setItem("RefreshToken", tokens.RefreshToken);

    //       // Update redux
    //       dispatch(addUser(user));
    //     }
    //   } catch (error) {
    //     // console.log(error);
    //     localStorage.clear();
    //     dispatch(clearUser());
    //   } finally {
    //     dispatch(stopAuthLoading());
    //   }
    // };
    const reLogin = async () => {
      try {
        const role = localStorage.getItem("role");
        const refreshToken = localStorage.getItem("RefreshToken");

        if (!role || !refreshToken) {
          throw new Error("Missing auth data");
        }

        // ✅ Centralized endpoint mapping
        const endpointMap = {
          Admin: "admin/auth/refresh-tokens",
          User: "users/auth/refresh-tokens",
          Facilitator: "facilitator/auth/refresh-token",
          Community: "communities/community/auth/refresh-token", // future ready
        };

        const endpoint = endpointMap[role];

        if (!endpoint) {
          throw new Error("Invalid role");
        }

        const res = await FetchData(endpoint, "post", { refreshToken });

        const { user, tokens } = res.data.data;

        // ✅ Store tokens
        localStorage.setItem("AccessToken", tokens.AccessToken);
        localStorage.setItem("RefreshToken", tokens.RefreshToken);

        // ✅ Update redux
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
    <div className="font-montserrat">
      <Header />

      {/* Top padding because header is fixed */}
      <div className="pt-24">
        <ScrollToTop />
        {/* <SearchPage /> */}
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Hero />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/search-feed/places" element={<SearchPage />} />
          <Route path="/live-telecasts" element={<LiveTelecast />} />
          <Route path="/login/admin" element={<Login />} />
          <Route path="/login/facilitator" element={<FacilitatorAuth />} />
          <Route
            path="/admin/register-admin"
            element={<AdminRegistrationForm />}
          />
          <Route path="/current/place/:placeId" element={<CurrentPlace />} />
          <Route
            path="/review/current/place/:placeId"
            element={<UnderReviewPlace />}
          />
          <Route
            path="/current/state-city/:stateId"
            element={<CurrentStateCity />}
          />
          <Route path="/guest/register-new-place" element={<GuestPlace />} />
          <Route path="/admin/register-place" element={<AddNewPlace />} />
          <Route path="/admin/edit-place/:placeId" element={<EditPlace />} />
          <Route
            path="/admin/register-city-state"
            element={<AddNewStateCity />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/current/facilitator/:facilitatorId"
            element={<CurrentFacilitator />}
          />
          <Route
            path="/current/food-court/:foodCourtId"
            element={<CurrentFoodKiosk />}
          />
          <Route
            path="/facilitator/dashboard"
            element={<FacilitatorDashboard />}
          />
          <Route
            path="/facilitator/review/:facilitatorId"
            element={<FacilitatorReview />}
          />

          <Route path="/login-register/user" element={<UserRegisterLogin />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />

          <Route path="/flights-busses" element={<FlightBus />} />
          <Route path="/travel-packages" element={<PackagesListing />} />
          <Route path="/hotels" element={<HotelListing />} />
          <Route path="/hotels/:hotelId" element={<CurrentHotel />} />
          <Route path="/clubs" element={<ClubListing />} />
          <Route path="/clubs/register" element={<AddNewClub />} />
          <Route path="/clubs/:clubId" element={<CurrentClub />} />
          <Route path="/community/form" element={<CommunityRegForm />} />
          <Route path="/login/community" element={<CommunityLogin />} />
          <Route path="/dashboard/community" element={<CommunityDashboard />} />

          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/how-this-site-works" element={<HowThisSiteWorks />} />
          {/* ================= FALLBACK ================= */}
        </Routes>
      </div>
      {isHome && <Footer />}
    </div>
  );
}

export default App;
