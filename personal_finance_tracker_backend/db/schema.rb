# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 20_250_910_213_818) do
  # These are extensions that must be enabled in order to support this database
  enable_extension 'plpgsql'
  enable_extension 'uuid-ossp'

  create_table 'active_storage_attachments', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.string 'name', null: false
    t.string 'record_type', null: false
    t.uuid 'record_id', null: false
    t.uuid 'blob_id', null: false
    t.datetime 'created_at', null: false
    t.index ['blob_id'], name: 'index_active_storage_attachments_on_blob_id'
    t.index %w[record_type record_id name blob_id], name: 'index_active_storage_attachments_uniqueness',
                                                    unique: true
  end

  create_table 'active_storage_blobs', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.string 'key', null: false
    t.string 'filename', null: false
    t.string 'content_type'
    t.text 'metadata'
    t.string 'service_name', null: false
    t.bigint 'byte_size', null: false
    t.string 'checksum'
    t.datetime 'created_at', null: false
    t.index ['key'], name: 'index_active_storage_blobs_on_key', unique: true
  end

  create_table 'active_storage_variant_records', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.uuid 'blob_id', null: false
    t.string 'variation_digest', null: false
    t.index %w[blob_id variation_digest], name: 'index_active_storage_variant_records_uniqueness', unique: true
  end

  create_table 'budgets', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.uuid 'user_id', null: false
    t.string 'name'
    t.text 'description'
    t.decimal 'monthly_limit'
    t.boolean 'archived'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['user_id'], name: 'index_budgets_on_user_id'
  end

  create_table 'categories', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.string 'name'
    t.string 'color'
    t.uuid 'user_id', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['user_id'], name: 'index_categories_on_user_id'
  end

  create_table 'recurring_transactions', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.uuid 'user_id', null: false
    t.uuid 'budget_id'
    t.uuid 'category_id'
    t.decimal 'amount'
    t.string 'description'
    t.string 'frequency'
    t.date 'start_date'
    t.date 'next_occurrence'
    t.string 'transaction_type'
    t.string 'currency'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['budget_id'], name: 'index_recurring_transactions_on_budget_id'
    t.index ['category_id'], name: 'index_recurring_transactions_on_category_id'
    t.index ['user_id'], name: 'index_recurring_transactions_on_user_id'
  end

  create_table 'refresh_tokens', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.string 'token'
    t.uuid 'user_id', null: false
    t.datetime 'expires_at'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['user_id'], name: 'index_refresh_tokens_on_user_id'
  end

  create_table 'transactions', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.uuid 'user_id', null: false
    t.uuid 'budget_id'
    t.uuid 'category_id'
    t.decimal 'amount'
    t.string 'description'
    t.date 'date'
    t.string 'transaction_type'
    t.string 'currency'
    t.boolean 'recurring'
    t.uuid 'recurring_transaction_id'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['budget_id'], name: 'index_transactions_on_budget_id'
    t.index ['category_id'], name: 'index_transactions_on_category_id'
    t.index ['recurring_transaction_id'], name: 'index_transactions_on_recurring_transaction_id'
    t.index ['user_id'], name: 'index_transactions_on_user_id'
  end

  create_table 'users', id: :uuid, default: -> { 'gen_random_uuid()' }, force: :cascade do |t|
    t.string 'name'
    t.string 'email_address'
    t.string 'password_digest'
    t.string 'currency'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['email_address'], name: 'index_users_on_email_address'
  end

  add_foreign_key 'active_storage_attachments', 'active_storage_blobs', column: 'blob_id'
  add_foreign_key 'active_storage_variant_records', 'active_storage_blobs', column: 'blob_id'
  add_foreign_key 'budgets', 'users'
  add_foreign_key 'categories', 'users'
  add_foreign_key 'recurring_transactions', 'budgets'
  add_foreign_key 'recurring_transactions', 'categories'
  add_foreign_key 'recurring_transactions', 'users'
  add_foreign_key 'refresh_tokens', 'users'
  add_foreign_key 'transactions', 'budgets'
  add_foreign_key 'transactions', 'categories'
  add_foreign_key 'transactions', 'recurring_transactions'
  add_foreign_key 'transactions', 'users'
end
