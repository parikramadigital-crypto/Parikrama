import { useRef, useState } from "react";
import FlightResults from "./FlightResults";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../InputBox";
import Button from "../Button";
import { INDIAN_AIRPORTS } from "../../constants/Constants";

const FlightSearch = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState();
  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);

  const searchFlights = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = new FormData(formRef.current);

      const response = await FetchData("flight/flight-enquiry", "post", body);
      setFlights(response.data.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full">
      <div className="bg-neutral-100 rounded-3xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6">Search Flights</h2>

        <form
          ref={formRef}
          onSubmit={searchFlights}
          className="grid md:grid-cols-3 gap-4 justify-center items-center"
        >
          <div>
            <select
              name="from"
              required
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
              onChange={handleChange}
            >
              <option value="">Select options</option>
              {INDIAN_AIRPORTS?.map((c, index) => (
                <option key={index} value={c.code}>
                  {c.city} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              name="to"
              required
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#FFC20E] focus:border-[#FFC20E] outline-none transition duration-200 ease-in-out hover:shadow-md"
              onChange={handleChange}
            >
              <option value="">Select options</option>
              {INDIAN_AIRPORTS?.map((c, index) => (
                <option key={index} value={c.code}>
                  {c.city} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <InputBox Type="date" Name="date" />
          <Button type={"submit"} label={loading ? "Searching..." : "Search"} />
        </form>
      </div>

      <FlightResults flights={flights} />
    </section>
  );
};

export default FlightSearch;
