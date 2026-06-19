import { useState } from "react";
import FlightEnquiryModal from "./FlightEnquiryModal";
import { formatDateTimeString } from "../../utils/mongoDB_DateTime";
import Button from "../Button";

const FlightCard = ({ flight }) => {
  const [open, setOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);

  const departureData = [
    { label: "Actual", value: formatDateTimeString(flight.departure.actual) },
    {
      label: "Actual Runway",
      value: formatDateTimeString(flight.departure.actual_runway),
    },
    { label: "Airport", value: flight.departure.airport },
    {
      label: "Estimated",
      value: formatDateTimeString(flight.departure.estimated),
    },
    {
      label: "Estimated Runway",
      value: formatDateTimeString(flight.departure.estimated_runway),
    },
    { label: "Gate", value: flight.departure.gate },
    { label: "IATA", value: flight.departure.iata },
    { label: "ICAO", value: flight.departure.icao },
    {
      label: "Scheduled",
      value: formatDateTimeString(flight.departure.scheduled),
    },
    { label: "Terminal", value: flight.departure.terminal },
    { label: "Time zone", value: flight.departure.timezone },
  ];

  const arrivalData = [
    { label: "Actual", value: formatDateTimeString(flight.arrival.actual) },
    {
      label: "Actual Runway",
      value: formatDateTimeString(flight.arrival.actual_runway),
    },
    { label: "Airport", value: flight.arrival.airport },
    {
      label: "Estimated",
      value: formatDateTimeString(flight.arrival.estimated),
    },
    {
      label: "Estimated Runway",
      value: formatDateTimeString(flight.arrival.estimated_runway),
    },
    { label: "Gate", value: flight.arrival.gate },
    { label: "IATA", value: flight.arrival.iata },
    { label: "ICAO", value: flight.arrival.icao },
    {
      label: "Scheduled",
      value: formatDateTimeString(flight.arrival.scheduled),
    },
    { label: "Terminal", value: flight.arrival.terminal },
    { label: "Time zone", value: flight.arrival.timezone },
  ];

  const airlineData = [
    { label: "Name", value: flight.airline.name },
    { label: "IATA", value: flight.airline.iata },
    { label: "ICAO", value: flight.airline.icao },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">{flight.airline.name}</h3>

            <p>Flight : {flight.flight.iata}</p>
          </div>

          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full capitalize">
            {flight.flight_status}
          </span>
        </div>

        <div className="grid md:grid-cols-3 mt-5 gap-4">
          <div>
            <p className="text-gray-500">Departure</p>
            <p className="font-semibold">{flight.departure.iata}</p>
            <p>{formatDateTimeString(flight.departure.scheduled)}</p>
          </div>

          <div>
            <p className="text-gray-500">Arrival</p>
            <p className="font-semibold">{flight.arrival.iata}</p>
            <p>{formatDateTimeString(flight.arrival.scheduled)}</p>
          </div>

          <div>
            <p className="text-gray-500">Terminal</p>
            <p>{flight.departure.terminal || "N/A"}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            label={"View details"}
            normal={false}
            onClick={() => setViewDetails(true)}
          />
          <Button label={"Book Now"} onClick={() => setOpen(true)} />
        </div>
        {viewDetails && (
          <div className="md:shadow md:p-1 rounded-xl flex flex-col justify-center items-start gap-4">
            <div className="md:bg-neutral-100 md:p-1 rounded-xl flex flex-col gap-5">
              {/* departure details */}
              <div className="bg-neutral-200 p-3 rounded-xl flex flex-col justify-center items-start gap-5">
                <h1 className="font-semibold text-xl underline-offset-2 underline">
                  Departure Details
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center w-full gap-x-5">
                  {departureData?.map((i, index) => (
                    <p key={index}>
                      <strong>{i.label}</strong>: {i.value}
                    </p>
                  ))}
                </div>
              </div>
              {/* Arrival details */}
              <div className="bg-neutral-200 p-3 rounded-xl flex flex-col justify-center items-start gap-5">
                <h1 className="font-semibold text-xl underline-offset-2 underline">
                  Arrival Details
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center w-full">
                  {arrivalData?.map((i, index) => (
                    <p key={index}>
                      <strong>{i.label}</strong>: {i.value}
                    </p>
                  ))}
                </div>
              </div>
              {/* airline details */}
              <div className="bg-neutral-200 p-3 rounded-xl flex flex-col justify-center items-start gap-5">
                <h1 className="font-semibold text-xl underline-offset-2 underline">
                  Airline Details
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center w-full">
                  {airlineData?.map((i, index) => (
                    <p key={index}>
                      <strong>{i.label}</strong>: {i.value}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <Button label={"Close"} onClick={() => setViewDetails(false)} />
          </div>
        )}
      </div>

      <FlightEnquiryModal
        open={open}
        onClose={() => setOpen(false)}
        flight={flight}
      />
    </>
  );
};

export default FlightCard;
