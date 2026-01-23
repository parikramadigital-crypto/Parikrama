import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";

const FacilitatorRegister = ({ startLoading, stopLoading }) => {
  const formRef = useRef();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagePreviews2, setImagePreviews2] = useState([]);

  /* ---------------- IMAGE PREVIEW HANDLER ---------------- */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 1) {
      alert("Maximum 1 images allowed");
      e.target.value = "";
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreviews(previews);
  };

  const handleImageChange2 = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 2) {
      alert("Maximum 2 images allowed");
      e.target.value = "";
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreviews2(previews);
  };

  /* ================= FETCH CITIES ================= */
  useEffect(() => {
    const fetchCities = async () => {
      try {
        startLoading();
        const res = await FetchData("cities", "get");
        setCities(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        stopLoading();
      }
    };
    fetchCities();
  }, []);

  /* ================= FETCH PLACES ================= */
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await FetchData("places", "get");
        setPlaces(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlaces();
  }, []);

  /* ================= HANDLE CITY CHANGE ================= */
  const handleCityChange = (cityId) => {
    const city = cities.find((c) => c._id === cityId);
    setSelectedCity(cityId);
    setSelectedState(city?.state?._id || "");

    const cityPlaces = places.filter((p) => p.city?._id === cityId);
    setFilteredPlaces(cityPlaces);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(formRef.current);
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }

    try {
      startLoading();
      const res = await FetchData(
        "facilitator/register",
        "post",
        formData,
        true,
      );
      // console.log(res);
      formRef.current.reset();
      setImagePreviews([]);
      setImagePreviews2([]);
      alert(res.data.message);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-full"
      >
        <h2 className="text-2xl font-bold mb-6">Facilitator Registration</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="grid md:grid-cols-2 gap-3">
          <InputBox
            LabelName="Full Name"
            Name="name"
            required
            Placeholder="Full name"
          />
          <InputBox
            LabelName="Phone"
            Name="phone"
            required
            Placeholder="Contact number"
          />
          <InputBox
            LabelName="Email"
            Name="email"
            required
            Placeholder="Email"
          />
          <InputBox
            LabelName="Password"
            Name="password"
            Type="password"
            required
            Placeholder="*********"
          />

          <InputBox
            LabelName="Role"
            Name="role"
            Placeholder="Guide / Pandit / Instructor"
            required
          />
          <InputBox
            LabelName="ID Proof"
            Name="documentNumber"
            Placeholder="Aadhar / PAN number"
            required
          />
          <InputBox
            LabelName="Experience"
            Name="experienceYears"
            Placeholder="Experience in Years"
            required
          />
          <InputBox
            LabelName="Known language"
            Name="languages"
            Placeholder="eg: Hindi, English "
            required
          />

          {/* CITY */}
          <div>
            <label className="block text-sm font-medium mb-1">
              City and State
            </label>
            <select
              name="city"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}, {city.state?.name}
                </option>
              ))}
            </select>
          </div>

          {/* PLACE (FILTERED) */}
          <div>
            <label className="block text-sm font-medium mb-1">Place</label>
            <select
              name="place"
              required
              disabled={!selectedCity}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
            >
              <option value="">Select place</option>
              {filteredPlaces.map((place) => (
                <option key={place._id} value={place._id}>
                  {place.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center items-center w-full col-span-2">
            <div className="py-4 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Write a short description about your self..."
                name="bio"
                rows="3"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
              />
            </div>
          </div>

          <div className="col-span-2 bg-gray-200 py-5 px-2 rounded-xl">
            <label className="block text-sm font-medium mb-1">
              Profile Image
            </label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
            />

            {/* PREVIEWS */}
            {imagePreviews.length > 0 && (
              <div className="mt-3 w-40 h-40 overflow-hidden bg-neutral-500 rounded-full object-center object-cover flex justify-center items-center">
                {imagePreviews.map((src, idx) => (
                  <img key={idx} src={src} alt="preview" className="" />
                ))}
              </div>
            )}
          </div>
          <div className="col-span-2 bg-gray-200 py-5 px-2 rounded-xl">
            <label className="block text-sm font-medium mb-1">
              ID Proof Image (select multiple)
            </label>
            <input
              type="file"
              name="documentImage"
              multiple
              accept="image/*"
              onChange={handleImageChange2}
              className="bg-gray-300 w-fit py-2 px-5 rounded-xl"
            />

            {/* PREVIEWS */}
            {imagePreviews2.length > 0 && (
              <div className="mt-3 w-full overflow-hidden gap-3 flex justify-start items-start">
                {imagePreviews2.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="preview"
                    className="object-contain w-40 bg-neutral-300"
                  />
                ))}
              </div>
            )}
          </div>

          <InputBox
            LabelName="State"
            Name="state"
            Value={selectedState}
            required
            className="hidden"
            LabelClassname="hidden"
          />
        </div>

        <Button label="Register" type="submit" className="w-full mt-6" />
      </form>
    </div>
  );
};

export default LoadingUI(FacilitatorRegister);
