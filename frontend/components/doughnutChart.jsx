import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ stats }) {
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

  const options = {
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#e2e2e2' : '#11111b',
        },
      },
    },
  };

  const data = {
    labels: ['Won', 'Lost'],
    datasets: [{
      data: [stats?.gamesWon, stats?.gamesLost],
      backgroundColor: ['#7c83ff', '#c678dd'],
      borderWidth: 2,
      hoverOffset: 10,
      borderColor: isDark ? '#313244' : '#ffffff',
    }],
  };

  return (
    <div style={{ height: 300 }}>
      <Doughnut data={data} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  );
}