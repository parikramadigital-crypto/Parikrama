import { useSelector } from "react-redux";
import Button from "./Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Logo1.png";
import logo2 from "../assets/Logo3.png";
import { CiMenuFries, CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BiArrowFromLeft } from "react-icons/bi";
import { LiaHotelSolid } from "react-icons/lia";
import {
  MdAdd,
  MdLocalOffer,
  MdOutlineExplore,
  MdOutlineFlight,
} from "react-icons/md";
import { FaBusSimple, FaUserTie } from "react-icons/fa6";
import { FaUserCircle, FaUserCog, FaUsersCog } from "react-icons/fa";
import { GiClubs } from "react-icons/gi";
import InputBox from "./InputBox";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const location = useLocation();
  const isHome =
    location.pathname === "/search-feed/places" ||
    location.pathname === "/travel-packages" ||
    location.pathname === "/clubs/register";

  const LinkNavigate = (link) => {
    navigate(link);
    setPopup(false);
    setPopup2(false);
  };

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="mx-auto px-4 py-3 md:py-1 flex items-center justify-around w-full gap-10 md:gap-40">
        {/* Logo Section */}
        <Link to={"/"} className="flex items-center">
          <img src={logo} className="w-10 md:w-16" />
          <img src={logo2} className="w-28 hidden md:block" />
        </Link>
        {localStorage.role === "Admin" ? (
          <Button
            label={"Go to dashboard"}
            onClick={() => navigate("/admin/dashboard")}
          />
        ) : (
          <div className="flex justify-end md:justify-end items-center gap-5 w-full">
            {isHome ? (
              ""
            ) : (
              <div className="hidden md:flex justify-center items-center w-full relative ">
                <InputBox
                  onClick={() => navigate("/search-feed/places")}
                  Placeholder="Search by place, city, state, category..."
                  className="w-full pr-10"
                />
                <CiSearch className="absolute right-3 text-gray-500" />
              </div>
            )}

            <Button
              label={
                <h1 className="flex justify-center items-center gap-2 text-nowrap text-xs md:text-base">
                  <MdOutlineExplore className="text-xs md:text-xl" />
                  Explore More
                </h1>
              }
              onClick={() => LinkNavigate("/explore")}
            />
            <Button
              className={"lg:block hidden text-nowrap"}
              label={"Add your near by place"}
              onClick={() => setPopup2(true)}
            />
            <button onClick={() => setPopup(true)}>
              <CiMenuFries className="font-bold text-xl" />
            </button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {/* hamburger  */}
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-end"
          >
            <div
              className="bg-black/80 w-[10%] md:w-full h-full"
              onClick={() => setPopup(false)}
            ></div>
            <div className="md:w-1/2 w-[90%] bg-white flex md:justify-between justify-evenly items-start flex-col h-full py-5 px-5">
              <div className="flex justify-between items-center gap-5 p-5 w-full">
                <Button label={<IoMdClose />} onClick={() => setPopup(false)} />
              </div>
              {/* logo  */}
              <div className="hidden md:flex items-center justify-center flex-col w-full">
                <img src={logo} className="w-20 md:w-40" />
                <img src={logo2} className="w-20 md:w-40" />
              </div>
              {/* buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
                <Button
                  label={
                    <h1 className="flex justify-between items-center">
                      <MdAdd className="text-2xl" />
                      Add Popular Place
                    </h1>
                  }
                  onClick={() => {
                    setPopup2(true);
                    setPopup(false);
                  }}
                />
                <Button
                  label={
                    user ? (
                      <h1 className="flex justify-between items-center">
                        <FaUserCircle className="text-2xl" />
                        Go to Dashboard
                      </h1>
                    ) : (
                      <h1 className="flex justify-between items-center">
                        <FaUserCircle className="text-2xl" />
                        Login
                      </h1>
                    )
                  }
                  onClick={() => {
                    user
                      ? localStorage.role === "user" ||
                        localStorage.role === "User"
                        ? LinkNavigate("/user/dashboard")
                        : localStorage.role === "community" ||
                            localStorage.role === "Community"
                          ? LinkNavigate("/dashboard/community")
                          : LinkNavigate("/facilitator/dashboard")
                      : LinkNavigate("/authentication");
                  }}
                  className={"w-full"}
                />
              </div>
            </div>
          </motion.div>
        )}
        {/* add place popup  */}
        {popup2 && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-black/70"
          >
            <div className="bg-white p-5 rounded-xl flex flex-col md:flex-row justify-center items-start gap-5 md:gap-10  w-full md:w-fit">
              <Button label={"Close"} onClick={() => setPopup2(false)} />
              <div className="w-full lg:w-[30vw] flex flex-col justify-center items-center gap-10 bg-neutral-300 p-5 rounded-xl overflow-hidden">
                <h2 className="uppercase font-semibold text-xl">
                  Add tourist place
                </h2>
                <div className="lg:w-96 w-40 h-40 lg:h-96 overflow-hidden object-center rounded-xl shadow-2xl hidden md:block">
                  <img
                    src={
                      "https://ik.imagekit.io/parikrama/ChatGPT%20Image%20Apr%2021,%202026,%2001_13_42%20PM.png"
                    }
                  />
                </div>
                <p className="text-center">
                  Click the button below to list a popular TOURIST PLACE.
                </p>
                <Button
                  label={"Add Tourist Place"}
                  onClick={() => LinkNavigate("/guest/register-new-place")}
                />
              </div>
              {/* add food place  */}
              <div className="w-full lg:w-[30vw] flex flex-col justify-center items-center gap-10 bg-neutral-300 p-5 rounded-xl overflow-hidden">
                <h2 className="uppercase font-semibold text-xl">
                  Add food place
                </h2>
                <div className="lg:w-96 w-40 h-40 lg:h-96 overflow-hidden object-center rounded-xl shadow-2xl hidden md:block">
                  <img
                    src={
                      "https://ik.imagekit.io/parikrama/Ardor-2.1s-United-Indian-Thali-1-1.jpg"
                    }
                  />
                </div>
                <p className="text-center">
                  Click the button below to list a popular FOOD PLACE located
                  near tourist attraction.
                </p>
                <Button
                  label={"Add Food Spot"}
                  onClick={() => LinkNavigate("/guest/register-new-food-place")}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
