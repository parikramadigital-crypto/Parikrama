import React, { use, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCarSide,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";

import RandomImageSlider from "../../components/ui/RandomImageSlider";
import Button from "../../components/Button";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useSelector } from "react-redux";
import { truncateString } from "../../utils/Utility-functions";

const CurrentCityDarshan = ({ startLoading, stopLoading }) => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [readMore, setReadMore] = useState(100);
  const [popup, setPopup] = useState(false);
  const [handlePopup, setHandlePopup] = useState(false);
  const user = useSelector((state) => state.auth);
  console.log(user)
  const navigate = useNavigate();

  useEffect(() => {
    const loadTour = async () => {
      try {
        startLoading();
        const res = await FetchData(
          `city-darshan/admin/get/city-darshan-packages/${id}`,
          "get",
        );
        setTour(res.data.data);
      } catch (err) {
        alert(parseErrorMessage(err?.response?.data || ""));
      } finally {
        stopLoading();
      }
    };

    loadTour();
  }, [id]);

  if (!tour)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  const imageUrls = tour.images?.map((i) => i.url) || [];
  const startingPrice = tour.vehicles?.length
    ? Math.min(...tour.vehicles.map((v) => Number(v.price)))
    : 0;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="w-full mx-auto md:px-5 px-2 py-4 gap-4 flex flex-col justify-start items-start">
        <Button
          onClick={() => navigate("/city-darshan")}
          label={
            <h1 className="flex justify-center items-center gap-2 w-fit">
              <FaArrowLeft />
              Back
            </h1>
          }
          normal={false}
        />

        <div className="grid lg:grid-cols-3 gap-4 w-full">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="rounded-3xl overflow-hidden shadow-xl h-[420px]">
              <RandomImageSlider
                images={imageUrls}
                className="h-full rounded-none"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4 shadow-xl"
            >
              <h1 className="text-4xl font-bold">{tour.name}</h1>

              <div className="flex flex-wrap gap-6 mt-5 text-neutral-600">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#FFC20E]" />
                  {tour.city?.name}, {tour.state?.name}
                </div>

                <div className="flex items-center gap-2">
                  <FaClock className="text-[#FFC20E]" />
                  {tour.totalHours} Hours
                </div>

                <div className="flex items-center gap-2">
                  <FaCarSide className="text-[#FFC20E]" />
                  {tour.vehicles?.length} Vehicle Options
                </div>
              </div>

              <div className="mt-8 text-neutral-700 flex flex-col justify-start items-start overflow-hidden">
                <p className="duration-300 ease-in-out transition text-justify">
                  {truncateString(tour.description, readMore)}
                </p>
                {readMore === tour.description.length ? (
                  <button
                    className="text-blue-600 text-xs hover:underline"
                    onClick={() => setReadMore(100)}
                  >
                    Read Less
                  </button>
                ) : (
                  <button
                    className="text-blue-600 text-xs hover:underline"
                    onClick={() => setReadMore(tour.description.length)}
                  >
                    Read more
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6">
                Places Covered ({tour.placesToCover.length})
              </h2>

              <div className="grid md:grid-cols-2 gap-2">
                {tour.placesToCover?.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border border-neutral-200 rounded-xl p-2"
                  >
                    <FaMapMarkerAlt className="text-[#FFC20E]" />
                    {place}
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-2 md:justify-center items-center w-full">
              <div className="bg-white rounded-3xl p-4 shadow-xl h-full w-full">
                <h2 className="text-2xl font-bold mb-4">Inclusions</h2>

                {tour.inclusions?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-2 justify-start items-center"
                  >
                    <FaCheckCircle className="text-green-600" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3xl p-4 shadow-xl h-full w-full">
                <h2 className="text-2xl font-bold mb-6">Exclusions</h2>

                {tour.exclusions?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-2 justify-start items-center"
                  >
                    <FaTimesCircle className="text-red-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24 bg-white rounded-3xl shadow-2xl p-6">
              <p className="text-neutral-500">Starting From</p>

              <h2 className="text-4xl font-bold text-[#FFC20E] drop-shadow-2xl shadow-black">
                ₹{startingPrice.toLocaleString()}/-
              </h2>

              <hr className="my-6" />

              <h3 className="font-bold text-lg mb-4">Available Vehicles</h3>

              <div className="space-y-4">
                {tour.vehicles?.map((vehicle, index) => (
                  <div key={index} className="border rounded-2xl p-4">
                    <h4 className="font-semibold">{vehicle.vehicleType}</h4>

                    <p>Max Persons : {vehicle.maxPersons}</p>

                    <p className="font-bold text-[#FFC20E]">
                      ₹{vehicle.price.toLocaleString()}/-
                    </p>
                  </div>
                ))}
              </div>
              {user.user === null ? (
                <Button
                  className="w-full mt-8"
                  label="Book Now"
                  onClick={() => {
                    setPopup(true);
                    setTimeout(() => {
                      setPopup(false);
                    }, 5000);
                  }}
                />
              ) : (
                <Button
                  className="w-full mt-8"
                  label="Book Now"
                  onClick={() => {
                    window.location.href = `/city-darshan/booking/${tour._id}`;
                  }}
                />
              )}
            </div>
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
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-white"
          >
            <div className="flex justify-center items-center flex-col gap-5 bg-neutral-200 shadow-2xl p-5 rounded-xl">
              <h1 className="flex justify-center items-center gap-2">
                Please login or register to continue
              </h1>
              <div className="flex justify-center items-center gap-5">
                <Button
                  label={"Register"}
                  onClick={() => navigate("/authentication")}
                />
                <Button
                  label={"Login"}
                  onClick={() => navigate("/authentication")}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingUI(CurrentCityDarshan);
