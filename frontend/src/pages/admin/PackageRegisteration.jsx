import React, { useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import SelectBox from "../../components/SelectionBox";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useEffect } from "react";

const RegisterTravelPackage = ({
  startLoading,
  stopLoading,
  onCancel,
  offPopup,
}) => {
  const formRef = useRef();
  const [error, setError] = useState("");
  const [tags, setTags] = useState("");
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredState, setFilteredState] = useState([]);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const response = await FetchData("states", "get");

        setStates(response?.data?.data || []);
      } catch (err) {}
    };

    const loadCountry = async () => {
      try {
        const response = await FetchData("country/get/all-country", "get");

        setCountries(response.data.data || []);
      } catch (err) {}
    };

    loadStates();
    loadCountry();
  }, []);

  const handleCountryChange = (countryId) => {
    const country = countries.find((c) => c._id === countryId);
    setSelectedCountry(countryId);
    const state = states.filter((d) => d.country?._id === countryId);

    setFilteredState(state);
  };

  const priorityOptions = [
    { _id: "hotDeals", label: "Hot Deals" },
    { _id: "trendingDeals", label: "Trending Deals" },
    { _id: "exclusiveDeals", label: "Exclusive Deals" },
    { _id: "lastMomentPackage", label: "Last Moment Deals" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(formRef.current);

    // convert comma tags into array
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim());
      tagArray.forEach((tag) => formData.append("tags[]", tag));
    }

    try {
      startLoading();

      const adminId = localStorage.getItem("userId");

      const res = await FetchData(
        `packages/register-package/${adminId}`,
        "post",
        formData,
        true,
      );

      if (res.data.success) {
        alert("Package Created Successfully");

        formRef.current.reset();
        offPopup();
        setTags("");
      }
    } catch (err) {
      setError(
        parseErrorMessage(err?.response?.data) || "Something went wrong",
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex justify-center items-center w-[80vw]">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-full"
      >
        <h2 className="text-2xl font-bold mb-6">Register Travel Package</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 fixed top-36 right-10 bg-white px-4 py-2 rounded shadow z-50">
            {error}
          </p>
        )}

        {/* Package Name */}
        <InputBox
          LabelName="Package Name"
          Name="name"
          Placeholder="Golden Triangle Tour"
          required
        />
        {/* country  */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Country*</label>
            <select
              name="country"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
              onChange={(e) => handleCountryChange(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State*</label>
            <select
              name="state"
              required
              disabled={!selectedCountry}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
            >
              <option value="">Select State</option>
              {filteredState.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <InputBox
          LabelName="Description"
          Name="description"
          Placeholder="Short description"
        />

        {/* Duration */}
        <div className="grid grid-cols-2 gap-1">
          <InputBox
            LabelName="Total Duration"
            Placeholder="Total duration including Days and Nights"
            Name="days"
            Type="number"
          />
          <InputBox
            LabelName="Number of nights"
            Placeholder="Number of nights in total days"
            Name="durationNight"
            Type="number"
          />

          <InputBox
            LabelName="Number of days"
            Placeholder="Number of days in total days"
            Name="durationDay"
            Type="number"
          />
          <InputBox
            LabelName="Number of persons (including adults & kids)"
            Placeholder="Number of persons"
            Name="numberOfPerson"
            Type="number"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 justify-center items-center ">
          {/* Price */}
          <InputBox
            LabelName="Price of Package"
            Name="price"
            Type="number"
            Placeholder="Eg: 25,000/-"
          />
          {/* Priority */}
          <div className="flex justify-center items-center w-full">
            <div className="py-4 w-full">
              <label className="block text-sm font-medium mb-1">
                Priority*
              </label>

              <select
                name="priority"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
              >
                <option value="">Select</option>
                {priorityOptions.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            <div className="py-4 w-full">
              <label className="block text-sm font-medium mb-1">
                Only for adults ?
              </label>

              <select
                name="onlyForAdults"
                defaultValue={"No"}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
              >
                <option value="">Select</option>
                {["Yes", "No"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tags */}
        <InputBox
          LabelName="Tags (comma separated)"
          Placeholder="Adventure, Snow, Luxury"
          Value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* Images */}
        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>

          <input
            type="file"
            name="image"
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            label="Cancel"
            onClick={onCancel}
            className="w-full mt-4"
            normal={false}
          />
          <Button
            label="Create Package"
            type="submit"
            className="w-full mt-4"
          />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(RegisterTravelPackage);
