import React, { useState } from "react";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getDistanceKm } from "../../utils/DistanceCalculator";

/* ================= MARKER ================= */

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
      className="absolute group"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        zIndex: show ? 999 : 1, // ⭐ FIX: tooltip always above center
      }}
    >
      {/* DASHED LINE */}
      <div
        className="absolute top-1/2 right-1/2 origin-right border-t border-dashed border-gray-900"
        style={{
          width: Math.sqrt(x * x + y * y),
          transform: `rotate(${Math.atan2(y, x)}rad)`,
        }}
      />

      {/* PIN */}
      <Link
        to={`/current/place/${place?._id}`}
        onClick={(e) => {
          if (!show) {
            e.preventDefault();
            setShow(true);
            setTimeout(() => setShow(false), 2500);
          }
        }}
        className="relative text-2xl cursor-pointer "
      >
        <FaMapMarkerAlt />
      </Link>

      {/* TOOLTIP */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 bottom-7
          bg-black text-white px-3 py-2 rounded
          whitespace-nowrap transition hover:z-[1000]
          ${show ? "opacity-100" : "opacity-0"}
          group-hover:opacity-100
        `}
        style={{ zIndex: 99999 }} // ⭐ force on top
      >
        {place?.images?.[0]?.url && (
          <div className="w-24 h-24 mb-1">
            <img
              src={place.images[0].url}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        <div className="text-sm font-medium">{place.name}</div>

        {distance && (
          <div className="text-xs text-gray-300">{distance} km away</div>
        )}
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const CityPlacesCircle = ({ cityName, places = [], cityLong, cityLat }) => {
  const radius = 150;
  const centerSize = 130;

  const [expanded, setExpanded] = useState(false);

  /* ---------- limit to 24 ---------- */
  const visiblePlaces = places.slice(0, 24);
  const extraPlaces = places.slice(24);

  return (
    <div className="w-full">
      {/* CIRCLE */}
      <div className="relative md:w-[400px] w-full h-[400px] md:mx-auto flex items-center justify-center bg-gray-200 rounded-xl shadow overflow-visible">
        {/* CENTER CIRCLE */}
        <div
          className="absolute flex items-center justify-center rounded-full bg-[#FFC20E] font-semibold shadow-lg flex-col z-10 group"
          style={{ width: centerSize, height: centerSize }}
        >
          {/* HEART + TOOLTIP */}
          <div className="relative flex items-center gap-2">
            <p>I</p>
            <FaHeart className="text-red-500" />

            <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
              We are displaying distance from the heart of city
            </div>
          </div>

          {/* CITY NAME */}
          <span
            className={`text-center px-2 leading-tight ${
              cityName?.length > 18
                ? "text-[11px]"
                : cityName?.length > 12
                  ? "text-xs"
                  : "text-sm md:text-base"
            }`}
          >
            {cityName}
          </span>
        </div>

        {/* MARKERS */}
        {visiblePlaces.map((place, index) => {
          const angle = (2 * Math.PI * index) / visiblePlaces.length;
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

      {/* ---------- SHOW MORE BUTTON ---------- */}
      {extraPlaces.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-4 py-2 bg-[#FFC20E] rounded shadow hover:scale-105 transition"
          >
            {expanded
              ? "Hide other places"
              : `Show ${extraPlaces.length} more places`}
          </button>
        </div>
      )}

      {/* ---------- ACCORDION ---------- */}
      {expanded && (
        <div className="mt-4 p-4 bg-gray-100 rounded-xl shadow space-y-2">
          {extraPlaces.map((place) => (
            <Link
              key={place._id}
              to={`/current/place/${place._id}`}
              className="block p-2 hover:bg-gray-200 rounded"
            >
              {place.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityPlacesCircle;
