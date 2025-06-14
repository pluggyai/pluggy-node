import { PageFilters, PageResponse } from '../common'

export const AUTOMATIC_PIX_PAYMENT_STATUSES = [
  'SCHEDULED',
  'CREATED',
  'COMPLETED',
  'CANCELED',
  'ERROR',
] as const
export type AutomaticPixPaymentStatus = typeof AUTOMATIC_PIX_PAYMENT_STATUSES[number]

export type AutomaticPixPaymentErrorDetail = {
  code: string
  description: string
  detail?: string
}

export type AutomaticPixPayment = {
  id: string
  status: AutomaticPixPaymentStatus
  amount: number
  description?: string
  date: string // YYYY-MM-DD
  endToEndId?: string
  errorDetail?: AutomaticPixPaymentErrorDetail | null
}

export type ScheduleAutomaticPixPaymentRequest = {
  amount: number
  description?: string
  date: string // YYYY-MM-DD
}

export type RetryAutomaticPixPaymentRequest = {
  date: string // YYYY-MM-DD
}

export type AutomaticPixPaymentListResponse = PageResponse<AutomaticPixPayment>

export type PaymentPixAutomaticFilters = PageFilters
