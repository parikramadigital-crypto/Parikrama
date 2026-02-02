import React, { useEffect } from "react";
import LoadingUI from "../../components/LoadingUI";
import { useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import { Link } from "react-router-dom";
import { truncateString } from "../../utils/Utility-functions";
import Button from "../../components/Button";
import { useMemo } from "react";

const Explore = ({ startLoading, stopLoading }) => {
  const [popularData, setPopularData] = useState([]);
  const [enrichedPlaces, setEnrichedPlaces] = useState([]);
  console.log(enrichedPlaces);

  useEffect(() => {
    const getData = async () => {
      try {
        startLoading();
        const response = await FetchData("places/explore/places", "get");
        setPopularData(response?.data?.data?.places || []);
        setEnrichedPlaces(response?.data?.data?.enrichedPlaces || []);
      } catch (err) {
        console.log(err);
      } finally {
        stopLoading();
      }
    };
    getData();
  }, []);

  const { trendingPlaces, popularPlaces, risingPlaces, lowPlaces } =
    useMemo(() => {
      return {
        trendingPlaces: enrichedPlaces.filter(
          (p) => p?.popularity?.label === "Trending",
        ),
        popularPlaces: enrichedPlaces.filter(
          (p) => p?.popularity?.label === "Popular",
        ),
        risingPlaces: enrichedPlaces.filter(
          (p) => p?.popularity?.label === "Rising",
        ),
        lowPlaces: enrichedPlaces.filter((p) => p?.popularity?.label === "Low"),
      };
    }, [enrichedPlaces]);

  const {
    templePlaces,
    naturePlaces,
    beachPlaces,
    mountainPlaces,
    heritagePlaces,
    wildlifePlaces,
  } = useMemo(() => {
    return {
      templePlaces: enrichedPlaces.filter((p) =>
        p?.category?.toLowerCase().includes("temple"),
      ),

      naturePlaces: enrichedPlaces.filter((p) =>
        p?.category?.toLowerCase().includes("market"),
      ),

      beachPlaces: enrichedPlaces.filter((p) =>
        p?.category?.toLowerCase().includes("beach"),
      ),

      mountainPlaces: enrichedPlaces.filter((p) =>
        p?.category?.toLowerCase().includes("mountain"),
      ),

      heritagePlaces: enrichedPlaces.filter((p) =>
        p?.category?.toLowerCase().includes("landmarks"),
      ),

      wildlifePlaces: enrichedPlaces.filter((p) =>
        p?.category?.toLowerCase().includes("wildlife"),
      ),
    };
  }, [enrichedPlaces]);

  const Card = ({ data, text = "", minLimit = 8 }) => {
    // if (!data) return null;
    const [count, setCount] = useState(minLimit);
    return data ? (
      <div className="flex justify-center items-center flex-col gap-5 pb-5 border-b border-gray-300 lg:mx-20 mx-5">
        <h1 className="py-10 text-3xl uppercase tracking-wider font-bold">
          {text}
        </h1>
        <div className="md:w-fit w-full h-fit grid lg:grid-cols-4 md:grid-cols-3 p-1 gap-4">
          {data?.slice(0, count).map((p) => (
            <Link
              to={`/current/place/${p?._id}`}
              className="bg-gray-300 rounded-md shadow p-2 flex flex-col gap-2 justify-center items-center object-contain md:w-72 h-60"
            >
              <div className="h-40 lg:h-60 md:h-60 w-full bg-gray-200 flex items-center justify-center overflow-hidden object-contain rounded-xl">
                {p?.images[0]?.length === 0 ? (
                  <span className="text-gray-400 text-sm">No Image</span>
                ) : (
                  <img
                    src={p?.images[0]?.url}
                    className="object-cover w-full h-full "
                    alt="No image available"
                  />
                )}
              </div>
              <h1>{truncateString(p?.name, 25)}</h1>
            </Link>
          ))}
        </div>
        {count >= data?.length ? (
          ""
        ) : (
          <Button
            label={"Show More"}
            onClick={() => setCount((count) => count + 4)}
          />
        )}
      </div>
    ) : (
      ""
    );
  };

  console.log(risingPlaces);

  return (
    <div>
      <Card data={popularData} text="Browse most Rated places" />
      <Card data={templePlaces} text="Browse Temples" minLimit={4} />
      <Card data={heritagePlaces} text="Browse Heritages" minLimit={4} />
      <Card data={trendingPlaces} text="Trending Places" minLimit={4} />
      <Card data={popularPlaces} text="Popular Places" minLimit={4} />
      {/* <Card data={risingPlaces} text="Rising PLace" minLimit={4} /> */}
      {/* <Card data={naturePlaces} text="Browse Temples" minLimit={4} /> */}
      {/* {popularData?.slice(0, 10).map((p) => (
      ))} */}
    </div>
  );
};

export default LoadingUI(Explore);
