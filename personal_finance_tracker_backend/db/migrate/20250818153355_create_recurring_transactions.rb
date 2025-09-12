class CreateRecurringTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :recurring_transactions, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :budget, null: true, foreign_key: true, type: :uuid
      t.references :category, null: true, foreign_key: true, type: :uuid
      t.decimal :amount
      t.string :description
      t.string :frequency
      t.date :start_date
      t.date :next_occurrence
      t.string :transaction_type
      t.string :currency

      t.timestamps
    end
  end
end
