module Api::V1
  class TransactionsController < ApplicationController
    before_action :set_transaction, only: %i[update destroy]

    def index
      @transactions = current_user.transactions
      @transactions = @transactions.where(budget_id: params[:budget_id]) if params[:budget_id]
      @transactions = @transactions.where(transaction_type: params[:type]) if params[:type]

      render json: @transactions
        .includes(:recurring_transaction)
        .order(date: :desc)
        .as_json(include: :recurring_transaction)
    end

    def summary
      start_date = params[:start_date]&.to_date || Date.current.beginning_of_month
      end_date = params[:end_date]&.to_date || Date.current.end_of_month

      prev_start_date = (start_date - 1.month).beginning_of_month
      prev_end_date = (start_date - 1.month).end_of_month

      transactions = current_user.transactions
                                 .where(date: start_date..end_date)
                                 .group(:transaction_type)
                                 .sum(:amount)

      income = transactions['income'] || 0
      expenses = transactions['expense'] || 0
      balance = income - expenses

      prev_transactions = current_user.transactions
                                      .where(date: prev_start_date..prev_end_date)
                                      .group(:transaction_type)
                                      .sum(:amount)

      previous_income = prev_transactions['income'] || 0
      previous_expenses = prev_transactions['expense'] || 0

      render json: {
        income: income,
        expenses: expenses,
        balance: balance,
        previous_month_income: previous_income,
        previous_month_expenses: previous_expenses
      }
    end

    def recent
      limit = [params[:limit].to_i, 50].min
      limit = 5 if limit <= 0

      transactions = current_user.transactions
                                 .includes(:recurring_transaction)
                                 .order(date: :desc)
                                 .limit(limit.to_i)

      render json: transactions.as_json(include: :recurring_transaction)
    end

    def create
      if params[:transaction][:recurring] == 'true'
        @recurring_transaction = current_user.recurring_transactions.new(recurring_transaction_params.except(:date))
        if @recurring_transaction.save
          render json: @recurring_transaction, status: :created
        else
          render json: @recurring_transaction.errors, status: :unprocessable_content
        end
      else
        @transaction = current_user.transactions.new(transaction_params)
        @transaction.receipt.attach(params[:transaction][:receipt]) if params[:transaction][:receipt].present?

        if @transaction.save
          receipt_url = @transaction.receipt.attached? ? url_for(@transaction.receipt) : nil
          render json: @transaction.as_json.merge(receipt_url: receipt_url), status: :created
        else
          render json: @transaction.errors, status: :unprocessable_content
        end
      end
    end

    def update
      new_recurring_value = ActiveModel::Type::Boolean.new.cast(params[:transaction][:recurring])

      if @transaction.recurring? && !new_recurring_value
        recurring = @transaction.recurring_transaction
        @transaction.update!(recurring: false, recurring_transaction_id: nil)
        recurring&.destroy!
        render json: @transaction

      elsif !@transaction.recurring? && new_recurring_value
        recurring = current_user.recurring_transactions.new(recurring_transaction_params)
        if recurring.save
          if @transaction.update(recurring: true, recurring_transaction_id: recurring.id)
            render json: @transaction
          else
            render json: @transaction.errors, status: :unprocessable_content
          end
        else
          render json: recurring.errors, status: :unprocessable_content
        end

      elsif @transaction.recurring? && @transaction.recurring_transaction_id.present?
        recurring = @transaction.recurring_transaction
        if recurring.update(recurring_transaction_params)
          render json: recurring
        else
          render json: recurring.errors, status: :unprocessable_content
        end

      elsif @transaction.update(transaction_params)
        render json: @transaction
      else
        render json: @transaction.errors, status: :unprocessable_content
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.message }, status: :unprocessable_content
    end

    def destroy
      if @transaction.recurring? && @transaction.recurring_transaction_id.present?
        recurring = @transaction.recurring_transaction

        ActiveRecord::Base.transaction do
          @transaction.destroy!
          recurring.destroy! if recurring.transactions.where.not(id: @transaction.id).empty?
        end

        head :no_content
      else
        @transaction.destroy
        head :no_content
      end
    rescue StandardError => e
      render json: { error: e.message }, status: :unprocessable_content
    end

    private

    def create_transaction
      @transaction = current_user.transactions.new(transaction_params.except(:frequency, :start_date, :next_occurrence))

      if params[:transaction] && params[:transaction][:receipt].present?
        @transaction.receipt.attach(params[:transaction][:receipt])
      end

      if @transaction.save
        render json: @transaction, status: :created
      else
        render json: @transaction.errors, status: :unprocessable_content
      end
    end

    def create_recurring_transaction
      @recurring = current_user.recurring_transactions.new(transaction_params.slice(
                                                             :amount, :description, :transaction_type, :budget_id, :category_id,
                                                             :frequency, :start_date, :next_occurrence
                                                           ))

      if @recurring.save
        render json: @recurring, status: :created
      else
        render json: @recurring.errors, status: :unprocessable_content
      end
    end

    def set_transaction
      @transaction = current_user.transactions.find(params[:id])
    end

    def transaction_params
      params.require(:transaction).permit(
        :amount, :description, :date, :transaction_type, :currency,
        :budget_id, :category_id, :recurring, :frequency,
        :start_date, :next_occurrence, :receipt
      )
    end

    def recurring_transaction_params
      params.require(:transaction).permit(
        :amount, :description, :transaction_type, :currency,
        :budget_id, :category_id, :frequency, :start_date, :next_occurrence
      )
    end
  end
end
