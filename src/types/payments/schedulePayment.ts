export const SCHEDULED_PAYMENT_STATUSES = ['SCHEDULED', 'COMPLETED', 'ERROR', 'CANCELED'] as const

export type ScheduledPaymentStatus = typeof SCHEDULED_PAYMENT_STATUSES[number]

export type SchedulePayment = {
  id: string
  status: ScheduledPaymentStatus
  scheduledDate: string
  description: string
}
