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
