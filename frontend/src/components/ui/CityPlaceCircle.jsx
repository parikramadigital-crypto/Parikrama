import React, { useState } from "react";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaArrowRight,
  FaLocationArrow,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getDistanceKm } from "../../utils/DistanceCalculator";
import { IoClose } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";

const CityPlacesCircle = ({ cityName, places = [], cityLat, cityLong }) => {
  const [selectedPlace, setSelectedPlace] = useState(places?.[0]);

  const radius = 150;

  return (
    <div className=" relative w-full h-[500px] overflow-hidden rounded-[40px] bg-[#f5f5f7] flex items-center justify-center ">
      {/* SIDE CARD */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            layout
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute top-1/2 -translate-y-1/2 w-[320px] bg-white rounded-[30px] shadow-2xl overflow-hidden z-50"
          >
            <div className="relative h-[190px]">
              <button className=" absolute top-4 left-4 rounded-full bg-white/70 shadow-lg flex items-center justify-center text-[10px] px-2 py-1 leading-2.5">
                <IoIosInformationCircle className="text-base" />
                The distance is from <br /> the heart of the City.
              </button>
              <img
                src={selectedPlace?.images?.[0]?.url}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => setSelectedPlace(false)}
                className=" absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"
              >
                <IoClose />
              </button>
            </div>

            <div className="p-3">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedPlace?.name}
              </h2>

              <div className="flex items-center gap-2 mt-3 text-gray-500">
                <FaLocationArrow className="text-[#FFC20E]" />
                <span className="text-lg">
                  {getDistanceKm(
                    cityLat,
                    cityLong,
                    selectedPlace?.location?.coordinates?.[1],
                    selectedPlace?.location?.coordinates?.[0],
                  ).toFixed(1)}{" "}
                  km away
                </span>
              </div>

              <Link
                onClick={() => setSelectedPlace(false)}
                to={`/current/place/${selectedPlace?._id}`}
                className=" text-xs flex items-center justify-center gap-3 bg-[#FFC20E] py-4 rounded-2xl font-semibold"
              >
                View Place
                <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENTER CIRCLE */}
      <div className=" relative w-[110px] h-[110px] rounded-full bg-[#FFC20E] shadow-[0_20px_60px_rgba(255,193,7,0.35)] flex flex-col items-center justify-center z-40">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold">I</span>

          <FaHeart className="text-red-500 text-xl" />
        </div>

        <h2
          className={`text-xl font-bold mt-2 ${cityName?.length > 18 ? "text-[10px]" : cityName?.length > 12 ? "text-xs" : "text-sm md:text-base"}`}
        >
          {cityName}
        </h2>
      </div>

      {/* OUTER RINGS */}
      <div className="absolute w-[400px] h-[400px] rounded-full border border-gray-400 opacity-30" />
      <div className="absolute w-[500px] h-[500px] rounded-full border border-gray-600 opacity-20" />

      {/* MARKERS */}
      {places.map((place, index) => {
        const angle = (2 * Math.PI * index) / places.length;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const distance = getDistanceKm(
          cityLat,
          cityLong,
          place?.location?.coordinates?.[1],
          place?.location?.coordinates?.[0],
        ).toFixed(1);

        return (
          <div
            key={place?._id}
            className="absolute"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            {/* CONNECTOR */}
            <div
              className=" absolute top-1/2 right-1/2 origin-right border-t border-dashed border-gray-400"
              style={{
                width: Math.sqrt(x * x + y * y),
                transform: `rotate(${Math.atan2(y, x)}rad)`,
              }}
            />

            {/* MARKER BUTTON */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              onClick={() => setSelectedPlace(place)}
              className=" relative z-20 w-10 h-10 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border border-gray-100"
            >
              <FaMapMarkerAlt className="text-[#FFC20E] text-2xl" />
            </motion.button>
          </div>
        );
      })}
    </div>
  );
};

export default CityPlacesCircle;
