import React, { useEffect, useMemo, useState } from "react";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { Link } from "react-router-dom";
import { truncateString } from "../../utils/Utility-functions";
import { motion } from "framer-motion";

import {
  FaFire,
  FaLandmark,
  FaPlaceOfWorship,
  FaArrowRight,
  FaStar,
  FaCompass,
  FaHeart,
  FaArrowDown,
} from "react-icons/fa";

const Explore = ({ startLoading, stopLoading, userProfile = false }) => {
  const [popularData, setPopularData] = useState([]);
  const [enrichedPlaces, setEnrichedPlaces] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        startLoading();

        const response = await FetchData("places/explore/places", "get");

        setPopularData(response?.data?.data?.places || []);
        setEnrichedPlaces(response?.data?.data?.enrichedPlaces || []);
      } catch (err) {
      } finally {
        stopLoading();
      }
    };

    getData();
  }, []);

  const { trendingPlaces, popularPlaces } = useMemo(() => {
    return {
      trendingPlaces: enrichedPlaces.filter(
        (p) => p?.popularity?.label === "Trending",
      ),

      popularPlaces: enrichedPlaces.filter(
        (p) => p?.popularity?.label === "Popular",
      ),
    };
  }, [enrichedPlaces]);

  const { templePlaces, heritagePlaces } = useMemo(() => {
    return {
      templePlaces: enrichedPlaces.filter((p) =>
        p?.category?.toLowerCase().includes("temple"),
      ),

      heritagePlaces: enrichedPlaces.filter((p) =>
        p?.category?.toLowerCase().includes("landmarks"),
      ),
    };
  }, [enrichedPlaces]);

  const sections = [
    {
      title: "Most Rated Places",
      icon: <FaStar />,
      data: popularData,
      subtitle: "Top-rated places loved by travelers.",
    },

    {
      title: "Temples",
      icon: <FaPlaceOfWorship />,
      data: templePlaces,
      subtitle: "Sacred spiritual destinations across India.",
    },

    {
      title: "Heritages",
      icon: <FaLandmark />,
      data: heritagePlaces,
      subtitle: "Historic landmarks with rich culture.",
    },

    {
      title: "Trending Places",
      icon: <FaFire />,
      data: trendingPlaces,
      subtitle: "Currently popular destinations.",
    },

    {
      title: "Popular Places",
      icon: <FaHeart />,
      data: popularPlaces,
      subtitle: "Most visited and loved places.",
    },
  ];

  const SectionCard = ({ title, subtitle, data, icon, minLimit = 4 }) => {
    const [count, setCount] = useState(minLimit);

    if (!data?.length) return null;

    return (
      <section className="w-full py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid lg:grid-cols-[280px_1fr]">
              {/* LEFT INFO PANEL */}
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between bg-[#fffdf5]">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#FFC20D] flex items-center justify-center text-black text-xl shadow-md">
                    {icon}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black mt-6">
                    {title}
                  </h2>

                  <p className="text-gray-600 mt-4 leading-relaxed text-sm md:text-base">
                    {subtitle}
                  </p>
                </div>

                <button
                  onClick={() => setCount((prev) => prev + 4)}
                  className="mt-8 flex items-center gap-2 border border-[#FFC20D] hover:bg-[#FFC20D] transition-all duration-300 rounded-xl px-5 py-3 font-semibold w-fit"
                >
                  View More
                  <FaArrowRight />
                </button>
              </div>

              {/* RIGHT CARDS */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {data?.slice(0, count).map((place, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                      }}
                      viewport={{ once: true }}
                      key={place?._id}
                    >
                      <Link
                        to={`/current/place/${place?._id}`}
                        className="group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-[#FFC20D] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl block"
                      >
                        {/* IMAGE */}
                        <div className="relative overflow-hidden h-56">
                          {place?.images?.[0]?.url ? (
                            <img
                              src={place?.images?.[0]?.url}
                              alt={place?.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              No Image
                            </div>
                          )}

                          {/* RATING */}
                          {/* <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <FaStar className="text-[#FFC20D]" />
                            {place?.ratings?.average || "4.8"}
                          </div> */}
                        </div>

                        {/* CONTENT */}
                        <div className="p-5">
                          <h3 className="font-bold text-lg leading-snug">
                            {truncateString(place?.name, 30)}
                          </h3>

                          <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                            <FaCompass className="text-[#FFC20D]" />
                            <span>{place?.address?.city?.name || "India"}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#FFC20D]/20 blur-3xl rounded-full" />

        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#FFC20D]/10 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-gray-100"
          >
            <div className="grid lg:grid-cols-2 items-center">
              {/* LEFT */}
              <div className="p-8 md:p-14">
                <div className="inline-flex items-center gap-3 bg-[#FFC20D]/20 px-5 py-2 rounded-full mb-8">
                  <div className="w-2 h-2 bg-[#FFC20D] rounded-full animate-pulse" />

                  <span className="font-semibold text-sm">
                    Explore Incredible Destinations
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black leading-tight">
                  Discover The
                  <span className="text-[#FFC20D]"> Best </span>
                  Places Around You
                </h1>

                <p className="text-gray-600 mt-6 text-lg leading-relaxed max-w-xl">
                  Explore temples, heritage sites, trending destinations and
                  beautiful places curated for your next journey.
                </p>

                <button className="mt-8 bg-[#FFC20D] hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg">
                  Explore Now
                  <FaArrowDown />
                </button>
              </div>

              {/* RIGHT IMAGE */}
              <div className="h-[300px] md:h-[500px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da"
                  alt="travel"
                  className="w-full h-full object-cover rounded-l-xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTIONS */}
      <div className="pb-20">
        <SectionCard
          title={sections[0].title}
          icon={sections[0].icon}
          subtitle={sections[0].subtitle}
          data={sections[0].data}
          minLimit={4}
        />

        {!userProfile && (
          <>
            <SectionCard
              title={sections[1].title}
              icon={sections[1].icon}
              subtitle={sections[1].subtitle}
              data={sections[1].data}
              minLimit={4}
            />

            <SectionCard
              title={sections[2].title}
              icon={sections[2].icon}
              subtitle={sections[2].subtitle}
              data={sections[2].data}
              minLimit={4}
            />

            <SectionCard
              title={sections[3].title}
              icon={sections[3].icon}
              subtitle={sections[3].subtitle}
              data={sections[3].data}
              minLimit={4}
            />

            <SectionCard
              title={sections[4].title}
              icon={sections[4].icon}
              subtitle={sections[4].subtitle}
              data={sections[4].data}
              minLimit={4}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingUI(Explore);
