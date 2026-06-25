import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import InputBox from "../../components/InputBox";
import LoadingUI from "../../components/LoadingUI";
import { motion } from "framer-motion";
import { PlaceCard } from "../../components/ui/PlaceCard";
import { HiArrowLongDown } from "react-icons/hi2";

const KidsPlace = ({ startLoading, stopLoading }) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(8);

  const getKidsPlace = async () => {
    try {
      startLoading();
      const response = await FetchData("places/kids/explore/places", "get");

      setData(response.data.data || []);
    } catch (err) {

    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    getKidsPlace();
  }, []);

  return (
    <div className="flex flex-col justify-center items-start md:px-20 px-5 pb-10">
      <div className="space-y-3 m-5 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex justify-start items-center gap-3">
          Discover Places for Kids <HiArrowLongDown />
        </h1>
      </div>
      <div className="w-full md:w-[70vw] flex flex-col gap-5">
        {data?.slice(0, count).map((place) => (
          <motion.div
            key={place?._id}
            className="w-full"
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.5, ease: "easeInOut" }}
          >
            <PlaceCard key={place._id} place={place} />
          </motion.div>
        ))}
        {count >= data?.length ? (
          <Button
            label={"Show less"}
            onClick={() => setCount(4)}
            className={"w-fit"}
          />
        ) : (
          <Button
            label={"Show More"}
            className={"w-fit"}
            onClick={() => setCount((count) => count + 4)}
          />
        )}
      </div>
    </div>
  );
};

export default LoadingUI(KidsPlace);
