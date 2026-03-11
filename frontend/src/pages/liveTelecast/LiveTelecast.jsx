import React, { useEffect, useState } from "react";
import LoadingUI from "../../components/LoadingUI";
import { FetchData } from "../../utils/FetchFromApi";
import { Link } from "react-router-dom";
import { truncateString } from "../../utils/Utility-functions";
import { TbLivePhotoFilled } from "react-icons/tb";
import Button from "../../components/Button";

const Card = ({
  name,
  city,
  state,
  category,
  description,
  lat,
  long,
  placeId,
  image,
  telecastLink,
}) => {
  const openMaps = () => {
    // const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
    const url = telecastLink;
    window.open(url, "_blank");
  };
  return (
    <Link
      to={`/current/place/${placeId}`}
      className="bg-neutral-100 w-full md:px-10 px-1 py-2 flex justify-between items-center rounded-xl hover:shadow-xl duration-300 ease-in-out"
    >
      <div className="h-full flex flex-col items-start gap-2">
        <h1 className="md:text-xl text-base md:tracking-wide uppercase">
          {name}
        </h1>
        <h2 className="text-xs">
          <span>{city}</span>, <span>{state}</span>
        </h2>
        <h1 className="inline-block w-fit text-xs px-2 py-1 rounded-full bg-[#FFC20E]">
          {category}
        </h1>
        <h1 className="text-xs hidden md:block">
          {truncateString(description, 50)}
        </h1>
      </div>
      <div className="flex justify-center items-center flex-col gap-3">
        <div className="h-28 w-32 bg-neutral-200 flex justify-center items-center rounded-xl overflow-hidden">
          <img
            src={image}
            alt="No image found"
            className="object-cover object-center rounded-xl w-full h-full"
          />
        </div>
        <Button
          onClick={openMaps}
          label={
            <h1 className="flex justify-center items-center gap-5">
              Live Telecast
              <span>
                <TbLivePhotoFilled className="text-red-700" />
              </span>
            </h1>
          }
        />
        {/* <button
          onClick={openMaps}
          className="group flex justify-center items-center gap-2 bg-transparent rounded-2xl drop-shadow-xl hover:drop-shadow-2xl"
        >
          <span>Live Telecast</span>

          <BiSolidNavigation className="transition duration-150 ease-in-out text-neutral-500 group-hover:text-[#FFC20E] group-hover:rotate-45" />
        </button> */}
      </div>
    </Link>
  );
};

const LiveTelecast = ({ stopLoading, startLoading }) => {
  const [data, setData] = useState([]);
  const banner = async () => {
    try {
      startLoading();
      const response = await FetchData("promotions/get/all/promotions", "get");
      setData(response.data.data.telecastPlace);
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    banner();
  }, []);

  return (
    <div className="flex justify-start items-center flex-col w-full py-10">
      <h1 className="text-2xl font-semibold ">Live Telecast</h1>
      <div className="flex justify-center items-center flex-col gap-5 w-[70vw]">
        {data ? (
          data?.map((place) => (
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
              telecastLink={place?.telecastLink}
            />
          ))
        ) : (
          <h1>No data currently available for live telecast</h1>
        )}
      </div>
    </div>
  );
};

export default LoadingUI(LiveTelecast);
