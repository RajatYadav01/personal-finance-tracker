import { ArrowRight } from "lucide-react";
import CategoryBadge from "../../category/components/CategoryBadge";
import SpendingPieChart from "./SpendingPieChart";
import ReportCard from "./ReportCard";
import { type SpendingData } from "../types/report.types";

interface SpendingByCategoryProps {
  data: SpendingData[];
  onCategorySelect: (id: string | null) => void;
  selectedCategory: string | null;
}

export default function SpendingByCategory({
  data,
  onCategorySelect,
  selectedCategory,
}: SpendingByCategoryProps) {
  const totalSpending = (data && Array.isArray(data) ? data : []).reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <ReportCard title="Spending by Category" className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-[300px]">
          <SpendingPieChart data={data} />
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="font-medium">Category breakdown</h3>
          <div className="space-y-1">
            {(data && Array.isArray(data) ? data : []).map((item) => (
              <button
                key={item.category}
                className={`flex items-center justify-between w-full p-2 rounded hover:bg-gray-50 ${
                  selectedCategory === item.category_id ? "bg-blue-50" : ""
                }`}
                onClick={() =>
                  onCategorySelect(
                    selectedCategory === item.category_id
                      ? null
                      : item.category_id
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <CategoryBadge
                    category={{
                      id: item.category_id,
                      name: item.category,
                      color: item.color,
                    }}
                    size="sm"
                  />
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    ${Number(item.amount).toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {((Number(item.amount) / totalSpending) * 100).toFixed(1)}%
                  </span>
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ReportCard>
  );
}
