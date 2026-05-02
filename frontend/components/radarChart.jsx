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

  const mostWords = stats?.mostWordsInOneMatch ?? 0;
  const avgLen = stats?.averageWordLength ?? 0;
  const longest = stats?.longestStreak ?? 0;
  const hasData = mostWords + avgLen + longest > 0;

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: textColor },
      },
      tooltip: {
        enabled: hasData,
      },
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: hasData ? undefined : 5,
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
        label: hasData ? "Word Mastery" : "No data yet",
        data: [mostWords, avgLen, longest],
        backgroundColor: hasData ? "#7c83ff33" : "transparent",
        borderColor: hasData ? "#7c83ff" : (isDark ? "#45475a" : "#d8d8d8"),
        pointBackgroundColor: hasData ? "#c678dd" : (isDark ? "#45475a" : "#d8d8d8"),
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