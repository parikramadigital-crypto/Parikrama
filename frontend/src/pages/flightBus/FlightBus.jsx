import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { MdOutlineFlight } from "react-icons/md";
import { FaBusSimple } from "react-icons/fa6";
import { FaHotel } from "react-icons/fa";
import FlightSearch from "../../components/flights/FlightSearch";
import { FlightBusForm } from "../../components/ui/FlightEnquiryForm";

const FlightBus = ({ stopLoading, startLoading }) => {
  const buttons = [
    {
      label: "Flights",
      icon: <MdOutlineFlight className="text-base md:text-5xl" />,
      description: "Compare and book best flights",
      color: "text-blue-700 group-hover:rotate-45",
    },
    {
      label: "Buses",
      icon: <FaBusSimple className="text-base md:text-5xl" />,
      description: "Find and book bus tickets",
      color: "text-purple-700 group-hover:rotate-2",
    },
    {
      label: "Hotels",
      icon: <FaHotel className="text-base md:text-5xl" />,
      description: "Explore and book comfortable stays",
      color: "text-red-600 group-hover:rotate-1",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-start h-full md:px-10 md:gap-10">
        <div className="h-full flex flex-col justify-between items-start gap-16 overflow-hidden relative md:w-1/2 select-none">
          <FlightSearch />
        </div>
        <FlightBusForm />
      </div>
    </div>
  );
};

export default LoadingUI(FlightBus);
