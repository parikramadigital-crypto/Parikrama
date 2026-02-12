import React, { useState } from "react";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getDistanceKm } from "../../utils/DistanceCalculator";

const MobileMarker = ({ place, x, y, cityLat, cityLong }) => {
  const [show, setShow] = useState(false);
  const placeLat = place?.location?.coordinates?.[1];
  const placeLong = place?.location?.coordinates?.[0];

  const distance =
    cityLat && cityLong && placeLat && placeLong
      ? getDistanceKm(cityLat, cityLong, placeLat, placeLong).toFixed(1)
      : null;

  return (
    <div
      className="absolute group hover:z-50"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {/* DASHED LINE */}
      <div
        className="absolute top-1/2 right-1/2 origin-right border-t group-hover:border-none border-dashed border-gray-900 group-hover:z-0"
        style={{
          width: Math.sqrt(x * x + y * y),
          transform: `rotate(${Math.atan2(y, x)}rad)`,
        }}
      />

      {/* ICON */}
      <Link
        to={`/current/place/${place?._id}`}
        onClick={(e) => {
          if (!show) {
            e.preventDefault();
            setShow(true);
            setTimeout(() => setShow(false), 2500);
          }
        }}
        className="relative z-10 text-2xl cursor-pointer"
      >
        <FaMapMarkerAlt />
      </Link>

      {/* TOOLTIP */}
      <div
        className={`
    absolute 
    left-1/2 
    -translate-x-1/2 
    bottom-7
    bg-black 
    text-white 
    px-3 
    py-1 
    rounded 
    whitespace-nowrap
    z-50
    pointer-events-none
    transition
    ${show ? "opacity-100" : "opacity-0"}
    group-hover:opacity-100
  `}
      >
        <div className="w-24 h-24  bg-red-400">
          <img
            src={place?.images[0]?.url}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-sm font-medium">{place.name}</div>
        {distance && (
          <div className="text-xs text-gray-300">{distance} km away</div>
        )}
      </div>
    </div>
  );
};

const CityPlacesCircle = ({ cityName, places = [], cityLong, cityLat }) => {
  const radius = 150; // distance from center
  const centerSize = 130;

  return (
    <div className="relative md:w-[400px] w-full h-[400px] md:mx-auto flex items-center justify-center bg-gray-200 rounded-xl shadow">
      {/* CENTER CIRCLE */}
      <div
        className="absolute flex items-center justify-center rounded-full bg-[#FFC20E] font-semibold text-lg shadow-lg z-50 flex-col"
        style={{ width: centerSize, height: centerSize }}
      >
        <span className="flex justify-center items-center gap-2">
          I <FaHeart className="text-red-500" />
        </span>
        {/* <span>{cityName}</span> */}
        <span
          className={`${cityName?.length > 18 ? "text-[11px]" : cityName?.length > 12 ? "text-xs" : "text-sm md:text-base"}`}
        >
          {cityName}
        </span>
      </div>

      {/* PLACES AROUND CIRCLE */}
      {places.map((place, index) => {
        const angle = (2 * Math.PI * index) / places.length;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <MobileMarker
            key={place._id || index}
            place={place}
            x={x}
            y={y}
            cityLat={cityLat}
            cityLong={cityLong}
          />
        );
      })}
    </div>
  );
};

export default CityPlacesCircle;
