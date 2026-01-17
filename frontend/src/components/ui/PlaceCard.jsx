import { useState } from "react";
import { BiSolidNavigation } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import RandomImageSlider from "./RandomImageSlider";
import { useMemo } from "react";
import Button from "../Button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FetchData } from "../../utils/FetchFromApi";

const PlaceCard = ({ place }) => {
  return (
    <Link
      to={`/current/place/${place?._id}`}
      className="
        w-full 
        bg-white 
        border border-gray-200 
        rounded-xl 
        shadow-sm 
        hover:shadow-md 
        transition
        lg:flex
        overflow-hidden
      "
    >
      {/* Image / Placeholder */}
      <div className="h-40 w-full bg-gray-100 flex items-center justify-center lg:h-auto lg:w-1/2">
        {place?.images?.length === 0 ? (
          <span className="text-gray-400 text-sm">No Image</span>
        ) : (
          <img src={place?.images[0]?.url} />
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
            {place?.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between text-sm text-gray-500 pt-4">
          <span>⏱ {place?.averageTimeSpent} min</span>
          <span className="bg-[#39B54A] text-white inline-block w-fit text-xs px-3 py-1 rounded-full">
            {" "}
            ₹{place?.entryFee}
          </span>
        </div>
      </div>
    </Link>
  );
};
const ExpandedPlaceCard = ({ place }) => {
  const { user } = useSelector((state) => state.auth);
  const [popup, setPopup] = useState(false);
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
      <div className="p-5 flex flex-row justify-between">
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
            {place?.description}
          </p>
        </div>

        {/* Meta Info */}
        <button
          onClick={openMaps}
          className={`bg-transparent px-4 py-2 rounded-2xl drop-shadow-xl hover:scale-105 hover:shadow-2xl transition duration-150 ease-in-out hover:text-[#FFC20E] border h-full flex flex-col justify-center items-center text-neutral-500`}
        >
          <span>
            <BiSolidNavigation className="text-3xl" />
          </span>
          <span className="text-black">Get Directions</span>
        </button>
      </div>
      <div className="flex justify-between text-sm text-gray-500 px-5 pb-5">
        <span>⏱ {place?.averageTimeSpent} min</span>
        <span className="bg-[#39B54A] text-white inline-block w-fit text-xs px-3 py-1 rounded-full">
          {" "}
          ₹{place?.entryFee}
        </span>
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
            className="fixed top-0 left-0 h-screen w-full bg-white flex justify-center items-center flex-col"
          >
            <h1>Are you sure you want to delete this Place ?</h1>
            <div className="flex justify-center items-center gap-5 py-5">
              <Button label={"Cancel"} onClick={() => setPopup(false)} />
              <Button label={"Confirm"} onClick={() => deletePlace()} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { PlaceCard, ExpandedPlaceCard };
