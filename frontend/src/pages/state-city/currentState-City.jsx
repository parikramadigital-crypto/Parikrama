import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import LoadingUI from "../../components/LoadingUI";
import { PlaceCard } from "../../components/ui/PlaceCard";
import Button from "../../components/Button";
import { motion, AnimatePresence } from "framer-motion";

const CurrentStateCity = ({ startLoading, stopLoading }) => {
  const { user } = useSelector((state) => state.auth);
  const { stateId } = useParams();
  const [state, setState] = useState({});
  const [cities, setCities] = useState([]);
  const [places, setPlace] = useState([]);
  const navigate = useNavigate();

  const getState = async () => {
    try {
      startLoading();
      const response = await FetchData(`states/state-by-id/${stateId}`, "get");
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
  useEffect(() => {
    getState();
  }, [user]);

  const deleteCity = async ({ cityId }) => {
    try {
      startLoading();
      const response = await FetchData(
        `cities/delete-city/${user?._id}/${cityId}`,
        "delete"
      );
      getState();
      alert("City deleted successfully !");
      navigate("/admin/dashboard");
    } catch (err) {
      console.log(err);
      alert("Error in deleting city try again later.");
    } finally {
      stopLoading();
    }
  };

  const Table = ({ Text = "", TableData }) => {
    const [popup, setPopup] = useState(false);
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
                      <Button label={"Delete"} onClick={() => setPopup(true)} />
                    </td>
                    <AnimatePresence>
                      {popup && (
                        <motion.div
                          whileInView={{ opacity: 1, x: 0 }}
                          initial={{ opacity: 0, x: -100 }}
                          exit={{ opacity: 0, x: 100 }}
                          transition={{
                            type: "spring",
                            duration: 0.4,
                            ease: "easeInOut",
                          }}
                          className="fixed top-0 left-0 h-screen w-full bg-white flex justify-center items-center flex-col"
                        >
                          <h1>
                            Are you sure you want to delete this City, if there
                            are places under, they will also get deleted ?
                          </h1>
                          <div className="flex justify-center items-center gap-5 py-5">
                            <Button
                              label={"Cancel"}
                              onClick={() => setPopup(false)}
                            />
                            <Button
                              label={"Confirm"}
                              onClick={() => deleteCity({ cityId: data?._id })}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
