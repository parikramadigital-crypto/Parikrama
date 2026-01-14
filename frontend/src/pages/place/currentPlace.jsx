import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import { PlaceCard, ExpandedPlaceCard } from "../../components/ui/PlaceCard";
import LoadingUI from "../../components/LoadingUI";

const CurrentPlace = ({ startLoading, stopLoading }) => {
  const { placeId } = useParams();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const [data, setData] = useState();
  console.log(data);
  const [recommendations, setRecommendations] = useState([]);

  const currentPlace = async () => {
    try {
      startLoading();
      const response = await FetchData(`places/${placeId}`, "get");
      setData(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  const searchRelated = async () => {
    try {
      const query = data?.city?.name;
      const response = await FetchData(
        `places/related-places/${query}`,
        "get"
        // query
      );
      setRecommendations(response.data.data);
      //   console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    searchRelated();
  }, [data]);
  useEffect(() => {
    currentPlace();
  }, [user]);

  return (
    <div>
      <div className="flex flex-col w-full overflow-scroll flex-nowrap px-20 gap-5">
        <ExpandedPlaceCard place={data} />
        <h1 className="w-full text-left px-20">
          As you are interested in touring {data?.city?.name}, here are some
          more suggestion{" "}
        </h1>
        {recommendations?.map((place) => (
          <PlaceCard place={place} />
        ))}
      </div>
    </div>
  );
};

export default LoadingUI(CurrentPlace);
