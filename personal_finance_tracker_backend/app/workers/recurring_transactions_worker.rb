class RecurringTransactionsWorker
  include Sidekiq::Worker

  def perform
    RecurringTransaction
      .where('next_occurrence <= ?', Time.current)
      .find_each do |rt|
        rt.create_transaction!
        rt.schedule_next_occurrence!
      end
  end
end
