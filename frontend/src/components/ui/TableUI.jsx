import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import InputBox from "../../components/InputBox";
import { FetchData } from "../../utils/FetchFromApi";
import { truncateString } from "../../utils/Utility-functions";
import Button from "../Button";
import { formatDateTimeString } from "../../utils/mongoDB_DateTime";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";

const Place = ({ Text = "", TableData = [] }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = ["Place name", "Category", "State", "City", "Location"];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((p) =>
      `
        ${p?.name}
        ${p?.category}
        ${p?.state?.name}
        ${p?.city?.name}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-nowrap">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>
        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search place..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>

        {/* <input
          type="text"
          placeholder="Search place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded-md"
        /> */}
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td>
                    <Link
                      to={`/current/place/${data?._id}`}
                      className="px-5 py-3 block hover:text-blue-500 hover:underline"
                    >
                      {data?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{data?.category}</td>
                  <td className="px-5 py-3">{data?.state?.name}</td>
                  <td className="px-5 py-3">{data?.city?.name}</td>
                  <td className="px-5 py-3">
                    Long: {data?.location?.coordinates[0]} | Lat:{" "}
                    {data?.location?.coordinates[1]}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
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

const InactivePlace = ({ Text = "", TableData = [], user }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = [
    "Place name",
    "Category",
    "State",
    "City",
    "Location",
    "Actions",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((p) =>
      `
        ${p?.name}
        ${p?.category}
        ${p?.state?.name}
        ${p?.city?.name}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  const deletePlace = async ({ placeId }) => {
    try {
      const response = await FetchData(
        `places/delete-place/${user}/${placeId}`,
        "delete",
      );
      alert(response.data.message);
      alert("Kindly reload the dashboard");
    } catch (err) {}
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-nowrap">
          {Text} (<span className="text-sm">{filteredData.length}</span>){" "}
          <span className="text-xs text-red-600">
            ** The delete button will immediately delete the place, be careful
            using it.
          </span>
        </h2>
        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search inactive place..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td>
                    <Link
                      to={`/review/current/place/${data?._id}`}
                      className="px-5 py-3 block hover:text-blue-500 hover:underline"
                    >
                      {data?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{data?.category}</td>
                  <td className="px-5 py-3">{data?.state?.name}</td>
                  <td className="px-5 py-3">{data?.city?.name}</td>
                  <td className="px-5 py-3">
                    Long: {data?.location?.coordinates[0]} | Lat:{" "}
                    {data?.location?.coordinates[1]}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => deletePlace({ placeId: data._id })}
                      className="bg-red-300 p-1 rounded-md font-bold text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
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

const City = ({ Text = "", TableData = [] }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = ["City name", "State name", "State Code", "Location"];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((c) =>
      `
        ${c?.name}
        ${c?.state?.name}
        ${c?.state?.code}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>

        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search city..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3">{data?.name}</td>
                  <td className="px-5 py-3">{data?.state?.name}</td>
                  <td className="px-5 py-3">{data?.state?.code}</td>
                  <td className="px-5 py-3">
                    Long: {data?.location?.coordinates[0]} | Lat:{" "}
                    {data?.location?.coordinates[1]}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
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

const State = ({ Text = "", TableData = [] }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = [
    "State Name",
    "State Code",
    "Country Name",
    "Country Code",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((s) =>
      `${s?.name} ${s?.code} ${s?.country?.name} ${s?.country?.code}`
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>

        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search state..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3">
                    <Link
                      to={`/current/state-city/${data?._id}`}
                      className="hover:text-blue-500 hover:underline"
                    >
                      {data?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{data?.code}</td>
                  <td className="px-5 py-3">{data?.country?.name}</td>
                  <td className="px-5 py-3">{data?.country?.code}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-6 text-gray-500">
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

const Facilitator = ({ Text = "", TableData = [] }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = [
    "Name",
    "Contact",
    "Role",
    "City",
    "Place",
    "Experience",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((p) =>
      `
        ${p?.name}
        ${p?.phone}
        ${p?.role}
        ${p?.city?.name}
        ${p?.place?.name}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>

        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search facilitator..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3">
                    <Link
                      className="hover:text-blue-500 hover:underline"
                      to={`/current/facilitator/${data?._id}`}
                    >
                      {data?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{data?.phone}</td>
                  <td className="px-5 py-3">{data?.role}</td>
                  <td className="px-5 py-3">{data?.city?.name}</td>
                  <td className="px-5 py-3">
                    {truncateString(data?.place?.name, 30)}
                  </td>
                  <td className="px-5 py-3">{data?.experienceYears} years</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
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

const InactiveFacilitator = ({ Text = "", TableData = [], user }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = [
    "Name",
    "Contact",
    "Role",
    "City",
    "Place",
    "Experience",
    "Actions",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((p) =>
      `
        ${p?.name}
        ${p?.phone}
        ${p?.role}
        ${p?.city?.name}
        ${p?.place?.name}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  const deleteFacilitator = async ({ facilitatorId }) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const response = await FetchData(
        `facilitator/delete-facilitator/${user}/${facilitatorId}`,
        "delete",
      );
      alert(response.data.message);
      alert("Kindly reload the dashboard");
    } catch (err) {}
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-nowrap">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>
        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search inactive facilitator..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3">
                    <Link
                      className="hover:text-blue-500 hover:underline"
                      to={`/current/facilitator/${data?._id}`}
                    >
                      {data?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{data?.phone}</td>
                  <td className="px-5 py-3">{data?.role}</td>
                  <td className="px-5 py-3">{data?.city?.name}</td>
                  <td className="px-5 py-3">
                    {truncateString(data?.place?.name, 30)}
                  </td>
                  <td className="px-5 py-3">{data?.experienceYears} years</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() =>
                        deleteFacilitator({ facilitatorId: data._id })
                      }
                      className="bg-red-300 p-1 rounded-md font-bold text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
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

const Promotions = ({ Text = "", TableData = [], user }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = [
    "Promotion name",
    "Place name",
    "Position",
    "Preview",
    "Action",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((c) =>
      `
        ${c?.name}
        ${c?.priority === "Max" ? "Top" : c?.priority === "Mid" ? "Right" : "Left"}
        ${c?.place?.name}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  const deletePromotion = async ({ promotionId }) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const response = await FetchData(
        `promotions/delete-promotion/${user}/${promotionId}`,
        "delete",
      );
      alert(response.data.message);
      alert("Kindly reload the dashboard");
    } catch (err) {}
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>

        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search promotion..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3">
                    {data?.name}
                    {data?.isMobile === true ? (
                      <p className="bg-[#FFC20D] p-1 text-nowrap rounded-full">
                        Mobile Banner
                      </p>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-5 py-3">{data?.place?.name}</td>
                  <td className="px-5 py-3">
                    {data?.priority === "Max" ? "Top" : ""}
                    {data?.priority === "Mid" ? "Right" : ""}
                    {data?.priority === "Min" ? "Left" : ""}
                  </td>
                  <td className="px-5 py-3">
                    <img src={data?.images?.url} className="w-40 h-20" />
                  </td>
                  <td className="px-5 py-3">
                    <Button
                      label={"Delete"}
                      onClick={() => deletePromotion({ promotionId: data._id })}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
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

const TravelPackages = ({ Text = "", TableData = [], user }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = ["Package name", "Place name", "Priority", "Action"];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((c) =>
      `
        ${c?.name}
        ${c?.priority === "exclusiveDeals" ? "Exclusive Deals" : c?.priority === "trendingDeals" ? "Trending Deals" : "Hot Deals"}
        ${c?.place?.name}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  const deletePackage = async ({ packageId }) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const response = await FetchData(
        `promotions/delete-promotion/${user}/${packageId}`,
        "delete",
      );
      alert(response.data.message);
      alert("Kindly reload the dashboard");
    } catch (err) {}
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>

        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search packages..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3">{data?.name}</td>
                  <td className="px-5 py-3">{data?.place?.name}</td>
                  <td className="px-5 py-3">
                    {data?.priority === "exclusiveDeals"
                      ? "Exclusive Deals"
                      : ""}
                    {data?.priority === "trendingDeals" ? "Trending Deals" : ""}
                    {data?.priority === "hotDeals" ? "Hot Deals" : ""}
                  </td>
                  <td className="px-5 py-3">
                    <Button
                      label={"Delete"}
                      onClick={() => deletePackage({ packageId: data._id })}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
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

const FoodKiosks = ({ Text = "", TableData = [], user }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = [
    "Store Name",
    "Contact number",
    "Email",
    "Nearest place name",
    "Category (Veg / Non-Veg)",
    "Action",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((c) =>
      `
        ${c?.name}
        ${c?.place?.name}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  const deletePlaceKiosk = async ({ placeKioskId }) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const response = await FetchData(
        `foodCourt/delete/food-court/by-id/${user}/${placeKioskId}`,
        "delete",
      );
      alert(response.data.message);
      alert("Kindly reload the dashboard");
    } catch (err) {}
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>

        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search food place..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr
                  key={data._id}
                  className={`hover:bg-gray-50 border-b ${data?.verified === false && data?.active === false ? "bg-gray-200" : ""}`}
                >
                  <td className="px-5 py-3">
                    <Link to={`/current/food-court/${data?._id}`}>
                      {data?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{data?.contactNumber}</td>
                  <td className="px-5 py-3">{data?.email}</td>
                  <td className="px-5 py-3">{data?.place?.name}</td>
                  <td className="px-5 py-3">{data?.category}</td>
                  <td className="px-5 py-3">
                    {data?.verified === false && data?.active === false ? (
                      <Button
                        label={"Delete"}
                        onClick={() =>
                          deletePlaceKiosk({ placeKioskId: data._id })
                        }
                      />
                    ) : (
                      <span className="bg-green-300 text-green-800 font-semibold p-2 rounded-md">Verified</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
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

const Hotels = ({ Text = "", TableData = [] }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = [
    "Hotel Name",
    "Property Type",
    "City",
    "Rating",
    "Price Range",
    "Rooms",
    "Actions",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((h) =>
      `
        ${h?.name}
        ${h?.propertyType}
        ${h?.address?.city?.name}
        ${h?.address?.state?.name}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  const deleteHotel = async ({ hotelId, adminId }) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const response = await FetchData(
        `hotels/delete/${adminId}/${hotelId}`,
        "delete",
      );
      alert(response.data.message);
      alert("Kindly reload the dashboard");
    } catch (err) {
      alert("Failed to delete hotel");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-nowrap">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>
        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search hotels..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td>
                    <Link
                      to={`/hotels/${data?._id}`}
                      className="px-5 py-3 block hover:text-blue-500 hover:underline"
                    >
                      {data?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{data?.propertyType || "N/A"}</td>
                  <td className="px-5 py-3">{data?.address?.city?.name}</td>
                  <td className="px-5 py-3">{data?.ratings?.average || 0}/5</td>
                  <td className="px-5 py-3">
                    ₹{data?.pricing?.minPrice || "N/A"} - ₹
                    {data?.pricing?.maxPrice || "N/A"}
                  </td>
                  <td className="px-5 py-3">{data?.totalRooms || 0}</td>
                  <td className="px-5 py-3 flex gap-2">
                    <Button
                      label="Delete"
                      onClick={() =>
                        deleteHotel({
                          hotelId: data._id,
                          adminId: data?.createdBy?._id,
                        })
                      }
                      className="bg-red-300 text-red-900"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No hotels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Clubs = ({ Text = "", TableData = [] }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = [
    "Club Name",
    "Category",
    "City",
    "Rating",
    "Members",
    "Verified",
    "Actions",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((c) =>
      `
        ${c?.clubName}
        ${c?.category}
        ${c?.location?.city}
        ${c?.location?.state}
      `
        .toLowerCase()
        .includes(q),
    );
  }, [search, TableData]);

  const deleteClub = async ({ clubId, adminId }) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    try {
      const response = await FetchData(
        `clubs/delete/${adminId}/${clubId}`,
        "delete",
      );
      alert(response.data.message);
      alert("Kindly reload the dashboard");
    } catch (err) {
      alert("Failed to delete club");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-nowrap">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>
        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search clubs..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td>
                    <Link
                      to={`/clubs/${data?._id}`}
                      className="px-5 py-3 block hover:text-blue-500 hover:underline"
                    >
                      {data?.clubName}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{data?.category || "N/A"}</td>
                  <td className="px-5 py-3">{data?.location?.city || "N/A"}</td>
                  <td className="px-5 py-3">{data?.ratings?.average || 0}/5</td>
                  <td className="px-5 py-3">{data?.members?.length || 0}</td>
                  <td className="px-5 py-3">
                    {data?.adminVerified ? (
                      <span className="text-green-600 font-semibold">
                        ✓ Yes
                      </span>
                    ) : (
                      <span className="text-red-600">✗ No</span>
                    )}
                  </td>
                  <td className="px-5 py-3 flex gap-2">
                    <Button
                      label="Delete"
                      onClick={() =>
                        deleteClub({
                          clubId: data._id,
                          adminId: data?.createdBy?._id,
                        })
                      }
                      className="bg-red-300 text-red-900"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No clubs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Users = ({ Text = "", TableData = [] }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = [
    "Name",
    "Email",
    "Contact number",
    "Registration date(DDMMYY)",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((s) => `${s?.number}`.toLowerCase().includes(q));
  }, [search, TableData]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>

        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search user..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3">{data?.name || "Na"}</td>
                  <td className="px-5 py-3">{data?.email || "Na"}</td>
                  <td className="px-5 py-3">{data?.contactNumber}</td>
                  <td className="px-5 py-3">
                    {formatDateTimeString(data?.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-6 text-gray-500">
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

const Enquiry = ({ Text = "", TableData = [], user }) => {
  const [search, setSearch] = useState("");
  const [request, setRequest] = useState();
  const [popup, setPopup] = useState(false);
  const formRef = useRef();

  const TableHeaders = [
    "Action",
    "Enquiry Category",
    "Name",
    "Contact number",
    "Enquired on (DDMMYY)",
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((s) =>
      `${s?.enquiryType}`.toLowerCase().includes(q),
    );
  }, [search, TableData]);

  const getRequest = async ({ enquiryId }) => {
    try {
      const response = await FetchData(
        `enquiry/admin/get/enquiry-by-id/${user}/${enquiryId}`,
        "get",
      );
      setRequest(response.data.data || []);
      setPopup(true);
    } catch (err) {
      // console.log(err);
    }
  };
  const data = [
    {
      label: "Enquiry Type",
      value: (
        <span>
          {request?.enquiryType === "ContactUsForm" ? "Contact Form" : ""}
          {request?.enquiryType === "flightBusHotel"
            ? "Flights, Buses, Hotels"
            : ""}
          {request?.enquiryType === "PackageEnquiryForm"
            ? "Travel Packages"
            : ""}
          {request?.enquiryType === "CorporateEnquiry"
            ? "Corporate Enquiry"
            : ""}
        </span>
      ),
    },
    {
      label: "Customer Name",
      value:
        request?.formDetails?.contactPersonName ||
        request?.corporate?.contactPersonName,
    },
    {
      label: "Contact Number",
      value:
        request?.formDetails?.contactPersonPhone ||
        request?.corporate?.contactNumber,
      className: "font-semibold",
    },
    {
      label: "Email",
      value:
        request?.formDetails?.contactPersonEmail ||
        request?.corporate?.companyEmail,
    },
    {
      label: "Comment",
      value: request?.formDetails?.comments || request?.corporate?.comments,
      className: "font-semibold",
    },
    {
      label: "Current Location",
      value: request?.formDetails?.fromCity,
    },
    { label: "Destination", value: request?.formDetails?.toCity },
    {
      label: "From Date(DDMMYY)",
      value: formatDateTimeString(request?.formDetails?.fromDate),
    },
    {
      label: "To Date(DDMMYY)",
      value: formatDateTimeString(request?.formDetails?.toDate),
    },
    {
      label: "Number of persons",
      value: request?.formDetails?.numberOfPerson,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `enquiry/mark-as-reviewed/${user}/${request?._id}`,
        "post",
        formData,
      );
      // console.log(response);
      formRef.current.reset();
      setPopup(false);
      alert(response.data.message);
      alert("Kindly reload dashboard");
    } catch (err) {
      // console.log(err);
      alert(parseErrorMessage(err.response.data));
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>

        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search enquiry..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3">
                    <button
                      onClick={() => getRequest({ enquiryId: data?._id })}
                      className="bg-green-300 text-green-700 text-xs font-semibold p-1 rounded-md cursor-pointer"
                    >
                      Open
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    {data?.enquiryType === "ContactUsForm"
                      ? "Contact Form"
                      : ""}
                    {data?.enquiryType === "flightBusHotel"
                      ? "Flights Buses Hotels"
                      : ""}
                    {data?.enquiryType === "PackageEnquiryForm"
                      ? "Travel Packages"
                      : ""}
                    {data?.enquiryType === "CorporateEnquiry"
                      ? "Corporate Enquiry"
                      : ""}
                  </td>
                  <td className="px-5 py-3">
                    {data?.formDetails?.contactPersonName ||
                      data?.corporate?.contactPersonName ||
                      "Na"}
                  </td>
                  <td className="px-5 py-3">
                    {data?.formDetails?.contactPersonPhone ||
                      data?.corporate?.contactNumber ||
                      "Na"}
                  </td>
                  <td className="px-5 py-3">
                    {formatDateTimeString(data?.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-6 text-gray-500">
                  No Data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center flex-col z-50 bg-black/90 overflow-scroll no-scrollbar"
          >
            <div className="bg-white rounded-md p-5 w-[60vw] flex justify-center items-center gap-10 flex-col">
              {request ? (
                <div>
                  {data?.map((r, index) => (
                    <h1
                      className="flex w-full justify-between items-start gap-40 border-b p-1"
                      key={index}
                    >
                      <strong>{r?.label}</strong>{" "}
                      <span className={`text-justify ${r?.className}`}>
                        {r.value || "na"}
                      </span>
                    </h1>
                  ))}
                </div>
              ) : (
                ""
              )}
              <div className="flex flex-col justify-center items-center">
                <form ref={formRef} onSubmit={handleSubmit}>
                  <InputBox
                    Name="customerFeedBack"
                    Placeholder="Feedback"
                    LabelName="What did the customer said ?"
                    Type="text"
                  />
                  <div className="flex justify-center items-center gap-10">
                    <Button
                      label={"Close"}
                      onClick={() => {
                        setPopup(false);
                        formRef.current.reset();
                      }}
                    />
                    <Button label={"Mark as reviewed"} type={"submit"} />
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Country = ({ Text = "", TableData = [] }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = ["Country Name", "Code", "Total States"];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((s) =>
      `${s?.name} ${s?.code}`.toLowerCase().includes(q),
    );
  }, [search, TableData]);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">
          {Text} (<span className="text-sm">{filteredData.length}</span>)
        </h2>

        <div className="w-96">
          <InputBox
            Type="text"
            Placeholder="Search country..."
            Value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="w-full mt-1 h-[500px] overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3">
                    {data?.name}
                    {/* <Link
                      to={`/current/state-city/${data?._id}`}
                      className="hover:text-blue-500 hover:underline"
                    >
                      {data?.name}
                    </Link> */}
                  </td>
                  <td className="px-5 py-3">{data?.code}</td>
                  <td className="px-5 py-3">{data?.totalStates}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-6 text-gray-500">
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

export {
  City,
  State,
  Place,
  InactivePlace,
  Facilitator,
  InactiveFacilitator,
  Promotions,
  TravelPackages,
  FoodKiosks,
  Hotels,
  Clubs,
  Users,
  Enquiry,
  Country,
};
