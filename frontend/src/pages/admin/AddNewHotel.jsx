import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddNewHotel = ({ startLoading, stopLoading, onCancel, adminId }) => {
  const formRef = useRef();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [preview, setPreview] = useState([]);

  const { user } = useSelector((state) => state.auth);
  const currentAdminId = adminId || user?._id;

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await FetchData("states", "get");
        setStates(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) return;
    const fetchCities = async () => {
      try {
        const res = await FetchData(`cities/state/${selectedState}`, "get");
        setCities(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCities();
  }, [selectedState]);

  useEffect(() => {
    if (!selectedState) return;

    const fetchCountry = async () => {
      try {
        const res = await FetchData(
          `country/get/country/by-stateId/${selectedState}`,
          "get",
        );
        setCountry(res?.data?.data || []);
      } catch (err) {
        // console.error(err);
      }
    };

    fetchCountry();
  }, [selectedState]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError("Maximum 10 images allowed (1 cover + 9 gallery)");
      e.target.value = "";
      return;
    }
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };
  const handleImageChange2 = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 1) {
      setError("Maximum 1");
      e.target.value = "";
      return;
    }
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(formRef.current);

    try {
      startLoading();
      const res = await FetchData(
        `hotels/create/${currentAdminId}`,
        "post",
        formData,
        true,
      );
      console.log(res);
      setSuccess("Hotel listed successfully");
      formRef.current.reset();
      setImagePreviews([]);
      setCities([]);
      setSelectedState("");
      alert("Hotel listed successfully");
      if (onCancel) onCancel();
    } catch (err) {
      console.error(err);
      setError("Failed to list hotel. Please check all required fields.");
    } finally {
      stopLoading();
    }
  };

  const SectionTitle = ({ title }) => (
    <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-[#FFC20E]">
      {title}
    </h3>
  );

  return user ? (
    <div className="flex justify-center items-center py-10 px-4">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-8 rounded-xl shadow-md w-full max-w-5xl bg-white"
      >
        <h2 className="text-3xl font-bold mb-2">Add New Hotel</h2>
        <p className="text-gray-600 mb-6">
          Fill in the details below to list a new hotel on Parikrama
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
            LabelName="Hotel Name"
            Name="name"
            required
            Placeholder="Name of your property"
          />
          <InputBox
            LabelName="Property Type"
            Name="propertyType"
            Placeholder="Eg: Resort, B&B, Hotel etc."
          />
          <InputBox
            LabelName="Short Description"
            Name="shortDescription"
            Placeholder="2-3 line summary"
          />
          <InputBox
            Placeholder="Max: 5"
            LabelName="Star Rating"
            Name="starRating"
            Type="number"
            min="0"
            max="5"
          />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Full Description
          </label>
          <textarea
            name="description"
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFC20E] focus:border-transparent outline-none"
            placeholder="Enter detailed description about the hotel"
          />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            placeholder="Luxury, Family-friendly, Pet-friendly"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFC20E] focus:border-transparent outline-none"
          />
        </div>

        {/* LOCATION */}
        <SectionTitle title="Location" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              State *
            </label>
            <select
              name="stateId"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFC20E] focus:border-transparent outline-none"
              onChange={(e) => {
                setSelectedState(e.target.value);
                setCities([]);
              }}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}, {state?.country?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              City *
            </label>
            <select
              name="cityId"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFC20E] focus:border-transparent outline-none"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {country ? (
            <input
              className="hidden"
              value={country?.id || ""}
              name="country"
              onChange={(e) => setSelectedCountry(e.target.value)}
            />
          ) : (
            ""
          )}
          {/* <input
            className="hidden"
            value={country?.id}
            name="country"
            onChange={(e) => setSelectedCountry(e.target.value)}
          /> */}
          <InputBox
            LabelName="Country"
            Placeholder={country?.name}
            Value={country?.name}
          />

          <InputBox
            LabelName="Address Line 1 *"
            Name="line1"
            Placeholder="Street address"
            required
          />
          <InputBox LabelName="Address Line 2" Name="line2" />
          <InputBox
            LabelName="Locality"
            Name="locality"
            Placeholder="Locality near you"
          />
          <InputBox
            LabelName="Landmark"
            Name="landmark"
            Placeholder="Nearest famous landmarks"
          />
          <InputBox
            LabelName="Latitude"
            Name="lat"
            Type="text"
            // step="0.0001"
            required
          />
          <InputBox
            LabelName="Longitude"
            Name="lng"
            Type="text"
            // step="0.0001"
            required
          />
          <InputBox
            LabelName="Pincode"
            Name="pincode"
            Placeholder="Enter your area's Pincode"
          />
        </div>

        {/* CONTACT DETAILS */}
        <SectionTitle title="Contact Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputBox
            LabelName="Phone"
            Name="phone"
            Placeholder="Contact number"
          />
          <InputBox
            LabelName="Email"
            Name="email"
            Type="email"
            Placeholder="Contact email"
          />
          <InputBox
            LabelName="Website"
            Name="website"
            Placeholder="https://yourwebsite.com"
          />
          <InputBox
            LabelName="Booking URL"
            Name="bookingUrl"
            Required={false}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              name="amenities"
              placeholder="Free WiFi, Parking, Swimming Pool"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFC20E] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Services (comma separated)
            </label>
            <input
              type="text"
              name="services"
              placeholder="Room service, Laundry, Concierge"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFC20E] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* PRICING */}
        <SectionTitle title="Pricing" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputBox
            LabelName="Minimum Price"
            Name="pricing[minPrice]"
            Type="number"
            Placeholder="e.g., 2000"
          />
          <InputBox
            LabelName="Maximum Price"
            Name="pricing[maxPrice]"
            Type="number"
            Placeholder="e.g., 5000"
          />
          <InputBox
            LabelName="Average Price"
            Name="pricing[averagePrice]"
            Type="number"
            Placeholder="e.g., 3500"
          />
        </div>

        {/* IMAGES */}
        <SectionTitle title="Images" />
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-700">
            Upload gallery images (max 10)
          </label>
          <input
            type="file"
            name="gallery"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FFC20E] transition"
          />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="h-24 w-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <span className="absolute -top-2 -right-2 bg-[#FFC20E] text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-gray-700">
            Upload cover image (max 1)
          </label>
          <input
            type="file"
            name="cover"
            accept="image/*"
            onChange={handleImageChange2}
            className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FFC20E] transition"
          />
          {preview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
              {preview.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="h-24 w-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <span className="absolute -top-2 -right-2 bg-[#FFC20E] text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* POLICIES */}
        <SectionTitle title="Policies" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputBox LabelName="Check-in Time" Name="policies[checkInTime]" />
          <InputBox LabelName="Check-out Time" Name="policies[checkOutTime]" />
          <InputBox
            LabelName="Cancellation Policy"
            Name="policies[cancellationPolicy]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="policies[petsAllowed]"
              className="w-4 h-4"
            />
            <span className="text-gray-700">Pets Allowed</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="policies[childrenAllowed]"
              className="w-4 h-4"
            />
            <span className="text-gray-700">Children Allowed</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="policies[smokingAllowed]"
              className="w-4 h-4"
            />
            <span className="text-gray-700">Smoking Allowed</span>
          </label>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-5 mt-10 pt-8 border-t">
          <Button
            label="Cancel"
            onClick={() =>
              onCancel ? onCancel() : navigate("/admin/dashboard")
            }
            className="bg-gray-300 text-gray-900"
          />
          <Button label="List Hotel" type="submit" />
        </div>
      </form>
    </div>
  ) : (
    <div className="flex justify-center items-center w-full h-screen">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl">⚠️</p>
        Restricted Access !! Please log in as admin.
      </h2>
    </div>
  );
};

export default LoadingUI(AddNewHotel);
