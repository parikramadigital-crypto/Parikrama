import React, { useEffect, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import HotelCard from "../../components/ui/HotelCard";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { useDebounce } from "../../utils/Utility-functions";
import { VscSettings } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import { FlightBusForm } from "../../components/ui/FlightEnquiryForm";

// new imports
import { FaBusSimple, FaHotel } from "react-icons/fa6";
import { MdOutlineFlight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const HotelListing = ({ startLoading, stopLoading }) => {
  // const [hotels, setHotels] = useState([]);
  // const [search, setSearch] = useState("");
  // const [filteredHotels, setFilteredHotels] = useState([]);
  const [error, setError] = useState("");
  // const [isOpen, setIsOpen] = useState(false);

  // const loadHotels = async () => {
  //   try {
  //     startLoading();
  //     const response = await FetchData("hotels", "get");
  //     setHotels(response?.data?.data || []);
  //     setFilteredHotels(response?.data?.data || []);
  //   } catch (err) {
  //     setError("Unable to load hotels. Please try again.");
  //   } finally {
  //     stopLoading();
  //   }
  // };

  // const handleSearch = useDebounce(async (value) => {
  //   if (!value.trim()) {
  //     setFilteredHotels(hotels);
  //     return;
  //   }

  //   try {
  //     const response = await FetchData("hotels/search", "get", { q: value });
  //     setFilteredHotels(response?.data?.data || []);
  //   } catch (err) {
  //     setError("Search failed. Please try again.");
  //   }
  // }, 400);

  // const onSearchChange = (event) => {
  //   const value = event.target.value;
  //   setSearch(value);
  //   handleSearch(value);
  // };

  // useEffect(() => {
  //   loadHotels();
  // }, []);

  const navigate = useNavigate();
  const buttons = [
    {
      label: "Buses",
      icon: <FaBusSimple className="text-base md:text-5xl" />,
      description: "Find and book bus tickets",
      color: "text-purple-700 group-hover:rotate-2",
    },
    {
      label: "Flights",
      icon: <MdOutlineFlight className="text-base md:text-5xl" />,
      description: "Compare and book best flights",
      color: "text-blue-700 group-hover:rotate-45",
      url: `/flights-busses/${true}`,
    },
    {
      label: "Hotels",
      icon: <FaHotel className="text-base md:text-5xl" />,
      description: "Explore and book comfortable stays",
      color: "text-red-600 group-hover:rotate-1",
      url: "/hotels",
    },
  ];

  return (
    <div className=" px-4 md:py-10">
      {/* <div className="space-y-3 mb-2 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Discover hotels, resorts and stay options
        </h1>
        <p className="text-gray-600 max-w-3xl hidden md:block">
          Browse verified hotel listings with pricing, amenities, ratings and
          instant booking links.
        </p>
        <div className="flex justify-center items-center gap-2 md:gap-10">
          <div className="rounded-xl">
            <button
              className={"bg-gray-300 px-2 py-2 w-fit rounded-full"}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex justify-between items-center">
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VscSettings className="w-6 h-6" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -100 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{
                    type: "spring",
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-black/80 z-50"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr,240px] gap-6 mb-10">
                    <Button label={"Close"} onClick={() => setIsOpen(false)} />
                    <div className="space-y-3">
                      <div className="rounded-3xl bg-[#FFF4D3] p-5">
                        <h2 className="text-lg font-semibold">
                          Popular filters
                        </h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {[
                            "Hotel",
                            "Resort",
                            "Homestay",
                            "Villa",
                            "Boutique",
                          ].map((type) => (
                            <span
                              key={type}
                              className="text-xs inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white text-gray-700"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-white p-5 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-3">
                          Top features
                        </h2>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>Verified hotels</li>
                          <li>Flexible cancellation</li>
                          <li>Free Wi-Fi listings</li>
                          <li>Best price available</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <InputBox
            LabelName="Search hotels"
            Name="hotelSearch"
            Value={search}
            onChange={onSearchChange}
            Placeholder="Search by city, hotel name or amenity"
            Required={false}
          />
        </div>
      </div> */}

      {error && <div className="mb-6 text-red-600 font-medium">{error}</div>}

      {/* <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredHotels?.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No hotels found. Try a different search term.
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <Button
          label="Refresh listings"
          onClick={loadHotels}
          className="mx-auto"
        />
      </div> */}
      <h1 className="text-center w-full pb-10 text-3xl uppercase font-medium">
        Thank you for your interest in <br /> booking a hotel
      </h1>
      <div className="flex justify-between items-start w-full gap-5">
        {" "}
        <div className="h-full flex flex-col justify-between items-start gap-16 overflow-hidden relative md:w-1/2 select-none">
          <h1 className="text-xl flex flex-col font-semibold absolute top-0 left-0 p-5 z-40">
            <span className="uppercase py-10">Explore, discover, remember</span>
            <span className="text-4xl ">Parikrama</span> <br /> Welcomes you to
            Travel and Explore places together.
            <span className="w-1/2 py-10 font-light hidden md:block">
              Plan your perfect trip with ease. Book Flights, Busses, Hotels and
              more - all in one place.
            </span>
          </h1>
          <div className="absolute bottom-0 left-0 p-5 z-40 hidden lg:block">
            <h1 className="font-semibold text-xl py-5">
              Book Flight, Bus or Hotels
            </h1>
            {/* <RandomImageSlider images={right} /> */}
            <div className="flex flex-row justify-center items-centers flex-wrap gap-2">
              {buttons.map((b, index) => (
                <button
                  onClick={() => navigate(b.url)}
                  key={index}
                  className={`md:w-44 md:h-48 h-32 w-32 flex flex-col justify-between items-start rounded-xl group hover:bg-neutral-100 bg-white duration-300 ease-in-out hover:shadow-xl py-6 px-3 group`}
                >
                  <span
                    className={`text-base md:text-3xl ${b.color} duration-300 ease-in-out group-hover:scale-110`}
                  >
                    {b.icon}
                  </span>
                  <span className="text-xs md:text-base">{b.label}</span>
                  <span className="text-xs text-left">{b.description}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="w-full top-0 left-0 md:h-[85vh] rounded-xl overflow-hidden opacity-30">
            <img
              className="object-cover h-full w-full"
              src={
                "https://ik.imagekit.io/parikrama/Ever%20Thought%20About%20Traveling%20The%20World_.jpeg"
                // "https://ik.imagekit.io/parikrama/wallpaperflare-cropped%20(1).jpg"
              }
            />
          </div>
        </div>
        <FlightBusForm />
      </div>
    </div>
  );
};

export default LoadingUI(HotelListing);
