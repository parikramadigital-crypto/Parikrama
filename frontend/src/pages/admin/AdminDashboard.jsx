import React, { useEffect, useRef, useState } from "react";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
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
} from "../../components/ui/TableUI";
import { RiImageAddFill } from "react-icons/ri";
import { MdAdd, MdAddLocationAlt } from "react-icons/md";
import { LuRefreshCw } from "react-icons/lu";
import { IoMdLogOut } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import InputBox from "../../components/InputBox";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CategoryPieChart from "../../components/ui/CategoryPieChart";
import StatesDonutChart from "../../components/ui/StatesDonutChart";
import CitiesByStateBarChart from "../../components/ui/CitiesByStateBarChart";

const AdminDashboard = ({ startLoading, stopLoading }) => {
  const [placeData, setPlaceData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [facilitator, setFacilitator] = useState([]);
  const [inactivePlaceData, setInactivePlaceData] = useState([]);
  const [inactiveFacilitator, setInactiveFacilitator] = useState([]);
  const [popup, setPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    () => localStorage.getItem("activeSection") || "Overview",
  );

  const fetchDashboard = async () => {
    try {
      startLoading();
      const res = await FetchData("admin/dashboard/data", "get");
      setPlaceData(res.data.data.place); // done
      setCityData(res.data.data.city); // done
      setStateData(res.data.data.state); // done
      setFacilitator(res.data.data.activeFacilitator); //done
      setInactivePlaceData(res.data.data.inactivePlace); // done
      setInactiveFacilitator(res.data.data.inactiveFacilitator); //done
    } catch (err) {
      // console.log(err);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

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
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    if (files[0].size > MAX_SIZE) {
      alert("Image size must be less than 2 MB");
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
    { label: "Top", value: "Max" },
    { label: "Left", value: "Mid" },
    { label: "Right", value: "Min" },
  ];

  const SubmitPromotion = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const formData = new FormData(formRef.current);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      const response = await FetchData(
        `promotions/make/promotions/${user?._id}`,
        "post",
        formData,
        true,
      );
      console.log(response);
      cancelPopup();
      alert("Banner added successfully!");
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  const sections = [
    "Overview",
    "Active Places",
    "Cities",
    "States",
    "Inactive Places",
    "Verified Facilitator",
    "Non-Verified Facilitator",
  ];

  return user ? (
    <div className="flex flex-col h-screen gap-5 justify-between items-start">
      {/* <h2 className="text-2xl font-bold mb-2 px-20">Admin Dashboard</h2> */}
      {/* ADMIN DETAILS  */}
      <div className="w-full px-20">
        <div className="rounded-xl overflow-hidden">
          <button
            className={"w-full bg-gray-300 px-10 py-2"}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold uppercase">
                Your Details and Quick Actions
              </h2>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown className="w-6 h-6" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="flex w-full shadow-2xl p-5 rounded-b-xl bg-neutral-200 justify-between ">
                  <div className="md:space-y-2">
                    {userDetails.map((item, index) => (
                      <h1 key={index}>
                        <strong>{item.label} :</strong> {item.value ?? "NA"}
                      </h1>
                    ))}
                  </div>
                  {/* BUTTONS  */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* <div className="flex justify-center items-start gap-5"> */}
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
                          <IoMdLogOut />
                          Log out
                        </h1>
                      }
                      className={"w-full"}
                      onClick={() => logout()}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tables  */}
      <div className="flex w-full bg-neutral-200 px-5 py-5 rounded-xl h-full gap-5">
        <aside className="static bottom-0 left-0 w-60 flex justify-start items-start h-full">
          <nav>
            <ul className="flex gap-5 items-start flex-col">
              {sections.map((section, idx) => (
                <li
                  key={section}
                  className={`cursor-pointer transition-all duration-300 rounded-xl shadow-2xl w-full p-4 ${
                    activeSection === section
                      ? "bg-[#FFC20E] underline"
                      : "bg-white text-black"
                  }`}
                  onClick={() => {
                    setActiveSection(section);
                    setMenuOpen(false); // close menu on click (mobile)
                  }}
                >
                  {section}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="w-full px-5 overflow-scroll bg-neutral-100 rounded-md pb-5">
          {activeSection === "Overview" && (
            <div className="flex justify-start items-start gap-5 pb-5 overflow-y-scroll w-fit">
              <CategoryPieChart places={placeData} />
              <StatesDonutChart states={stateData} />
              <CitiesByStateBarChart cities={cityData} />
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
                {/* banner name  */}
                <InputBox
                  LabelName="Name for promotion"
                  Type="text"
                  Placeholder="Enter name for this promotion"
                  Name="name"
                  required
                />
                {/* priority  */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Where to insert this banner
                  </label>
                  <select
                    name="priority"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                    // onChange={(e) => handleCityChange(e.target.value)}
                  >
                    <option value="">Select banner location</option>
                    {priority.map((location) => (
                      <option key={location.id} value={location.value}>
                        {location.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Place  */}
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
                {/* image  */}
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

                  {/* PREVIEWS */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-3 w-[100%] gap-5 rounded-xl overflow-hidden bg-neutral-300 object-center object-cover flex justify-center items-center flex-col">
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
