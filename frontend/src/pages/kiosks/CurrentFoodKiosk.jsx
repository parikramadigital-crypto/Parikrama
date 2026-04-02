import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";

const CurrentFoodKiosk = ({ startLoading, stopLoading }) => {
  const { foodCourtId } = useParams();
  const [data, setData] = useState();
  const [previewImage, setPreviewImage] = useState(null);

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

  return (
    <div className="p-6">
      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {/* 🔥 Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                data.verified
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {data.verified ? "Verified" : "Not Verified"}
            </span>
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

          {/* 🏪 Store Images */}
          <div>
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
          <div>
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
          <div>
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
