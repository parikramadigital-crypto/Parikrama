import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SelectBox from "../../components/SelectionBox";

const AddNewClub = ({ startLoading, stopLoading, onCancel, adminId }) => {
  const formRef = useRef();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreviews, setImagePreviews] = useState({
    logo: null,
    coverImage: null,
    gallery: [],
  });

  const { user } = useSelector((state) => state.auth);
  const currentAdminId = adminId || user?._id;

  const clubAmenities = [
    "Accommodation",
    "Dining",
    "Gym",
    "Spa",
    "Swimming Pool",
    "Event Hall",
    "Travel Assistance",
  ];

  const clubCategories = [
    "Travel Club",
    "Adventure Club",
    "Religious Club",
    "Bike Club",
    "Business Club",
    "Social Club",
  ];

  const handleImageChange = (e, imageType) => {
    const files = Array.from(e.target.files);

    if (imageType === "logo" || imageType === "coverImage") {
      if (files.length > 0) {
        setImagePreviews((prev) => ({
          ...prev,
          [imageType]: URL.createObjectURL(files[0]),
        }));
      }
    } else if (imageType === "gallery") {
      if (files.length > 10) {
        setError("Maximum 10 gallery images allowed");
        e.target.value = "";
        return;
      }
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => ({
        ...prev,
        gallery: previews,
      }));
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setImagePreviews((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(formRef.current);

    try {
      startLoading();
      // Use public endpoint if no admins ID, otherwise use admin endpoint
      const endpoint = currentAdminId
        ? `clubs/create/${currentAdminId}`
        : "clubs/register/public";
      const res = await FetchData(endpoint, "post", formData, true);
      console.log(res);
      setSuccess("Club created successfully");
      formRef.current.reset();
      setImagePreviews({ logo: null, coverImage: null, gallery: [] });
      alert("Club created successfully");
      if (onCancel) onCancel();
    } catch (err) {
      console.error(err);
      setError("Failed to create club. Please check all required fields.");
    } finally {
      stopLoading();
    }
  };

  const SectionTitle = ({ title }) => (
    <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-[#FFC20D]">
      {title}
    </h3>
  );

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-8 rounded-xl shadow-md w-full max-w-5xl bg-white"
      >
        <h2 className="text-3xl font-bold mb-2">Create New Club</h2>
        <p className="text-gray-600 mb-6">
          Fill in the details below to register your club on Parikrama
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* BASIC INFORMATION */}
        <SectionTitle title="Basic Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputBox
            Type="text"
            Name="clubName"
            LabelName="Club Name"
            Placeholder="Enter club name"
            required
          />
          <div className="flex justify-center items-start w-full py-4 flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md"
              defaultValue="Social Club"
              required
            >
              {clubCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter club description"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <InputBox
            Type="number"
            Name="foundedYear"
            LabelName="Founded Year"
            Placeholder="e.g., 2020"
          />
        </div>

        {/* LOCATION */}
        <SectionTitle title="Location" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputBox
            Type="text"
            Name="address"
            LabelName="Address "
            Placeholder="Enter full address"
            required
          />
          <InputBox
            Type="number"
            Name="lat"
            LabelName="Latitude "
            Placeholder="Latitude"
            step="0.000001"
            required
          />
          <InputBox
            Type="number"
            Name="lng"
            LabelName="Longitude"
            Placeholder="Longitude"
            step="0.000001"
            required
          />
        </div>

        {/* CONTACT DETAILS */}
        <SectionTitle title="Contact Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputBox
            Type="email"
            Name="email"
            LabelName="Email"
            Placeholder="club@example.com"
          />
          <InputBox
            Type="tel"
            Name="phone"
            LabelName="Phone"
            Placeholder="Enter contact number"
          />
          <InputBox
            Type="url"
            Name="website"
            LabelName="Website"
            Placeholder="https://example.com"
          />
        </div>

        {/* IMAGES */}
        <SectionTitle title="Images" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Club Logo
            </label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "logo")}
              className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FFC20D] transition"
            />
            {imagePreviews.logo && (
              <div className="mt-3 relative inline-block">
                <img
                  src={imagePreviews.logo}
                  alt="Logo preview"
                  className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200"
                />
                <span className="absolute -top-2 -right-2 bg-[#FFC20D] text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Logo
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "coverImage")}
              className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FFC20D] transition"
            />
            {imagePreviews.coverImage && (
              <img
                src={imagePreviews.coverImage}
                alt="Cover preview"
                className="mt-3 h-24 w-full rounded-lg object-cover border-2 border-gray-200"
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gallery Images (Max 10)
          </label>
          <input
            type="file"
            name="gallery"
            multiple
            accept="image/*"
            onChange={(e) => handleImageChange(e, "gallery")}
            className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FFC20D] transition"
          />
          {imagePreviews.gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {imagePreviews.gallery.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Gallery ${index + 1}`}
                    className="h-24 w-full rounded-lg object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-semibold hover:bg-red-600"
                  >
                    ✕
                  </button>
                  <span className="absolute bottom-1 right-1 bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AMENITIES */}
        <SectionTitle title="Amenities" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubAmenities.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                name="amenities"
                value={amenity}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-5 mt-10 pt-8 border-t">
          <Button
            type="button"
            label="Cancel"
            onClick={onCancel ? onCancel : () => navigate("/clubs")}
            className="bg-gray-300 text-gray-900"
          />
          <Button type="submit" label="Create Club" />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(AddNewClub);
