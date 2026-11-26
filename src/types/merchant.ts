import { TransactionMerchantData } from './transaction'

export type MerchantsResponse = {
  /** List of merchants found for the provided CNPJs */
  foundMerchants: TransactionMerchantData[]
  /** List of valid CNPJs that were not found in the merchant database */
  notFoundMerchants: string[]
  /** List of invalid CNPJ values provided */
  invalidCnpjs: string[]
}
