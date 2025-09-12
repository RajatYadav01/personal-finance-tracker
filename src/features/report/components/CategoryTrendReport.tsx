import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import ReportCard from "./ReportCard";
import CategoryBadge from "../../category/components/CategoryBadge";
import { type CategoryTrendData } from "../types/report.types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface CategoryTrendReportProps {
  data: CategoryTrendData[];
  categoryId: string;
}

export default function CategoryTrendReport({
  data,
  categoryId,
}: CategoryTrendReportProps) {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Spending",
        data: data.map((item) => item.amount),
        backgroundColor: "#3B82F6",
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const value = context.raw as number;
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number | string) => {
            return `$${value}`;
          },
        },
      },
    },
  };

  return (
    <ReportCard
      title={
        <div className="flex items-center space-x-2">
          <span>Trend for</span>
          <CategoryBadge
            category={{
              id: categoryId,
              name: data[0]?.category || "",
              color: data[0]?.color || "#000",
            }}
          />
        </div>
      }
    >
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </ReportCard>
  );
}
