import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import { PlaceCard, ExpandedPlaceCard } from "../../components/ui/PlaceCard";
import LoadingUI from "../../components/LoadingUI";
import CityPlacesCircle from "../../components/ui/CityPlaceCircle";
import Button from "../../components/Button";
import { motion, AnimatePresence } from "framer-motion";

const CurrentPlace = ({ startLoading, stopLoading }) => {
  const { placeId } = useParams();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const [data, setData] = useState();
  const [facilitator, setFacilitator] = useState([]);
  const [popup, setPopup] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [count, setCount] = useState(4);

  const currentPlace = async () => {
    try {
      startLoading();
      const response = await FetchData(`places/${placeId}`, "get");
      setData(response.data.data.place);
      setFacilitator(response.data.data.facilitators);
    } catch (err) {
      // console.log(err);
    } finally {
      stopLoading();
    }
  };

  const searchRelated = async () => {
    try {
      const query = data?.city?.name;
      const response = await FetchData(
        `places/related-places/${query}`,
        "get",
        // query
      );
      setRecommendations(response.data.data);
      // console.log(response);
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    searchRelated();
  }, [data]);
  useEffect(() => {
    currentPlace();
  }, [user, placeId]);

  return (
    <div className="w-full">
      {/* Top section */}
      <div className="w-full md:px-20 px-2">
        <ExpandedPlaceCard place={data} facilitator={facilitator} />
      </div>

      {/* Content + Sticky Circle */}
      <div className="flex  gap-10 md:px-20 px-5 py-20 ">
        {/* LEFT CONTENT (SCROLLS) */}
        <div className="flex flex-col justify-center items-start gap-6 w-full">
          <div className="w-full overflow-x-hidden flex flex-col gap-2 justify-center items-center md:hidden">
            <h1>This is a itinerary of {data?.city?.name}</h1>
            <CityPlacesCircle
              cityName={data?.city?.name}
              places={recommendations}
            />
          </div>
          {/* <Button
            label={"View itinerary"}
            onClick={() => setPopup(true)}
            className={"block lg:hidden"}
          /> */}
          <h1 className="text-left">
            As you are interested in touring {data?.city?.name}, here are some
            more suggestions
          </h1>

          {recommendations?.slice(0, count).map((place) => (
            <motion.div
              className="w-full"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", duration: 0.5, ease: "easeInOut" }}
            >
              <PlaceCard key={place._id} place={place} />
            </motion.div>
          ))}
          {count >= recommendations?.length ? (
            <Button label={"Show less"} onClick={() => setCount(4)} />
          ) : (
            <Button
              label={"Show More"}
              onClick={() => setCount((count) => count + 4)}
            />
          )}
        </div>

        {/* RIGHT STICKY */}
        <div className="sticky top-20 self-start lg:block hidden w-fit">
          <CityPlacesCircle
            cityLong={data?.city?.location?.coordinates[0]}
            cityLat={data?.city?.location?.coordinates[1]}
            cityName={data?.city?.name}
            places={recommendations}
          />
        </div>
      </div>
      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full bg-white flex justify-center items-end flex-col"
          >
            <div className="flex justify-center items-center gap-5 p-5">
              <Button label={"Close"} onClick={() => setPopup(false)} />
            </div>
            <CityPlacesCircle
              cityLong={data?.city?.location?.coordinates[0]}
              cityLat={data?.city?.location?.coordinates[1]}
              cityName={data?.city?.name}
              places={recommendations}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingUI(CurrentPlace);
