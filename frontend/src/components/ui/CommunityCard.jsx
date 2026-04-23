import { Link } from "react-router-dom";
import { BiMap, BiSolidStar, BiUser, BiCalendar } from "react-icons/bi";
import { FaTag } from "react-icons/fa";
import { truncateString } from "../../utils/Utility-functions";

const CommunityCard = ({ community }) => {
  const imageUrl =
    community?.images?.profileImage?.url ||
    community?.images?.gallery?.[0]?.url ||
    "";

  return (
    <Link
      to={`/community/${community?._id}`}
      className="group block bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg transition overflow-hidden w-72"
    >
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            // alt={community?.clubName}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
        {community?.personalDetails?.soloTraveler && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium">
            Solo Traveler: {community?.personalDetails?.soloTraveler}
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            {/* <p className="text-sm text-gray-500 flex items-center gap-2">
              <BiMap /> {community?.location?.city},{" "}
              {community?.location?.state}
            </p> */}
            <h3 className="text-xl font-semibold text-gray-900 mt-2">
              {community?.personalDetails?.name}
            </h3>
          </div>
          {/* <div className="text-right">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#FFC20E]/20 px-3 py-1 text-sm font-medium text-[#6B4A00]">
              <BiSolidStar /> {community?.ratings?.average || 0}
            </div>
          </div> */}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {truncateString(community?.about, 110)}
        </p>

        {/* <div className="flex flex-wrap gap-2">
          {community?.category && (
            <span className="text-xs uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {community.category}
            </span>
          )}
          {community?.amenities?.slice(0, 2).map((amenity) => (
            <span
              key={amenity}
              className="text-xs px-3 py-1 rounded-full bg-[#FFC20E]/20 text-[#6B4A00]"
            >
              <FaTag className="inline-block mr-1" />
              {amenity}
            </span>
          ))}
        </div> */}

        {/* <div className="flex items-center justify-between text-sm text-gray-500 pt-3">
          <span className="flex items-center gap-1">
            <BiUser /> {community?.members?.length || 0} members
          </span>
          <span className="flex items-center gap-1">
            <BiCalendar /> {community?.events?.length || 0} events
          </span>
        </div> */}
      </div>
    </Link>
  );
};

export default CommunityCard;
