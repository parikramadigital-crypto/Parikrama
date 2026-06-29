import React, { useEffect, useState } from "react";
import { FaHotel, FaUsersCog } from "react-icons/fa";
import {
  FaBusSimple,
  FaChildren,
  FaPersonWalkingLuggage,
} from "react-icons/fa6";
import { PiCityFill } from "react-icons/pi";
import { RiBuilding2Fill } from "react-icons/ri";
import { GiClubs } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { MdEventAvailable, MdOutlineFlight } from "react-icons/md";
import { ImSpoonKnife } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import InputBox from "../InputBox";
import { CiSearch } from "react-icons/ci";
import RandomImageSlider from "./RandomImageSlider";
import { FetchData } from "../../utils/FetchFromApi";
import Button from "../Button";
import { HiUserGroup } from "react-icons/hi";

const FloatNavBar = () => {
  const [leftBanner, setLeftBanner] = useState([]);
  const left = leftBanner?.map((banner) => [banner?.images?.url]);
  const banner = async () => {
    try {
      const response = await FetchData("promotions/get/all/promotions", "get");
      setLeftBanner(response.data.data.promotionsMin);
    } catch (err) {}
  };

  useEffect(() => {
    banner();
  }, []);

  const navigate = useNavigate();
  const buttons = [
    {
      label: "Flights",
      icon: <MdOutlineFlight />,
      url: `/flights-busses/${true}`,
      color: "text-blue-700",
    },
    {
      label: "Corporate",
      icon: <RiBuilding2Fill />,
      url: "/corporate/plans",
      color: "text-red-700",
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
      url: `/flights-busses/${false}`,
      color: "text-red-600 ",
    },
    {
      label: "City Darshan",
      icon: <PiCityFill />,
      url: "/city-darshan",
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
      label: "Events",
      icon: <MdEventAvailable />,
      url: "/explore/club-events",
      color: "text--600",
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
    {
      label: "Kids Zone",
      icon: <FaChildren />,
      url: "/explore/kids/place",
      color: "text-blue-700",
    },
  ];
  return (
    <div className="p-2 bg-[#F2F3F4] md:bg-transparent mx-5 px-2 rounded-t-xl shadow-2xl md:shadow-none w-full">
      <div className="md:hidden flex justify-center items-center w-full relative">
        <InputBox
          onClick={() => navigate("/search-feed/places")}
          Placeholder="Search Place, City, State, Category..."
          className="w-full pr-10"
        />
        <CiSearch className="absolute right-3 text-gray-500" />
      </div>
      <div className="flex flex-row justify-center lg:justify-between items-centers flex-wrap w-full">
        {buttons.map((b, index) => (
          <Link
            key={index}
            to={b.url}
            className={`flex justify-center items-center group hover:bg-[#FFC20D]/50  duration-300 ease-in-out hover:shadow-xl w-24 p-10 h-12 flex-col gap-1 hover:rounded-xl`}
            // className={`flex justify-center items-center group hover:bg-neutral-100  duration-300 ease-in-out hover:shadow-xl w-24 p-10 h-12 flex-col gap-1 hover:rounded-xl  ${
            //   index === buttons.length - 1 ? "" : "borde"
            // }`}
          >
            <span
              className={`md:text-2xl text-xl ${b.color} duration-300 ease-in-out group-hover:shadow-2xl`}
            >
              {b.icon}
            </span>

            <span className="text-xs md:text-sm text-center">{b.label}</span>
          </Link>
        ))}
      </div>
      <div className="relative rounded-xl overflow-hidden m-3 shadow-2xl md:hidden flex">
        {/* <img
          src={
            "https://ik.imagekit.io/parikrama/Epic%20Mountain%20Travel%20Adventure%20_%20Solo%20Hiking%20Views%20That%20Inspire%20Wanderlust.jpeg"
          }
        /> */}
        <RandomImageSlider images={left} />
        <div className="absolute bg-black/10 h-full w-full top-0 left-0 flex flex-col justify-between items-end text-xs">
          <p className="text-right font-semibold text-neutral-300 bg-black/80 my-10 pr-10 py-1 px-3">
            Plan a perfect holiday with us. <br />
            Packages for every kind of traveler
          </p>
          <div className="m-7">
            <Button
              // normal={false}
              label={"Explore travel Packages"}
              onClick={() => navigate("/explore")}
              className={"font-semibold"}
            />
          </div>
          {/* <button
            onClick={() => navigate("/explore")}
            className="text-xs border-[#FFC20D] border-[0.5px] bg-white/50 rounded-xl px-3 py-1"
          >
            Explore Travel <br />
            Packages
          </button> */}
        </div>
      </div>
      <div className="w-full justify-center items-center md:hidden flex py-2">
        <Button
          label={
            <h1 className="flex justify-center items-center gap-2">
              <HiUserGroup />
              Register Yourself as Facilitator
            </h1>
          }
          onClick={() => navigate("/login/facilitator")}
        />
      </div>
    </div>
  );
};

export default FloatNavBar;
