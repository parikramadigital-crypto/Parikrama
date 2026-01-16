import { Link } from "react-router-dom";

const Place = ({ Text = "", TableData }) => {
  const TableHeaders = [
    "Place name",
    "Category",
    "State name",
    "State Code",
    "Location",
  ];
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">
        {Text} (<span className="text-sm"> {TableData?.length}</span>)
      </h2>
      <div className="w-full mt-1 h-96 overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium tracking-wide">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TableData?.length > 0 ? (
              TableData?.map((data) => (
                // TableData?.slice(0, 20).map((data) => (
                <tr
                  key={data._id}
                  className="hover:bg-gray-50 transition-colors duration-200 border-b"
                >
                  <td>
                    <Link
                      to={`/current/place/${data?._id}`}
                      className="px-5 py-3 text-gray-700 hover:text-blue-500 hover:underline"
                    >
                      {data?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{data?.category}</td>
                  <td className="px-5 py-3 text-gray-700">
                    {data?.state?.name}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {data?.city?.name}
                  </td>
                  <td className="px-5 py-3 text-gray-700 flex gap-2">
                    <span>Long: {data?.location?.coordinates[0]}</span>
                    <span>Lat: {data?.location?.coordinates[1]}</span>
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
const City = ({ Text = "", TableData }) => {
  const TableHeaders = ["City name", "State name", "State Code", "Location"];
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">
        {Text} (<span className="text-sm"> {TableData?.length}</span>)
      </h2>
      <div className="w-full mt-1 h-96 overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium tracking-wide">
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
                  <td className="px-5 py-3 text-gray-700">
                    {data?.state?.name}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {data?.state?.code}
                  </td>
                  <td className="px-5 py-3 text-gray-700 flex gap-2">
                    <span>Long: {data?.location?.coordinates[0]}</span>
                    <span>Lat: {data?.location?.coordinates[1]}</span>
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
const State = ({ Text = "", TableData }) => {
  const TableHeaders = ["State name", "State Code"];
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">
        {Text} (<span className="text-sm"> {TableData?.length}</span>)
      </h2>
      <div className="w-full mt-1 h-96 overflow-scroll">
        <table className="w-full text-sm text-left bg-white rounded-xl shadow-sm ">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {TableHeaders.map((header, index) => (
                <th key={index} className="px-5 py-3 font-medium tracking-wide">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TableData?.length > 0 ? (
              TableData?.slice(0, 20).map((data) => (
                <tr
                  key={data._id}
                  className="hover:bg-gray-50 transition-colors duration-200 border-b"
                >
                  <td className="px-5 py-3 text-gray-700 ">
                    <Link
                      to={`/current/state-city/${data?._id}`}
                      className="hover:text-blue-500 hover:underline"
                    >
                      {data?.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{data?.code}</td>
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

export { City, State, Place };
