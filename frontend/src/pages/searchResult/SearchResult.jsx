import React, { useState } from "react";
import PlaceSearch from "./PlaceSearch";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import logo from "../../assets/Logo1.png";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState(
    () => localStorage.getItem("activeSection") || "",
  );
  const category = [
    "Temple",
    "Heritages",
    "Spiritual Destination",
    "Fort",
    "Museum",
    "Nature",
  ];

  return (
    <div className="p-6 flex justify-center items-center flex-col gap-10">
      <div className="flex flex-col items-center gap-10">
        <img src={logo} className="w-28" />
        <h1 className="text-2xl font-semibold text-center">
          Search for your desired Destination
        </h1>
        <div className="hidden md:flex justify-center items-center gap-5 text-sm">
          {category.map((c) => (
            <li
              onClick={() => {
                localStorage.setItem("activeSection", c);
                setQuery(c);
                setActiveSection(c);
              }}
              className={`cursor-pointer transition-all duration-300  w-fit p-3 list-none rounded-full ${
                activeSection === c
                  ? "bg-[#FFC20E]"
                  : "bg-neutral-200 text-black"
              }`}
            >
              {c}
            </li>
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center w-full md:w-[80vw] md:gap-5">
        <InputBox
          Type="text"
          Placeholder="Search by place, city, state, category..."
          className="w-full md:w-[80vw]"
          Value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button label={"Search"} className={"w-full"} />
      </div>
      {/* <input
        type="text"
        placeholder="Search places..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      /> */}
      <PlaceSearch query={query} />
    </div>
  );
};

export default SearchPage;
