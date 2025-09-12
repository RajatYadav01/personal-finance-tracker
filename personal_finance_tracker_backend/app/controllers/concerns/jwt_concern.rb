module JwtConcern
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
  end

  def jwt_encode(payload, exp = nil)
    exp ||= Time.now.to_i + ENV.fetch('JWTEXPIRYTIME', '900').to_i
    payload[:exp] = exp.to_i
    JWT.encode(payload, ENV.fetch('JWTSECRETKEY'))
  end

  def jwt_decode(token)
    decoded = JWT.decode(token, ENV.fetch('JWTSECRETKEY'))[0]
    HashWithIndifferentAccess.new(decoded)
  end

  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header

    begin
      decoded = jwt_decode(token)
      @current_user = User.find(decoded[:user_id])
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
