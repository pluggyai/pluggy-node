import { PageFilters, DateFilters } from "../common"

export type PaymentRequestsFilters = PageFilters & DateFilters

export type PaymentIntentsFilters = PageFilters & DateFilters

export type PaymentRecipientsFilters = PageFilters

export type PaymentCustomersFilters = PageFilters

export type PaymentInstitutionsFilters = PageFilters & { name?: string }
