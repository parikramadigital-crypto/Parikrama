import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TOTAL_STATES_IN_INDIA = 36;

const StatesDonutChart = ({ states = [] }) => {
  const stats = useMemo(() => {
    const registered = states.length;
    const remaining = Math.max(TOTAL_STATES_IN_INDIA - registered, 0);

    return { registered, remaining };
  }, [states]);

  const data = {
    labels: ["Registered States", "Remaining States"],
    datasets: [
      {
        data: [stats.registered, stats.remaining],
        backgroundColor: ["#22C55E", "#E5E7EB"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: "70%", // makes it donut
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow w-[400px] flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">States Coverage</h2>

      <Doughnut data={data} options={options} />

      <p className="mt-4 text-sm text-gray-600">
        {stats.registered} / {TOTAL_STATES_IN_INDIA} States Registered
      </p>
    </div>
  );
};

export default StatesDonutChart;
