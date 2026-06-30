import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCarSide,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

import RandomImageSlider from "../../components/ui/RandomImageSlider";
import Button from "../../components/Button";

const CityDarshanCard = ({ cityDarshan }) => {
  if (!cityDarshan) return null;

  const imageUrls =
    cityDarshan.images?.map((img) => img.url).filter(Boolean) || [];

  const minimumPrice =
    cityDarshan.vehicles?.length > 0
      ? Math.min(...cityDarshan.vehicles.map((v) => Number(v.price || 0)))
      : 0;

  const vehicleNames =
    cityDarshan.vehicles?.map((v) => v.vehicleType).join(" • ") || "N/A";

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-neutral-200"
    >
      <div className="relative h-64 overflow-hidden">
        <RandomImageSlider images={imageUrls} className="h-full rounded-none" />

        {cityDarshan.priority === "featured" && (
          <div className="absolute top-4 left-4 bg-[#FFC20E] px-3 py-1 rounded-full flex items-center gap-2 font-semibold shadow-lg">
            <FaStar />
            Featured
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-black/70 text-white rounded-xl px-4 py-2 backdrop-blur-sm">
          <p className="text-xs">Starting From</p>
          <h3 className="text-xl font-bold">₹{minimumPrice}</h3>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold line-clamp-1">{cityDarshan.name}</h2>

          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <FaMapMarkerAlt className="text-[#FFC20E]" />
            <span>
              {cityDarshan.city?.name}, {cityDarshan.state?.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FaClock />
            <span>{cityDarshan.totalHours} Hours</span>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt />
            <span>{cityDarshan.placesToCover?.length || 0} Places</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaCarSide />
          <span className="line-clamp-2">{vehicleNames}</span>
        </div>

        <Link to={`/current/city-darshan/${cityDarshan._id}`}>
          <Button
            className="w-full flex items-center justify-center gap-2"
            label={
              <>
                View Details <FaArrowRight />
              </>
            }
          />
        </Link>
      </div>
    </motion.div>
  );
};

export default CityDarshanCard;
