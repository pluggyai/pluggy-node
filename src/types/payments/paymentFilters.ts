import { PageFilters, DateFilters } from '../common'

export type PaymentRequestsFilters = PageFilters & DateFilters

export type PaymentIntentsFilters = PageFilters & DateFilters

export type PaymentRecipientsFilters = PageFilters

export type PaymentCustomersFilters = PageFilters

export type PaymentInstitutionsFilters = PageFilters & { name?: string }

export type SmartTransferPreauthorizationsFilters = PageFilters

export type SmartTransferPreauthorizationPaymentsFilters = PageFilters & {
  /** Filter payments created from this date ('YYYY-MM-DD') */
  from?: string
  /** Filter payments created until this date ('YYYY-MM-DD') */
  to?: string
}
