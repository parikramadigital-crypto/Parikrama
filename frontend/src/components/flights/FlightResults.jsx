import FlightCard from "./FlightCard";

const FlightResults = ({ flights, index }) => {
  //   if (!flights?.length) return null;

  return (
    <div className="mt-8 space-y-5">
      {flights?.map((flight) => (
        <FlightCard key={index} flight={flight} />
      ))}
    </div>
  );
};

export default FlightResults;
