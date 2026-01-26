import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const CityPlacesCircle = ({ cityName, places = [] }) => {
  const radius = 140; // distance from center
  const centerSize = 120;

  return (
    <div className="relative w-[400px] h-[400px] mx-auto flex items-center justify-center bg-gray-200 rounded-xl shadow">
      {/* CENTER CIRCLE */}
      <div
        className="absolute flex items-center justify-center rounded-full bg-[#FFC20E] font-semibold text-lg shadow-lg"
        style={{ width: centerSize, height: centerSize }}
      >
        {cityName}
      </div>

      {/* PLACES AROUND CIRCLE */}
      {places.map((place, index) => {
        const angle = (2 * Math.PI * index) / places.length;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <div
            key={place._id || index}
            className="absolute group"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            {/* POINT */}
            <Link
              to={`/current/place/${place?._id}`}
              className="w-4 h-4 rounded-full text-2xl cursor-pointer shadow-md"
            >
              <FaMapMarkerAlt />
            </Link>

            {/* TOOLTIP */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 opacity-0 group-hover:opacity-100 transition bg-black text-white px-2 py-1 rounded whitespace-nowrap">
              {place.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CityPlacesCircle;
