import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo1.png";
import logo2 from "../assets/Logo2.png";
import { FaFacebook, FaLinkedin, FaUserTie, FaYoutube } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import Button from "./Button";
import { useSelector } from "react-redux";
import { AiFillInstagram } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Contact us", path: "/contact-us/parikrama-global" },
  { label: "Corporate", path: "/corporate/plans" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms of service", path: "/terms-of-service" },
  { label: "Club Updates", path: "/updates/for/club" },
  // { label: "About us", path: "/" },
  // { label: "How this site works", path: "/how-this-site-works" },
];

const social_links = [
  {
    label: <FaYoutube className="text-[#FF0033]" />,
    path: "https://www.youtube.com/@Parikrama-e3b",
  },
  {
    label: <FaFacebook className="text-[#0064E0]" />,
    path: "https://www.facebook.com/ParikramaGlobal",
  },
  {
    label: <AiFillInstagram className="text-[#F60077]" />,
    path: "https://www.instagram.com/parikramaglobal/",
  },
  {
    label: <FaLinkedin className="text-[#0B66C2]" />,
    path: "https://www.linkedin.com/company/112715748",
  },
  // {
  //   label: (
  //     <h1 className="flex justify-center items-center gap-4 ">
  //       <IoMdMail />
  //       Gmail
  //     </h1>
  //   ),
  //   path: "https://mail.google.com/mail/?view=cm&fs=1&to=connect@parikramaglobal.com",
  // },
];

const Footer = () => {
  const { user } = useSelector((state) => state.auth);
  const [popup, setPopup] = useState();
  const navigate = useNavigate();
  const LinkNavigate = (link) => {
    navigate(link);
    setPopup(false);
  };

  return (
    <div className="bg-[#e5e5e5] text-neutral-600 p-2 rounded-t-2xl">
      <div className="px-5 flex md:flex-row-reverse flex-col md:justify-between md:items-center justify-center items-start gap-5">
        <div className="relative rounded-xl overflow-hidden m-3 shadow-2xl flex w-fit">
          <img
            className="lg:w-80 md:w-40"
            src={
              "https://ik.imagekit.io/parikrama/ChatGPT%20Image%20May%207,%202026,%2004_10_20%20PM.png"
            }
          />
          <div className="absolute bg-black/10 h-full w-full top-0 left-0 flex flex-col justify-end items-center py-3 text-xs">
            {/* <p className="text-right font-semibold">
              Add your place and grow with Parikrama. <br />
              List your business or place and reach thousands of travelers
              daily.
            </p> */}
            <Button
              label={
                <h1 className="flex justify-between items-center text-black">
                  <MdAdd className="text-2xl" />
                  Add Popular Place
                </h1>
              }
              onClick={() => {
                setPopup(true);
                // setPopup(false);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-2">
          <h1 className="font-semibold">Quick Links</h1>
          <div className="flex flex-col justify-center items-start gap-1">
            {links.map((f, index) => (
              <Link
                key={index}
                to={f.path}
                className="text-sm text-gray-500 hover:text-black hover:font-semibold hover:underline duration-200 ease-in-out w-full"
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-start items-start flex-col">
          <h1 className="font-semibold">Follow us on</h1>
          <div className="flex justify-center items-center gap-2">
            {social_links.map((s, index) => (
              <Link
                to={s.path}
                key={index}
                target="blank"
                className="p-1 text-3xl shadow-2xl rounded-full shadow-black"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Link to={"/"} className="flex items-end m-2">
            <img src={logo} className="w-20" />
            <img src={logo2} className="w-28" />
          </Link>
          <p className="text-xs border-t pt-2">
            © 2026 Parikrama Global All rights reserved.
          </p>
          <p className="text-xs">Brand Unit by ANONZ GLOBAL LLP</p>
        </div>
      </div>
      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-black/70 z-50"
          >
            <div className="bg-white p-5 rounded-xl flex flex-col md:flex-row justify-center items-start gap-5 md:gap-10  w-full md:w-fit">
              <Button label={"Close"} onClick={() => setPopup(false)} />
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
    </div>
  );
};

export default Footer;
