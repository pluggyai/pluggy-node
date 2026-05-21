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
  /** Social name of the natural person (the name by which travestis and transsexuals recognize themselves and are recognized in their community). PF-only field */
  socialName: string | null
  /** Sex of the natural person. PF-only field */
  sex: Sex | null
  /** Marital status of the natural person. PF-only field */
  maritalStatus: MaritalStatus | null
  /** Nationality of the natural person. PF-only field */
  nationality: Nationality | null
  /** Other identification documents the natural person holds. PF-only field */
  otherDocuments: OtherDocument[] | null
  /** Passport metadata for the natural person. PF-only field — applies when the client is a non-resident not required to register a CPF */
  passport: Passport | null
  /** Date the business was incorporated. PJ-only field */
  incorporationDate: Date | null
  /** Partners and administrators of the business. PJ-only field */
  parties: BusinessParty[] | null
  /** Additional documents for businesses headquartered abroad and not required to register a CNPJ. PJ-only field */
  businessOtherDocuments: BusinessOtherDocument[] | null
  /** CNPJs of the financial institutions responsible for the customer cadastro. Numbers only, no mask */
  companiesCnpj: string[] | null
  /** Date of the first time that the Identity was recovered */
  createdAt: Date
  /** Last update of the Identity data (if the data never changes, updatedAt will be the same as createdAt) */
  updatedAt: Date
}

export type PhoneNumber = {
  type: 'Personal' | 'Work' | 'Residencial' | null
  value: string
  /** International dialing code (DDI). Populated when different from '55' */
  countryCallingCode?: string | null
  /** Area code (DDD) of the phone */
  areaCode?: string | null
  /** Extension number, when part of the phone identification */
  extension?: string | null
  /** Additional info related to the source phone type */
  additionalInfo?: string | null
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
  additionalInfo: string | null
  /** District / neighborhood (bairro) */
  district?: string | null
  /** IBGE municipality code (7 digits). The first two digits identify the Federation Unit */
  ibgeTownCode?: string | null
  /** Country code in alpha3 ISO-3166 format (e.g. 'BRA') */
  countryCode?: string | null
  /** Geographic coordinates of the address */
  geographicCoordinates?: GeographicCoordinates | null
}

export type GeographicCoordinates = {
  /** Latitude in decimal degrees (WGS84). Between -90 and 90 */
  latitude: number
  /** Longitude in decimal degrees (WGS84). Between -180 and 180 */
  longitude: number
}

export type Sex = 'FEMALE' | 'MALE' | 'OTHER'

export type MaritalStatus = {
  code:
    | 'SINGLE'
    | 'MARRIED'
    | 'WIDOWED'
    | 'JUDICIALLY_SEPARATED'
    | 'DIVORCED'
    | 'STABLE_UNION'
    | 'OTHER'
  /** Free-text complement. Populated when code is OTHER */
  additionalInfo?: string
}

export type Nationality = {
  /** Whether the client has Brazilian nationality */
  hasBrazilianNationality: boolean
  /** Other nationalities held by the client, if any */
  otherNationalities?: OtherNationality[]
}

export type OtherNationality = {
  /** Country code in alpha3 ISO-3166 format */
  countryCode: string
  /** Supporting documents for this nationality */
  documents: NationalityDocument[]
}

export type NationalityDocument = {
  /** Document type (free text) */
  type: string
  /** Document number */
  number: string
  country?: string
  issueDate?: Date
  expirationDate?: Date
  additionalInfo?: string
}

export type OtherDocument = {
  /** Document type. Brazilian acronyms are kept verbatim; OTHER covers any other type */
  type: 'CNH' | 'RG' | 'NIF' | 'RNE' | 'OTHER'
  /** Free-text complement. Populated when type is OTHER */
  typeAdditionalInfo?: string
  /** Document number */
  number: string
  /** Check digit of the document, if it has one */
  checkDigit?: string
  /** Free-text complement, used to record the issuing authority (e.g. 'SSP/SP') when relevant */
  additionalInfo?: string
  expirationDate?: Date
}

export type Passport = {
  /** Passport number */
  number: string
  /** Issuing country in alpha3 ISO-3166 format */
  country: string
  issueDate?: Date
  expirationDate?: Date
}

export type BusinessParty = {
  /** Role of the party in the business */
  type: 'PARTNER' | 'ADMINISTRATOR'
  /** Whether the party is a natural person or a legal entity */
  personType: 'NATURAL_PERSON' | 'LEGAL_ENTITY'
  /** Type of the party's identification document */
  documentType: 'CPF' | 'CNPJ' | 'PASSPORT' | 'OTHER_TRAVEL_DOCUMENT'
  /** Number of the identification document (digits and check digit, if any) */
  documentNumber: string
  /** Issuing country of the document, alpha3 ISO-3166 */
  documentCountry?: string
  documentExpirationDate?: Date
  documentIssueDate?: Date
  /** Free-text complement when the document carries identification info that doesn't fit the other fields */
  documentAdditionalInfo?: string
  /** Civil name of the party. Required when personType is NATURAL_PERSON */
  civilName?: string
  /** Social name of the natural-person party, if any */
  socialName?: string
  /** Company name of the party. Required when personType is LEGAL_ENTITY */
  companyName?: string
  /** Trade name of the legal-entity party, if any */
  tradeName?: string
  /** Date the party's participation started */
  startDate?: Date
  /** Shareholding fraction between 0 and 1 (e.g. 0.51 represents 51%, 1 represents 100%). Required when type is PARTNER and the shareholding is 25% or higher */
  shareholding?: number
}

export type BusinessOtherDocument = {
  /** Type of the document (e.g. 'EIN') */
  type: string
  /** Document number */
  number: string
  /** Issuing country in alpha3 ISO-3166 format */
  country: string
  expirationDate?: Date
}

export type FinancialRelationships = {
  /** Start date of the relationship */
  startDate: Date
  /** List of products and services type */
  productsServicesType: string[]
  /** Additional info about the products and services. Populated when productsServicesType includes 'OUTROS' */
  productsServicesTypeAdditionalInfo?: string
  /** List of procurators */
  procurators: Procurator[]
  /** List of accounts */
  accounts?: FinancialRelationshipAccount[]
  /** Salary portabilities received by the institution from the client's previous paycheck banks (banco-folha). PF-only field */
  portabilitiesReceived?: PortabilityReceived[]
  /** Paycheck-bank links to employers, active or formerly active. PF-only field */
  paychecksBankLink?: PaycheckBankLink[]
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
  /** CPF or CNPJ of the procurator. For business links this field may hold a CNPJ (kept for backward compatibility — prefer documentNumber + documentType) */
  cpfNumber: string
  /** Document number of the procurator (CPF or CNPJ). Mirrors cpfNumber and is the canonical value to read */
  documentNumber?: string
  /** Type of document carried by documentNumber */
  documentType?: 'CPF' | 'CNPJ'
  /** Civil name of the procurator. For business procurators, may hold the company name */
  civilName: string
  /** Social name of the procurator (if any) */
  socialName?: string
}

export type PortabilityReceived = {
  /** Employer name as received in the portability message. When the employer is a legal entity, this is the company name */
  employerName: string
  /** Employer document (CPF or CNPJ) as received in the portability message */
  employerDocument: string
  /** CNPJ of the bank that holds the paycheck account (banco-folha) as received in the portability message */
  paycheckBankDetainerCnpj: string
  /** ISPB of the bank that holds the paycheck account as received in the portability message */
  paycheckBankDetainerIspb: string
  /** Date the portability was approved */
  portabilityApprovalDate: Date
}

export type PaycheckBankLink = {
  /** Employer name as registered when the paycheck account was opened. When the employer is a legal entity, this is the company name */
  employerName: string
  /** Employer document (CPF or CNPJ) as registered when the paycheck account was opened */
  employerDocument: string
  /** CNPJ of the institution contracted to provide the paycheck service (banco-folha) */
  paycheckBankCnpj: string
  /** ISPB of the institution contracted to provide the paycheck service */
  paycheckBankIspb: string
  /** Date the paycheck account was opened */
  accountOpeningDate: Date
}

export type Qualifications = {
  /** CNPJ of the company */
  companyCnpj: string
  /** Code of the occupation */
  occupationCode?: 'RECEITA_FEDERAL' | 'CBO' | 'OUTRO'
  /** Free-text occupation description. When occupationCode is RECEITA_FEDERAL or CBO it holds the standardized list code; when OUTRO it describes the occupation in cases where the institution does not follow the Receita Federal nor the CBO list */
  occupationDescription?: string
  /** Informed income */
  informedIncome?: InformedIncome
  /** Informed patrimony */
  informedPatrimony?: InformedPatrimony
  /** CNAE codes describing the economic activities of the business. Only one entry per response should be marked as main */
  economicActivities?: EconomicActivity[]
  /** Revenue (faturamento) informed by the business — the business equivalent of informedIncome */
  informedRevenue?: InformedRevenue
}

export type EconomicActivity = {
  /** CNAE code (7 digits, including leading zeros). Follows the CNAE-Subclasse 2.3 classification */
  code: string
  /** Whether this is the main economic activity (true) or a secondary one (false). Only one item per response should be true */
  isMain: boolean
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

export type InformedRevenue = {
  /** Amount of the informed revenue */
  amount: number
  /** Frequency or period of the informed revenue */
  frequency?:
    | 'DAILY'
    | 'WEEKLY'
    | 'BIWEEKLY'
    | 'MONTHLY'
    | 'BIMONTHLY'
    | 'QUARTERLY'
    | 'SEMIANNUAL'
    | 'ANNUAL'
    | 'OTHER'
  /** Free-text complement to the frequency. Populated when frequency is OTHER */
  frequencyAdditionalInfo?: string
  /** Reference year of the revenue */
  year?: number
}

export type InformedPatrimony = {
  /** Patrimony amount */
  amount: number
  /** Year of the patrimony */
  year: number
  /** Reference date of the patrimony. Returned on the business path of Open Finance, where the source field is a full date rather than just a year */
  date?: Date
}
