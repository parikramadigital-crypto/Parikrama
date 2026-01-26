import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import InputBox from "../../components/InputBox";

/* ----------------------- PLACE TABLE ----------------------- */

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
    <div className="mt-10">
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

      <div className="w-full mt-1 h-96 overflow-scroll">
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

/* ----------------------- CITY TABLE ----------------------- */

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
    <div className="mt-10">
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
          />
        </div>
      </div>

      <div className="w-full mt-1 h-96 overflow-scroll">
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

/* ----------------------- STATE TABLE ----------------------- */

const State = ({ Text = "", TableData = [] }) => {
  const [search, setSearch] = useState("");

  const TableHeaders = ["State name", "State Code"];

  const filteredData = useMemo(() => {
    if (!search.trim()) return TableData;

    const q = search.toLowerCase();

    return TableData.filter((s) =>
      `${s?.name} ${s?.code}`.toLowerCase().includes(q),
    );
  }, [search, TableData]);

  return (
    <div className="mt-10">
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
          />
        </div>
      </div>

      <div className="w-full mt-1 h-96 overflow-scroll">
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

export { City, State, Place };
