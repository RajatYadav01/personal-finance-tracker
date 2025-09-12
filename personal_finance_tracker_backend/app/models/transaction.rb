class Transaction < ApplicationRecord
  belongs_to :user
  belongs_to :budget, optional: true
  belongs_to :category, optional: true
  belongs_to :recurring_transaction, optional: true
  has_one_attached :receipt

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :description, presence: true
  validates :date, presence: true
  validates :transaction_type, presence: true, inclusion: { in: %w[income expense] }
  validates :currency, presence: true

  scope :income, -> { where(transaction_type: 'income') }
  scope :expense, -> { where(transaction_type: 'expense') }
end
