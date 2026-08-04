import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import Explore from "../explore/explore";
import { FetchData } from "../../utils/FetchFromApi";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import LoadingUI from "../../components/LoadingUI";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import InputBox from "../../components/InputBox";
import { userFormInputs } from "../../constants/Constants";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { TbLivePhotoFilled } from "react-icons/tb";
import logo from "../../assets/Logo1.png";
import CityDarshanBookedCard from "../cityDarshan/cityDarshanBookedCard";
import { FaRupeeSign } from "react-icons/fa";

const UserDashboard = ({ startLoading, stopLoading }) => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef();
  const userRole = localStorage.role;
  const [model, setModel] = useState(false);
  const [pricing, setPricing] = useState([]);
  const [rightBanner, setRightBanner] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [cities, setCities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const right = rightBanner?.map((banner) => [banner?.images?.url]);

  const banner = async () => {
    try {
      startLoading();
      const response = await FetchData("promotions/get/all/promotions", "get");
      setRightBanner(response.data.data.promotionsMid);
    } catch (err) {
    } finally {
      stopLoading();
    }
  };

  const getBookings = async () => {
    try {
      const response = await FetchData(`users/get-bookings/${userId}`, "get");
      setBookings(response.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    banner();
    getBookings();
  }, [user]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        startLoading();
        const res = await FetchData("cities", "get");
        setCities(res?.data?.data || []);
      } catch (err) {
      } finally {
        stopLoading();
      }
    };

    loadCities();
  }, []);

  const handleCityChange = (cityId) => {
    const city = cities.find((c) => c._id === cityId);

    setSelectedCity(cityId);
    setSelectedState(city?.state?._id || "");
    setSelectedStateName(city?.state?.name || "");

    const cityPlaces = city.filter((p) => p.city?._id === cityId);

    setFilteredPlaces(cityPlaces);
  };

  const logout = () => {
    localStorage.clear();
    dispatch(clearUser());
    alert("You are logged out successfully");
    navigate("/");
  };

  const isUserUpdate =
    user?.name &&
    user?.email &&
    user?.contactNumber &&
    user?.address &&
    user?.city;

  const userData = [
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Contact number", value: user?.contactNumber },
    { label: "Address", value: user?.address },
    { label: "City", value: user?.city?.name },
    // { label: "State", value: user?.state },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `users/update-profile/${userId}`,
        "post",
        formData,
      );
      setModel(false);
      formRef.current.reset();
      setSelectedStateName("");
      setSelectedState("");
      setSelectedCity("");
      alert(response.data.message);
      window.location.reload();
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    }
  };

  const getPricingPackages = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `pricing-models/get/pricing-model/all/by-modelFor/${"user"}`,
        "get",
      );
      console.log(response);
      setPricing(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    getPricingPackages();
  }, []);

  return userRole === "User" ? (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold md:px-20 md:text-left text-center capitalize">
        Parikrama <br /> welcomes to your profile
      </h1>
      <div className="flex justify-center items-center gap-20">
        <div className="md:w-1/2 flex flex-col w-[90%]">
          {userData?.map((u, index) => (
            <div key={index}>
              <h1 className="flex justify-between items-center gap-10 border-b border-neutral-300 p-3 w-full">
                <strong>{u.label}: </strong>{" "}
                <span>{u.value || <p>Update your {u.label}</p>}</span>
              </h1>
            </div>
          ))}
          <div className="flex justify-start items-center md:gap-10 gap-5 p-5">
            <Button label={"Logout"} onClick={() => logout()} normal={false} />
            {isUserUpdate ? (
              <Button label={"Home"} onClick={() => navigate("/")} />
            ) : (
              <Button label={"Update Profile"} onClick={() => setModel(true)} />
            )}
            {/* <Button label={"Update Profile"} onClick={() => setModel(true)} /> */}
          </div>
        </div>
        <div className="w-96 h-96 hidden md:flex">
          <RandomImageSlider images={right} />
        </div>
      </div>
      <div className="bg-amber-50 shadow-2xl md:py-10 py-5 ">
        <h1 className="text-base md:text-xl font-semibold text-center w-full ">
          Bookings
        </h1>
        <div className="p-4 md:p-10">
          <CityDarshanBookedCard booking={bookings} />
        </div>
      </div>
      <Explore userProfile={true} />
      {/* show all the pricing packages  */}
      {console.log(pricing)}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 place-items-center gap-2 px-5">
        {pricing?.map((i, index) => (
          <div className="flex flex-col border w-full items-start border-[#FFC20D] rounded-lg overflow-hidden">
            <h1 className="bg-[#FFC20D] w-full text-center py-8 text-3xl uppercase font-semibold flex flex-col justify-center items-center ">
              {i?.modelName}
              <span className="font-light normal-case text-sm">
                {i?.tagline}
              </span>
            </h1>
            <div className="px-5 py-10 flex flex-col w-full gap-5 items-start">
              <div className="text-sm flex justify-center items-end gap-2 w-full">
                <span className="text-3xl font-semibold flex justify-center items-end gap-2 italic">
                  <FaRupeeSign /> {i?.price?.sellingPrice}{" "}
                  <span className="text-xs ">/ month</span>
                </span>
                <span className="flex justify-center items-center line-through">
                  <FaRupeeSign />
                  {i?.price?.mrp}
                </span>
                <span className="bg-[#FFC20D] px-1">
                  {i?.price?.discount}% off
                </span>
              </div>
              <div className="text-sm">
                <h2 className="font-semibold">Plan features: </h2>
                <div className="px-2 w-full">
                  {i?.features?.map((i, index) => (
                    <ul key={index}>
                      <li>
                        {index + 1}. {i}
                      </li>
                    </ul>
                  ))}
                </div>
              </div>
              <div className="text-xs">
                <h2 className="font-semibold ">Faqs: </h2>
                <div className="px-2 w-full">
                  {i?.faqs?.map((i, index) => (
                    <div key={index}>
                      <p className="font-semibold ">
                        {index + 1}. {i?.question} ?
                      </p>
                      <p>- {i?.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-[#FFC20D] w-full flex justify-center items-center p-2 gap-4">
              {i?.planDuration === "Quarter"
                ? "3 months"
                : i?.planDuration === "Half-Year"
                  ? "6 months"
                  : i?.planDuration === "Per-Year"
                    ? "12 months"
                    : ""}
              <Button normal={false} className={"bg-white"} label={"Get"} />
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {model && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <div className="bg-white shadow-2xl px-5 md:px-20 py-10 rounded-md w-full md:w-1/2">
              <h1 className="w-full text-center text-xl font-semibold">
                Fill form to update your profile.
              </h1>
              <form ref={formRef} onSubmit={handleSubmit}>
                {userFormInputs.map((i) => (
                  <InputBox
                    LabelName={i.label}
                    Placeholder={i.placeHolder}
                    Name={i.name}
                    Type={i.type}
                  />
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City*
                  </label>
                  <select
                    name="city"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                    onChange={(e) => handleCityChange(e.target.value)}
                  >
                    <option value="">Select City</option>
                    {cities.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} , {c.state?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <InputBox
                  LabelName="State"
                  // Name="state"
                  Value={selectedStateName}
                  required
                  // className="hidden"
                  // LabelClassname="hidden"
                />
                <InputBox
                  LabelName="State"
                  Name="state"
                  Value={selectedState}
                  required
                  className="hidden"
                  LabelClassname="hidden"
                />
                <div className="flex justify-center items-center gap-20">
                  <Button
                    label={"Cancel"}
                    onClick={() => {
                      setModel(false);
                      formRef.current.reset();
                      setSelectedStateName("");
                      setSelectedState("");
                      setSelectedCity("");
                    }}
                  />
                  <Button label={"Submit"} type={"submit"} />
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="sticky md:bottom-10 bottom-5 w-full flex justify-end items-end px-10 z-50">
        <button
          onClick={() => navigate("/live-telecasts")}
          className="flex justify-center items-center flex-col gap-2 bg-[#FFC20E] md:bg-neutral-200 rounded-full md:rounded-md md:py-3 py-5 px-3 shadow-black shadow-2xl cursor-pointer hover:scale-105 duration-300 ease-in-out"
        >
          <img src={logo} className="w-14 h-14 md:block hidden" />
          <h1 className="md:text-base text-xs flex justify-center items-center flex-col md:flex-row md:gap-1">
            <span className="flex justify-center items-center md:flex-row-reverse ">
              Live <TbLivePhotoFilled className="text-red-600" />
            </span>
            Connect
          </h1>
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center w-full">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl ">⚠️</p>
        Restricted Access !! Please log in to view the dashboard.
      </h2>
    </div>
  );
};

export default LoadingUI(UserDashboard);
