require 'csv'

module Api::V1
  class ReportsController < ApplicationController
    def spending
      start_date = parse_date(params[:start_date], Date.current.beginning_of_month)
      end_date = parse_date(params[:end_date], Date.current.end_of_month)
      budget_id = params[:budget_id]

      transactions = current_user.transactions
                                 .where(date: start_date..end_date)
                                 .where(budget_id: budget_id.presence)
                                 .group(:category_id)
                                 .sum(:amount)

      categories = Category.where(id: transactions.keys)
      data = categories.map do |category|
        {
          category: category.name,
          amount: transactions[category.id],
          color: category.color
        }
      end

      render json: data
    end

    def trends
      months = params[:months] ? params[:months].to_i : 6
      budget_id = params[:budget_id]

      data = (0..months - 1).map do |i|
        date = Date.current - i.months
        transactions = current_user.transactions
                                   .where(date: date.beginning_of_month..date.end_of_month)
                                   .where(budget_id: budget_id.presence)
                                   .group(:transaction_type)
                                   .sum(:amount)

        {
          month: date.strftime('%b %Y'),
          income: transactions['income'] || 0,
          expenses: transactions['expense'] || 0
        }
      end.reverse

      render json: data
    end

    def cash_flow
      start_date = parse_date(params[:start_date], 1.year.ago)
      end_date = parse_date(params[:end_date], Date.current)
      budget_id = params[:budget_id]
      interval = params[:interval] || 'monthly'

      data = calculate_cash_flow(start_date, end_date, budget_id, interval)

      render json: data
    end

    def category_trends
      category_id = params[:category_id]
      months = params[:months] ? params[:months].to_i : 6
      budget_id = params[:budget_id]

      data = (0..months - 1).map do |i|
        date = Date.current - i.months
        amount = current_user.transactions
                             .where(date: date.beginning_of_month..date.end_of_month)
                             .where(budget_id: budget_id.presence)
                             .where(category_id: category_id.presence)
                             .sum(:amount)

        {
          month: date.strftime('%b %Y'),
          amount: amount
        }
      end.reverse

      render json: data
    end

    def export
      start_date = parse_date(params[:start_date], 1.year.ago)
      end_date = parse_date(params[:end_date], Date.current)
      budget_id = params[:budget_id]

      transactions = current_user.transactions
                                 .where(date: start_date..end_date)
                                 .where(budget_id: budget_id.presence)
                                 .order(date: :desc)
                                 .includes(:category, :budget)

      csv_data = CSV.generate(headers: true) do |csv|
        csv << %w[Date Type Amount Currency Category Budget Description]
        transactions.each do |t|
          csv << [
            t.date,
            t.transaction_type,
            t.amount,
            t.currency,
            t.category&.name,
            t.budget&.name,
            t.description
          ]
        end
      end

      send_data csv_data, filename: "transactions-#{Date.current}.csv"
    end

    private

    def parse_date(date_string, default)
      date_string.present? ? Date.parse(date_string) : default
    rescue ArgumentError
      default
    end

    def calculate_cash_flow(start_date, end_date, budget_id, interval)
      case interval
      when 'daily'
        group_by = "DATE_TRUNC('day', date)"
        format = '%Y-%m-%d'
      when 'weekly'
        group_by = "DATE_TRUNC('week', date)"
        format = 'Week of %Y-%m-%d'
      when 'monthly'
        group_by = "DATE_TRUNC('month', date)"
        format = '%b %Y'
      when 'yearly'
        group_by = "DATE_TRUNC('year', date)"
        format = '%Y'
      end

      transactions = current_user.transactions
                                 .where(date: start_date..end_date)
                                 .where(budget_id: budget_id.presence)
                                 .select(
                                   "#{group_by} as period",
                                   "SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as income",
                                   "SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as expense"
                                 )
                                 .group('period')
                                 .order('period')

      transactions.map do |t|
        {
          period: t.period.strftime(format),
          income: t.income.to_f,
          expenses: t.expense.to_f,
          net: t.income.to_f - t.expense.to_f
        }
      end
    end
  end
end
