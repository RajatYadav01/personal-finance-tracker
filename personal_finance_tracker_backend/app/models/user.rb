class User < ApplicationRecord
  has_secure_password
  has_many :refresh_tokens, dependent: :destroy
  has_many :transactions, dependent: :destroy
  has_many :recurring_transactions
  has_many :categories
  has_many :budgets

  before_validation :normalize_currency
  validates :name, presence: { message: 'Name cannot be blank' }
  validates :email_address, presence: { message: 'Email address cannot be blank' }
  validates :email_address,
            format: {
              with: URI::MailTo::EMAIL_REGEXP,
              message: 'Must be a valid email address'
            },
            uniqueness: {
              case_sensitive: false,
              message: 'Email address is already registered'
            }
  validates :password,
            length: {
              minimum: 8,
              message: 'Password must be at least 8 characters long'
            },
            format: {
              with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)./x,
              message: 'Must include at least one lowercase letter, one uppercase letter, and one digit'
            },
            if: :password_required?

  SUPPORTED_CURRENCIES = %w[AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BRL BSD BTN BWP
                            BYN BYR BZD CAD CDF CHF CLF CLP CNY COP CRC CUC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GGP GHS GIP GMD GNF GTQ GYD HKD HNL HRK HTG HUF IDR ILS IMP INR IQD IRR ISK JEP JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LSL LTL LVL LYD MAD MDL MGA MKD MMK MNT MOP MRO MUR MVR MWK MXN MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLL SOS SRD STD SVC SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS UAH UGX USD UYU UZS VEF VND VUV WST XAF XCD XOF XPF YER ZAR ZMW ZWL]

  validates :currency, inclusion: {
    in: SUPPORTED_CURRENCIES,
    message: '%<value>s is not a supported currency'
  }
  validate :password_complexity

  private

  def normalize_currency
    self.currency = currency&.upcase
  end

  def password_required?
    new_record? || password.present?
  end

  def password_complexity
    return if password.blank?
    return if password.match?(/[!@#$%^&*(),.?":{}|<>]/)
    errors.add :password, 'must include at least one special character'
  end
end
