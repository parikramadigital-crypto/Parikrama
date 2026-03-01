import { useSelector } from "react-redux";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo1.png";
import logo2 from "../assets/Logo3.png";
import { CiMenuFries } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BiArrowFromLeft } from "react-icons/bi";
import { LiaHotelSolid } from "react-icons/lia";
import {
  MdLocalOffer,
  MdOutlineExplore,
  MdOutlineFlight,
} from "react-icons/md";
import { FaBusSimple, FaUserTie } from "react-icons/fa6";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [popup, setPopup] = useState(false);

  const LinkNavigate = (link) => {
    navigate(link);
    setPopup(false);
  };

  const buttons = [
    {
      className: "w-full md:hidden block",
      label: "Add your near by popular place",
      url: "/guest/register-new-place",
    },
    {
      className: "w-full",
      label: (
        <h1 className="flex justify-between items-center">
          <MdLocalOffer className="text-2xl" />
          Travel Packages
        </h1>
      ),
      url: "/travel-packages",
    },
    {
      className: "w-full",
      label: (
        <h1 className="flex justify-between items-center">
          <LiaHotelSolid className="text-2xl" />
          Hotel Booking
        </h1>
      ),
      url: "/flights-busses",
    },
    {
      className: "w-full",
      label: (
        <h1 className="flex justify-between items-center">
          <MdOutlineFlight className="text-2xl" />
          Flight Booking
        </h1>
      ),
      url: "/flights-busses",
    },
    {
      className: "w-full",
      label: (
        <h1 className="flex justify-between items-center">
          <FaBusSimple className="text-2xl" />
          Bus Booking
        </h1>
      ),
      url: "/flights-busses",
    },
    {
      className: "w-full",
      label: (
        <h1 className="flex justify-between items-center">
          <FaUserTie className="text-2xl" />
          Facilitator Login
        </h1>
      ),
      url: "/login/facilitator",
    },
  ];

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      {/* {window.location.pathname === "/" ? (
        <button
          onClick={() => LinkNavigate("/login/facilitator")}
          className="w-full h-fit bg-[#FFC20E] text-xs md:text-sm px-5 flex justify-between items-center py-1"
        >
          <h1>
            You can register yourself as a Facilitator (Pandit, Temple Guide,
            Tour Guide, Photographer etc.)
          </h1>
          <span className="md:flex justify-center items-center gap-2 hidden">
            Register / Login <BiArrowFromLeft />
          </span>
        </button>
      ) : (
        ""
      )} */}

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link to={"/"} className="flex items-center">
          <img src={logo} className="w-10" />
          <img src={logo2} className="w-28" />
        </Link>

        <div className="flex justify-center items-center gap-5">
          <Button
            label={
              <h1 className="flex justify-center items-center gap-2">
                <MdOutlineExplore className="text-xl" />
                Explore More
              </h1>
            }
            onClick={() => LinkNavigate("/explore")}
            className={"md:block hidden"}
          />
          <button
            onClick={() => LinkNavigate("/explore")}
            className="bg-[#FFC20E] px-4 py-2 rounded-2xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out md:hidden text-xs flex justify-center items-center gap-1"
          >
            <MdOutlineExplore />
            Explore More
          </button>
          <Button
            className={"lg:block hidden"}
            label={"Add your near by popular place"}
            onClick={() => LinkNavigate("/guest/register-new-place")}
          />
          <button onClick={() => setPopup(true)}>
            <CiMenuFries className="font-bold text-xl" />
          </button>
        </div>
      </div>
      <AnimatePresence>
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
                <div className="hidden md:flex items-center gap-4">
                  {user?.role === "Admin" ? (
                    <Link
                      onClick={() => setPopup(false)}
                      to={`/admin/dashboard`}
                      className="bg-gray-400 px-4 py-2 rounded-2xl drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out text-center"
                    >
                      {window.location.pathname === "/"
                        ? "Go to Dashboard"
                        : `Welcome admin ${user.name}`}
                    </Link>
                  ) : (
                    <Button
                      className={"w-full bg-gray-400 text-white"}
                      label="Admin Login"
                      onClick={() => LinkNavigate("/login")}
                    />
                  )}
                </div>
              </div>
              {/* logo  */}
              <div className="flex items-center justify-center flex-col w-full">
                <img src={logo} className="w-20 md:w-40" />
                <img src={logo2} className="w-20 md:w-40" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-3">
                {buttons.map((b) => (
                  <Button
                    className={b.className}
                    onClick={() => LinkNavigate(b.url)}
                    label={b.label}
                  />
                ))}
                {/* Desktop Buttons */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
