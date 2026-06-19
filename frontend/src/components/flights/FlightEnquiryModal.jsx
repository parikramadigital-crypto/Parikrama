import { useState } from "react";

const FlightEnquiryModal = ({
  open,
  onClose,
  flight,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    travellers: 1,
  });

  if (!open) return null;

  const submitEnquiry = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/flight-enquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            flightNumber:
              flight.flight.iata,
            airline:
              flight.airline.name,
            departure:
              flight.departure.iata,
            arrival:
              flight.arrival.iata,
          }),
        }
      );

      alert("Enquiry Submitted");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4">
          Flight Enquiry
        </h2>

        <div className="bg-gray-100 p-4 rounded-xl mb-5">
          <p>
            {flight.airline.name}
          </p>

          <p>
            {flight.departure.iata}
            {" → "}
            {flight.arrival.iata}
          </p>

          <p>
            {flight.flight.iata}
          </p>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Name"
            className="w-full border rounded-xl p-3"
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Phone"
            className="w-full border rounded-xl p-3"
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            className="w-full border rounded-xl p-3"
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <input
            type="number"
            min={1}
            placeholder="Travellers"
            className="w-full border rounded-xl p-3"
            onChange={(e) =>
              setFormData({
                ...formData,
                travellers: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border px-5 py-2 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={submitEnquiry}
            className="bg-[#6D213C] text-white px-5 py-2 rounded-xl"
          >
            Submit Enquiry
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightEnquiryModal;