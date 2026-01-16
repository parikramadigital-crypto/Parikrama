import React from "react";
import InputBox from "../InputBox";
import { useState } from "react";
import Button from "../Button";
import { useRef } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../LoadingUI";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const NewCity = ({ startLoading, stopLoading }) => {
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const formRef = useRef();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        startLoading();
        const res = await FetchData("states", "get");
        console.log(res);
        setStates(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        stopLoading();
      }
    };
    fetchStates();
  }, []);

  const addNewCity = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `cities/register-city/${user?._id}`,
        "post",
        formData
      );
      setSuccess(response.data.data.message);
      formRef.current.reset();
      navigate("/admin/dashboard");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message || "Something went wrong");
    }
  };
  return (
    <div className="w-full ">
      <form ref={formRef} onSubmit={addNewCity}>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <div className="">
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              name="stateId"
              required
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select State</option>
              {states?.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <InputBox Placeholder="City name" LabelName="City Name" Name="name" />
          <InputBox
            Placeholder="Longitude"
            LabelName="Longitude of city"
            Name="lng"
          />
          <InputBox
            Placeholder="Latitude"
            LabelName="Latitude of city"
            Name="lat"
          />
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button
            label={"Cancel"}
            onClick={() => navigate("/admin/dashboard")}
          />
          <Button label={"Submit"} type={"submit"} />
        </div>
      </form>
    </div>
  );
};

export default LoadingUI(NewCity);
