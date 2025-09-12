class CreateTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :transactions, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :budget, null: true, foreign_key: true, type: :uuid
      t.references :category, null: true, foreign_key: true, type: :uuid
      t.decimal :amount
      t.string :description
      t.date :date
      t.string :transaction_type
      t.string :currency
      t.boolean :recurring
      t.references :recurring_transaction, null: true, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
