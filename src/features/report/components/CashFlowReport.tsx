import formatCurrency from "../../../utilities/formatCurrency";
import CashFlowLineChart from "./CashFlowLineChart";
import ReportCard from "./ReportCard";
import { type CashFlowData } from "../types/report.types";

interface CashFlowReportProps {
  data: CashFlowData[];
  timeRange: {
    interval: "daily" | "weekly" | "monthly" | "yearly";
  };
  userDefaultCurrency: string;
}

export default function CashFlowReport({
  data,
  timeRange,
  userDefaultCurrency,
}: CashFlowReportProps) {
  const netValues = (data && Array.isArray(data) ? data : []).map(
    (item) => item.net
  );
  const maxNet = Math.max(...netValues);
  const minNet = Math.min(...netValues);
  console.log(userDefaultCurrency);

  return (
    <ReportCard title="Cash Flow">
      <div className="h-[300px]">
        <CashFlowLineChart data={data} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-green-50 rounded">
          <div className="text-sm text-green-600">Highest net</div>
          <div className="font-medium">
            {formatCurrency(maxNet, userDefaultCurrency)}
          </div>
        </div>
        <div className="p-2 bg-blue-50 rounded">
          <div className="text-sm text-blue-600">Time period</div>
          <div className="font-medium capitalize">{timeRange.interval}</div>
        </div>
        <div className="p-2 bg-red-50 rounded">
          <div className="text-sm text-red-600">Lowest net</div>
          <div className="font-medium">
            {formatCurrency(minNet, userDefaultCurrency)}
          </div>
        </div>
      </div>
    </ReportCard>
  );
}
