import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCarSide,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaImage,
} from "react-icons/fa";

import RandomImageSlider from "../../components/ui/RandomImageSlider";
import Button from "../../components/Button";
import LoadingUI from "../../components/LoadingUI";
import InputBox from "../../components/InputBox";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useSelector } from "react-redux";
import { truncateString } from "../../utils/Utility-functions";

const CurrentCityDarshan = ({ startLoading, stopLoading }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  const [tour, setTour] = useState(null);
  const [readMore, setReadMore] = useState(100);
  const [popup, setPopup] = useState(false);

  // ================= ADMIN UI STATES =================
  const [isEditMode, setIsEditMode] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    country: "",
    state: "",
    city: "",
    numberOfAdults: 2,
    numberOfChildren: 0,
    placesToCover: [],
    totalDistance: "",
    totalHours: "",
    pickupTime: "",
    dropTime: "",
    vehicles: [],
    inclusions: [],
    exclusions: [],
    priority: "normal",
    isActive: true,
    isVerified: true,

    existingImages: [], // [{url,fileId}]
    removedImageFileIds: [],
    newImages: [], // File[]
  });

  // temp inputs for dynamic list add
  const [newPlace, setNewPlace] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  // detect admin
  const isAdmin = useMemo(() => {
    const localRole = localStorage.getItem("role");
    return localRole === "Admin";
  }, []);

  // ================= FETCH TOUR =================
  useEffect(() => {
    const loadTour = async () => {
      try {
        startLoading();
        const res = await FetchData(
          `city-darshan/admin/get/city-darshan-packages/${id}`,
          "get",
        );
        const fetchedTour = res?.data?.data;
        setTour(fetchedTour);

        // prefill admin form
        setEditData({
          name: fetchedTour?.name || "",
          description: fetchedTour?.description || "",
          country: fetchedTour?.country?._id || fetchedTour?.country || "",
          state: fetchedTour?.state?._id || fetchedTour?.state || "",
          city: fetchedTour?.city?._id || fetchedTour?.city || "",
          numberOfAdults: fetchedTour?.numberOfAdults ?? 2,
          numberOfChildren: fetchedTour?.numberOfChildren ?? 0,
          placesToCover: fetchedTour?.placesToCover || [],
          totalDistance: fetchedTour?.totalDistance || "",
          totalHours: fetchedTour?.totalHours || "",
          pickupTime: fetchedTour?.pickupTime || "",
          dropTime: fetchedTour?.dropTime || "",
          vehicles: fetchedTour?.vehicles || [],
          inclusions: fetchedTour?.inclusions || [],
          exclusions: fetchedTour?.exclusions || [],
          priority: fetchedTour?.priority || "normal",
          isActive: fetchedTour?.isActive ?? true,
          isVerified: fetchedTour?.isVerified ?? true,

          existingImages: fetchedTour?.images || [],
          removedImageFileIds: [],
          newImages: [],
        });
      } catch (err) {
        alert(parseErrorMessage(err?.response?.data || ""));
      } finally {
        stopLoading();
      }
    };

    loadTour();
  }, [id]);

  // ================= HELPERS =================
  const imageUrls = useMemo(() => {
    if (!tour) return [];
    return tour.images?.map((i) => i.url) || [];
  }, [tour]);

  const startingPrice = useMemo(() => {
    if (!tour?.vehicles?.length) return 0;
    return Math.min(...tour.vehicles.map((v) => Number(v.price || 0)));
  }, [tour]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleChange = (index, field, value) => {
    setEditData((prev) => {
      const updatedVehicles = [...prev.vehicles];
      updatedVehicles[index] = {
        ...updatedVehicles[index],
        [field]: value,
      };
      return { ...prev, vehicles: updatedVehicles };
    });
  };

  const addVehicle = () => {
    setEditData((prev) => ({
      ...prev,
      vehicles: [
        ...prev.vehicles,
        {
          vehicleType: "",
          maxPersons: "",
          price: "",
        },
      ],
    }));
  };

  const removeVehicle = (index) => {
    setEditData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index),
    }));
  };

  const addListItem = (field, value, setter) => {
    if (!value.trim()) return;
    setEditData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    setter("");
  };

  const removeListItem = (field, index) => {
    setEditData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setEditData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
  };

  const removeExistingImage = (index) => {
    setEditData((prev) => {
      const imageToRemove = prev.existingImages[index];

      return {
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
        removedImageFileIds: imageToRemove?.fileId
          ? [...prev.removedImageFileIds, imageToRemove.fileId]
          : prev.removedImageFileIds,
      };
    });
  };

  const removeNewImage = (index) => {
    setEditData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  const resetEditForm = () => {
    if (!tour) return;

    setEditData({
      name: tour?.name || "",
      description: tour?.description || "",
      country: tour?.country?._id || tour?.country || "",
      state: tour?.state?._id || tour?.state || "",
      city: tour?.city?._id || tour?.city || "",
      numberOfAdults: tour?.numberOfAdults ?? 2,
      numberOfChildren: tour?.numberOfChildren ?? 0,
      placesToCover: tour?.placesToCover || [],
      totalDistance: tour?.totalDistance || "",
      totalHours: tour?.totalHours || "",
      pickupTime: tour?.pickupTime || "",
      dropTime: tour?.dropTime || "",
      vehicles: tour?.vehicles || [],
      inclusions: tour?.inclusions || [],
      exclusions: tour?.exclusions || [],
      priority: tour?.priority || "normal",
      isActive: tour?.isActive ?? true,
      isVerified: tour?.isVerified ?? true,

      existingImages: tour?.images || [],
      removedImageFileIds: [],
      newImages: [],
    });
  };
  const handleCancelEdit = () => {
    resetEditForm();
    setIsEditMode(false);
  };

  const handleSavePackage = async () => {
    try {
      startLoading();

      const formData = new FormData();

      // scalar fields
      formData.append("name", editData.name);
      formData.append("description", editData.description || "");
      formData.append("country", editData.country);
      formData.append("state", editData.state);
      formData.append("city", editData.city);
      formData.append("numberOfAdults", editData.numberOfAdults);
      formData.append("numberOfChildren", editData.numberOfChildren);
      formData.append("totalDistance", editData.totalDistance || "");
      formData.append("totalHours", editData.totalHours || "");
      formData.append("pickupTime", editData.pickupTime || "");
      formData.append("dropTime", editData.dropTime || "");
      formData.append("priority", editData.priority || "normal");
      formData.append("isActive", editData.isActive);
      formData.append("isVerified", editData.isVerified);

      // arrays / nested fields
      formData.append("placesToCover", JSON.stringify(editData.placesToCover));
      formData.append("inclusions", JSON.stringify(editData.inclusions));
      formData.append("exclusions", JSON.stringify(editData.exclusions));
      formData.append("vehicles", JSON.stringify(editData.vehicles));

      // image handling
      formData.append(
        "existingImages",
        JSON.stringify(editData.existingImages || []),
      );
      formData.append(
        "removedImageFileIds",
        JSON.stringify(editData.removedImageFileIds || []),
      );

      editData.newImages.forEach((file) => {
        formData.append("images", file);
      });

      const res = await FetchData(
        `city-darshan/admin/update/city-darshan-package/${id}`,
        "post",
        formData,
        true,
      );

      const updatedTour = res?.data?.data;
      setTour(updatedTour);

      setEditData({
        name: updatedTour?.name || "",
        description: updatedTour?.description || "",
        country: updatedTour?.country?._id || updatedTour?.country || "",
        state: updatedTour?.state?._id || updatedTour?.state || "",
        city: updatedTour?.city?._id || updatedTour?.city || "",
        numberOfAdults: updatedTour?.numberOfAdults ?? 2,
        numberOfChildren: updatedTour?.numberOfChildren ?? 0,
        placesToCover: updatedTour?.placesToCover || [],
        totalDistance: updatedTour?.totalDistance || "",
        totalHours: updatedTour?.totalHours || "",
        pickupTime: updatedTour?.pickupTime || "",
        dropTime: updatedTour?.dropTime || "",
        vehicles: updatedTour?.vehicles || [],
        inclusions: updatedTour?.inclusions || [],
        exclusions: updatedTour?.exclusions || [],
        priority: updatedTour?.priority || "normal",
        isActive: updatedTour?.isActive ?? true,
        isVerified: updatedTour?.isVerified ?? true,
        existingImages: updatedTour?.images || [],
        removedImageFileIds: [],
        newImages: [],
      });

      setIsEditMode(false);
      alert("Package updated successfully");
    } catch (err) {
      console.error(err);
      alert(parseErrorMessage(err?.response?.data || err?.message));
    } finally {
      stopLoading();
    }
  };

  if (!tour) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="w-full mx-auto md:px-5 px-2 py-4 gap-4 flex flex-col justify-start items-start">
        {/* TOP ACTIONS */}
        <div className="w-full flex justify-between items-center gap-3 flex-wrap">
          <Button
            onClick={() => navigate("/city-darshan")}
            label={
              <h1 className="flex justify-center items-center gap-2 w-fit">
                <FaArrowLeft />
                Back
              </h1>
            }
            normal={false}
          />

          {isAdmin && !isEditMode && (
            <Button
              onClick={() => setIsEditMode(true)}
              label={
                <span className="flex items-center gap-2">
                  <FaEdit />
                  Edit Package
                </span>
              }
            />
          )}

          {isAdmin && isEditMode && (
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleSavePackage}
                label={
                  <span className="flex items-center gap-2">
                    <FaSave />
                    Save Package
                  </span>
                }
              />
              <Button
                onClick={handleCancelEdit}
                normal={false}
                label={
                  <span className="flex items-center gap-2">
                    <FaTimes />
                    Cancel
                  </span>
                }
              />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 w-full">
          {/* ================= LEFT SECTION ================= */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* IMAGE SECTION */}
            <div className="rounded-3xl overflow-hidden shadow-xl bg-white">
              {!isEditMode ? (
                <div className="h-[420px]">
                  <RandomImageSlider
                    images={imageUrls}
                    className="h-full rounded-none"
                  />
                </div>
              ) : (
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-4">Package Images</h2>

                  {/* Existing Images */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-neutral-700">
                      Existing Images
                    </h3>

                    {editData.existingImages?.length ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {editData.existingImages.map((img, index) => (
                          <div
                            key={index}
                            className="relative rounded-2xl overflow-hidden border bg-neutral-50"
                          >
                            <img
                              src={img?.url}
                              alt={`tour-${index}`}
                              className="w-full h-44 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500">
                        No existing images left.
                      </p>
                    )}
                  </div>

                  {/* Add New Images */}
                  <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-4">
                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                      <FaImage className="text-2xl text-[#FFC20E]" />
                      <span className="font-medium text-neutral-700">
                        Upload New Images
                      </span>
                      <span className="text-sm text-neutral-500">
                        Select one or multiple images
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                    </label>
                  </div>

                  {/* New image previews */}
                  {!!editData.newImages.length && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3 text-neutral-700">
                        New Images to Upload
                      </h3>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {editData.newImages.map((file, index) => (
                          <div
                            key={index}
                            className="relative rounded-2xl overflow-hidden border bg-neutral-50"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-44 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow"
                            >
                              <FaTrash size={12} />
                            </button>
                            <div className="p-2 text-xs truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BASIC DETAILS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4 shadow-xl"
            >
              {!isEditMode ? (
                <>
                  <h1 className="text-4xl font-bold">{tour.name}</h1>

                  <div className="flex flex-wrap gap-6 mt-5 text-neutral-600">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#FFC20E]" />
                      {tour.city?.name}, {tour.state?.name}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaClock className="text-[#FFC20E]" />
                      {tour.totalHours} Hours
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCarSide className="text-[#FFC20E]" />
                      {tour.vehicles?.length} Vehicle Options
                    </div>
                  </div>

                  <div className="mt-8 text-neutral-700 flex flex-col justify-start items-start overflow-hidden">
                    <p className="duration-300 ease-in-out transition text-justify">
                      {truncateString(tour.description, readMore)}
                    </p>
                    {readMore === tour.description.length ? (
                      <button
                        className="text-blue-600 text-xs hover:underline"
                        onClick={() => setReadMore(100)}
                      >
                        Read Less
                      </button>
                    ) : (
                      <button
                        className="text-blue-600 text-xs hover:underline"
                        onClick={() => setReadMore(tour.description.length)}
                      >
                        Read more
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2">
                    Edit Basic Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <InputBox
                      LabelName="Package Name"
                      Name="name"
                      Value={editData.name}
                      onChange={handleBasicChange}
                    />

                    <InputBox
                      LabelName="Total Hours"
                      Name="totalHours"
                      Type="number"
                      Value={editData.totalHours}
                      onChange={handleBasicChange}
                    />

                    <InputBox
                      LabelName="City"
                      Name="city"
                      Value={editData.city}
                      onChange={handleBasicChange}
                    />

                    <InputBox
                      LabelName="State"
                      Name="state"
                      Value={editData.state}
                      onChange={handleBasicChange}
                    />
                  </div>

                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description*
                    </label>
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleBasicChange}
                      rows={8}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
                      placeholder="Enter package description"
                    />
                  </div>
                </>
              )}
            </motion.div>

            {/* PLACES COVERED */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6">
                Places Covered{" "}
                {isEditMode
                  ? `(${editData.placesToCover.length})`
                  : `(${tour.placesToCover.length})`}
              </h2>

              {!isEditMode ? (
                <div className="grid md:grid-cols-2 gap-2">
                  {tour.placesToCover?.map((place, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 border border-neutral-200 rounded-xl p-2"
                    >
                      <FaMapMarkerAlt className="text-[#FFC20E]" />
                      {place}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
                    <InputBox
                      LabelName="Add Place"
                      Name="place"
                      Value={newPlace}
                      onChange={(e) => setNewPlace(e.target.value)}
                      Placeholder="Enter place name"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addListItem("placesToCover", newPlace, setNewPlace)
                      }
                      className="mt-1 md:mt-7 bg-[#FFC20E] text-black px-4 py-2 rounded-xl flex items-center gap-2"
                    >
                      <FaPlus />
                      Add
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {editData.placesToCover?.map((place, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center gap-2 border border-neutral-200 rounded-xl p-3"
                      >
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-[#FFC20E]" />
                          <span>{place}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeListItem("placesToCover", index)}
                          className="text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* INCLUSIONS / EXCLUSIONS */}
            <div className="grid md:grid-cols-2 gap-2 md:justify-center items-start w-full">
              {/* Inclusions */}
              <div className="bg-white rounded-3xl p-4 shadow-xl h-full w-full">
                <h2 className="text-2xl font-bold mb-4">Inclusions</h2>

                {!isEditMode ? (
                  tour.inclusions?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-2 justify-start items-center"
                    >
                      <FaCheckCircle className="text-green-600" />
                      {item}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
                      <InputBox
                        LabelName="Add Inclusion"
                        Name="inclusion"
                        Value={newInclusion}
                        onChange={(e) => setNewInclusion(e.target.value)}
                        Placeholder="Enter inclusion"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addListItem(
                            "inclusions",
                            newInclusion,
                            setNewInclusion,
                          )
                        }
                        className="mt-1 md:mt-7 bg-[#FFC20E] text-black px-4 py-2 rounded-xl flex items-center gap-2"
                      >
                        <FaPlus />
                        Add
                      </button>
                    </div>

                    <div className="space-y-3">
                      {editData.inclusions?.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center gap-2 border border-neutral-200 rounded-xl p-3"
                        >
                          <div className="flex gap-2 justify-start items-center">
                            <FaCheckCircle className="text-green-600" />
                            {item}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeListItem("inclusions", index)}
                            className="text-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-3xl p-4 shadow-xl h-full w-full">
                <h2 className="text-2xl font-bold mb-6">Exclusions</h2>

                {!isEditMode ? (
                  tour.exclusions?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-2 justify-start items-center"
                    >
                      <FaTimesCircle className="text-red-500" />
                      {item}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
                      <InputBox
                        LabelName="Add Exclusion"
                        Name="exclusion"
                        Value={newExclusion}
                        onChange={(e) => setNewExclusion(e.target.value)}
                        Placeholder="Enter exclusion"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addListItem(
                            "exclusions",
                            newExclusion,
                            setNewExclusion,
                          )
                        }
                        className="mt-1 md:mt-7 bg-[#FFC20E] text-black px-4 py-2 rounded-xl flex items-center gap-2"
                      >
                        <FaPlus />
                        Add
                      </button>
                    </div>

                    <div className="space-y-3">
                      {editData.exclusions?.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center gap-2 border border-neutral-200 rounded-xl p-3"
                        >
                          <div className="flex gap-2 justify-start items-center">
                            <FaTimesCircle className="text-red-500" />
                            {item}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeListItem("exclusions", index)}
                            className="text-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {isEditMode ? (
              <div className="grid md:grid-cols-2 gap-4">
                <InputBox
                  LabelName="Country ID"
                  Name="country"
                  Value={editData.country}
                  onChange={handleBasicChange}
                />

                <InputBox
                  LabelName="State ID"
                  Name="state"
                  Value={editData.state}
                  onChange={handleBasicChange}
                />

                <InputBox
                  LabelName="City ID"
                  Name="city"
                  Value={editData.city}
                  onChange={handleBasicChange}
                />

                <InputBox
                  LabelName="Total Distance"
                  Name="totalDistance"
                  Type="number"
                  Value={editData.totalDistance}
                  onChange={handleBasicChange}
                />

                <InputBox
                  LabelName="Number of Adults"
                  Name="numberOfAdults"
                  Type="number"
                  Value={editData.numberOfAdults}
                  onChange={handleBasicChange}
                />

                <InputBox
                  LabelName="Number of Children"
                  Name="numberOfChildren"
                  Type="number"
                  Value={editData.numberOfChildren}
                  onChange={handleBasicChange}
                />

                <InputBox
                  LabelName="Pickup Time"
                  Name="pickupTime"
                  Value={editData.pickupTime}
                  onChange={handleBasicChange}
                  Placeholder="e.g. 08:00 AM"
                />

                <InputBox
                  LabelName="Drop Time"
                  Name="dropTime"
                  Value={editData.dropTime}
                  onChange={handleBasicChange}
                  Placeholder="e.g. 06:00 PM"
                />
              </div>
            ) : (
              ""
            )}
            {isEditMode ? (
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority*
                  </label>
                  <select
                    name="priority"
                    value={editData.priority}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                  >
                    <option value="featured">featured</option>
                    <option value="recommended">recommended</option>
                    <option value="popular">popular</option>
                    <option value="normal">normal</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is Active
                  </label>
                  <select
                    name="isActive"
                    value={String(editData.isActive)}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        isActive: e.target.value === "true",
                      }))
                    }
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is Verified
                  </label>
                  <select
                    name="isVerified"
                    value={String(editData.isVerified)}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        isVerified: e.target.value === "true",
                      }))
                    }
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div>
            <div className="sticky top-24 bg-white rounded-3xl shadow-2xl p-6">
              {!isEditMode ? (
                <>
                  <p className="text-neutral-500">Starting From</p>

                  <h2 className="text-4xl font-bold text-[#FFC20E] drop-shadow-2xl shadow-black">
                    ₹{startingPrice.toLocaleString()}/-
                  </h2>

                  <hr className="my-6" />

                  <h3 className="font-bold text-lg mb-4">Available Vehicles</h3>

                  <div className="space-y-4">
                    {tour.vehicles?.map((vehicle, index) => (
                      <div key={index} className="border rounded-2xl p-4">
                        <h4 className="font-semibold">{vehicle.vehicleType}</h4>

                        <p>Max Persons : {vehicle.maxPersons}</p>

                        <p className="font-bold text-[#FFC20E]">
                          ₹{Number(vehicle.price || 0).toLocaleString()}/-
                        </p>
                      </div>
                    ))}
                  </div>

                  {user.user === null ? (
                    <Button
                      className="w-full mt-8"
                      label="Book Now"
                      onClick={() => {
                        setPopup(true);
                        setTimeout(() => {
                          setPopup(false);
                        }, 5000);
                      }}
                    />
                  ) : (
                    <Button
                      className="w-full mt-8"
                      label="Book Now"
                      onClick={() => {
                        window.location.href = `/city-darshan/booking/${tour._id}`;
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">Edit Vehicles</h3>
                    <button
                      type="button"
                      onClick={addVehicle}
                      className="bg-[#FFC20E] text-black px-3 py-2 rounded-xl flex items-center gap-2"
                    >
                      <FaPlus />
                      Add Vehicle
                    </button>
                  </div>

                  <div className="space-y-5">
                    {editData.vehicles?.map((vehicle, index) => (
                      <div
                        key={index}
                        className="border rounded-2xl p-4 bg-neutral-50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">
                            Vehicle #{index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeVehicle(index)}
                            className="text-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <div className="w-full mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Type*
                          </label>
                          <select
                            value={vehicle.vehicleType || ""}
                            onChange={(e) =>
                              handleVehicleChange(
                                index,
                                "vehicleType",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
                          >
                            <option value="">Select Vehicle Type</option>
                            <option value="Mini (Hatchback)">
                              Mini (Hatchback)
                            </option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="MUV">MUV</option>
                            <option value="Tempo Traveller">
                              Tempo Traveller
                            </option>
                            <option value="Luxury Sedan">Luxury Sedan</option>
                            <option value="Luxury SUV">Luxury SUV</option>
                          </select>
                        </div>

                        <InputBox
                          LabelName="Max Persons"
                          Name={`maxPersons-${index}`}
                          Type="number"
                          Value={vehicle.maxPersons || ""}
                          onChange={(e) =>
                            handleVehicleChange(
                              index,
                              "maxPersons",
                              e.target.value,
                            )
                          }
                        />

                        <InputBox
                          LabelName="Price"
                          Name={`price-${index}`}
                          Type="number"
                          Value={vehicle.price || ""}
                          onChange={(e) =>
                            handleVehicleChange(index, "price", e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN POPUP */}
      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-white/90 z-50"
          >
            <div className="flex justify-center items-center flex-col gap-5 bg-neutral-200 shadow-2xl p-5 rounded-xl">
              <h1 className="flex justify-center items-center gap-2">
                Please login or register to continue
              </h1>
              <div className="flex justify-center items-center gap-5">
                <Button
                  label={"Register"}
                  onClick={() => navigate("/authentication")}
                />
                <Button
                  label={"Login"}
                  onClick={() => navigate("/authentication")}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingUI(CurrentCityDarshan);
