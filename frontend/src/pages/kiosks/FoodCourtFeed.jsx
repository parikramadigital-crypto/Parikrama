import React, { useEffect, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import FoodCard from "../../components/ui/FoodCard";
import LoadingUI from "../../components/LoadingUI";

const FoodCourtFeed = ({ startLoading, stopLoading }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getFoodCourts = async () => {
      try {
        startLoading();
        const response = await FetchData(
          "foodCourt/get/all/food-courts",
          "get",
        );
        setData(response.data.data);
      } catch (err) {
      } finally {
        stopLoading();
      }
    };

    getFoodCourts();
  }, []);

  return (
    <div className="flex flex-col justify-start items-start w-full md:px-10">
      <div className="space-y-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Discover food stores, kiosks, resorts and more
        </h1>
        <p className="text-gray-600 max-w-3xl">
          Browse verified food listings with pricing and ratings
        </p>
      </div>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-center items-center w-full md:px-10">
          <FoodCard f={data} />
        </div>
      ) : (
        "No data available"
      )}
    </div>
  );
};

export default LoadingUI(FoodCourtFeed);
