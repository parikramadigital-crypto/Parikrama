import React from "react";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import {
  formatDateString,
  formatDateTimeString,
} from "../../utils/mongoDB_DateTime";
import { IoLocationSharp } from "react-icons/io5";

const CityDarshanBookedCard = ({ booking }) => {
  if (!booking) return;

  return (
    <div className="flex overflow-x-scroll gap-4 p-1 md:p-5 inset-shadow-sm rounded-xl ">
      {booking.map((b, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row justify-start items-start min-w-[80vw] bg-neutral-100 border border-neutral-200 rounded-xl p-4 shadow-2xl"
        >
          <div className="w-full md:w-[40vw] relative">
            <p className="bg-black/70 rounded-xl py-1 px-2 text-white absolute top-5 left-5 z-30 text-xs">
              {b.bookingStatus}
            </p>
            <RandomImageSlider
              images={b?.cityDarshan?.images?.map((i) => i.url)}
            />
          </div>
          <div className="w-full flex flex-col gap-2 justify-start items-start py-2 md:p-4">
            <p className="text-base md:text-xl font-semibold flex justify-end items-end gap-5">
              <span className="border border-[#FFC20E] px-4 py-2 rounded-2xl">
                {b?.cityDarshan?.name}{" "}
              </span>
              <span className="text-sm flex justify-center items-center gap-1">
                <IoLocationSharp className="text-xl text-[#FFC20D]" />
                <span>{b?.cityDarshan?.city?.name}</span>
                <span>,{b?.cityDarshan?.state?.name}</span>
              </span>
            </p>
            <div className="grid md:grid-cols-2 justify-between items-center w-full">
              <p>
                <strong>Total distance covered :</strong>{" "}
                {b?.cityDarshan?.totalDistance}
              </p>
              <p>
                <strong>Total time :</strong> {b?.cityDarshan?.totalHours}
              </p>
            </div>
            <div className="grid md:grid-cols-2 justify-between items-center w-full">
              <p>
                <strong>Number of Adults : </strong>
                {b?.adults}
              </p>
              <p>
                <strong>Number of Children : </strong>
                {b?.children}
              </p>
            </div>
            <div className="grid md:grid-cols-2 justify-between items-center w-full">
              <p>
                <strong>Date for Darshan : </strong>
                {formatDateString(b?.travelDate)}{" "}
                <span className="text-xs">(DDMMYY)</span>
              </p>
              <p>
                <strong>Your Pickup time : </strong>
                {b?.pickupTime}
              </p>
            </div>
            <p>
              <strong>Your Pickup location : </strong>
              {b?.pickupLocation}
            </p>
            <p>
              <strong>Booking amount : </strong>₹
              {b?.totalAmount.toLocaleString()}
            </p>
            <div className="bg-neutral-50 w-full p-2 rounded-xl shadow">
              <strong>Places included :</strong>
              <p className="grid grid-cols-2 lg:grid-cols-3 w-full">
                {b.cityDarshan?.placesToCover.map((p, index) => (
                  <span key={index}>
                    {index + 1}. {p}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CityDarshanBookedCard;
