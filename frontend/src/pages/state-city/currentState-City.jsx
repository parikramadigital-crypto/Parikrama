import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import { PlaceCard } from "../../components/ui/PlaceCard";
import Button from "../../components/Button";

const CurrentStateCity = ({ startLoading, stopLoading }) => {
  const { user } = useSelector((state) => state.auth);
  const { stateId } = useParams();
  const [state, setState] = useState({});
  const [cities, setCities] = useState([]);
  const [places, setPlace] = useState([]);

  useEffect(() => {
    const getState = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `states/state-by-id/${stateId}`,
          "get"
        );
        if (response.data.statusCode === 200) {
          setState(response.data.data.state);
          setCities(response.data.data.cities);
          setPlace(response.data.data.places);
        }
      } catch (err) {
        console.log(err);
      } finally {
        stopLoading();
      }
    };

    getState();
  }, [user]);

  const Table = ({ Text = "", TableData }) => {
    const TableHeaders = ["City name", "Location", "Action"];
    return (
      <div className="mt-10 bg-gray-200 rounded-xl px-5 py-2">
        <h2 className="text-2xl font-bold mb-6 flex justify-center items-center">
          {Text} (<span className="text-sm"> {TableData?.length}</span>)
        </h2>
        <div className="w-full mt-1 h-96 overflow-scroll">
          <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                {TableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="px-5 py-3 font-medium tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TableData?.length > 0 ? (
                TableData?.map((data) => (
                  <tr
                    key={data._id}
                    className="hover:bg-gray-50 transition-colors duration-200 border-b"
                  >
                    <td className="px-5 py-3 text-gray-700">{data?.name}</td>
                    <td className="px-5 py-3 text-gray-700 flex gap-2">
                      <span>Long: {data?.location?.coordinates[0]}</span>
                      <span>Lat: {data?.location?.coordinates[1]}</span>
                    </td>
                    <td>
                      <Button label={"Delete"} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={TableHeaders.length}
                    className="px-5 py-6 text-center text-gray-500"
                  >
                    No Data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return user ? (
    <div className="flex flex-col gap-5 px-20 py-10">
      {/* state section  */}
      <div className="bg-gray-200 rounded-xl px-5 py-2">
        <h1>
          <strong>State Id: </strong>
          {stateId}
        </h1>
        <h1>
          <strong>State Name: </strong>
          {state?.name}
        </h1>
        <h1>
          <strong>State Code: </strong>
          {state?.code}
        </h1>
      </div>
      {/* city section  */}
      <Table TableData={cities} Text={<p>Total City under {state?.name}</p>} />
      {/* place section */}
      <div>
        {places?.length === 0 ? (
          ""
        ) : (
          <div className="bg-gray-200 rounded-xl px-5 py-2 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-6 flex justify-center items-center">
              Places listed under current state and city
            </h1>

            {places?.map((place) => (
              <PlaceCard place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center w-full">
      <h2 className="text-2xl font-bold text-center">
        <p className="text-5xl ">⚠️</p>
        Restricted Access !! Please log in to view the dashboard.
      </h2>
    </div>
  );
};

export default LoadingUI(CurrentStateCity);
