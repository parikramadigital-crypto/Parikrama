import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import LoadingUI from "../../components/LoadingUI";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiArrowLongDown } from "react-icons/hi2";
import { guestEventEnquiryInputs } from "../../constants/Constants";
import { formatDateString } from "../../utils/mongoDB_DateTime";

const EventFeed = ({ startLoading, stopLoading }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const getAllEvents = async () => {
    try {
      startLoading();
      const response = await FetchData("clubs/club/get-all/events", "get");
      setData(response.data.data);
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  const EventCard = ({ event }) => {
    const clubId = event._id;
    const eventId = event.eventId;
    const formRef = useRef();
    const [popup, setPopup] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault(e);
      try {
        startLoading();
        const formData = new FormData(formRef.current);
        const response = await FetchData(
          `clubs/club-guest/${clubId}/events/${eventId}/join`,
          "post",
          formData,
        );
        alert(response.data.message);
        formRef.current.reset();
        setPopup(false);
        getAllEvents();
        // window.location.reload();
      } catch (err) {
        alert(parseErrorMessage(err.response.data));
        getAllEvents();
      } finally {
        stopLoading();
      }
    };

    return (
      <div className="w-full rounded-3xl overflow-hidden bg-white shadow-md border border-gray-100">
        {/* Club Banner / Logo */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={event.clubImage.url}
            alt={event.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-xl md:text-2xl font-bold">{event.title}</h2>

            <p className="text-sm opacity-90">{event.clubName}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Description */}
          <p className="text-sm md:text-base text-gray-600 line-clamp-3">
            {event.description}
          </p>

          {/* Event Info */}
          <div className="flex justify-start items-center gap-3">
            {/* Date */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <div className="p-2 rounded-xl bg-black text-white">
                <FaCalendarAlt size={14} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Event Date</p>

                <p className="text-sm font-semibold text-gray-800">
                  {formatDateString(event.validFrom)}
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <div className="p-2 rounded-xl bg-black text-white">
                <FaUsers size={14} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Participants</p>

                <p className="text-sm font-semibold text-gray-800">
                  {event.totalParticipants} Joined
                </p>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
            <div>
              <p className="text-xs text-gray-500">Valid Till (DDMMYY)</p>

              <p className="text-sm font-semibold text-red-500">
                {/* {new Date(event.validUpto).toLocaleDateString()} */}
                {formatDateString(event.validUpto)}
              </p>
            </div>

            <button
              onClick={() => setPopup(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-black text-white text-sm font-medium hover:scale-105 transition-all duration-200"
            >
              Join Event
            </button>
          </div>
        </div>
        <AnimatePresence>
          {popup && (
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-black/70 z-50"
            >
              <div className="bg-white w-[90vw] md:w-[80vw] p-2 md:p-10 rounded-xl">
                <h1 className="text-xl font-semibold">
                  Enter your details for joining participating in this Event.
                </h1>
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div>
                    {guestEventEnquiryInputs.map((i, index) => (
                      <InputBox
                        key={index}
                        Placeholder={i.placeHolder}
                        Name={i.name}
                        LabelName={i.label}
                        Type={i.type}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex justify-center items-center gap-5">
                      <Button
                        label={"Cancel"}
                        onClick={() => {
                          setPopup(false);
                          formRef.current.reset();
                        }}
                      />
                      <Button
                        label={"View Club"}
                        normal={false}
                        onClick={() => navigate(`/clubs/${event._id}`)}
                      />
                    </div>
                    <Button type={"submit"} label={"Submit"} />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  return (
    <div>
      <div className="space-y-3 m-5">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex justify-start items-center gap-3">
          Discover Events <HiArrowLongDown />
        </h1>
        <p className="text-gray-600 max-w-3xl">
          Browse verified event listings with membership options, events etc.
        </p>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.map((event) => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </div>
    </div>
  );
};

export default LoadingUI(EventFeed);
