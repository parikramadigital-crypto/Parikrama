import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import RandomImageSlider from "../../components/ui/RandomImageSlider";
import Button from "../../components/Button";
import { BiMap, BiSolidStar, BiTimeFive } from "react-icons/bi";
import { FaPhoneAlt, FaRegMoneyBillAlt, FaWifi } from "react-icons/fa";

const CurrentHotel = ({ startLoading, stopLoading }) => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState("");

  const loadHotel = async () => {
    try {
      startLoading();
      const response = await FetchData(`hotels/${hotelId}`, "get");
      setHotel(response?.data?.data || null);
    } catch (err) {
      setError("Unable to load hotel details. Please try again.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    loadHotel();
  }, [hotelId]);

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        {error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="text-gray-500">Loading hotel details...</div>
        )}
      </div>
    );
  }

  const imageList =
    hotel.images?.gallery?.length > 0
      ? hotel.images.gallery.map((item) => item.url)
      : hotel.images?.cover?.url
        ? [hotel.images.cover.url]
        : [];

  const currentRoom = hotel.rooms?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
            <RandomImageSlider images={imageList} />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <BiMap />
                {hotel.address?.city?.name}, {hotel.address?.state?.name}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-3">
                {hotel.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF4D3] px-4 py-2">
                  <BiSolidStar /> {hotel?.starRating || 0} / 5 (
                  {hotel.ratings?.count || 0} reviews)
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F3FF] px-4 py-2">
                  <FaWifi />{" "}
                  {hotel.amenities?.includes("Free WiFi")
                    ? "Free Wi-Fi"
                    : "Wi-Fi available"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F0FDF4] px-4 py-2">
                  {hotel.propertyType}
                </span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {hotel.description ||
                hotel.shortDescription ||
                "No description available."}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <h2 className="text-lg font-semibold mb-3">Contact</h2>
                <p className="text-sm text-gray-700">
                  Phone: {hotel.contact?.phone || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  Email: {hotel.contact?.email || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  Website:{" "}
                  <a
                    className="text-[#1F6FEB] underline"
                    href="https://parikramaglobal.com/hotels"
                    target="blank"
                  >
                    Visit Website
                  </a>
                </p>
                {/* <p className="text-sm text-gray-700">
                  Booking URL:{" "}
                  {hotel.contact?.bookingUrl ? (
                    <a
                      href={hotel.contact.bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1F6FEB] underline"
                    >
                      Visit booking page
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p> */}
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <h2 className="text-lg font-semibold mb-3">Price range</h2>
                <div className="text-gray-900 text-2xl font-semibold">
                  ₹{hotel.pricing?.minPrice || "NA"} - ₹
                  {hotel.pricing?.maxPrice || "NA"}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Average price per night
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    label="Book now"
                    onClick={() => {
                      if (hotel.contact?.bookingUrl) {
                        window.open(hotel.contact.bookingUrl, "_blank");
                      }
                    }}
                    className="w-full"
                  />
                  <Button
                    label="View room details"
                    onClick={() => {
                      const details = hotel.rooms
                        ?.map((room) => `${room.roomType}: ₹${room.price}`)
                        .join(" \n");
                      alert(details || "No room data available.");
                    }}
                    className="w-full bg-gray-900 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick facts</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between gap-3">
                <span>Property type</span>
                <span>{hotel.propertyType || "N/A"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Star rating</span>
                <span>{hotel.starRating || "N/A"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Rooms available</span>
                <span>{hotel.availableRooms || "Available"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Popular facility</span>
                <span>{hotel.featuredFacilities?.[0] || "Wifi"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Top amenities</h2>
            <div className="grid gap-2 text-sm text-gray-700">
              {hotel.amenities?.length > 0 ? (
                hotel.amenities.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[#F8F6EE] px-3 py-2"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p>No amenities listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Hotel policies</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between gap-3">
              <span>Check-in</span>
              <span>{hotel.policies?.checkInTime || "N/A"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Check-out</span>
              <span>{hotel.policies?.checkOutTime || "N/A"}</span>
            </div>
            <div className="flex justify-between gap-3 capitalize">
              <span>Cancellation</span>
              <span>{hotel.policies?.cancellationPolicy || "Standard"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Pets allowed</span>
              <span>{hotel.policies?.petsAllowed ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Smoking</span>
              <span>{hotel.policies?.smokingAllowed ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Guest reviews</h2>
          {hotel.reviews?.length > 0 ? (
            hotel.reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900">
                    {review.title || "Guest review"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {review.rating}/5
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  By {review.user?.name || "Anonymous"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CurrentHotel);
