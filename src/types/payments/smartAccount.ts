export type SmartAccount = {
  id: string
  agency: string
  number: string
  verifyingDigit: string
  type: 'CHECKING_ACCOUNT'
  isSandbox: boolean
}

/**
 * @typedef CreateSmartAccount
 * Data to create a new Smart Account
 * @property {string} name - Name of the owner of the account (Name of the person or company)
 * @property {string} taxNumber - Tax number of the owner of the account (CPF or CNPJ)
 * @property {string} email - Email of the owner of the account
 * @property {string} phoneNumber - Phone number of the owner of the account
 * @property {boolean} [isSandbox] - Indicates if the account is a sandbox account (default is false)
 */
export type CreateSmartAccount = {
  name: string
  taxNumber: string
  email: string
  phoneNumber: string
  isSandbox?: boolean
}

export type SmartAccountBalance = {
  lastUpdatedAt: string
  balance: number
  blockedBalance: number
  scheduledBalance: number
}
