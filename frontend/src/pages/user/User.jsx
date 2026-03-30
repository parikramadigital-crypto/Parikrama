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

const UserDashboard = ({ startLoading, stopLoading }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef();
  const userRole = localStorage.role;
  const [model, setModel] = useState(false);
  const [rightBanner, setRightBanner] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [cities, setCities] = useState([]);
  const right = rightBanner?.map((banner) => [banner?.images?.url]);
  const banner = async () => {
    try {
      startLoading();
      const response = await FetchData("promotions/get/all/promotions", "get");
      setRightBanner(response.data.data.promotionsMid);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    banner();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      try {
        startLoading();
        const res = await FetchData("cities", "get");
        setCities(res?.data?.data || []);
      } catch (err) {
        console.log(err);
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

    const cityPlaces = places.filter((p) => p.city?._id === cityId);

    setFilteredPlaces(cityPlaces);
  };

  const logout = () => {
    localStorage.clear();
    dispatch(clearUser());
    alert("You are logged out successfully");
    navigate("/");
  };

  const userData = [
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Contact number", value: user?.contactNumber },
    { label: "Address", value: user?.address },
    { label: "City", value: user?.city },
    { label: "State", value: user?.state },
  ];

  return userRole === "User" ? (
    <div>
      <h1 className="text-2xl font-semibold md:px-20 ">
        Parikrama welcomes to your profile
      </h1>

      <div className="flex justify-center items-center gap-20">
        <div className="md:w-1/2 flex flex-col w-[90%]">
          {userData?.map((u) => (
            <div>
              <h1 className="flex justify-between items-center gap-10 border-b border-neutral-300 p-3 w-full">
                <strong>{u.label}: </strong>{" "}
                <span>{u.value || <p>Update your {u.label}</p>}</span>
              </h1>
            </div>
          ))}
          <div className="flex justify-start items-center md:gap-10 gap-5 p-5">
            <Button label={"Update Profile"} onClick={() => setModel(true)} />
            <Button label={"Logout"} onClick={() => logout()} />
          </div>
        </div>
        <div className="w-96 h-96 hidden md:flex">
          <RandomImageSlider images={right} />
        </div>
      </div>
      <Explore userProfile={true} />
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
              <form ref={formRef}>
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
                  Name="state"
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
              </form>
              <div className="flex justify-center items-center gap-20">
                <Button
                  label={"Cancel"}
                  onClick={() => {
                    setModel(false);
                    formRef.current.reset();
                  }}
                />
                <Button label={"Submit"} type={"submit"} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
