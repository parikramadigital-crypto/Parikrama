import { Link } from "react-router-dom";
import { BiMap, BiSolidStar } from "react-icons/bi";
import { FaHotel, FaTags } from "react-icons/fa";
import { truncateString } from "../../utils/Utility-functions";

const HotelCard = ({ hotel }) => {
  const imageUrl =
    hotel?.images?.cover?.url || hotel?.images?.gallery?.[0]?.url || "";

  return (
    <Link
      to={`/hotels/${hotel?._id}`}
      className="group block bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg transition overflow-hidden"
    >
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={hotel?.name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <BiMap /> {hotel?.address?.city?.name}, {hotel?.address?.state?.name}
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-2">
              {hotel?.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#FFC20E]/20 px-3 py-1 text-sm font-medium text-[#6B4A00]">
              <BiSolidStar /> {hotel?.ratings?.average || 0}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {truncateString(hotel?.shortDescription || hotel?.description, 110)}
        </p>

        <div className="flex flex-wrap gap-2">
          {hotel?.propertyType && (
            <span className="text-xs uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {hotel.propertyType}
            </span>
          )}
          {hotel?.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-[#FFC20E]/20 text-[#6B4A00]"
            >
              <FaTags className="inline-block mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-3">
          <span>{hotel?.rooms?.length || 0} room type(s)</span>
          <span>
            ₹{hotel?.pricing?.minPrice || "NA"} - ₹{hotel?.pricing?.maxPrice || "NA"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
