// EventsManager.jsx

import React, { useState } from "react";
import { MdEvent, MdDelete } from "react-icons/md";
import Button from "../../components/Button";
import InputBox from "../../components/InputBox";
import { FetchData } from "../../utils/FetchFromApi";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const EventsManager = ({ club, setClub }) => {
  const [popup, setPopup] = useState(false);

  const [form, setForm] = useState({
    title: "",
    validFrom: "",
    validUpto: "",
    description: "",
  });

  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      const response = await FetchData(
        `clubs/club/${club._id}/event`,
        "post",
        form,
      );

      setClub({
        ...club,
        events: response.data.data,
      });

      setPopup(false);

      setForm({
        title: "",
        validFrom: "",
        validUpto: "",
        description: "",
      });
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    }
  };

  const removeEvent = async (eventId) => {
    try {
      await FetchData(`clubs/club/${club._id}/event/${eventId}`, "delete");

      setClub({
        ...club,
        events: club.events.filter((event) => event._id !== eventId),
      });
    } catch (err) {
      alert(parseErrorMessage(err.response.data));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>

          <p className="text-sm text-gray-500">Manage your club events</p>
        </div>

        <Button label={"Add Event"} onClick={() => setPopup(true)} />
      </div>

      {/* EVENTS */}
      <div className="mt-6 space-y-4 max-h-[450px] overflow-y-auto">
        {club?.events?.length > 0 ? (
          club?.events?.map((event) => (
            <div key={event._id} className="border rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{event.title}</h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(event.validFrom).toLocaleDateString()} -{" "}
                    {new Date(event.validUpto).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => removeEvent(event._id)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  <MdDelete size={22} />
                </button>
              </div>

              <p className="text-gray-700 mt-3">{event.description}</p>
            </div>
          ))
        ) : (
          <div className="h-40 flex justify-center items-center border rounded-2xl">
            <div className="text-center">
              <MdEvent className="text-5xl mx-auto text-[#FFC20D]" />

              <p className="mt-3 text-gray-500">No Events Added Yet</p>
            </div>
          </div>
        )}
      </div>

      {/* POPUP */}
      {popup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5">
          <form
            onSubmit={handleAddEvent}
            className="bg-white rounded-3xl p-6 w-full max-w-2xl"
          >
            <h1 className="text-2xl font-bold mb-4">Add Event</h1>

            <InputBox
              LabelName="Event Title"
              Placeholder="Enter event title"
              Value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

            <div className="grid md:grid-cols-2 gap-4">
              <InputBox
                LabelName="Valid From"
                Type="date"
                Value={form.validFrom}
                onChange={(e) =>
                  setForm({
                    ...form,
                    validFrom: e.target.value,
                  })
                }
              />

              <InputBox
                LabelName="Valid Upto"
                Type="date"
                Value={form.validUpto}
                onChange={(e) =>
                  setForm({
                    ...form,
                    validUpto: e.target.value,
                  })
                }
              />
            </div>

            <div className="py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description*
              </label>

              <textarea
                required
                rows={5}
                placeholder="Enter event description"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex gap-4 mt-5">
              <Button type="submit" label={"Create Event"} />

              <Button
                type="button"
                label={"Cancel"}
                normal={false}
                onClick={() => setPopup(false)}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventsManager;
