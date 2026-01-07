const AdminTable = ({ columns, data }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-6 py-3 text-left font-semibold text-gray-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              {Object.values(row).map((cell, i) => (
                <td key={i} className="px-6 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
