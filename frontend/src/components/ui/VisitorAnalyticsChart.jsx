import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const VisitorAnalyticsChart = ({ analytics = [] }) => {
  const chartData = {
    labels: analytics.map((item) => {
      const hour = item.hour;

      if (hour === 0) return "12 AM";
      if (hour === 12) return "12 PM";

      return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    }),

    datasets: [
      {
        label: "Visitors",
        data: analytics.map((item) => item.visits),

        tension: 0.4,

        fill: true,

        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white p-5 shadow rounded w-full">
      <h3 className="text-lg font-semibold mb-4">Visitors Today</h3>

      <Line data={chartData} options={options} />
    </div>
  );
};

export default VisitorAnalyticsChart;
