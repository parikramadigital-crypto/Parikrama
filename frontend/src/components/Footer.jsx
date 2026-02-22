import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo1.png";
import logo2 from "../assets/Logo2.png";
import { FaFacebook, FaYoutube } from "react-icons/fa";

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
        <FaFacebook />
        FaceBook
      </h1>
    ),
    path: "https://www.facebook.com/ParikramaGlobal",
  },
  {
    label: (
      <h1 className="flex justify-center items-center gap-4 ">
        <FaYoutube />
        YouTube
      </h1>
    ),
    path: "https://www.youtube.com/@Parikrama-e3b",
  },
];

const Footer = () => {
  return (
    <div className="bg-[#F7F7F7] p-10 flex md:flex-row flex-col-reverse md:justify-between md:items-start justify-center items-start gap-10">
      <div className="flex flex-col justify-center items-center">
        <Link to={"/"} className="flex items-center">
          <img src={logo} className="w-40" />
          <img src={logo2} className="w-28" />
        </Link>
        <p className="text-xs">© 2026 Parikrama Global All rights reserved.</p>
      </div>
      <div className="flex flex-col justify-start items-start gap-2">
        {links.map((f) => (
          <Link
            to={f.path}
            className="text-sm text-gray-500 hover:text-black hover:font-semibold hover:underline duration-200 ease-in-out"
          >
            {f.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col justify-start items-start">
        {social_links.map((s) => (
          <Link
            to={s.path}
            target="blank"
            className="text-sm text-gray-500 hover:text-black hover:font-semibold hover:underline duration-200 ease-in-out"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
