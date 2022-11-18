import { CurrencyCode } from './common'

export const OPPORTUNITY_TYPES = [
  'CREDIT_CARD',
  'PERSONAL_LOAN',
  'BUSINESS_LOAN',
  'MORTGAGE_LOAN',
  'VEHICLE_LOAN',
  'OVERDRAFT',
  'OTHER_LOAN',
  'OTHER',
]

export type OpportunityType = typeof OPPORTUNITY_TYPES[number]

export const OPPORTUNITY_DATE_TYPES = ['YEARLY', 'MONTHLY']
export type OpportunityDateType = typeof OPPORTUNITY_DATE_TYPES[number]

export type Opportunity = {
  /* Total pre-approved money */
  totalLimit?: number
  /* Money used to date */
  usedLimit?: number
  /* Money available to ask at present */
  availableLimit?: number
  /* Number of maximum quotes */
  totalQuotas?: number
  /* Type of annual or monthly quotas */
  quotasType?: OpportunityDateType
  /* Rate of interest charged by the loan */
  interestRate?: number
  /* Type of annual or monthly taxa */
  rateType?: OpportunityDateType
  /* Type of product */
  type: OpportunityType
  /* Commercial name */
  name: string
  /* Additional description of product */
  description?: string
  /* Date of extraction of the product */
  date: Date
  /* Currency code money */
  currencyCode: CurrencyCode
  /* id of the item related */
  itemId: string
  /* id of the product */
  id: string
}

export type OpportunityFilters = {
  /** Amount of opportunities to retrieve */
  pageSize?: number
  /** Page of opportunities to retrieve, this calculates the offset */
  page?: number
}
