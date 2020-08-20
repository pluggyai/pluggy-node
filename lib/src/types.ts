/*
 * @typedef TransactionFilters
 * @type {object}
 * @property {string} from - filter greater than date. Format (ISO Date | yyyy-mm-dd)
 * @property {string} to - filter greater than date. Format (ISO Date | yyyy-mm-dd)
 * @property {number} pageSize - Amount of transactions to retrieve
 * @property {number} page - Page of transactions to retrieve, this calculates the offset.
 */
export type TransactionFilters = {
  to?: string;
  from?: string;
  pageSize?: number;
  page?: number;
}

/*
 * @typedef ConnectorFilters
 * @type {object}
 * @property {string} name - Connector´s name or alike name
 * @property {string[]} countries - list of countries to filter available connectors
 * @property {string[]} types - list of types to filter available connectors
 */
export type ConnectorFilters = {
  name?: string;
  countries?: string[];
  types?: string[];
}

export type CurrencyCode = 'USD' | 'ARS' | 'BRL'
export type AccountType = 'BANK' | 'CREDIT'
export type AccountSubType = 'SAVINGS_ACCOUNT' | 'CHECKINGS_ACCOUNT' | 'CREDIT_CARD'
export type InvestmentType = 'MUTUAL_FUND' | 'SECURITY' | 'EQUITY'
/*
 * @typedef Category
 * @type {object}
 * @property {string} id - primary identifier of the category
 * @property {string} description - Category's name or description.
 * @property {string} parentId - Parent category hierachy primary identifier
 * @property {string} parentDescription - Parent category hierachy name or description
 */
export type Category = {
  id: string;
  description: string;
  parentId?: string;
  parentDescription?: string;
}

/*
 * @typedef Investment
 * @type {object}
 * @property {string} id - primary identifier of the investment
 * @property {string} itemId - primary identifier of the Item
 * @property {string} name - Investment description
 * @property {string} number - Identifier from the institution for the investment.
 * @property {number} balance - Current balance of the investment
 * @property {number} annualRate - Annual rate of the investment
 * @property {CurrencyCode} currencyCode - ISO Currency code of the investment
 * @property {InvestmentType} type - Type of the investment
 */
export type Investment = {
  id: string;
  itemId: string;
  type: InvestmentType;
  number: string;
  balance: number;
  name: string;
  annualRate: number;
  currencyCode: CurrencyCode;
}

/*
 * @typedef Account
 * @type {object}
 * @property {string} id - primary identifier of the account
 * @property {string} itemId - primary identifier of the Item
 * @property {string} name - Account's name or description
 * @property {string} marketingName - Account's name provided by the institution based on the level of client.
 * @property {string} number - Account's provider number
 * @property {number} balance - Current balance of the account
 * @property {string} owner - Account's owner´s name
 * @property {string} taxNumber - Account's owner´s tax number
 * @property {CurrencyCode} currencyCode - ISO Currency code of the investment
 * @property {AccountType} type - Type of the account
 * @property {AccountSubType} subtype - Sub type of the account
 */
export type Account = {
  id: string;
  itemId: string;
  type: AccountType;
  subtype: AccountSubType;
  number: string;
  balance: number;
  name: string;
  marketingName?: string;
  owner?: string;
  taxNumber?: string;
  currencyCode: CurrencyCode;
  bankData?: BankData;
  creditData?: CreditData;
}

/*
 * @typedef BankData
 * @type {object}
 * @property {string} transferNumber - primary identifier of the account to make bank transfers
 * @property {string} closingBalance - available balance of the account
 */
export type BankData = {
  transferNumber?: string;
  closingBalance?: number;
}

/*
 * @typedef CreditData
 * @type {object}
 * @property {string} level - Credit card client's level
 * @property {string} brand - Credit card brand
 * @property {Date} balanceCloseDate - Current balance close date
 * @property {Date} balanceDueDate - Current balance due date
 * @property {number} minimumPayment - Current balance minimum payment due
 * @property {number} balanceForeignCurrency - Current balance in foreign currency
 * @property {number} availableCreditLimit - Available credit limit to use.
 */
export type CreditData = {
  level?: string;
  brand?: string;
  balanceCloseDate?: Date;
  balanceDueDate?: Date;
  availableCreditLimit?: number;
  balanceForeignCurrency?: number;
  minimumPayment?: number;
}

/*
 * @typedef Transaction
 * @type {object}
 * @property {string} id - primary identifier of the transaction
 * @property {string} accountId - primary identifier of the Account
 * @property {string} description - Transaction original description
 * @property {Date} date - Date of the transaction that was made.
 * @property {number} amount - Amount of the transaction
 * @property {number} balance - Current balance of the trasaction, after transaction was made.
 * @property {CurrencyCode} currencyCode - ISO Currency code of the Transaction
 */
export type Transaction = {
  id: string;
  accountId: string;
  date: Date;
  description: string;
  amount: number;
  balance: number;
  currencyCode: CurrencyCode;
  providerCode?: string;
}

/*
 * @typedef ConnectorCredential
 * @type {object}
 * @property {string} label - parameter label that describes it
 * @property {string} name - parameter key name
 * @property {string} type - type of parameter to create the form
 * @property {boolean} mfa - If parameter is used for MFA.
 */
export type ConnectorCredential = {
  label: string;
  name: string;
  type?: 'text' | 'password' | 'number';
  mfa?: boolean;
}

/*
 * @typedef Connector
 * @type {object}
 * @property {number} id - primary identifier of the connector
 * @property {string} name - Connector's institution name
 * @property {string} institutionUrl - Url of the institution that the connector represents
 * @property {string} imageUrl - Image url of the institution.
 * @property {string} primaryColor - Primary color of the institution
 * @property {string} country - Country of the institution
 * @property {string} type - Type of the connector
 * @property {any} credentials - List of parameters needed to execute the connector
 */
export type Connector = {
  id: string;
  name: string;
  institutionUrl: string;
  imageUrl: string;
  primaryColor: string;
  type: string;
  country: string;
  credentials: ConnectorCredential[];
}

/*
 * @typedef Item
 * @type {object}
 * @property {number} id - primary identifier of the Item
 * @property {Connector} connector - Connector's associated with item
 * @property {string} status - Current status of the item
 * @property {string} executionStatus - Current execution status of item.
 * @property {Date} createdAt - Date of the first connection
 * @property {Date} lastUpdatedAt - Last connection sync date with the institution.
 */
export type Item = {
  id: string;
  connector: Connector;
  status: string;
  executionStatus: string;
  createdAt: Date;
  lastUpdatedAt?: Date;
}

export type PageResponse<T> = {
  results: T[];
}

export type Webhook = {
  id: string;
  event: string;
  url: string;
}

export type WebhookEvent = 'item/created' | 'item/updated' | 'item/error' | 'all'