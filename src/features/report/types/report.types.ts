export interface SpendingData {
  category: string;
  category_id: string;
  amount: number;
  color: string;
  icon: string;
}

export interface CashFlowData {
  period: string;
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryTrendData {
  month: string;
  amount: number;
  category: string;
  color: string;
}

export interface TimeRange {
  startDate: Date;
  endDate: Date;
  interval: "daily" | "weekly" | "monthly" | "yearly";
}

export interface ReportParams {
  start_date?: string;
  end_date?: string;
  interval?: string;
  months?: number;
  category_id?: string;
  budget_id?: string;
}
