export const CURRENCY_CODES = [
  'USD',
  'ARS',
  'BRL',
  'EUR',
  'MXN',
  'COP',
  'CLP',
  'UYU',
  'PYG',
  'PEN',
] as const
/**
 * @typedef CurrencyCode
 * Supported currency ISO codes
 */
export type CurrencyCode = typeof CURRENCY_CODES[number]

export const COUNTRY_CODES = ['AR', 'BR', 'CO', 'MX'] as const
/**
 * @typedef CountryCode
 *  Supported and available countries, in ISO-3166-1 alpha 2 format.
 *  Useful to filter connectors list.
 */
export type CountryCode = typeof COUNTRY_CODES[number]

export type PageResponse<T> = {
  results: T[]
  page: number
  total: number
  totalPages: number
}

export type PageFilters = {
  /** Page to retrieve, this calculates the offset */
  page?: number
  /** Amount of results to retrieve per page. Optional, default: 20. Maximum supported: 500. */
  pageSize?: number
}
