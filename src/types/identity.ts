export type IdentityResponse = {
  /** Primary identifier of the entity */
  id: string
  /** Primary identifier of the Item */
  itemId: string
  /** Date of birth of the owner */
  birthDate?: Date
  /** Primary tax identifier (CNPJ or CUIT) */
  taxNumber?: string
  /** Primary ID (DNI or CPF) */
  document?: string
  /** Type of ID (DNI, CPF, CNPJ) */
  documentType?: string
  /** Title of the job position */
  jobTitle?: string
  /** For business connection, the business's name. */
  companyName?: string
  /** Complete name of the account owner */
  fullName?: string
  /** List of associated phone numbers */
  phoneNumbers?: PhoneNumber[]
  /** List of associated emails */
  emails?: Email[]
  /** List of associated phisical addresses */
  addresses?: Address[]
  /** List of associated personal relationships */
  relations?: IdentityRelation[]
  /** Date of the first time that the Identity was recovered */
  createdAt: Date
  /** Last update of the Identity data (if the data never changes, updatedAt will be the same as createdAt) */
  updatedAt: Date
}

export type PhoneNumber = {
  type?: 'Personal' | 'Work' | 'Residencial'
  value: string
}

export type Email = {
  type?: 'Personal' | 'Work'
  value: string
}

export type IdentityRelation = {
  type?: 'Mother' | 'Father' | 'Spouse'
  name?: string
  document?: string
}

export type Address = {
  fullAddress?: string
  primaryAddress?: string
  city?: string
  postalCode?: string
  state?: string
  country?: string
  type?: 'Personal' | 'Work'
}
