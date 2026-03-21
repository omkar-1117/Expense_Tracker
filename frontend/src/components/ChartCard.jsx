import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom", labels: { boxWidth: 12, padding: 8 } },
    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${ctx.formattedValue}` } },
  },
  cutout: "40%",
};

export const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
};

export function ChartCard({ chartType, data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm min-h-[280px]">
      {chartType === "pie" ? <Pie data={data} options={pieOptions} /> : <Line data={data} options={lineOptions} />}
    </div>
  );
}
