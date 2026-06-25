import React, { useEffect, useMemo, useState } from "react";
import InputBox from "../../components/InputBox";
import { CiSearch } from "react-icons/ci";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import Card from "../../components/ui/card";
import { motion } from "framer-motion";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { TbLivePhotoFilled } from "react-icons/tb";
import logo from "../../assets/Logo1.png";
import FloatNavBar from "../../components/ui/FloatNavBar";
import { FaAngleDoubleDown, FaAngleDoubleRight } from "react-icons/fa";

const Hero = ({ stopLoading, startLoading }) => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [topBanner, setTopBanner] = useState([]);
  const [topBannerMobile, setTopBannerMobile] = useState([]);
  const [rightBanner, setRightBanner] = useState([]);
  const [leftBanner, setLeftBanner] = useState([]);
  const [count, setCount] = useState(8);
  const navigate = useNavigate();

  const top = topBanner?.map((banner) => [banner?.images?.url]);
  const topMobile = topBannerMobile?.map((banner) => [banner?.images?.url]);
  const right = rightBanner?.map((banner) => [banner?.images?.url]);
  const left = leftBanner?.map((banner) => [banner?.images?.url]);

  const banner = async () => {
    try {
      startLoading();
      const response = await FetchData("promotions/get/all/promotions", "get");
      setTopBanner(response.data.data.promotionsMax);
      setTopBannerMobile(response.data.data.promotionsMaxMobile);
      setRightBanner(response.data.data.promotionsMid);
      setLeftBanner(response.data.data.promotionsMin);
    } catch (err) {
    } finally {
      stopLoading();
    }
  };

  const getData = async () => {
    try {
      startLoading();
      const response = await FetchData("places/get-hero-places", "get");
      setData(response?.data?.data || []);
    } catch (err) {
      // console.log(err);
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
    return shuffled;
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
    <div className="flex justify-center items-center flex-col pb-10">
      {/* TOP BANNER */}
      <FloatNavBar />
      <div className="md:w-[99%] hidden md:block">
        <RandomImageSlider images={top} className="md:h-[400px] h-[200px]" />
      </div>

      <div className="flex justify-center w-full md:px-0 px-2 py-5">
        <div className="md:px-4 w-fulll lg:w-[70vw] overflow-hidden">
          <h1 className="font-semibold md:text-2xl tracking-tighter pb-5 w-full flex justify-around items-center">
            Recommendations for you
            <button
              onClick={() => navigate("/explore")}
              className="text-blue-400 text-xs flex justify-center items-center gap-1"
            >
              Explore <FaAngleDoubleRight />
            </button>
          </h1>

          <div className="flex gap-2 flex-col">
            <div className="flex flex-col justify-center items-center gap-5 w-full">
              {featuredPlaces.slice(0, count).map((place) => (
                <motion.div
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -100 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  key={place._id}
                  className="w-full"
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
              ))}
              {count >= data?.length ? (
                <Button
                  label={"Explore More"}
                  onClick={() => navigate("/explore")}
                />
              ) : (
                <Button
                  label={"Show More"}
                  onClick={() => setCount((count) => count + 4)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-96 h-fit rounded-xl lg:block hidden sticky top-24 left-0 justify-center items-center flex-col">
          <div className="w-full flex justify-center items-center pb-4">
            <Button
              label={"Register as facilitator"}
              onClick={() => navigate("/login/facilitator")}
            />
          </div>
          <div className="h-96">
            <RandomImageSlider images={right} />
          </div>
        </div>
      </div>

      <div className="sticky md:fixed md:bottom-10 md:right-10 right-5 bottom-5 md:w-fit w-full flex justify-end items-end px-10">
        <button
          onClick={() => navigate("/live-telecasts")}
          className="flex justify-center items-center flex-col gap-2 bg-[#FFC20E] md:bg-neutral-200 rounded-full md:rounded-md md:py-3 py-5 px-3 shadow-black shadow-2xl cursor-pointer hover:scale-105 duration-300 ease-in-out"
        >
          <img src={logo} className="w-14 h-14 md:block hidden" />
          <h1 className="md:text-base text-xs flex justify-center items-center flex-col md:flex-row md:gap-1">
            <span className="flex justify-center items-center md:flex-row-reverse ">
              Live <TbLivePhotoFilled className="text-red-600" />
            </span>
            Connect
          </h1>
        </button>
      </div>
    </div>
  );
};

export default LoadingUI(Hero);
