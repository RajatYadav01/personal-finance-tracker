import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { type SpendingData } from "../types/report.types";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SpendingPieChart({ data }: { data: SpendingData[] }) {
  const chartData = {
    labels: (data && Array.isArray(data) ? data : []).map(
      (item) => item.category
    ),
    datasets: [
      {
        data: (data && Array.isArray(data) ? data : []).map(
          (item) => item.amount
        ),
        backgroundColor: (data && Array.isArray(data) ? data : []).map(
          (item) => item.color
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const label = context.label || "";
            const value = (context.raw as number) || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}
