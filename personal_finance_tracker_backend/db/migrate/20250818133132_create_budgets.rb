class CreateBudgets < ActiveRecord::Migration[7.1]
  def change
    create_table :budgets, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :name
      t.text :description
      t.decimal :monthly_limit
      t.boolean :archived

      t.timestamps
    end
  end
end
