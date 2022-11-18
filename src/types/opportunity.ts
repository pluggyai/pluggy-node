import { CurrencyCode, PageFilters } from './common'

export const OPPORTUNITY_TYPES = [
  'CREDIT_CARD',
  'PERSONAL_LOAN',
  'BUSINESS_LOAN',
  'MORTGAGE_LOAN',
  'VEHICLE_LOAN',
  'OVERDRAFT',
  'OTHER_LOAN',
  'OTHER',
] as const

export type OpportunityType = typeof OPPORTUNITY_TYPES[number]

export const OPPORTUNITY_DATE_TYPES = ['YEARLY', 'MONTHLY'] as const
export type OpportunityDateType = typeof OPPORTUNITY_DATE_TYPES[number]

export type Opportunity = {
  /* Total pre-approved money */
  totalLimit: number | null
  /* Money used to date */
  usedLimit: number | null
  /* Money available to ask at present */
  availableLimit: number | null
  /* Number of maximum quotes */
  totalQuotas: number | null
  /* Type of annual or monthly quotas */
  quotasType: OpportunityDateType | null
  /* Rate of interest charged by the loan */
  interestRate: number | null
  /* Type of annual or monthly taxa */
  rateType: OpportunityDateType | null
  /* Type of product */
  type: OpportunityType
  /* Commercial name */
  name: string
  /* Additional description of product */
  description: string | null
  /* Date of extraction of the product */
  date: Date
  /* Currency code money */
  currencyCode: CurrencyCode
  /* id of the item related */
  itemId: string
  /* id of the product */
  id: string
}

export type OpportunityFilters = PageFilters
