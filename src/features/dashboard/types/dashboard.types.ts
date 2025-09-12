export interface Summary {
  balance: number;
  monthly_income: number;
  monthly_expenses: number;
}

export interface SpendingTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}
