import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo1.png";
import logo2 from "../assets/Logo2.png";
import { FaFacebook, FaLinkedin, FaUserTie, FaYoutube } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import Button from "./Button";
import { useSelector } from "react-redux";
import { AiFillInstagram } from "react-icons/ai";

const links = [
  { label: "Terms of service", path: "/terms-of-service" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Contact us", path: "/" },
  { label: "About us", path: "/" },
  { label: "How this site works", path: "/how-this-site-works" },
];

const social_links = [
  {
    label: (
      <h1 className="flex justify-center items-center gap-4 ">
        <FaYoutube />
        YouTube
      </h1>
    ),
    path: "https://www.youtube.com/@Parikrama-e3b",
  },
  {
    label: (
      <h1 className="flex justify-center items-center gap-4 ">
        <AiFillInstagram />
        Instagram
      </h1>
    ),
    path: "https://www.instagram.com/parikramaglobal/",
  },
  {
    label: (
      <h1 className="flex justify-center items-center gap-4 ">
        <FaFacebook />
        FaceBook
      </h1>
    ),
    path: "https://www.facebook.com/ParikramaGlobal",
  },
  {
    label: (
      <h1 className="flex justify-center items-center gap-4 ">
        <FaLinkedin />
        LinkedIn
      </h1>
    ),
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
  const navigate = useNavigate();

  return (
    <div className="bg-[#F7F7F7] ">
      <div className="p-10 flex md:flex-row flex-col-reverse md:justify-between md:items-start justify-center items-start gap-10">
        <div className="flex flex-col justify-center items-center">
          <Link to={"/"} className="flex items-center">
            <img src={logo} className="w-40" />
            <img src={logo2} className="w-28" />
          </Link>
          <p className="text-xs">
            © 2026 Parikrama Global All rights reserved.
          </p>
        </div>
        <div className="flex flex-col justify-start items-start gap-2">
          {links.map((f, index) => (
            <Link
              key={index}
              to={f.path}
              className="text-sm text-gray-500 hover:text-black hover:font-semibold hover:underline duration-200 ease-in-out"
            >
              {f.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col justify-start items-start">
          {social_links.map((s, index) => (
            <Link
              to={s.path}
              key={index}
              target="blank"
              className="text-sm text-gray-500 hover:text-black hover:font-semibold hover:underline duration-200 ease-in-out"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="h-[40vh] overflow-hidden object-top grayscale-100">
        <img className="w-full h-full object-cover"
          src={
            "https://ik.imagekit.io/parikrama/vecteezy_travel-around-the-world-important-landmarks-poster_1128259.jpg"
          }
        />
      </div>
      {/* <div className="hidden md:flex items-center gap-4">
        {user?.role === "Admin" ? (
          <Link
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
            label={
              <h1 className="flex justify-between items-center">
                <FaUserTie className="text-2xl text-black" />
                Admin Login
              </h1>
            }
            onClick={() => navigate("/login/admin")}
          />
        )}
      </div> */}
    </div>
  );
};

export default Footer;
