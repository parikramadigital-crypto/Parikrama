import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CitiesByStateBarChart = ({ cities = [] }) => {
  const chartData = useMemo(() => {
    const countMap = {};

    // ✅ Count cities by state name
    cities.forEach((city) => {
      const stateName = city?.state?.name;
      if (!stateName) return;

      countMap[stateName] = (countMap[stateName] || 0) + 1;
    });

    const labels = Object.keys(countMap);
    const values = Object.values(countMap);

    return {
      labels,
      datasets: [
        {
          label: "Cities Registered",
          data: values,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderRadius: 6,
        },
      ],
    };
  }, [cities]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow w-[650px]">
      <h2 className="text-lg font-semibold mb-4">
        Cities Registered Per State
      </h2>

      {cities.length === 0 ? (
        <p className="text-gray-500">No city data available</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default CitiesByStateBarChart;
