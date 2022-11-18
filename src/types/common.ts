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

export type PageResponse<T> = {
  results: T[]
  page: number
  total: number
  totalPages: number
}

export type PaginationFilters = {
  page?: number
  pageSize?: number
}
