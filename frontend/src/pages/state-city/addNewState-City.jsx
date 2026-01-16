import React from "react";
import NewState from "../../components/ui/NewState";
import NewCity from "../../components/ui/NewCity";
import { useState } from "react";
import { useSelector } from "react-redux";

const AddNewStateCity = () => {
  const [isState, setIsState] = useState(true);
  const { user } = useSelector((state) => state.auth);
  return user ? (
    <div className="flex justify-center items-center w-full ">
      <div className="shadow-xl rounded-2xl w-1/2 p-6">
        {/* Toggle Buttons */}
        <div className="flex mb-6 rounded-xl overflow-hidden">
          <button
            onClick={() => setIsState(true)}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              isState ? "bg-[#FFC20E] text-black" : "bg-gray-100 text-gray-700"
            }`}
          >
            New State
          </button>
          <button
            onClick={() => setIsState(false)}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              !isState ? "bg-[#FFC20E] text-black" : "bg-gray-100 text-gray-700"
            }`}
          >
            New City
          </button>
        </div>

        {/* Render Selected Login */}
        <div className="flex justify-center items-center w-full">
          {isState ? <NewState /> : <NewCity />}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center w-full">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl ">⚠️</p>
        Restricted Access !! Please log in to view the dashboard.
      </h2>
    </div>
  );
};

export default AddNewStateCity;
