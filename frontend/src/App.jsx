import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Hero from "./pages/hero/hero";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/authentication/login";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser, stopAuthLoading } from "./redux/slices/authSlice";
import { FetchData } from "./utils/FetchFromApi";
import { useEffect } from "react";
import AdminRegistrationForm from "./pages/admin/AdminRegistrationForm";
import SearchResult from "./pages/searchResult/SearchResult";
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

function App() {
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  // console.log(user);
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshToken = localStorage.getItem("RefreshToken");

    // No refresh token → user is logged out
    if (!refreshToken) {
      dispatch(stopAuthLoading());
      return;
    }

    const reLogin = async () => {
      try {
        if (localStorage?.role === "Admin") {
          const res = await FetchData(
            "admin/auth/refresh-tokens", // ✅ SINGLE endpoint
            "post",
            { refreshToken },
          );
          const { user, tokens } = res.data.data;

          // Store new tokens
          localStorage.setItem("AccessToken", tokens.AccessToken);
          localStorage.setItem("RefreshToken", tokens.RefreshToken);

          // Update redux
          dispatch(addUser(user));
        } else {
          const res = await FetchData(
            "facilitator/auth/refresh-token", // ✅ SINGLE endpoint
            "post",
            { refreshToken },
          );
          // console.log(res);

          const { user, tokens } = res.data.data;

          // Store new tokens
          localStorage.setItem("AccessToken", tokens.AccessToken);
          localStorage.setItem("RefreshToken", tokens.RefreshToken);

          // Update redux
          dispatch(addUser(user));
        }
      } catch (error) {
        // console.log(error);
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

        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/facilitator" element={<FacilitatorAuth />} />
          <Route
            path="/admin/register-admin"
            element={<AdminRegistrationForm />}
          />
          <Route path="/current/place/:placeId" element={<CurrentPlace />} />
          <Route path="/review/current/place/:placeId" element={<UnderReviewPlace />} />
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
            path="/facilitator/dashboard"
            element={<FacilitatorDashboard />}
          />
          <Route
            path="/facilitator/review/:facilitatorId"
            element={<FacilitatorReview />}
          />

          {/* ================= FALLBACK ================= */}
          <Route path="/testing" element={<SearchResult />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
