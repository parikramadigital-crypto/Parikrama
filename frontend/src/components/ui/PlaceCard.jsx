import { useState } from "react";
import { BiChevronDown, BiSolidNavigation } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import RandomImageSlider from "./RandomImageSlider";
import { useMemo } from "react";
import Button from "../Button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FetchData } from "../../utils/FetchFromApi";
import { truncateString } from "../../utils/Utility-functions";

const PlaceCard = ({ place }) => {
  return (
    <Link
      to={`/current/place/${place?._id}`}
      className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition md:flex overflow-hidden"
    >
      {/* Image / Placeholder */}
      <div className="h-40 md:h-full w-full bg-gray-100 flex items-center justify-center lg:h-auto lg:w-1/2 overflow-hidden object-contain">
        {place?.images?.length === 0 ? (
          <span className="text-gray-400 text-sm">No Image</span>
        ) : (
          <img
            src={place?.images[0]?.url}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between lg:w-1/2">
        <div className="space-y-2">
          {/* Name */}
          <h3 className="text-xl font-semibold text-gray-900">{place?.name}</h3>

          {/* Location */}
          <p className="text-sm text-gray-500">
            {place?.city?.name}, {place?.state?.name}
          </p>

          {/* Category */}
          <span className="inline-block w-fit text-xs px-3 py-1 rounded-full bg-[#FFC20E]">
            {place?.category}
          </span>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {truncateString(place?.description, 90)}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between text-sm text-gray-500 pt-4">
          <span>⏱ {place?.averageTimeSpent} min</span>
          {/* <span className="bg-[#39B54A] text-white inline-block w-fit text-xs px-3 py-1 rounded-full">
            {" "}
            ₹{place?.entryFee}
          </span> */}
        </div>
      </div>
    </Link>
  );
};
const ExpandedPlaceCard = ({ place, facilitator }) => {
  const { user } = useSelector((state) => state.auth);
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [facilitatorData, setFacilitatorData] = useState(false);
  const lat = place?.location?.coordinates[1];
  const long = place?.location?.coordinates[0];
  const navigate = useNavigate();

  const images = useMemo(() => {
    return place?.images?.length ? place.images.map((img) => img.url) : [];
  }, [place?.images]);

  const openMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
    window.open(url, "_blank");
  };

  const deletePlace = async () => {
    try {
      const response = await FetchData(
        `places/delete-place/${user?._id}/${place?._id}`,
        "delete",
      );
      console.log(response);
      alert(response.data.message);
      navigate("/admin/dashboard");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col pb-2">
      {/* Image / Placeholder */}
      <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">
        {images.length > 0 ? (
          <RandomImageSlider images={images} />
        ) : (
          <span className="text-gray-400">No images available</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex md:flex-row flex-col justify-between">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", duration: 1, ease: "easeInOut" }}
          className="space-y-2 md:w-3/4"
        >
          {/* Name */}
          <h3 className="text-xl font-semibold text-gray-900">{place?.name}</h3>

          {/* Location */}
          <p className="text-sm text-gray-500">
            {place?.city?.name}, {place?.state?.name}
          </p>

          {/* Category */}
          <p className="inline-block w-fit text-xs px-3 py-1 rounded-full bg-[#FFC20E]">
            {place?.category}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {place?.description}
          </p>
        </motion.div>

        {/* Meta Info */}
        <div className="flex flex-col justify-center items-center gap-5">
          <button
            onClick={openMaps}
            className={`bg-transparent px-4 py-2 rounded-2xl drop-shadow-xl hover:scale-105 hover:shadow-2xl transition duration-150 ease-in-out hover:text-[#FFC20E] border h-full flex md:flex-col justify-center items-center text-neutral-500`}
          >
            <span>
              <BiSolidNavigation className="md:text-3xl" />
            </span>
            <span className="text-black">Get Directions</span>
          </button>
          <Button
            label={"Hire your facilitator"}
            onClick={() => setPopup2(true)}
          />
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-500 px-5 pb-5">
        <span>⏱ {place?.averageTimeSpent} min</span>
        {/* <span className="bg-[#39B54A] text-white inline-block w-fit text-xs px-3 py-1 rounded-full">
          {" "}
          ₹{place?.entryFee}
        </span> */}
      </div>
      {user ? (
        <div className="flex justify-center items-center gap-10">
          <Button
            onClick={() => navigate(`/admin/edit-place/${place?._id}`)}
            label={
              <h1 className="flex justify-center items-center gap-2">
                <FaEdit />
                Edit
              </h1>
            }
          />
          <Button
            onClick={() => setPopup(true)}
            label={
              <h1 className="flex justify-center items-center gap-2">
                <FaTrash /> Delete
              </h1>
            }
            className={
              "text-black hover:bg-red-500 hover:text-white duration-300 ease-in-out"
            }
          />
        </div>
      ) : (
        ""
      )}
      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full bg-white flex justify-center items-center flex-col z-50"
          >
            <h1>Are you sure you want to delete this Place ?</h1>
            <div className="flex justify-center items-center gap-5 py-5">
              <Button label={"Cancel"} onClick={() => setPopup(false)} />
              <Button label={"Confirm"} onClick={() => deletePlace()} />
            </div>
          </motion.div>
        )}
        {popup2 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center z-50 "
          >
            <div className="bg-white md:w-3/4 w-full h-full flex flex-col justify-start items-center py-10 overflow-scroll">
              {facilitator?.map((fac) => (
                <div className="flex flex-col justify-between items-center bg-neutral-200 px-10 py-5 w-[90%] rounded-xl">
                  <div className="flex flex-col md:flex-row justify-center items-start md:items-center md:gap-5">
                    <div className="w-10 h-10 md:w-20 md:h-20 rounded-full overflow-hidden object-fill bg-red-500 flex justify-center items-center ">
                      <img
                        src={fac?.images[0]?.url}
                        className="h-full w-full"
                      />
                    </div>
                    <h2 className="flex flex-col w-48 text-nowrap overflow-hidden">
                      <strong>{fac?.name}</strong>{" "}
                      <span className="text-xs">
                        {fac?.experienceYears} year Experience
                      </span>
                      <span className="bg-[#FFC20E] px-2 py-1 rounded-2xl w-fit text-xs">
                        {fac?.role}
                      </span>
                    </h2>
                    {facilitatorData ? (
                      ""
                    ) : (
                      <Button label={"Call"} className={"w-full md:w-fit"} />
                    )}
                  </div>
                  {facilitatorData ? (
                    <button
                      onClick={() => setFacilitatorData(false)}
                      className="flex justify-center items-center hover:bg-neutral-300 border border-neutral-300 px-2 py-1 rounded-xl text-xs"
                    >
                      CLose <BiChevronDown className="text-2xl" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setFacilitatorData(true)}
                      className="flex justify-center items-center hover:bg-neutral-300 border border-neutral-300 px-2 py-1 rounded-xl text-xs"
                    >
                      More about <BiChevronDown className="text-2xl" />
                    </button>
                  )}
                  {/* <button
                    onClick={() => setFacilitatorData(true)}
                    className="flex justify-center items-center hover:bg-neutral-300 border border-neutral-300 px-2 py-1 rounded-xl text-xs"
                  >
                    More about <BiChevronDown className="text-2xl" />
                  </button> */}
                  <AnimatePresence>
                    {facilitatorData && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <p>
                          <strong>Languages :</strong> {fac?.languages}{" "}
                        </p>
                        <p className="flex flex-col text-xs">
                          <strong>About</strong>
                          {fac?.bio}
                        </p>
                        {fac?.verification?.status === "Pending" ? (
                          <p>
                            <strong>Note : </strong>Please contact and hire on
                            your own risk, this facilitator is not verified yet.
                          </p>
                        ) : (
                          ""
                        )}
                        <Button label={"Call"} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <div
              onClick={() => setPopup2(false)}
              className="w-1/4 md:w-1/2 h-full bg-black/80"
            ></div>
            {/* <h1>Are you sure you want to delete this Place ?</h1> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { PlaceCard, ExpandedPlaceCard };
