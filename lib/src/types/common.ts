export const CURRENCY_CODES = ['USD', 'ARS', 'BRL'] as const
/**
 * @typedef CurrencyCode
 * Supported currency ISO codes
 */
export type CurrencyCode = typeof CURRENCY_CODES[number]

export type PageResponse<T> = {
  results: T[]
}
