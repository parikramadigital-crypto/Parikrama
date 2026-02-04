import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ places = [] }) => {
  // --------- COUNT CATEGORIES ----------
  const categoryStats = useMemo(() => {
    const map = {};

    places.forEach((place) => {
      const category = place?.category || "Uncategorized";
      map[category] = (map[category] || 0) + 1;
    });

    return {
      labels: Object.keys(map),
      counts: Object.values(map),
    };
  }, [places]);

  // --------- CHART DATA ----------
  const data = {
    labels: categoryStats.labels,
    datasets: [
      {
        label: "Places",
        data: categoryStats.counts,
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#14B8A6",
          "#F97316",
          "#22C55E",
          "#6366F1",
          "#EC4899",
        ],
        borderWidth: 1,
      },
    ],
  };

  // --------- OPTIONS ----------
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow w-[450px]">
      <h2 className="text-lg font-semibold mb-4">Places by Category</h2>

      {categoryStats.labels.length > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default CategoryPieChart;
