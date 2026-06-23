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
import { useNavigate, useParams } from "react-router-dom";

const FlightBus = ({ stopLoading, startLoading }) => {
  const { flight } = useParams("");
  const navigate = useNavigate();
  const buttons = [
    {
      label: "Buses",
      icon: <FaBusSimple className="text-base md:text-5xl" />,
      description: "Find and book bus tickets",
      color: "text-purple-700 group-hover:rotate-2",
    },
    {
      label: "Flights",
      icon: <MdOutlineFlight className="text-base md:text-5xl" />,
      description: "Compare and book best flights",
      color: "text-blue-700 group-hover:rotate-45",
      url: `/flights-busses/${true}`,
    },
    {
      label: "Hotels",
      icon: <FaHotel className="text-base md:text-5xl" />,
      description: "Explore and book comfortable stays",
      color: "text-red-600 group-hover:rotate-1",
      url: "/hotels",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-start h-full md:px-10 md:gap-10">
        {flight === "false" ? (
          <div className="h-full flex flex-col justify-between items-start gap-16 overflow-hidden relative md:w-1/2 select-none">
            <h1 className="text-xl flex flex-col font-semibold absolute top-0 left-0 p-5 z-40">
              <span className="uppercase py-10">
                Explore, discover, remember
              </span>
              <span className="text-4xl ">Parikrama</span> <br /> Welcomes you
              to Travel and Explore places together.
              <span className="w-1/2 py-10 font-light hidden md:block">
                Plan your perfect trip with ease. Book Flights, Busses, Hotels
                and more - all in one place.
              </span>
            </h1>
            <div className="absolute bottom-0 left-0 p-5 z-40 hidden lg:block">
              <h1 className="font-semibold text-xl py-5">
                Book Flight, Bus or Hotels
              </h1>
              {/* <RandomImageSlider images={right} /> */}
              <div className="flex flex-row justify-center items-centers flex-wrap gap-2">
                {buttons.map((b, index) => (
                  <button
                    onClick={() => navigate(b.url)}
                    key={index}
                    className={`md:w-44 md:h-48 h-32 w-32 flex flex-col justify-between items-start rounded-xl group hover:bg-neutral-100 bg-white duration-300 ease-in-out hover:shadow-xl py-6 px-3 group`}
                  >
                    <span
                      className={`text-base md:text-3xl ${b.color} duration-300 ease-in-out group-hover:scale-110`}
                    >
                      {b.icon}
                    </span>
                    <span className="text-xs md:text-base">{b.label}</span>
                    <span className="text-xs text-left">{b.description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full top-0 left-0 md:h-[85vh] rounded-xl overflow-hidden opacity-30">
              <img
                className="object-cover h-full w-full"
                src={
                  "https://ik.imagekit.io/parikrama/Ever%20Thought%20About%20Traveling%20The%20World_.jpeg"
                  // "https://ik.imagekit.io/parikrama/wallpaperflare-cropped%20(1).jpg"
                }
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {flight === "true" ? (
          <div className="h-full flex flex-col justify-between items-start gap-16 overflow-hidden relative md:w-1/2 select-none">
            <FlightSearch />
          </div>
        ) : (
          ""
        )}
        <FlightBusForm />
      </div>
    </div>
  );
};

export default LoadingUI(FlightBus);
