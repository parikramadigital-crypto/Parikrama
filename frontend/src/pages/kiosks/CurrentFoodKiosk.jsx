import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { MdVerified } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import FoodCourtRatings from "../../components/ui/FoodCourtRating";
import useCopyUrl from "../../components/hooks/CopyUrl";
import { FaShareNodes, FaSquareShareNodes } from "react-icons/fa6";

const CurrentFoodKiosk = ({ startLoading, stopLoading }) => {
  const { foodCourtId } = useParams();
  const [data, setData] = useState();
  const [previewImage, setPreviewImage] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { copied, copy } = useCopyUrl();
  const adminId = user?._id;
  const [success, setSuccess] = useState("");

  const foodCourt = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `foodCourt/get/food-court/by-id/${foodCourtId}`,
        "get",
      );
      setData(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    foodCourt();
  }, [foodCourtId]);

  const handleAdminControls = async ({ process = "", header = "" }) => {
    try {
      startLoading();
      const response = await FetchData(
        `foodCourt/${process}/food-court/by-id/${foodCourtId}/${adminId}`,
        `${header}`,
      );
      console.log(response);
      alert(response.data.message);
      foodCourt();
    } catch (err) {
      console.log(err);
      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="p-6">
      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col md:flex-row justify-center items-start gap-5">
          <AnimatePresence>
            {success && (
              <motion.p
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -100 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{
                  type: "spring",
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="bg-green-200 font-semibold text-green-800 absolute top-24 p-5 rounded-xl"
              >
                Link copied successfully !
              </motion.p>
            )}
          </AnimatePresence>
          <div className="space-y-6">
            {localStorage.role === "Admin" ? (
              <div className="flex flex-col justify-center items-start gap-5 bg-neutral-200 w-fit p-5 rounded-xl">
                {/* <h1>Actions to perform</h1> */}
                {data?.active === false ? (
                  <Button
                    label={"Mark as active"}
                    onClick={() =>
                      handleAdminControls({ header: "post", process: "active" })
                    }
                  />
                ) : (
                  ""
                )}
                {data?.verified === false ? (
                  <Button
                    label={"Mark as Verified"}
                    onClick={() =>
                      handleAdminControls({ header: "post", process: "verify" })
                    }
                  />
                ) : (
                  ""
                )}
                {data?.active && data?.verified === true ? (
                  <div className="flex flex-col justify-center items-start gap-5 bg-neutral-200 w-fit p-5 rounded-xl">
                    <Button
                      label={"Mark Food place as inactive"}
                      onClick={() =>
                        handleAdminControls({
                          header: "post",
                          process: "cancel-verification",
                        })
                      }
                    />
                    <Button
                      label={"Mark Food place as non-verified"}
                      onClick={() =>
                        handleAdminControls({
                          header: "post",
                          process: "deactivate",
                        })
                      }
                    />
                    <Button
                      label={"Delete food place"}
                      onClick={() =>
                        handleAdminControls({
                          header: "delete",
                          process: "delete",
                        })
                      }
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
            {/* 🔥 Header */}
            <div className="w-fit">
              <div className="flex justify-start items-center gap-2">
                {data?.verified === true ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs w-fit ${
                      data.verified
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {data.verified ? <MdVerified /> : "Not Verified"}
                  </span>
                ) : (
                  ""
                )}

                <h1 className="text-2xl font-bold">{data.name}</h1>
                <button
                  className="bg-[#FFC20D] px-2 py-1 rounded-full flex justify-center items-center text-xs gap-1"
                  onClick={() => {
                    copy(`/foodPlace/review/${data._id}`);
                    setSuccess(true);
                    setTimeout(() => {
                      setSuccess(false);
                    }, 4000);
                  }}
                >
                  {copied ? (
                    <FaSquareShareNodes />
                  ) : (
                    <h2 className="flex justify-center items-center">
                      <FaShareNodes />
                    </h2>
                  )}
                </button>
              </div>
              <h1 className="flex justify-start items-center">
                <IoLocation /> {data?.city?.name}, {data?.state?.name}
              </h1>
            </div>
            {/* 🍜 Special Food */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Special Food</h2>
              <div className="flex flex-wrap gap-2">
                {data.specialFood?.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#FFC20E] uppercase rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full space-y-2">
              {/* 🏪 Store Images */}
              <div className="bg-neutral-200 p-2 rounded-xl">
                <h2 className="text-lg font-semibold mb-2">Store Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {data.storeImages?.map((img) => (
                    <img
                      key={img.fileId}
                      src={img.url}
                      alt="img"
                      onClick={() => setPreviewImage(img.url)}
                      className="w-40 h-40 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition"
                    />
                  ))}
                </div>
              </div>

              {/* 🍲 Food Images */}
              <div className="bg-neutral-200 p-2 rounded-xl">
                <h2 className="text-lg font-semibold mb-2">Food Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {data.foodImages?.map((img) => (
                    <img
                      key={img.fileId}
                      src={img.url}
                      alt="img"
                      onClick={() => setPreviewImage(img.url)}
                      className="w-40 h-40 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition"
                    />
                  ))}
                </div>
              </div>

              {/* 📜 Menu Images */}
              <div className="bg-neutral-200 p-2 rounded-xl">
                <h2 className="text-lg font-semibold mb-2">Menu</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {data.menuImages?.map((img) => (
                    <img
                      key={img.fileId}
                      src={img.url}
                      alt="img"
                      onClick={() => setPreviewImage(img.url)}
                      className="w-40 h-40 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition"
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* 📍 Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <p>
                <b>Category:</b> {data.category}
              </p>
              <p>
                <b>Contact:</b> {data.contactNumber}
              </p>
              <p>
                <b>Email:</b> {data.email}
              </p>
              <p>
                <b>City:</b> {data.city?.name}
              </p>
              <p>
                <b>State:</b> {data.state?.name}
              </p>
              <p>
                <b>Establishment:</b> {data.establishment}
              </p>
            </div>
            {/* 📍 Place Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">
                Nearest Place Details
              </h2>
              <p>
                <b>Name:</b> {data.place?.name}
              </p>
              <p>
                <b>Category:</b> {data.place?.category}
              </p>
              <p>
                <b>Entry Fee:</b> ₹{data.place?.entryFee}
              </p>
            </div>
          </div>
          <div className="md:sticky top-24 right-0">
            <FoodCourtRatings ratings={data?.ratings} reviews={data?.reviews} />
          </div>
        </div>
      )}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default LoadingUI(CurrentFoodKiosk);
