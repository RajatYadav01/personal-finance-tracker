class RecurringTransaction < ApplicationRecord
  belongs_to :user
  belongs_to :budget, optional: true
  belongs_to :category, optional: true

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :description, presence: true
  validates :frequency, presence: true, inclusion: { in: %w[daily weekly monthly yearly] }
  validates :transaction_type, presence: true, inclusion: { in: %w[income expense] }
  validates :next_occurrence, presence: true
  validates :currency, presence: true

  def schedule_next_occurrence!
    update(
      start_date: Time.current,
      next_occurrence: calculate_next_occurrence
    )
  end

  def create_transaction!
    Transaction.create!(
      user: user,
      budget: budget,
      category: category,
      amount: amount,
      currency: currency,
      description: description,
      date: Date.current,
      transaction_type: transaction_type,
      recurring: true,
      recurring_transaction_id: id
    )
  end

  private

  def calculate_next_occurrence
    case frequency
    when 'daily' then 1.day.from_now
    when 'weekly' then 1.week.from_now
    when 'monthly' then 1.month.from_now
    when 'yearly' then 1.year.from_now
    end
  end
end
