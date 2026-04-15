import React, { useState } from "react";
import PlaceSearch from "./PlaceSearch";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="p-6 flex justify-center items-center flex-col">
      <div className="flex justify-center items-center w-full md:w-[80vw] gap-5">
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
