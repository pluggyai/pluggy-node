export declare const CURRENCY_CODES: readonly ["USD", "ARS", "BRL"];
/**
 * @typedef CurrencyCode
 * Supported currency ISO codes
 */
export declare type CurrencyCode = typeof CURRENCY_CODES[number];
export declare type PageResponse<T> = {
    results: T[];
};
