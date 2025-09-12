import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import Button from "../../../components/ui/Button";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { useAuthContext } from "../../authentication";
import ReportTimeRange from "../components/ReportTimeRange";
import SpendingByCategory from "../components/SpendingByCategory";
import CashFlowReport from "../components/CashFlowReport";
import CategoryTrendReport from "../components/CategoryTrendReport";
import {
  getSpendingData,
  getCashFlowData,
  getCategoryTrends,
  exportReportData,
} from "../services/Report";
import { type TimeRange } from "../types/report.types";

export const ReportPage = () => {
  const { loginStatusState } = useAuthContext();
  const isUserAuthenticated = !!loginStatusState.userID;
  const [timeRange, setTimeRange] = useState<TimeRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    interval: "monthly",
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isExportingReport, setIsExportingReport] = useState(false);

  const {
    data: spendingData = [],
    isLoading: spendingLoading,
    error: spendingError,
  } = useQuery({
    queryKey: ["spending-report", timeRange],
    queryFn: () =>
      getSpendingData({
        start_date: timeRange.startDate.toISOString().split("T")[0],
        end_date: timeRange.endDate.toISOString().split("T")[0],
      }),
    enabled: isUserAuthenticated,
  });

  const {
    data: cashFlowData = [],
    isLoading: cashFlowLoading,
    error: cashFlowError,
  } = useQuery({
    queryKey: ["cashflow-report", timeRange],
    queryFn: () =>
      getCashFlowData({
        start_date: timeRange.startDate.toISOString().split("T")[0],
        end_date: timeRange.endDate.toISOString().split("T")[0],
        interval: timeRange.interval,
      }),
    enabled: isUserAuthenticated,
  });

  const {
    data: categoryTrends = [],
    isLoading: categoryTrendsLoading,
    error: categoryTrendsError,
  } = useQuery({
    queryKey: ["category-trends", selectedCategory, timeRange],
    queryFn: () => {
      if (!selectedCategory) return Promise.resolve(null);
      return getCategoryTrends({
        category_id: selectedCategory,
        months: 6,
      });
    },
    enabled: !!selectedCategory && isUserAuthenticated,
  });

  const getFilenameFromDispositionHeader = (disposition: string): string => {
    const filenameStarMatch = disposition.match(
      /filename\*\=UTF-8''(.+?)(?:;|$)/
    );
    if (filenameStarMatch && filenameStarMatch[1]) {
      return decodeURIComponent(filenameStarMatch[1]);
    }
    const filenameMatch = disposition.match(/filename="(.+?)"/);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1];
    }
    return "Report.csv";
  };

  const handleReportExport = async () => {
    try {
      setIsExportingReport(true);
      const params = {
        start_date: timeRange.startDate.toISOString().split("T")[0],
        end_date: timeRange.endDate.toISOString().split("T")[0],
        interval: timeRange.interval,
        category_id: selectedCategory || undefined,
      };

      const response = await exportReportData(params);
      const disposition = response.headers["content-disposition"];
      const filename = disposition
        ? getFilenameFromDispositionHeader(disposition)
        : "Report.csv";
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to export report. Please try again.");
    } finally {
      setIsExportingReport(false);
    }
  };

  return (
    <Fragment>
      {spendingLoading ||
      cashFlowLoading ||
      categoryTrendsLoading ||
      !loginStatusState.userDefaultCurrency ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {(spendingError || cashFlowError || categoryTrendsError) && (
            <ErrorMessage message="Failed to load report" />
          )}
          <div className="flex flex-col justify-between items-center">
            <h1 className="mt-2 mb-2 w-full text-center text-2xl font-lato font-[500]">
              Analyze your spending patterns and trends
            </h1>
            <Button onClick={handleReportExport}>
              {isExportingReport ? <LoadingSpinner /> : "Export report"}
            </Button>
          </div>

          <ReportTimeRange timeRange={timeRange} onChange={setTimeRange} />

          <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingByCategory
              data={spendingData}
              onCategorySelect={setSelectedCategory}
              selectedCategory={selectedCategory}
            />

            <CashFlowReport
              data={cashFlowData}
              timeRange={timeRange}
              userDefaultCurrency={loginStatusState.userDefaultCurrency}
            />
          </div>

          {selectedCategory && (
            <CategoryTrendReport
              data={categoryTrends}
              categoryId={selectedCategory}
            />
          )}
        </div>
      )}
    </Fragment>
  );
};
