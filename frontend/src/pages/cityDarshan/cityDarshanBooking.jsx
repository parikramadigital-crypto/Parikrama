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
  const { id } = useParams(); // city darshan package id
  const navigate = useNavigate();
  const formRef = useRef();

  const userState = useSelector((state) => state.auth);
  const user = userState?.user || userState;
  const userId = user?._id;

  const [tour, setTour] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     FETCH CITY DARSHAN PACKAGE
  ========================= */
  useEffect(() => {
    const load = async () => {
      try {
        startLoading();

        const res = await FetchData(
          `city-darshan/admin/get/city-darshan-packages/${id}`,
          "get",
        );

        const data = res?.data?.data;
        setTour(data);

        if (data?.vehicles?.length > 0) {
          setSelectedVehicle(data.vehicles[0]);
        }
      } catch (e) {
        alert(parseErrorMessage(e?.response?.data || e?.message || ""));
      } finally {
        stopLoading();
      }
    };

    if (id) load();
  }, [id]);

  /* =========================
     COMPUTED TOTAL
     (UI only — backend will still calculate actual amount)
  ========================= */
  const total = useMemo(() => {
    if (!selectedVehicle?.price) return 0;
    return Number(selectedVehicle.price);
  }, [selectedVehicle]);

  /* =========================
     LOAD RAZORPAY CHECKOUT
  ========================= */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  /* =========================
     OPEN RAZORPAY CHECKOUT
  ========================= */
  const openRazorpayCheckout = async ({ booking, transaction, razorpay }) => {
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      throw new Error(
        "Razorpay SDK failed to load. Please check your internet connection.",
      );
    }

    const options = {
      key: razorpay.key,
      amount: razorpay.amount, // in paise
      currency: razorpay.currency || "INR",
      name: razorpay.name || "Parikrama",
      description: razorpay.description || "City Darshan Booking",
      order_id: razorpay.orderId,

      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.contactNumber || "",
      },

      notes: {
        bookingId: booking?._id,
        transactionId: transaction?._id,
        packageId: id,
      },

      theme: {
        color: "#FFC20E",
      },

      handler: async function (response) {
        try {
          startLoading();

          const verifyRes = await FetchData("payment/verify", "post", {
            transactionId: transaction._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert(
            verifyRes?.data?.message ||
              "Payment successful and booking confirmed",
          );

          formRef.current?.reset();
          navigate("/user/bookings");
        } catch (e) {
          alert(
            parseErrorMessage(e?.response?.data || e?.message || "") ||
              "Payment verification failed",
          );
        } finally {
          stopLoading();
          setSubmitting(false);
        }
      },

      modal: {
        ondismiss: function () {
          setSubmitting(false);
          stopLoading();
          alert(
            "Payment window closed. Your booking is created in pending state. You can retry payment later from your bookings section.",
          );
        },
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.on("payment.failed", function (response) {
      setSubmitting(false);
      stopLoading();

      const msg =
        response?.error?.description ||
        response?.error?.reason ||
        "Payment failed";
      alert(msg);
    });

    paymentObject.open();
  };

  /* =========================
     HANDLE BOOKING
     FLOW:
     1. start booking
     2. create payment
     3. open razorpay
     4. verify payment
  ========================= */
  const handleBooking = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!userId) {
      alert("Please login first to continue booking.");
      navigate("/login");
      return;
    }

    if (!selectedVehicle?.vehicleType) {
      alert("Please select a vehicle");
      return;
    }

    try {
      setSubmitting(true);
      startLoading();

      const formData = new FormData(formRef.current);

      const travelDate = formData.get("travelDate");
      const pickupTime = formData.get("pickupTime");
      const pickupLocation = formData.get("pickupLocation");
      const specialInstructions =
        formData.get("specialInstructions")?.trim() || "";

      if (!travelDate || !pickupTime || !pickupLocation) {
        throw new Error("Please fill all required booking fields.");
      }

      /* -------------------------
         STEP 1: START BOOKING
      ------------------------- */
      const bookingRes = await FetchData(
        // `city-darshan/booking/start/${userId}/${id}`,
        `city-darshan/admin/booking/start/${userId}/${id}`,
        "post",
        {
          travelDate,
          pickupTime,
          pickupLocation,
          specialInstructions,
          adults: Number(adults),
          children: Number(children),
          vehicleType: selectedVehicle.vehicleType,
        },
      );

      const booking = bookingRes?.data?.data;

      if (!booking?._id) {
        throw new Error("Unable to create booking. Please try again.");
      }

      /* -------------------------
         STEP 2: CREATE PAYMENT
         moduleId MUST BE BOOKING ID
      ------------------------- */
      const paymentRes = await FetchData("payment/create", "post", {
        module: "CityDarshan",
        moduleId: booking._id,
        user: userId,
        amount: booking.totalAmount,
        currency: "INR",
        metadata: {
          bookingType: "CityDarshan",
          cityDarshanId: id,
          cityDarshanBookingId: booking._id,
        },
      });

      const paymentData = paymentRes?.data?.data;
      const transaction = paymentData?.transaction;
      const razorpay = paymentData?.razorpay;

      if (!transaction?._id || !razorpay?.orderId) {
        throw new Error("Unable to initialize payment. Please try again.");
      }

      /* -------------------------
         STEP 3: OPEN RAZORPAY
      ------------------------- */
      await openRazorpayCheckout({
        booking,
        transaction,
        razorpay,
      });
    } catch (e) {
      setSubmitting(false);
      stopLoading();

      const fallbackMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong while creating booking.";

      if (e?.response?.data) {
        alert(parseErrorMessage(e.response.data) || fallbackMessage);
      } else {
        alert(fallbackMessage);
      }
    }
  };

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* =========================
            LEFT : BOOKING FORM
        ========================= */}
        <form
          ref={formRef}
          onSubmit={handleBooking}
          className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold mb-8">Book City Darshan</h1>

          <div className="grid md:grid-cols-2 gap-5">
            <InputBox
              LabelName="Travel Date"
              Name="travelDate"
              Type="date"
              Min={new Date().toISOString().split("T")[0]}
            />

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
            {tour?.vehicles?.map((vehicle) => {
              const isActive =
                selectedVehicle?.vehicleType === vehicle.vehicleType;

              return (
                <button
                  key={vehicle.vehicleType}
                  type="button"
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`border rounded-2xl p-5 text-left transition ${
                    isActive
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
                    ₹{Number(vehicle.price || 0).toLocaleString()}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <InputBox
              LabelName="Adults"
              Name="dummyAdults"
              Type="number"
              Value={adults}
              Min={1}
              onChange={(e) => setAdults(e.target.value)}
            />

            <InputBox
              LabelName="Children (+5 years)"
              Name="dummyChildren"
              Type="number"
              Min={0}
              Required={false}
              Value={children}
              onChange={(e) => setChildren(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            Disabled={submitting}
            className="w-full mt-10"
            label={submitting ? "Processing..." : "Confirm Booking & Pay"}
          />
        </form>

        {/* =========================
            RIGHT : BOOKING SUMMARY
        ========================= */}
        <div className="bg-white rounded-3xl shadow-xl p-8 h-fit sticky top-24">
          <h2 className="text-2xl font-bold">{tour?.name}</h2>

          <div className="space-y-5 mt-8">
            <div className="flex gap-3 items-center">
              <FaMapMarkerAlt className="text-[#FFC20E]" />
              <span>
                {tour?.city?.name}, {tour?.state?.name}
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <FaCalendarAlt className="text-[#FFC20E]" />
              <span>{tour?.totalHours} Hours Tour</span>
            </div>

            <div className="flex gap-3 items-center">
              <FaUsers className="text-[#FFC20E]" />
              <span>{Number(adults) + Number(children)} Travellers</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg">
              <span>Vehicle</span>
              <strong>{selectedVehicle?.vehicleType || "--"}</strong>
            </div>

            <div className="flex justify-between text-lg">
              <span>Total Amount</span>
              <strong className="text-[#FFC20E] text-2xl">
                ₹{Number(total || 0).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CityDarshanBooking);
