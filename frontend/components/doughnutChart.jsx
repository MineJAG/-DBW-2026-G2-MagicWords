import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { useTheme } from "../context/themeContext.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ stats }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const won = stats?.gamesWon ?? 0;
  const played = stats?.gamesPlayed ?? 0;
  const lost = Math.max(played - won, 0);
  const hasData = played > 0;

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
      tooltip: {
        enabled: hasData,
      },
    },
  };

  const data = {
    labels: hasData ? ["Won", "Lost"] : ["No games yet"],
    datasets: [
      {
        data: hasData ? [won, lost] : [1],
        backgroundColor: hasData
          ? ["#7c83ff", "#c678dd"]
          : [isDark ? "#45475a" : "#d8d8d8"],
        borderWidth: 2,
        hoverOffset: hasData ? 10 : 0,
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
