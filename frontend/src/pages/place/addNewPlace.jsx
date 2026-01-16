import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddNewPlace = ({ startLoading, stopLoading }) => {
  const formRef = useRef();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  const { user } = useSelector((state) => state.auth);

  /* ---------------- FETCH STATES ---------------- */
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

  /* ---------------- FETCH CITIES BY STATE ---------------- */
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

  /* ---------------- IMAGE PREVIEW HANDLER ---------------- */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      e.target.value = "";
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreviews(previews);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(formRef.current);

    try {
      startLoading();
      const res = await FetchData(
        `places/register-new-place/${user._id}`,
        "post",
        formData,
        true
      );
      console.log(res);

      setSuccess("Place added successfully");
      formRef.current.reset();
      setImagePreviews([]);
      setCities([]);
      setSelectedState("");
      alert("Place added successfully");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to add place. Please check details.");
    } finally {
      stopLoading();
    }
  };

  /* ---------------- RENDER ---------------- */
  return user ? (
    <div className="flex justify-center items-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-8 rounded-xl shadow-md w-3/4 bg-white"
      >
        <h2 className="text-2xl font-bold mb-6">Add New Place</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        <div className="grid grid-cols-2 gap-5">
          <InputBox LabelName="Place Name" Name="name" required />
          <InputBox LabelName="Category" Name="category" />

          {/* STATE SELECT */}
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              name="stateId"
              required
              className="w-full border rounded-md px-3 py-2"
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* CITY SELECT */}
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <select
              name="cityId"
              required
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <InputBox LabelName="Longitude" Name="lng" required />
          <InputBox LabelName="Latitude" Name="lat" required />
          <InputBox
            LabelName="Average Time Spent (mins)"
            Name="averageTimeSpent"
            Type="number"
          />
          <InputBox LabelName="Best Time to Visit" Name="bestTimeToVisit" />
          <InputBox LabelName="Entry Fee" Name="entryFee" Type="number" />
          <InputBox LabelName="Popularity Score" Name="popularityScore" />

          {/* DESCRIPTION */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Place Images (*max 5 image select multiple)
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* PREVIEWS */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mt-3">
                {imagePreviews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="preview"
                    className="h-24 w-full object-cover rounded-md border"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <Button label="Add Place" type="submit" className="w-full mt-6" />
      </form>
    </div>
  ) : (
    <div className="flex justify-center items-center w-full">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl">⚠️</p>
        Restricted Access !! Please log in to view the dashboard.
      </h2>
    </div>
  );
};

export default LoadingUI(AddNewPlace);
