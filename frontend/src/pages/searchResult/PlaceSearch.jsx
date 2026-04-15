import React, { useEffect, useState, useRef } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import Card from "../../components/ui/card";
import LoadingUI from "../../components/LoadingUI";
import { ImFire } from "react-icons/im";

const PlaceSearch = ({ query, startLoading, stopLoading }) => {
  const [results, setResults] = useState([]);
  const [trendingResult, setTrendingResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const controllerRef = useRef(null);

  // 🔥 MAIN SEARCH EFFECT
  useEffect(() => {
    // If empty → fetch trending
    if (!query || !query.trim()) {
      fetchTrending();
      return;
    }

    // Debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(query);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // 🔍 SEARCH API CALL
  const handleSearch = async (searchQuery) => {
    try {
      setLoading(true);
      startLoading();

      // Cancel previous request
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      controllerRef.current = new AbortController();

      const response = await FetchData(
        "places/search-feed",
        "get",
        {
          query: searchQuery,
          page: 1,
          limit: 20,
        },
        {
          signal: controllerRef.current.signal,
        },
      );

      setResults(response.data.results || []);
      setTrendingResult(false);
    } catch (error) {
      if (error.name !== "AbortError") {
      }
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  // 🔥 TRENDING (no query)
  const fetchTrending = async () => {
    try {
      setLoading(true);
      startLoading();

      const response = await FetchData("places/search-feed", "get", {
        query: "",
        limit: 10,
      });

      setResults(response.data.results || []);
      setTrendingResult(true);
    } catch (error) {
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  // 🎯 UI
  return (
    <div className="w-full md:w-[80vw] flex justify-center items-center">
      {loading ? (
        <p className="text-gray-500">Searching...</p>
      ) : results?.length > 0 ? (
        <div className="space-y-3 flex flex-col justify-center items-center w-full">
          {trendingResult === true ? (
            <h1 className="font-semibold text-2xl text-left w-full flex justify-start items-center">
              Here are some most Trending Places
              <span className="text-red-500 px-2">
                <ImFire />
              </span>{" "}
            </h1>
          ) : (
            ""
          )}
          {results?.map((place, index) => (
            <Card
              placeId={place?._id}
              key={index}
              category={place?.category}
              name={place?.name}
              city={place?.city?.name}
              state={place?.state?.name}
              image={place?.images[0]?.url || place?.image[0]?.url}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No results found</p>
      )}
    </div>
  );
};

export default LoadingUI(PlaceSearch);
