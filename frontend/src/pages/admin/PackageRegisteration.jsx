import React, { useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import SelectBox from "../../components/SelectionBox";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useEffect } from "react";

const RegisterTravelPackage = ({ startLoading, stopLoading, onCancel }) => {
  const formRef = useRef();
  const [error, setError] = useState("");
  const [tags, setTags] = useState("");
  // const [places, setPlaces] = useState([]);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const res = await FetchData("places", "get");
        // setPlaces(res?.data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadPlaces();
  }, []);

  const priorityOptions = [
    { _id: "hotDeals", label: "Hot Deals" },
    { _id: "trendingDeals", label: "Trending Deals" },
    { _id: "exclusiveDeals", label: "Exclusive Deals" },
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
      );

      if (res.data.success) {
        alert("Package Created Successfully");

        formRef.current.reset();
        offPopup;
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

        {/* Place ID */}
        {/* <InputBox
          LabelName="Place ID"
          Name="place"
          Placeholder="MongoDB Place ID"s
          required
        /> */}
        <InputBox LabelName="State" Name="state" Placeholder="State name" />
        <InputBox LabelName="City" Name="city" Placeholder="City name" />
        {/* <div className="py-4">
          <label className="block text-sm font-medium mb-1">Place</label>
          <select
            name="place"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
          >
            <option value="">Select Place</option>
            {places.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div> */}

        {/* Description */}
        <InputBox
          LabelName="Description"
          Name="description"
          Placeholder="Short description"
        />

        {/* Duration */}
        <div className="grid grid-cols-2 gap-4">
          <InputBox
            LabelName="Duration Nights"
            Name="durationNight"
            Type="number"
          />

          <InputBox
            LabelName="Duration Days"
            Name="durationDay"
            Type="number"
          />
        </div>

        {/* Price */}
        <InputBox LabelName="Price" Name="price" Type="number" />

        {/* Tags */}
        <InputBox
          LabelName="Tags (comma separated)"
          Placeholder="Adventure, Snow, Luxury"
          Value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* Priority */}
        <SelectBox
          LabelName="Priority"
          Name="priority"
          Options={priorityOptions}
        />

        {/* Images */}
        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>

          <input
            type="file"
            name="images"
            multiple
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>

        <Button label="Create Package" type="submit" className="w-full mt-4" />
        <Button label="Cancel" onClick={onCancel} className="w-full mt-4" />
      </form>
    </div>
  );
};

export default LoadingUI(RegisterTravelPackage);
