import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { useTheme } from "../context/themeContext.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ stats }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const options = {
    cutout: "65%",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#e2e2e2" : "#11111b",
        },
      },
    },
  };

  const data = {
    labels: ["Won", "Lost"],
    datasets: [
      {
        data: [stats?.gamesWon ?? 0, stats?.gamesLost ?? 0],
        backgroundColor: ["#7c83ff", "#c678dd"],
        borderWidth: 2,
        hoverOffset: 10,
        borderColor: isDark ? "#313244" : "#ffffff",
      },
    ],
  };

  return (
    <div style={{ height: 300 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
