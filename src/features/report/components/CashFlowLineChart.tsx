import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { type CashFlowData } from "../types/report.types";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

export default function CashFlowLineChart({ data }: { data: CashFlowData[] }) {
  const chartData = {
    labels: (data && Array.isArray(data) ? data : []).map(
      (item) => item.period
    ),
    datasets: [
      {
        label: "Income",
        data: (data && Array.isArray(data) ? data : []).map(
          (item) => item.income
        ),
        borderColor: "#10B981",
        backgroundColor: "#10B981",
        tension: 0.1,
      },
      {
        label: "Expenses",
        data: (data && Array.isArray(data) ? data : []).map(
          (item) => item.expenses
        ),
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        tension: 0.1,
      },
      {
        label: "Net",
        data: (data && Array.isArray(data) ? data : []).map((item) => item.net),
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const label = context.dataset.label || "";
            const value = context.raw as number;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: number | string) => `$${value}`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
