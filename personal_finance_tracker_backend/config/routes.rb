require 'sidekiq/web'
# Enable sessions and cookies just for the Sidekiq Web UI
Sidekiq::Web.use ActionDispatch::Cookies
Sidekiq::Web.use ActionDispatch::Session::CookieStore, key: 'personal-finance-tracker'

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  namespace :api do
    namespace :v1 do
      # Authentication
      resources :users, only: %i[update] do
        collection do
          get 'me', to: 'users#me'
          post 'register', to: 'users#register'
          post 'authenticate', to: 'users#login'
          patch 'reset_password', to: 'users#reset_password'
          post 'refresh', to: 'users#refresh_token'
          delete 'logout', to: 'users#logout'
          delete 'delete', to: 'users#delete'
        end
      end

      resources :budgets

      resources :transactions do
        collection do
          get 'recent', to: 'transactions#recent'
          get 'summary', to: 'transactions#summary'
        end
      end

      resources :categories, except: %i[new edit]

      get 'reports/spending', to: 'reports#spending'
      get 'reports/trends', to: 'reports#trends'
      get 'reports/cash_flow', to: 'reports#cash_flow'
      get 'reports/category_trends', to: 'reports#category_trends'
      get 'reports/export', to: 'reports#export'
    end
  end
  mount Sidekiq::Web => '/sidekiq'
end
