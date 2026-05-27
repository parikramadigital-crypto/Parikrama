// GalleryManager.jsx

import React, { useRef, useState } from "react";
import { IoImages, IoClose } from "react-icons/io5";
import { FiUploadCloud } from "react-icons/fi";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const GalleryManager = ({ club, setClub }) => {
  const fileRef = useRef();

  const [loading, setLoading] = useState(false);

  const [previewImages, setPreviewImages] = useState([]);

  const handleSelectImages = (e) => {
    const files = Array.from(e.target.files);

    setPreviewImages(files);
  };

  const handleUploadImages = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      previewImages.forEach((img) => {
        formData.append("images", img);
      });

      const response = await FetchData(
        `clubs/club/${club._id}/gallery`,
        "post",
        formData,
        true,
      );

      setClub({
        ...club,
        images: {
          ...club.images,
          gallery: response.data.data,
        },
      });

      setPreviewImages([]);
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (imageId) => {
    try {
      await FetchData(`clubs/club/${club._id}/gallery/${imageId}`, "delete");

      setClub({
        ...club,
        images: {
          ...club.images,
          gallery: club.images.gallery.filter((img) => img._id !== imageId),
        },
      });
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gallery</h1>

          <p className="text-sm text-gray-500">
            Upload and manage gallery images
          </p>
        </div>

        <Button label={"Upload"} onClick={() => fileRef.current.click()} />
      </div>

      {/* HIDDEN INPUT */}
      <input
        type="file"
        multiple
        hidden
        ref={fileRef}
        onChange={handleSelectImages}
      />

      {/* PREVIEW */}
      {previewImages.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewImages.map((img, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden h-40"
              >
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() =>
                    setPreviewImages(
                      previewImages.filter((_, i) => i !== index),
                    )
                  }
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full"
                >
                  <IoClose />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-4">
            <Button
              label={loading ? "Uploading..." : "Upload Images"}
              onClick={handleUploadImages}
              Disabled={loading}
            />

            <Button
              label={"Cancel"}
              normal={false}
              onClick={() => setPreviewImages([])}
            />
          </div>
        </div>
      )}

      {/* GALLERY */}
      <div className="mt-6">
        {club?.images?.gallery?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {club?.images?.gallery?.map((image) => (
              <div
                key={image._id}
                className="relative rounded-2xl overflow-hidden h-44 group"
              >
                <img src={image.url} className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex justify-center items-center">
                  <button
                    onClick={() => removeImage(image._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-52 border rounded-3xl flex flex-col justify-center items-center">
            <FiUploadCloud className="text-6xl text-[#FFC20D]" />

            <p className="mt-4 text-gray-500">No gallery images uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;
