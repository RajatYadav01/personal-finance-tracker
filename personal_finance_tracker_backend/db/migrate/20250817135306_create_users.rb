class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    enable_extension 'uuid-ossp' unless extension_enabled?('uuid-ossp')

    create_table :users, id: :uuid do |t|
      t.string :name
      t.string :email_address
      t.string :password_digest
      t.string :currency
      # t.string :auth_token

      t.timestamps
    end
    add_index :users, :email_address
    # add_index :users, :auth_token
  end
end
