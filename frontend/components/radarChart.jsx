import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { useTheme } from "../context/themeContext.jsx";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ stats }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#e2e2e2" : "#11111b";
  const gridColor = isDark ? "#313244" : "#c8c8c8";

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: textColor },
      },
    },
    scales: {
      r: {
        ticks: {
          color: textColor,
          backdropColor: "transparent",
        },
        grid: { color: gridColor },
        pointLabels: { color: textColor },
        angleLines: { color: gridColor },
      },
    },
  };

  const data = {
    labels: ["Most Words in One Match", "Avg Word Length", "Longest Streak"],
    datasets: [
      {
        label: "Word Mastery",
        data: [
          stats?.mostWordsInOneMatch ?? 0,
          stats?.averageWordLength ?? 0,
          stats?.longestStreak ?? 0,
        ],
        backgroundColor: "#7c83ff33",
        borderColor: "#7c83ff",
        pointBackgroundColor: "#c678dd",
        pointBorderColor: isDark ? "#313244" : "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ height: 300 }}>
      <Radar data={data} options={options} />
    </div>
  );
}