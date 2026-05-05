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
import { Link } from "react-router-dom";

const FloatNavBar = () => {
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
      url: "",
      color: "text-pink-700",
    },
  ];
  return (
    <div className="pb-2">
      <div className="flex flex-row justify-center items-centers flex-wrap gap-2">
        {buttons.map((b, index) => (
          <Link
            key={index}
            to={b.url}
            className={`md:h-24 h-12 w-20 md:w-28 flex flex-col justify-center items-center rounded group hover:bg-neutral-100 bg-neutral-50 duration-300 ease-in-out hover:shadow-xl`}
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
    </div>
  );
};

export default FloatNavBar;
