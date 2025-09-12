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
import formatCurrency from "../../../utilities/formatCurrency";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

interface SpendingTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface SpendingChartProps {
  data: SpendingTrend[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Income",
        data: data.map((item) => item.income),
        borderColor: "#10B981",
        backgroundColor: "#10B981",
        tension: 0.3,
      },
      {
        label: "Expenses",
        data: data.map((item) => item.expenses),
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        tension: 0.3,
      },
      {
        label: "Savings",
        data: data.map((item) => item.savings),
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.3,
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
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: number | string) => formatCurrency(Number(value)),
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="font-medium text-lg mb-4">Spending trends</h2>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
