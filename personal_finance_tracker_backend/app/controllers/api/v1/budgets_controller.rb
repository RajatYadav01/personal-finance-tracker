module Api::V1
  class BudgetsController < ApplicationController
    before_action :set_budget, only: %i[update destroy]

    def index
      start_date = params[:start_date]&.to_date || Date.current.beginning_of_month
      end_date = params[:end_date]&.to_date || Date.current.end_of_month

      @budgets = current_user.budgets.includes(:transactions)

      render json: @budgets.map { |budget|
        filtered_transactions = budget.transactions.where(date: start_date..end_date)

        budget.as_json(only: %i[id name description monthly_limit created_at updated_at])
              .merge(
                current_spending: budget.current_spending(start_date, end_date),
                transactions: filtered_transactions.as_json(
                  only: %i[id amount description date transaction_type currency category_id recurring
                           recurring_transaction_id]
                )
              )
      }
    end

    def create
      @budget = current_user.budgets.new(budget_params)
      if @budget.save
        render json: @budget, status: :created
      else
        render json: @budget.errors, status: :unprocessable_content
      end
    end

    def update
      if @budget.update(budget_params)
        render json: @budget
      else
        render json: @budget.errors, status: :unprocessable_content
      end
    end

    def destroy
      @budget.destroy
      head :no_content
    end

    private

    def set_budget
      @budget = current_user.budgets.find(params[:id])
    end

    def budget_params
      params.require(:budget).permit(:name, :description, :monthly_limit)
    end
  end
end
