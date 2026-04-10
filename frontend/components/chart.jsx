import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  cutout: '65%',
  plugins: {
    legend: { position: 'bottom' },
  },
};

export default function GameStatsChart({ won, lost }) {
  const data = {
    labels: ['Won', 'Lost'],
    datasets: [{
      data: [won, lost],
      backgroundColor: ['#7c83ff', '#c678dd'],
      borderWidth: 2,
      hoverOffset: 10,
      borderColor: '#313244',
    }],
  };

  return (
    <div style={{ height: 300 }}>
      <Doughnut data={data} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  );
}