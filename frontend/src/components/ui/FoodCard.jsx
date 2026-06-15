import { Link } from "react-router-dom";
import { BiMap, BiSolidStar, BiUser, BiCalendar } from "react-icons/bi";
import { FaTag } from "react-icons/fa";
import { truncateString } from "../../utils/Utility-functions";
import { MdVerified } from "react-icons/md";

const FoodCard = ({ f }) => {
  console.log(f);
  return f?.map((data) => (
    <Link
      key={data?._id}
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
          <div className="w-full">
            <p className="text-xs text-gray-500 flex items-start md:items-center gap-2 flex-col md:flex-row">
              <BiMap /> Nearest tourist place{" "}
              <span className="font-semibold">
                {truncateString(data?.place?.name, 10)}
              </span>
            </p>
            <h3 className=" font-semibold text-gray-900 mt-2 flex justify-start items-center w-full gap-2">
              {data.verified === true ? (
                <span
                  className={`px-1 py-1 rounded-full text-xs w-fit ${
                    data.verified
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {data.verified ? <MdVerified /> : ""}
                </span>
              ) : (
                ""
              )}

              <span> {data?.name}</span>
            </h3>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {truncateString(data?.description, 110)}
        </p>

        <div className="flex w-full justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {data?.category && (
              <span className="text-xs uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {data.category}
              </span>
            )}
          </div>
          {data?.ratings?.totalReviews > 0 ? (
            <div className="text-right">
              <div className="inline-flex items-center gap-1 rounded-full bg-[#FFC20E]/20 px-3 py-1 text-sm font-medium text-[#6B4A00]">
                <BiSolidStar /> {data?.ratings?.overallAvg || 0}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Link>
  ));
};

export default FoodCard;
