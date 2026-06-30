import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCarSide,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";

import LoadingUI from "../../components/LoadingUI";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";

import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { useSelector } from "react-redux";

const CityDarshanBooking = ({ startLoading, stopLoading }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef();
  const user = useSelector((state) => state.auth);
  const userId = user?.user?._id || user?._id;
  const [tour, setTour] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        startLoading();
        const res = await FetchData(
          `city-darshan/admin/get/city-darshan-packages/${id}`,
          "get",
        );
        const data = res.data.data;
        setTour(data);
        if (data?.vehicles?.length) setSelectedVehicle(data.vehicles[0]);
      } catch (e) {
        alert(parseErrorMessage(e?.response?.data || ""));
      } finally {
        stopLoading();
      }
    };
    load();
  }, [id]);

  const total = useMemo(
    () => (selectedVehicle ? Number(selectedVehicle.price) : 0),
    [selectedVehicle],
  );

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      startLoading();

      const fd = new FormData(formRef.current);
      fd.append("vehicleType", selectedVehicle.vehicleType);
      fd.append("adults", adults);
      fd.append("children", children);

      const res = await FetchData(
        `city-darshan/admin/user-booking/book/${userId}/${id}`,
        "post",
        fd,
      );

      alert(res.data.message);
      navigate("/user/bookings");
    } catch (e) {
      alert(parseErrorMessage(e?.response?.data || ""));
    } finally {
      stopLoading();
    }
  };

  if (!tour)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        <form
          ref={formRef}
          onSubmit={handleBooking}
          className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold mb-8">Book City Darshan</h1>

          <div className="grid md:grid-cols-2 gap-5">
            <InputBox LabelName="Travel Date" Name="travelDate" Type="date" />

            <InputBox LabelName="Pickup Time" Name="pickupTime" Type="time" />
          </div>

          <InputBox
            LabelName="Pickup Location"
            Name="pickupLocation"
            Placeholder="Hotel / Railway Station / Airport"
          />

          <InputBox
            LabelName="Special Instructions"
            Name="specialInstructions"
            Placeholder="Anything we should know?"
            Required={false}
          />

          <h2 className="font-bold text-xl mt-8 mb-5">Select Vehicle</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {tour.vehicles?.map((vehicle) => (
              <button
                key={vehicle.vehicleType}
                type="button"
                onClick={() => setSelectedVehicle(vehicle)}
                className={`border rounded-2xl p-5 text-left transition ${
                  selectedVehicle?.vehicleType === vehicle.vehicleType
                    ? "border-[#FFC20E] bg-yellow-50"
                    : "hover:border-[#FFC20E]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaCarSide className="text-[#FFC20E]" />
                  <span className="font-semibold">{vehicle.vehicleType}</span>
                </div>

                <p className="mt-3">Max {vehicle.maxPersons} Persons</p>

                <p className="font-bold text-xl mt-2">
                  ₹{vehicle.price.toLocaleString()}
                </p>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <InputBox
              LabelName="Adults"
              Name="dummyAdults"
              Type="number"
              Value={adults}
              onChange={(e) => setAdults(e.target.value)}
            />

            <InputBox
              LabelName="Children (+5 years)"
              Name="dummyChildren"
              Type="number"
              Required={false}
              Value={children}
              onChange={(e) => setChildren(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-10"
            label="Confirm Booking"
          />
        </form>

        <div className="bg-white rounded-3xl shadow-xl p-8 h-fit sticky top-24">
          <h2 className="text-2xl font-bold">{tour.name}</h2>

          <div className="space-y-5 mt-8">
            <div className="flex gap-3 items-center">
              <FaMapMarkerAlt className="text-[#FFC20E]" />
              <span>
                {tour.city?.name}, {tour.state?.name}
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <FaCalendarAlt className="text-[#FFC20E]" />
              <span>{tour.totalHours} Hours Tour</span>
            </div>

            <div className="flex gap-3 items-center">
              <FaUsers className="text-[#FFC20E]" />
              <span>{Number(adults) + Number(children)} Travellers</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg">
              <span>Vehicle</span>
              <strong>{selectedVehicle?.vehicleType}</strong>
            </div>

            <div className="flex justify-between text-lg">
              <span>Total Amount</span>
              <strong className="text-[#FFC20E] text-2xl">
                ₹{total.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CityDarshanBooking);
