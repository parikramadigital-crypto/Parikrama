// ClubDashboard.jsx

import React, { useState } from "react";
import { BiMap, BiSolidStar } from "react-icons/bi";
import MembersManager from "./MembersManager";
import EventsManager from "./EventsManager";
import GalleryManager from "./GalleryManager";

const ClubDashboard = ({ club: initialClub }) => {
  const [club, setClub] = useState(initialClub);

  return (
    <div className="max-w-7xl mx-auto p-5">
      {/* COVER */}
      <div className="h-[350px] rounded-3xl overflow-hidden border border-neutral-200">
        <img
          src={club?.images?.coverImage?.url || "https://placehold.co/1200x400"}
          alt={club?.clubName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mt-6 gap-5">
        {/* LEFT */}
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">
            {club?.clubName}
          </h1>

          <p className="flex items-center gap-2 text-gray-500 mt-3">
            <BiMap className="text-lg" />
            {club?.location?.city?.name || "Unknown City"},{" "}
            {club?.location?.state?.name || "Unknown State"}
          </p>

          <p className="text-sm text-gray-400 mt-2">{club?.category}</p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#FFF4D3] rounded-full px-5 py-3 flex items-center gap-2 font-medium">
            <BiSolidStar />
            {club?.ratings?.average || 0} / 5
          </div>

          <div className="bg-blue-100 text-blue-700 rounded-full px-5 py-3 font-medium">
            {club?.members?.length || 0} Members
          </div>

          {club?.adminVerified && (
            <div className="bg-green-100 text-green-700 rounded-full px-5 py-3 font-medium">
              Verified
            </div>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      {club?.description && (
        <div className="mt-8 bg-white rounded-3xl p-6 border border-neutral-200">
          <h2 className="text-2xl font-bold mb-3">About Club</h2>

          <p className="text-gray-600 leading-7">{club.description}</p>
        </div>
      )}

      {/* MODULES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">
        <MembersManager club={club} setClub={setClub} />

        <EventsManager club={club} setClub={setClub} />

        <GalleryManager club={club} setClub={setClub} />
      </div>
    </div>
  );
};

export default ClubDashboard;
