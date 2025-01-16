export type IdentityResponse = {
  /** Primary identifier of the entity */
  id: string
  /** Primary identifier of the Item */
  itemId: string
  /** Date of birth of the owner */
  birthDate: Date | null
  /** Primary tax identifier (CNPJ or CUIT) */
  taxNumber: string | null
  /** Primary ID (DNI or CPF) */
  document: string | null
  /** Type of ID (DNI, CPF, CNPJ) */
  documentType: string | null
  /** Title of the job position */
  jobTitle: string | null
  /** For business connection, the business's name. */
  companyName: string | null
  /** Complete name of the account owner */
  fullName: string | null
  /** List of associated phone numbers */
  phoneNumbers: PhoneNumber[] | null
  /** List of associated emails */
  emails: Email[] | null
  /** List of associated phisical addresses */
  addresses: Address[] | null
  /** List of associated personal relationships */
  relations: IdentityRelation[] | null
  /** The investor's personality and motivation for investing  */
  investorProfile: 'Conservative' | 'Moderate' | 'Aggressive' | null
  /** Name of the establishment */
  establishmentName: string | null
  /** Code of the establishment */
  establishmentCode: string | null
  /** List of financial relationships */
  financialRelationships: FinancialRelationships | null
  /** List of qualifications */
  qualifications: Qualifications | null
  /** Date of the first time that the Identity was recovered */
  createdAt: Date
  /** Last update of the Identity data (if the data never changes, updatedAt will be the same as createdAt) */
  updatedAt: Date
}

export type PhoneNumber = {
  type: 'Personal' | 'Work' | 'Residencial' | null
  value: string
}

export type Email = {
  type: 'Personal' | 'Work' | null
  value: string
}

export type IdentityRelation = {
  type: 'Mother' | 'Father' | 'Spouse' | null
  name: string | null
  document: string | null
}

export type Address = {
  fullAddress: string | null
  primaryAddress: string | null
  city: string | null
  postalCode: string | null
  state: string | null
  country: string | null
  type: 'Personal' | 'Work' | null
}

export type FinancialRelationships = {
  /** Start date of the relationship */
  startDate: Date
  /** List of products and services type */
  productsServicesType: string[]
  /** List of procurators */
  procurators: Procurator[]
  /** List of accounts */
  accounts?: FinancialRelationshipAccount[]
}

export type FinancialRelationshipAccount = {
  /** Code of the bank */
  compeCode: string
  /** Code of the branch */
  branchCode: string
  /** Number of the account */
  number: string
  /** Check digit of the account */
  checkDigit: string
  /** Type of the account */
  type: 'CONTA_DEPOSITO_A_VISTA' | 'CONTA_POUPANCA' | 'CONTA_PAGAMENTO_PRE_PAGA'
  /** Subtype of the account */
  subtype: 'INDIVIDUAL' | 'CONJUNTA_SIMPLES' | 'CONJUNTA_SOLIDARIA'
}

export type Procurator = {
  /** Type of representative */
  type: 'REPRESENTANTE_LEGAL' | 'PROCURADOR'
  /** CPF number of the procurator */
  cpfNumber: string
  /** Civil name of the procurator */
  civilName: string
  /** Social name of the procurator (if any) */
  socialName?: string
}

export type Qualifications = {
  /** CNPJ of the company */
  companyCnpj: string
  /** Code of the occupation */
  occupationCode?: 'RECEITA_FEDERAL' | 'CBO' | 'OUTRO'
  /** Informed income */
  informedIncome?: InformedIncome
  /** Informed patrimony */
  informedPatrimony?: InformedPatrimony
}

export type InformedIncome = {
  /** Frequency of the income (e.g., daily) */
  frequency:
    | 'DIARIA'
    | 'SEMANAL'
    | 'QUINZENAL'
    | 'MENSAL'
    | 'BIMESTRAL'
    | 'TRIMESTRAL'
    | 'SEMESTRAL'
    | 'ANUAL'
    | 'OUTROS'
  /** Income amount */
  amount: number
  /** Date the income was informed */
  date: Date
}

export type InformedPatrimony = {
  /** Patrimony amount */
  amount: number
  /** Year of the patrimony */
  year: number
}
