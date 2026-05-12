import React from "react";
import { FaHotel, FaUsersCog } from "react-icons/fa";
import {
  FaBusSimple,
  FaPersonWalkingLuggage,
  FaTrainTram,
} from "react-icons/fa6";
import { GiClubs } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { MdOutlineFlight } from "react-icons/md";
import { ImSpoonKnife } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import InputBox from "../InputBox";
import { CiSearch } from "react-icons/ci";

const FloatNavBar = () => {
  const navigate = useNavigate();
  const buttons = [
    {
      label: "Flights",
      icon: <MdOutlineFlight />,
      url: "/flights-busses",
      color: "text-blue-700",
    },
    {
      label: "Packages",
      icon: <FaPersonWalkingLuggage />,
      url: "/travel-packages",
      color: "text-purple-700",
    },
    {
      label: "Buses",
      icon: <FaBusSimple />,
      url: "/flights-busses",
      color: "text-red-600 ",
    },
    {
      label: "Trains",
      icon: <FaTrainTram />,
      url: "/flights-busses",
      color: "text-cyan-600",
    },
    {
      label: "Hotels",
      icon: <FaHotel />,
      url: "/hotels",
      color: "text-orange-600",
    },
    {
      label: "Clubs",
      icon: <GiClubs />,
      url: "/clubs",
      color: "text-green-600",
    },
    {
      label: "Community",
      icon: <FaUsersCog />,
      url: "/community/feed",
      color: "text-yellow-500",
    },
    {
      label: "Food",
      icon: <ImSpoonKnife />,
      url: "/food/courts/feed",
      color: "text-pink-700",
    },
  ];
  return (
    <div className="pb-2 bg-[#F2F3F4] md:bg-transparent mx-5 px-2 rounded-t-xl shadow-2xl md:shadow-none">
      <div className="md:hidden flex justify-center items-center w-full relative">
        <InputBox
          onClick={() => navigate("/search-feed/places")}
          Placeholder="Search Place, City, State, Category..."
          className="w-full pr-10"
        />
        <CiSearch className="absolute right-3 text-gray-500" />
      </div>
      <div className="flex flex-row justify-center items-centers flex-wrap gap-2">
        {buttons.map((b, index) => (
          <Link
            key={index}
            to={b.url}
            className={`md:h-24 h-16 w-20 md:w-28 flex flex-col justify-center items-center rounded group hover:bg-neutral-100 bg-neutral-50 duration-300 ease-in-out hover:shadow-xl`}
          >
            <span
              className={`md:text-3xl ${b.color} duration-300 ease-in-out group-hover:shadow-2xl`}
            >
              {b.icon}
            </span>
            <span className="text-xs md:text-base">{b.label}</span>
          </Link>
        ))}
      </div>
      <div className="relative rounded-xl overflow-hidden m-3 shadow-2xl md:hidden flex">
        <img
          src={
            "https://ik.imagekit.io/parikrama/Epic%20Mountain%20Travel%20Adventure%20_%20Solo%20Hiking%20Views%20That%20Inspire%20Wanderlust.jpeg"
          }
        />
        <div className="absolute bg-black/10 h-full w-full top-0 left-0 flex flex-col justify-between items-end px-5 py-10 text-xs">
          <p className="text-right font-semibold">
            Plan a perfect holiday with us. <br />
            Packages for every kind of traveler
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="text-xs border-[#FFC20D] border-[0.5px] bg-white/50 rounded-xl px-3 py-1"
          >
            Explore Travel <br />
            Packages
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatNavBar;
