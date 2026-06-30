import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";

import LoadingUI from "../../components/LoadingUI";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import CityDarshanCard from "./cityDarshanCard";

import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const CityDarshanFeed = ({ startLoading, stopLoading }) => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadPackages = async () => {
      try {
        startLoading();

        const response = await FetchData(
          "city-darshan/admin/get-all/city-darshan-packages",
          "get",
        );

        setPackages(response.data.data || []);
      } catch (err) {
        alert(parseErrorMessage(err?.response?.data || ""));
      } finally {
        stopLoading();
      }
    };

    loadPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return packages;

    return packages.filter((pkg) => {
      return (
        pkg.name?.toLowerCase().includes(keyword) ||
        pkg.city?.name?.toLowerCase().includes(keyword) ||
        pkg.state?.name?.toLowerCase().includes(keyword)
      );
    });
  }, [packages, search]);

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-7xl mx-auto px-5 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-10"
        >
          <div>
            <h1 className="text-4xl font-bold">City Darshan</h1>

            <p className="text-neutral-500 mt-2">
              Explore the best one-day city experiences.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto justify-center items-center ">
            <div className="relative w-full md:w-96">
              <InputBox
                Name="search"
                Placeholder="Search City Darshan..."
                Value={search}
                onChange={(e) => setSearch(e.target.value)}
                Required={false}
              />

              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>

            <Button
              normal={false}
              className="flex items-center justify-center gap-2"
              onClick={() =>
                alert("This function is currently under maintenance")
              }
              label={
                <>
                  <FaFilter />
                  Filters
                </>
              }
            />
          </div>
        </motion.div>
        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow">
            <h2 className="text-2xl font-bold">No Packages Found</h2>

            <p className="text-neutral-500 mt-2">
              Try changing your search keywords.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredPackages.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <CityDarshanCard cityDarshan={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoadingUI(CityDarshanFeed);
