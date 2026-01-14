import React from "react";
import { BiSolidNavigation } from "react-icons/bi";
import Button from "../../components/Button";
import { truncateString } from "../../utils/Utility-functions";

const Card = ({ name, city, state, category, description, lat, long }) => {
  const openMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
    window.open(url, "_blank");
  };
  return (
    <div className="bg-neutral-200 w-full px-10 py-5 flex justify-between items-center rounded-xl text-sm">
      <div>
        <h1 className="text-2xl tracking-wide uppercase">{(name)}</h1>
        <h2>
          <span>{city}</span>,<span>{state}</span>
        </h2>
        <h1>
          <strong>Category: </strong>
          {category}
        </h1>
        <h1>
          <strong>Description: </strong>
          {truncateString(description, 30)}
        </h1>
      </div>
      <div>
        <button
          onClick={openMaps}
          className={`bg-transparent px-4 py-2 rounded-2xl drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out hover:text-[#DF3F33] border h-full flex flex-col justify-center items-center text-neutral-500`}
        >
          <span>
            <BiSolidNavigation className="text-3xl" />
          </span>
          <span className="">Get Directions</span>
        </button>
      </div>
    </div>
  );
};

export default Card;
