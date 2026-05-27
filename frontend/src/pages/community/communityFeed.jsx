import React, { useEffect, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import CommunityCard from "../../components/ui/CommunityCard";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import { useNavigate } from "react-router-dom";

const CommunityFeed = ({ startLoading, stopLoading }) => {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadCommunities = async () => {
    try {
      startLoading();
      const response = await FetchData("communities/community/all/list", "get");
      setCommunities(response?.data?.data || []);
    } catch (err) {
      setError("Unable to load clubs. Please try again.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-center items-start flex-col gap-5">
        <h1 className="font-medium text-left text-xs">
          <span className="md:border-b-2 border-[#FFC20E] text-3xl">
            Let's collaborate!
          </span>
          <br /> If you are an Influencer, Blogger, Solo-Traveller, Group
          Travellers, Bikers, Cycling etc.
        </h1>
        <div className="flex items-center gap-5">
          <Button
            label={"Register here"}
            className={"text-sm font-normal"}
            onClick={() => navigate("/community/form")}
          />
          <Button
            label={"Login"}
            className={"text-sm font-normal"}
            onClick={() => navigate("/login/community")}
          />
        </div>
      </div>
      <div className="flex justify-center items-center gap-10">
        <InputBox Placeholder="Enter here to search" />
        <Button label={"Search"} />
      </div>
      <div className="flex justify-center items-center">
        {communities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No communities found matching your search.
            </p>
          </div>
        ) : (
          <div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 p-10 w-full">
              {communities.map((community) => (
                <CommunityCard key={community._id} community={community} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingUI(CommunityFeed);
