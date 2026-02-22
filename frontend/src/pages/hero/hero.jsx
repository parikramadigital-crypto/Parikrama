import React, { useEffect, useMemo, useState } from "react";
import InputBox from "../../components/InputBox";
import { CiSearch } from "react-icons/ci";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import Card from "../../components/ui/card";
import { motion } from "framer-motion";

const Hero = ({ stopLoading, startLoading }) => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [topBanner, setTopBanner] = useState([]);
  const [topBannerMobile, setTopBannerMobile] = useState([]);
  const [rightBanner, setRightBanner] = useState([]);
  const [leftBanner, setLeftBanner] = useState([]);

  const top = topBanner?.map((banner) => [banner?.images?.url]);
  const topMobile = topBannerMobile?.map((banner) => [banner?.images?.url]);
  const right = rightBanner?.map((banner) => [banner?.images?.url]);
  const left = leftBanner?.map((banner) => [banner?.images?.url]);
  /* ---------------- FETCH BANNERS ---------------- */

  const banner = async () => {
    try {
      startLoading();
      const response = await FetchData("promotions/get/all/promotions", "get");
      setTopBanner(response.data.data.promotionsMax);
      setTopBannerMobile(response.data.data.promotionsMaxMobile);
      setRightBanner(response.data.data.promotionsMid);
      setLeftBanner(response.data.data.promotionsMin);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  /* ---------------- FETCH ALL PLACES ---------------- */
  const getData = async () => {
    try {
      startLoading();
      const response = await FetchData("admin/places", "get");
      setData(response?.data?.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    banner();
    getData();
  }, []);

  /* ---------------- RANDOM FEATURED PLACES (INITIAL VIEW) ---------------- */
  const featuredPlaces = useMemo(() => {
    if (!data.length) return [];
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 8);
  }, [data]);

  /* ---------------- SEARCH LOGIC ---------------- */
  const filteredPlaces = useMemo(() => {
    if (!searchInput.trim()) return [];

    // 1️⃣ Normalize query
    const rawQuery = searchInput.toLowerCase().trim();

    // 2️⃣ Stop words to ignore
    const stopWords = new Set([
      "in",
      "near",
      "places",
      "place",
      "best",
      "famous",
      "top",
      "to",
      "of",
      "for",
      "the",
      "and",
      "around",
    ]);

    // 3️⃣ Extract meaningful keywords
    const keywords = rawQuery
      .split(/\s+/)
      .filter((word) => word.length > 1 && !stopWords.has(word));

    if (keywords.length === 0) return [];

    const rankedResults = [];

    data.forEach((place) => {
      const searchableFields = [
        place?.name,
        place?.city?.name,
        place?.state?.name,
        place?.category,
        place?.description,
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;

      keywords.forEach((keyword) => {
        if (searchableFields.includes(keyword)) {
          score += 1;

          // bonus for exact word match
          const regex = new RegExp(`\\b${keyword}\\b`, "i");
          if (regex.test(searchableFields)) {
            score += 1;
          }
        }
      });

      if (score > 0) {
        rankedResults.push({ place, score });
      }
    });

    // 4️⃣ Sort by relevance score
    rankedResults.sort((a, b) => b.score - a.score);

    // 5️⃣ Return only places
    return rankedResults.map((item) => item.place);
  }, [searchInput, data]);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex justify-center items-center flex-col">
      {/* TOP BANNER */}
      <div className="md:w-[99%] hidden md:block">
        <RandomImageSlider images={top} className="md:h-[300px] h-[200px]" />
      </div>
      <div className="w-full md:hidden">
        <RandomImageSlider images={topMobile} className="h-[200px]" />
      </div>

      {/* CONTENT */}
      <div className="flex justify-center w-full py-10 md:px-0 px-2">
        {/* LEFT SLIDER */}
        <div className="w-fit h-fit flex flex-col gap-10">
          <div className="w-96 h-96 bg-neutral-500 rounded-xl md:flex hidden justify-center items-center flex-col">
            <RandomImageSlider images={left} />
          </div>
          {/* <div className="w-96 h-96 bg-gray-300 sticky top-24 left-0 flex justify-center items-center">
            <h1>Flight Booking</h1>
          </div> */}
        </div>

        {/* SEARCH + RESULTS */}
        <div className="md:p-4 w-fit overflow-hidden">
          {/* SEARCH BAR */}
          <div className="flex justify-center items-center w-full relative">
            <InputBox
              Value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              Placeholder="Search by place, city, state, category..."
              className="w-full pr-10"
            />
            <CiSearch className="absolute right-3 text-gray-500" />
          </div>

          {/* RESULTS */}
          <div className="flex gap-2 flex-col xl:w-[650px] mt-4">
            {searchInput ? (
              filteredPlaces.length > 0 ? (
                filteredPlaces.slice(0, 8).map((place) => (
                  <motion.div
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -100 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{
                      type: "spring",
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    <Card
                      key={place._id}
                      placeId={place._id}
                      name={place.name}
                      city={place?.city?.name}
                      state={place?.state?.name}
                      category={place?.category}
                      description={place?.description}
                      lat={place?.location?.coordinates?.[1]}
                      long={place?.location?.coordinates?.[0]}
                      image={place?.images?.[0]?.url}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-gray-500">No results found…</div>
              )
            ) : (
              featuredPlaces.map((place) => (
                <motion.div
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -100 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <Card
                    key={place._id}
                    placeId={place._id}
                    name={place.name}
                    city={place?.city?.name}
                    state={place?.state?.name}
                    category={place?.category}
                    description={place?.description}
                    lat={place?.location?.coordinates?.[1]}
                    long={place?.location?.coordinates?.[0]}
                    image={place?.images?.[0]?.url}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="w-96 h-96 bg-neutral-500 rounded-xl overflow-hidden lg:block hidden sticky top-24 left-0">
          <RandomImageSlider images={right} />
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(Hero);
