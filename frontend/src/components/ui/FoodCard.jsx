import { Link } from "react-router-dom";
import { BiMap, BiSolidStar, BiUser, BiCalendar } from "react-icons/bi";
import { FaTag } from "react-icons/fa";
import { truncateString } from "../../utils/Utility-functions";

const FoodCard = ({ f }) => {
  return f?.map((data) => (
    <Link
      to={`/current/food-court/${data?._id}`}
      className="group block bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg transition overflow-hidden md:w-[90%]"
    >
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        <img
          src={data?.storeImages[0]?.url}
          // alt={data?.clubName}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105 rounded-t-2xl"
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500 flex items-start md:items-center gap-2 flex-col md:flex-row">
              <BiMap /> Nearest tourist place{" "}
              <span className="font-semibold">{data?.place?.name}</span>
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-2">
              {data?.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#FFC20E]/20 px-3 py-1 text-sm font-medium text-[#6B4A00]">
              <BiSolidStar /> {data?.ratings?.average || 0}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {truncateString(data?.description, 110)}
        </p>

        <div className="flex flex-wrap gap-2">
          {data?.category && (
            <span className="text-xs uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {data.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  ));
};

export default FoodCard;
