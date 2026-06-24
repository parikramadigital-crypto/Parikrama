import React, { useEffect, useRef, useState } from "react";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { initializeSocket } from "../../utils/socket.js";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slices/authSlice";
import {
  Place,
  City,
  State,
  Facilitator,
  InactiveFacilitator,
  InactivePlace,
  Promotions,
  TravelPackages,
  FoodKiosks,
  Hotels,
  Clubs,
  Users,
  Enquiry,
  Country,
  SubAdmins,
} from "../../components/ui/TableUI";
import { RiImageAddFill } from "react-icons/ri";
import { MdAdd, MdAddLocationAlt, MdOutlineRule } from "react-icons/md";
import { LuRefreshCw } from "react-icons/lu";
import { IoMdLogOut } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import InputBox from "../../components/InputBox";
import {
  FaChevronDown,
  FaChevronRight,
  FaChevronUp,
  FaUserPlus,
} from "react-icons/fa";
import CategoryPieChart from "../../components/ui/CategoryPieChart";
import StatesDonutChart from "../../components/ui/StatesDonutChart";
import CitiesByStateBarChart from "../../components/ui/CitiesByStateBarChart";
import AdminRegistrationForm from "./AdminRegistrationForm";
import AdminCMS from "./AdminCMS";
import PackageRegisteration from "./PackageRegisteration";
import FoodKiosk from "../kiosks/FoodKiosk";
import AddNewHotel from "./AddNewHotel";
import AddNewClub from "./AddNewClub";
import AddCountry from "./AddCountry";
import SubAdmin from "./SubAdmin.jsx";

const AdminDashboard = ({ startLoading, stopLoading }) => {
  // hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef();
  // All the data which are getting displayed
  const [placeData, setPlaceData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [facilitator, setFacilitator] = useState([]);
  const [subAdminData, setSubAdminData] = useState([]);
  const [inactivePlaceData, setInactivePlaceData] = useState([]);
  const [inactiveFacilitator, setInactiveFacilitator] = useState([]);
  const [promotionData, setPromotionData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [foodKioskData, setFoodKioskData] = useState([]);
  const [pendingFoodCount, setPendingFoodCount] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [clubData, setClubData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [enquiryData, setEnquiryData] = useState([]);
  const [hotEnquiryData, setHotEnquiryData] = useState([]);
  const [reviewedEnquiryData, setReviewedEnquiryData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [socketNotifications, setSocketNotifications] = useState([]);
  // preview
  const [imagePreviews, setImagePreviews] = useState([]);
  // redux subscription
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  // popups
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [popup3, setPopup3] = useState(false);
  const [popup4, setPopup4] = useState(false);
  const [popup5, setPopup5] = useState(false);
  const [popup6, setPopup6] = useState(false);
  const [popup7, setPopup7] = useState(false);
  const [popup8, setPopup8] = useState(false);
  const [popup9, setPopup9] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // quick options drop down
  // extras
  const [activeSection, setActiveSection] = useState(
    () => localStorage.getItem("activeSection") || "Overview",
  );
  const [stats, setStats] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const fetchStats = async () => {
    const res = await FetchData("analytics/visitors", "get");
    setStats(res.data.data);
  };

  const fetchDashboard = async () => {
    try {
      startLoading();
      const res = await FetchData("admin/dashboard/data", "get");
      console.log(res);
      setPlaceData(res.data.data.place);
      setCityData(res.data.data.city);
      setStateData(res.data.data.state);
      setFacilitator(res.data.data.activeFacilitator);
      setInactivePlaceData(res.data.data.inactivePlace);
      setInactiveFacilitator(res.data.data.inactiveFacilitator);
      setPromotionData(res.data.data.promotions);
      setPackageData(res.data.data.packages);
      setFoodKioskData(res.data.data.foodCourts);
      setUserData(res.data.data.users);
      setEnquiryData(res.data.data.enquiry);
      setHotEnquiryData(res.data.data.hotEnquiry);
      setReviewedEnquiryData(res.data.data.reviewedEnquiry);
      setCountryData(res.data.data.country);
      setSubAdminData(res.data.data.subAdmin);
      setPendingFoodCount(res.data.data.underReviewCount);

      // Fetch hotels separately
      const hotelRes = await FetchData("hotels", "get");
      setHotelData(hotelRes?.data?.data || []);

      // Fetch clubs separately
      const clubRes = await FetchData("clubs", "get");
      setClubData(clubRes?.data?.data || []);
    } catch (err) {
      // console.log(err);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  useEffect(() => {
    if (localStorage.role !== "Admin") return;

    const socket = initializeSocket();

    const handleNewFoodPlace = (payload) => {
      setSocketNotifications((prev) => [payload, ...prev]);
      fetchDashboard();
    };

    socket.on("connect", () => {
      socket.emit("join-admin-room");
    });
    socket.on("new-food-place", handleNewFoodPlace);

    return () => {
      socket.off("connect");
      socket.off("new-food-place", handleNewFoodPlace);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const logout = () => {
    localStorage.clear();
    dispatch(clearUser());
    alert("You are logged out successfully");
    navigate("/");
  };

  const userDetails = [
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Phone number", value: user?.phoneNumber },
    { label: "Admin Id", value: user?.employeeId },
    { label: "Role", value: user?.role },
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Max 1 image
    if (files.length > 1) {
      alert("Maximum 1 image allowed");
      e.target.value = "";
      return;
    }

    // Max size 2MB
    const MAX_SIZE = 5 * 1024 * 1024; // 2MB

    if (files[0].size > MAX_SIZE) {
      alert("Image size must be less than 5 MB");
      e.target.value = "";
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const cancelPopup = () => {
    setPopup(false);
    formRef.current.reset();
    setImagePreviews([]);
  };

  const commands = [
    {
      label: (
        <h1 className="flex justify-center items-center gap-2">
          <MdAddLocationAlt />
          Add new Place
        </h1>
      ),
      path: "/admin/register-place",
    },
    {
      label: (
        <h1 className="flex justify-center items-center gap-2">
          <MdAdd />
          Add new City / State
        </h1>
      ),
      path: "/admin/register-city-state",
    },
  ];

  const priority = [
    { label: "Top (size(w * h): 1920*300 px)", value: "Max" },
    { label: "Right (size(w * h): 400*400 px)", value: "Mid" },
    { label: "Left (size(w * h): 400*400 px)", value: "Min" },
  ];

  const SubmitPromotion = async (e) => {
    e.preventDefault();

    try {
      startLoading();

      const formData = new FormData(formRef.current);

      // force priority if mobile
      if (formData.get("isMobile") === "true") {
        formData.set("priority", "Max");
      }

      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ": " + pair[1]);
      // }

      const response = await FetchData(
        `promotions/make/promotions/${user?._id}`,
        "post",
        formData,
        true,
      );

      cancelPopup();
      alert(response.data.message);
    } catch (err) {
      // console.log(err);
    } finally {
      stopLoading();
    }
  };

  const sections = [
    { label: "Overview", count: 0 },
    { label: "Enquiries", count: enquiryData.length || 0 },
    { label: "Hotels", count: 0 },
    { label: "Clubs", count: 0 },
    { label: "Active Places", count: 0 },
    { label: "Inactive Places", count: inactivePlaceData.length || 0 },
    { label: "Food Place", count: pendingFoodCount.length || 0 },
    { label: "Users", count: 0 },
    { label: "Verified Facilitator", count: 0 },
    {
      label: "Non-Verified Facilitator",
      count: inactiveFacilitator.length || 0,
    },
    { label: "Cities", count: 0 },
    { label: "States", count: 0 },
    { label: "Countries", count: 0 },
    { label: "Packages", count: 0 },
    { label: "Promotions", count: 0 },
    { label: "Sub Admins", count: 0 },
  ];

  const filteredSections =
    user?.restrictedAccess === true
      ? sections.filter((section) => user?.sectionList?.includes(section.label))
      : sections;

  return localStorage.role === "Admin" ? (
    <div className="flex flex-col h-[90vh] justify-start items-start bg-red-400">
      {/* Tables  */}
      <div className="flex w-full bg-neutral-100 px-2 h-full gap-5">
        <aside className="static bottom-0 left-0 w-72 flex justify-start items-start overflow-scroll no-scrollbar bg-neutral-200 p-3 rounded-xl shadow border border-neutral-200">
          <nav>
            <ul className="flex items-start flex-col">
              {filteredSections.map((section, idx) => (
                <li
                  key={idx}
                  className={`cursor-pointer transition-all duration-300 w-full px-4 py-2 rounded-xl ${
                    activeSection === section.label
                      ? "bg-[#FFC20E]"
                      : "hover:bg-white text-black"
                  }`}
                  onClick={() => {
                    localStorage.setItem("activeSection", section.label);
                    setActiveSection(section.label);
                    // setMenuOpen(false); // close menu on click (mobile)
                  }}
                >
                  <p className="flex justify-between items-center w-full">
                    {section.label}
                    <span
                      className={`${section?.count != 0 ? "bg-[#DF3F33] text-white rounded-full p-2 h-8 w-8 flex justify-center items-center" : ""}`}
                    >
                      {section.count != 0 ? section?.count : ""}
                    </span>
                    {activeSection === section.label ? <FaChevronRight /> : ""}
                    {/* {activeSection === "Enquiries" ? (
                      <p>{enquiryData?.length}</p>
                    ) : (
                      ""
                    )} */}
                  </p>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="w-full">
          <div className="w-full px-5 overflow-scroll bg-neutral-100 rounded-md h-[90%]">
            {activeSection === "Overview" && (
              <div className="flex gap-5">
                <div className="flex flex-col gap-4 w-fit">
                  <div className="bg-white p-4 shadow rounded">
                    <h3>Total Visits</h3>
                    <p className="text-2xl font-bold">{stats?.totalVisits}</p>
                  </div>

                  <div className="bg-white p-4 shadow rounded">
                    <h3>Today's Visitors</h3>
                    <p className="text-2xl font-bold">{stats?.todayVisits}</p>
                  </div>

                  <div className="bg-white p-4 shadow rounded">
                    <h3>Unique Users</h3>
                    <p className="text-2xl font-bold">
                      {stats?.uniqueVisitors}
                    </p>
                  </div>
                </div>
                {/* <CitiesByStateBarChart cities={cityData} /> */}
                {/* <StatesDonutChart states={stateData} /> */}
                <CategoryPieChart places={placeData} />
              </div>
            )}
            {activeSection === "Promotions" && (
              <Promotions
                TableData={promotionData}
                Text="Promotions"
                user={user?._id}
                reloadDashboard={() => fetchDashboard()}
              />
            )}
            {activeSection === "Packages" && (
              <div className="w-full h-full flex flex-col justify-start items-start">
                <Button
                  label={"List new package"}
                  onClick={() => setPopup4(true)}
                />
                {console.log(packageData)}
                <TravelPackages
                  TableData={packageData}
                  Text="Travel Packages"
                  user={user?._id}
                />
              </div>
            )}
            {activeSection === "Hotels" && (
              <div className="w-full h-full flex flex-col justify-start items-start">
                <Button
                  label={"List new hotel"}
                  onClick={() => setPopup6(true)}
                />
                <Hotels
                  TableData={hotelData}
                  Text="Listed Hotels"
                  reloadDashboard={() => fetchDashboard()}
                />
              </div>
            )}
            {activeSection === "Clubs" && (
              <div className="w-full h-full flex flex-col justify-start items-start">
                <Button
                  label={"List new club"}
                  onClick={() => setPopup7(true)}
                />
                <Clubs
                  TableData={clubData}
                  Text="Listed Clubs"
                  reloadDashboard={() => fetchDashboard()}
                />
              </div>
            )}
            {activeSection === "Active Places" && (
              <Place TableData={placeData} Text="Listed Places" />
            )}
            {activeSection === "Cities" && (
              <City TableData={cityData} Text="Listed Cities" />
            )}
            {activeSection === "States" && (
              <State TableData={stateData} Text="Listed States" />
            )}
            {activeSection === "Countries" && (
              <div className="">
                <Button label={"Add country"} onClick={() => setPopup8(true)} />
                <Country TableData={countryData} Text="Listed Countries" />
              </div>
            )}
            {activeSection === "Inactive Places" && (
              <InactivePlace
                TableData={inactivePlaceData}
                Text="Places under review"
                user={user?._id}
              />
            )}
            {activeSection === "Verified Facilitator" && (
              <Facilitator TableData={facilitator} Text="Active Facilitator" />
            )}
            {activeSection === "Non-Verified Facilitator" && (
              <InactiveFacilitator
                TableData={inactiveFacilitator}
                Text="Facilitator under review"
                user={user?._id}
              />
            )}
            {activeSection === "Food Place" && (
              <div className="w-full h-full flex flex-col justify-start items-start">
                <Button
                  label={"List new Food Place"}
                  onClick={() => setPopup5(true)}
                />
                <FoodKiosks
                  reloadDashboard={() => fetchDashboard()}
                  TableData={foodKioskData}
                  Text="Food kiosks"
                  user={user?._id}
                />
              </div>
            )}
            {activeSection === "Users" && (
              <div className="w-full h-full flex flex-col justify-start items-start">
                <Users TableData={userData} Text="User details" />
              </div>
            )}
            {activeSection === "Enquiries" && (
              <div className="w-full h-full flex flex-col justify-start items-start">
                <Enquiry
                  TableData={enquiryData}
                  TableData2={reviewedEnquiryData}
                  TableData3={hotEnquiryData}
                  Text="Enquiries"
                  user={user?._id}
                />
              </div>
            )}
            {activeSection === "Sub Admins" && (
              <div className="w-full h-full flex flex-col justify-start items-start">
                <Button
                  label={"Add new sub admin"}
                  onClick={() => setPopup9(true)}
                />
                <SubAdmins
                  TableData={subAdminData}
                  Text="Sub admins"
                  user={user?._id}
                />
              </div>
            )}
          </div>

          {/* buttons  */}
          <div className="flex h-14 justify-center items-center gap-2">
            <Button
              label={
                <h1 className="flex justify-center items-center gap-2">
                  <LuRefreshCw />
                  Reload Dashboard
                </h1>
              }
              className={"w-full text-nowrap"}
              onClick={() => fetchDashboard()}
            />
            <Button
              label={
                <h1 className="flex justify-center items-center gap-2">
                  <RiImageAddFill /> Add new banner
                </h1>
              }
              className={"w-full text-nowrap"}
              onClick={() => setPopup(true)}
            />
            {commands.map((item, index) => (
              <Button
                key={index}
                label={item.label}
                className={"w-full text-nowrap"}
                onClick={() => navigate(item.path)}
              />
            ))}
            <Button
              label={
                <h1 className="flex justify-center items-center gap-2">
                  <MdOutlineRule />
                  C.M.S.
                </h1>
              }
              className={"w-full"}
              onClick={() => setPopup3(true)}
            />
            <Button
              label={
                <h1 className="flex justify-center items-center gap-2">
                  <IoMdLogOut />
                  Log out
                </h1>
              }
              className={"w-full"}
              onClick={() => logout()}
            />
          </div>
        </main>
      </div>

      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-start items-center flex-col z-50 bg-black/80 overflow-scroll"
          >
            <div className="flex bg-white px-10 py-10 rounded-xl flex-col justify-start items-center gap-20 w-[90%]">
              <form
                onSubmit={SubmitPromotion}
                ref={formRef}
                className="flex flex-col justify-center gap-3"
              >
                {/* MOBILE TOGGLE */}
                <div className="flex justify-center items-center gap-5">
                  <label className="block text-sm font-medium">
                    Is this Mobile Banner?
                  </label>

                  <div className="flex items-center gap-4">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setIsMobile((prev) => !prev)}
                      className={`relative w-14 h-7 flex items-center rounded-full transition ${
                        isMobile ? "bg-[#FFC20E]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                          isMobile ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>

                    <span className="text-sm font-medium">
                      {isMobile
                        ? "Make sure the banner should be (w * h): 1920*300 px"
                        : ""}
                    </span>
                  </div>

                  {/* Hidden input so FormData sends value */}
                  <input
                    type="hidden"
                    name="isMobile"
                    value={isMobile ? "true" : "false"}
                  />
                </div>
                {/* banner name */}
                <InputBox
                  LabelName="Name for promotion"
                  Type="text"
                  Placeholder="Enter name for this promotion"
                  Name="name"
                  required
                />

                {/* PRIORITY (HIDE WHEN MOBILE) */}
                {!isMobile && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Where to insert this banner
                    </label>

                    <select
                      name="priority"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                    >
                      <option value="">Select banner location</option>

                      {priority.map((location) => (
                        <option key={location.id} value={location.value}>
                          {location.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* AUTO PRIORITY FOR MOBILE */}
                {isMobile && (
                  <input type="hidden" name="priority" value="Max" />
                )}

                {/* Place */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Place
                  </label>
                  <select
                    required
                    name="placeId"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                  >
                    <option value="">Select place</option>

                    {placeData.map((place) => (
                      <option key={place._id} value={place._id}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* image */}
                <div className="col-span-2 bg-gray-200 py-5 px-2 rounded-xl">
                  <label className="block text-sm font-medium mb-1">
                    Banner Image
                  </label>

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
                  />

                  {imagePreviews.length > 0 && (
                    <div className="mt-3 w-full gap-5 rounded-xl overflow-hidden bg-neutral-300 flex justify-center items-center flex-col">
                      {imagePreviews.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt="preview"
                          className="w-[50%]"
                        />
                      ))}

                      <Button
                        label={"Choose another"}
                        onClick={() => setImagePreviews([])}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-center items-center gap-10 w-full">
                  <Button label={"Cancel"} onClick={() => cancelPopup()} />
                  <Button label={"Confirm"} type={"submit"} />
                </div>
              </form>
            </div>
          </motion.div>
        )}
        {popup2 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center flex-col z-50 bg-black/80 overflow-scroll"
          >
            <AdminRegistrationForm onCancel={() => setPopup2(false)} />
          </motion.div>
        )}
        {popup3 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-start items-start flex-col z-50 bg-black/90 overflow-scroll"
          >
            <AdminCMS adminId={user?._id} onCancel={() => setPopup3(false)} />
          </motion.div>
        )}
        {popup4 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-start items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <PackageRegisteration
              onCancel={() => setPopup4(false)}
              offPopup={() => {
                setPopup4(false);
                fetchDashboard();
              }}
            />
          </motion.div>
        )}
        {popup5 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-start items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <FoodKiosk onCancel={() => setPopup5(false)} user={user?._id} />
          </motion.div>
        )}
        {popup6 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-start items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <AddNewHotel
              onCancel={() => setPopup6(false)}
              adminId={user?._id}
            />
          </motion.div>
        )}
        {popup7 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-start items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <AddNewClub onCancel={() => setPopup7(false)} adminId={user?._id} />
          </motion.div>
        )}
        {popup8 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <AddCountry onCancel={() => setPopup8(false)} adminId={user?._id} />
          </motion.div>
        )}
        {popup9 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-start items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <SubAdmin onCancel={() => setPopup9(false)} adminId={user?._id} />
          </motion.div>
        )}
        {socketNotifications.length > 0 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-20 right-10 z-50 mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">New food place registered</p>
                <p>
                  {socketNotifications[0]?.message ||
                    "A new food place has been registered."}
                </p>
                {socketNotifications.length > 1 && (
                  <p className="mt-1 text-xs text-green-700">
                    +{socketNotifications.length - 1} more notification(s)
                  </p>
                )}
              </div>
              <button
                className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-900 hover:bg-green-200"
                onClick={() => setSocketNotifications([])}
              >
                Dismiss
              </button>
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

export default LoadingUI(AdminDashboard);
