import { Connector } from "../connector"

export const PAYMENT_CUSTOMER_TYPE = ['INDIVIDUAL', 'BUSINESS'] as const

/**
 * @typedef PaymentCustomerType
 * Types of customers
 */
export type PaymentCustomerType = typeof PAYMENT_CUSTOMER_TYPE[number]

export type PaymentCustomer = {
  id: string
  name: string
  email: string
  cpf: string
  cnpj: string
  type: PaymentCustomerType
  connector: Connector | null
  createdAt: Date
  updatedAt: Date
}

export type CreatePaymentCustomer = {
  name: string
  email: string
  cpf: string
  cnpj: string
  type: PaymentCustomerType
}
