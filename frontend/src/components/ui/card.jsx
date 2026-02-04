import React from "react";
import { BiSolidNavigation } from "react-icons/bi";
import Button from "../../components/Button";
import { truncateString } from "../../utils/Utility-functions";
import { Link } from "react-router-dom";

const Card = ({
  name,
  city,
  state,
  category,
  description,
  lat,
  long,
  placeId,
  image,
}) => {
  const openMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
    window.open(url, "_blank");
  };
  return (
    <Link
      to={`/current/place/${placeId}`}
      className="bg-neutral-100 w-full md:px-10 px-1 py-2 flex justify-between items-center rounded-xl hover:shadow-xl duration-300 ease-in-out"
    >
      <div className="h-full flex flex-col items-start gap-2">
        <h1 className="md:text-xl text-base md:tracking-wide uppercase">
          {name}
        </h1>
        <h2 className="text-xs">
          <span>{city}</span>,<span>{state}</span>
        </h2>
        <h1 className="inline-block w-fit text-xs px-2 py-1 rounded-full bg-[#FFC20E]">
          {category}
        </h1>
        <h1 className="text-xs hidden md:block">
          {truncateString(description, 50)}
        </h1>
      </div>
      <div className="flex justify-center items-center flex-col gap-3">
        <div className="h-28 w-32 bg-neutral-200 flex justify-center items-center rounded-xl overflow-hidden">
          <img
            src={image}
            alt="No image found"
            className="object-cover object-center rounded-xl w-full h-full"
          />
        </div>
        <button
          onClick={openMaps}
          className="group flex justify-center items-center gap-2 bg-transparent rounded-2xl drop-shadow-xl hover:drop-shadow-2xl text-xs"
        >
          <span>Directions</span>

          <BiSolidNavigation className="transition duration-150 ease-in-out text-neutral-500 group-hover:text-[#FFC20E] group-hover:rotate-45" />
        </button>
      </div>
    </Link>
  );
};

export default Card;
