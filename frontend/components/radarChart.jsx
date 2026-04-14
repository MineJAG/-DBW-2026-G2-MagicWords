import { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ stats }) {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const textColor = isDark ? '#e2e2e2' : '#11111b';
  const gridColor = isDark ? '#313244' : '#c8c8c8';

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor },
      },
    },
    scales: {
      r: {
        ticks: {
          color: textColor,
          backdropColor: 'transparent',
        },
        grid: { color: gridColor },
        pointLabels: { color: textColor },
        angleLines: { color: gridColor },
      },
    },
  };

 const data = {
    labels: ['Most Words in One Match', 'Avg Word Length', 'Longest Streak'],
    datasets: [{
      label: 'Word Mastery',
      data: [
        stats?.mostWordsInOneMatch,
        stats?.averageWordLength,
        stats?.longestStreak,
      ],
      backgroundColor: '#7c83ff33',
      borderColor: '#7c83ff',
      pointBackgroundColor: '#c678dd',
      pointBorderColor: isDark ? '#313244' : '#ffffff',
      borderWidth: 2,
    }],
  };

  return (
    <div style={{ height: 300 }}>
      <Radar data={data} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  );
}