class Category < ApplicationRecord
  belongs_to :user
  has_many :budget_categories
  has_many :budgets, through: :budget_categories
  has_many :transactions, dependent: :nullify

  validates :name, 
    presence: true,
    uniqueness: { scope: :user_id },
    length: { maximum: 50 }
  validates :color,
    presence: true,
    format: { with: /\A#[0-9a-fA-F]{6}\z/ }
end
