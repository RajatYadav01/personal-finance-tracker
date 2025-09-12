class Budget < ApplicationRecord
  belongs_to :user
  has_many :budget_categories
  has_many :categories, through: :budget_categories
  has_many :transactions, dependent: :nullify

  validates :name, presence: true, length: { maximum: 50 }
  validates :description, length: { maximum: 500 }
  validates :monthly_limit,
            numericality: { greater_than: 0 },
            allow_nil: true

  scope :active, -> { where(archived: false) }

  def current_spending(start_date = Date.current.beginning_of_month, end_date = Date.current.end_of_month)
    transactions.where(date: start_date..end_date)
                .expense
                .sum(:amount)
  end

  def utilization_percentage
    return 0 unless monthly_limit

    (current_spending / monthly_limit * 100).round(2)
  end
end
