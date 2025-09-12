module Api::V1
  class UsersController < ApplicationController
    skip_before_action :authenticate_request, only: %i[register login refresh_token reset_password]

    def me
      if current_user
        render json: { user: current_user.as_json(except: [:password_digest]) }, status: :ok
      else
        render json: { message: 'Unauthorized access' }, status: :unauthorized
      end
    end

    def register
      user = User.new(user_params)
      if user.save
        token = jwt_encode(user_id: user.id)
        render json: { message: 'Registration successful', user: user.as_json(except: [:password_digest]), token: token },
               status: :created
      elsif user.errors[:email_address].include?('Email address is already registered')
        render json: { message: 'User with the given email address already exists' },
               status: :unprocessable_content
      else
        logger.debug 'User registration failed: #{user.errors.full_messages}'
        render json: { message: user.errors.full_messages },
               status: :unprocessable_content
      end
    end

    def login
      user = User.find_by(email_address: params[:emailAddress])

      if user.nil?
        render json: { message: 'User does not exist with the entered email address' }, status: :not_found
      elsif user.authenticate(params[:password])
        access_token = jwt_encode(user_id: user.id)
        refresh_token = user.refresh_tokens.create!(expires_at: 7.days.from_now)
        render json: {
          message: 'Logged in successfully',
          user: user.as_json(except: [:password_digest]),
          access_token: access_token,
          refresh_token: refresh_token.token
        }, status: :ok
      else
        render json: { message: 'Invalid password' }, status: :unauthorized
      end
    end

    def refresh_token
      token = request.headers['X-Refresh-Token']

      return render json: { error: 'Refresh token missing' }, status: :bad_request if token.blank?

      stored_token = RefreshToken.find_by(token: token)

      if stored_token&.expired?
        stored_token.destroy
        return render json: { error: 'Refresh token expired' }, status: :unauthorized
      end

      if stored_token
        user = stored_token.user
        access_token = jwt_encode(user_id: user.id)

        render json: {
          message: 'Access token refreshed successfully',
          access_token: access_token,
          user: user.as_json(except: [:password_digest])
        }, status: :ok
      else
        render json: { error: 'Invalid refresh token' }, status: :unauthorized
      end
    end

    def logout
      token = params[:refresh_token]
      stored_token = RefreshToken.find_by(token: token)
      stored_token&.destroy
      render json: { message: 'Logged out successfully' }, status: :ok
    end

    def update
      user = current_user

      old_currency = user.currency
      new_currency = params[:user][:currency]

      ActiveRecord::Base.transaction do
        if new_currency.present? && old_currency != new_currency
          rate = fetch_exchange_rate(old_currency, new_currency)
          user.transactions.find_each do |tx|
            tx.update!(amount: tx.amount * rate)
          end
          user.recurring_transactions.find_each do |rtx|
            rtx.update!(amount: rtx.amount * rate)
          end
          user.budgets.find_each do |budget|
            budget.monthly_limit = budget.monthly_limit * rate if budget.monthly_limit.present?
            budget.save!
          end
          user.balance = user.balance * rate if user.respond_to?(:balance) && user.balance.present?
        end

        raise ActiveRecord::Rollback, 'User update failed' unless user.update(user_params)

        render json: {
          message: 'User details updated successfully',
          user: user.as_json(except: [:password_digest])
        }, status: :ok
      end
    end

    def reset_password
      user = User.find_by(name: params[:name], email_address: params[:emailAddress])

      if user.nil?
        return render json: { message: 'No user found with the provided name and email address' }, status: :not_found
      end

      if params[:password].blank?
        return render json: { message: 'Password cannot be blank' },
                      status: :unprocessable_content
      end

      if user.update(password: params[:password])
        render json: { message: 'Password has been reset successfully' }, status: :ok
      else
        render json: { message: user.errors.full_messages }, status: :unprocessable_content
      end
    end

    def delete
      user = current_user

      return render json: { message: 'Unauthorized' }, status: :unauthorized unless user

      ActiveRecord::Base.transaction do
        user.transactions.find_each do |transaction|
          transaction.receipt.purge if transaction.receipt.attached?
          transaction.destroy!
        end
        user.recurring_transactions.find_each do |recurring|
          recurring.destroy!
        end
        user.budgets.destroy_all
        user.categories.destroy_all
        user.refresh_tokens.destroy_all
        user.destroy!
      end

      render json: { message: 'User and all related data deleted successfully' }, status: :ok
    rescue StandardError => e
      render json: { message: "Failed to delete user: #{e.message}" }, status: :internal_server_error
    end

    private

    def user_params
      raw = params.require(:user).permit(:name, :emailAddress, :currency, :password, :confirmPassword)
      {
        name: raw[:name],
        email_address: raw[:emailAddress],
        password: raw[:password],
        password_confirmation: raw[:confirmPassword],
        currency: raw[:currency]
      }
    end

    def fetch_exchange_rate(from_currency, to_currency)
      return 1.0 if from_currency == to_currency

      rate = ExchangeRate.find_by(
        base_currency: from_currency,
        target_currency: to_currency,
        date: Date.current
      )&.rate

      return rate if rate.present?

      api_rate = fetch_rates_from_api(from_currency, [to_currency])[to_currency]
      ExchangeRate.create!(
        base_currency: from_currency,
        target_currency: to_currency,
        rate: api_rate,
        date: Date.current
      )
      api_rate
    end

    def fetch_rates_from_api(base_currency, target_currencies)
      symbols = target_currencies.join(',')
      uri = URI("https://api.exchangerate.host/latest?base=#{base_currency}&symbols=#{symbols}")
      response = Net::HTTP.get(uri)
      data = JSON.parse(response)

      raise 'Failed to fetch exchange rates from API' unless data['success']

      data['rates'].slice(*target_currencies)
    rescue StandardError => e
      Rails.logger.error("Currency conversion API error: #{e.message}")
      target_currencies.index_with { 1.0 }
    end
  end
end
