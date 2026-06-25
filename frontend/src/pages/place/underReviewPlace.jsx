import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import {
  FaMapMarkerAlt,
  FaClock,
  FaRupeeSign,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import NewCity from "../../components/ui/NewCity";
import InputBox from "../../components/InputBox";
import { formatDateTimeString } from "../../utils/mongoDB_DateTime";

const PlaceDetailsCard = ({ place }) => {
  if (!place) return null;

  const {
    _id,
    name,
    category,
    description,
    averageTimeSpent,
    bestTimeToVisit,
    entryFee,
    popularityScore,
    images,
    city,
    state,
    location,
    uploaderName,
    uploaderContact,
    isActive,
    customCity,
    createdAt,
  } = place;

  const lat = location?.coordinates?.[1];
  const lng = location?.coordinates?.[0];

  const [popup, setPopup] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const formRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await FetchData("states", "get");
        setStates(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  const addNewCity = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `cities/register-city/by-place/${user?._id}/${_id}`,
        "post",
        formData,
      );
      setSuccess(response.data.data.message);
      formRef.current.reset();
      window.location.reload();
    } catch (err) {
      setError(err.response.data.message || "Something went wrong");
    }
  };

  const acceptPlace = async () => {
    try {
      const res = await FetchData(`places/active-new-place/${_id}`, "post");
      // setStates(res?.data?.data || []);
      alert("Place accepted");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-[90%] bg-white rounded-xl shadow-md overflow-hidden">
      {/* ================= IMAGE ================= */}
      <div className="w-full h-72 bg-gray-200 flex items-center justify-center">
        {images?.length > 0 ? (
          <img
            src={images[0]?.url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No Image Available</span>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6 space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            {customCity ? (
              <p className="text-gray-500 text-sm">
                {customCity}, {state?.name}{" "}
                <Button
                  label={"Add City"}
                  className={"text-black"}
                  onClick={() => setPopup(true)}
                />
                <span className="text-red-700 font-semibold">
                  ** This city is not listed in the Database first register it.
                </span>
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                {city?.name}, {state?.name}
              </p>
            )}
            {/* <p className="text-gray-500 text-sm">
              {city?.name}, {state?.name}
            </p> */}
          </div>

          <span
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs
              ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {isActive ? <FaCheckCircle /> : <FaTimesCircle />}
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* CATEGORY */}
        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
          {category}
        </span>

        {/* DESCRIPTION */}
        <p className="text-gray-700">{description}</p>

        {/* META INFO */}
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p className="flex items-center gap-2">
            <FaClock />
            Avg Time: {averageTimeSpent} mins
          </p>

          <p className="flex items-center gap-2">
            <FaRupeeSign />
            Entry Fee: ₹{entryFee}
          </p>

          <p className="flex items-center gap-2">
            <FaStar />
            Popularity: {popularityScore}
          </p>

          <p className="flex items-center gap-2">
            <FaMapMarkerAlt />
            Lat: {lat}, Lng: {lng}
          </p>
        </div>

        {/* BEST TIME */}
        {bestTimeToVisit && (
          <div>
            <h3 className="font-semibold">Best Time To Visit</h3>
            <p className="text-gray-600">{bestTimeToVisit}</p>
          </div>
        )}

        {/* UPLOADER */}
        <div className="border-t pt-4 flex justify-between items-start">
          <div>
            <h3 className="font-semibold mb-1">Submitted By</h3>
            <p>Name: {uploaderName}</p>
            <p>Contact: {uploaderContact}</p>
            <p>
              Place added <span className="text-xs">(DDMMYY)</span>:{" "}
              {formatDateTimeString(createdAt)}
            </p>
          </div>
          <div>
            {customCity ? (
              ""
            ) : (
              <Button
                label={"Accept this place"}
                onClick={() => acceptPlace()}
              />
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center flex-col z-50 bg-black/80 overflow-scroll"
          >
            <div className="flex bg-white px-10 py-10 rounded-xl flex-col justify-center items-center w-1/2 h-fit">
              <form ref={formRef} onSubmit={addNewCity} className="w-full">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <div className="">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State
                    </label>
                    <select
                      name="stateId"
                      required
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {states?.map((state) => (
                        <option key={state._id} value={state._id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <InputBox
                    Placeholder="City name"
                    LabelName="City Name"
                    Name="name"
                  />
                  <InputBox
                    Placeholder="Longitude"
                    LabelName="Longitude of city"
                    Name="lng"
                  />
                  <InputBox
                    Placeholder="Latitude"
                    LabelName="Latitude of city"
                    Name="lat"
                  />
                </div>
                <div className="flex justify-center items-center gap-2">
                  <Button label={"Cancel"} onClick={() => setPopup(false)} />
                  <Button label={"Submit"} type={"submit"} />
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UnderReviewPlace = ({ startLoading, stopLoading }) => {
  const { user } = useSelector((state) => state.auth);
  const { placeId } = useParams();
  const [data, setData] = useState();

  const place = async () => {
    try {
      startLoading();
      const response = await FetchData(`places/inactive/${placeId}`, "get");
      setData(response.data.data);
    } catch (err) {
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    place();
  }, []);


  return user?.role === "Admin" ? (
    <div className="flex justify-center items-center w-full">
      <PlaceDetailsCard place={data} />
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

export default LoadingUI(UnderReviewPlace);
