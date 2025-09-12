import DatePicker from "../../../components/ui/DatePicker";
import Select from "../../../components/ui/Select";
import { type TimeRange } from "../types/report.types";

interface ReportTimeRangeProps {
  timeRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

export default function ReportTimeRange({
  timeRange,
  onChange,
}: ReportTimeRangeProps) {
  const handleDateChange = (key: keyof TimeRange, value: Date) => {
    onChange({ ...timeRange, [key]: value });
  };

  const handleIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value as TimeRange["interval"];
    onChange({ ...timeRange, interval: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">From</label>
        <DatePicker
          selected={timeRange.startDate}
          onChange={(date) => date && handleDateChange("startDate", date)}
          selectsStart
          startDate={timeRange.startDate}
          endDate={timeRange.endDate}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">To</label>
        <DatePicker
          selected={timeRange.endDate}
          onChange={(date) => date && handleDateChange("endDate", date)}
          selectsEnd
          startDate={timeRange.startDate}
          endDate={timeRange.endDate}
          minDate={timeRange.startDate}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Interval</label>
        <Select
          value={timeRange.interval}
          onChange={handleIntervalChange}
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
          ]}
        />
      </div>
    </div>
  );
}
