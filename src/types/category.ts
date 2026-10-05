export type Category = {
  /** primary identifier of the category */
  id: string
  /** Category's name or description. */
  description: string
  /** Parent category hierachy primary identifier */
  parentId?: string
  /** Parent category hierachy name or description */
  parentDescription?: string
}

export type ClientCategoryRule = {
  /** Description of the transaction rule */
  description: string
  /** Identifier of the category */
  categoryId?: string
  /** Description of the category */
  category: string
  /** Identifier of the client */
  clientId?: string
  /** Transaction type (DEBIT/CREDIT) */
  transactionType?: string
  /** Account type (CHECKING_ACCOUNT/CREDIT_CARD) */
  accountType?: string
}

export type CreateClientCategoryRule = {
  /** Description of the transaction rule */
  description: string
  /** Identifier of the category */
  categoryId: string
  /** Transaction type (DEBIT/CREDIT) */
  transactionType?: string
  /** Account type (CHECKING_ACCOUNT/CREDIT_CARD) */
  accountType?: string
  /** Type of match used to identify the rule (exact/contains/startsWith/endsWith). Defaults to 'exact' */
  matchType?: string
}
