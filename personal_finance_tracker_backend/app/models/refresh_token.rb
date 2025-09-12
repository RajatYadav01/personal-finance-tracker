class RefreshToken < ApplicationRecord
  belongs_to :user

  before_create :generate_token
  validates :token, uniqueness: true
  validates :expires_at, presence: true

  scope :active, -> { where('expires_at > ?', Time.current) }

  def expired?
    Time.current >= expires_at
  end

  private

  def generate_token
    self.token = SecureRandom.hex(64)
  end
end
