export type ScrFilters = {
  /** First base date to consult, as YYYYMM. Defaults to 3 base dates before `to` */
  from?: string
  /** Last base date to consult, as YYYYMM. Defaults to 2 months before the current one, the most recent base date Bacen has consolidated */
  to?: string
}

/**
 * Bacen's SCR response, forwarded exactly as the Banco Central returns it: field names,
 * codes and all. Nothing is renamed or normalised.
 */
export type ScrResponse = {
  /** The base dates consulted, ie. "202604 a 202607" */
  dtbConsult: string
  /** The consulted document: the CPF for an individual, or the 8-digit CNPJ root for a company */
  cdCli: string
  /** Type of client: "1" for an individual, "2" for a legal entity */
  tpCli: '1' | '2'
  /** One entry per consulted base date. A base date with no data for the client is still listed, with no operations */
  lsDtb?: ScrDatabase[]
  /** Validation messages raised by Bacen for this request */
  listaDeMensagensDeValidacao?: ScrValidationMessage[]
}

/** One consulted base date, and what the SCR holds for the client in it */
export type ScrDatabase = {
  /** The base date, as YYYYMM. Numeric, not a string */
  dtb?: number
  /** Bacen's message for this base date, when it has one */
  msg?: string
  /** Percentage of the expected 3040 documents already incorporated by Bacen for this base date */
  docProc?: string
  /** Percentage of the expected operation volume already accepted for this base date */
  volProc?: string
  /** Number of financial institutions where the client has operations */
  qtdIfs?: number
  /** Number of financial conglomerates where the client has operations */
  qtdCongFinc?: number
  /** Start of the client's relationship with the national financial system */
  dtbIniRel?: string
  /** Co-obligation assumed by the client in credit assignments, in BRL */
  coobAss?: number
  /** Co-obligation received in credit assignments, in BRL */
  coobRec?: number
  /** Operation groups reported for this base date */
  lsOp?: ScrOperation[]
}

/**
 * A group of credit operations. The SCR aggregates contracts by the combination of
 * modality, source of funds, index and exchange variation.
 */
export type ScrOperation = {
  /** Bacen's code for the operation modality */
  mod?: string
  /** Bacen's code for the source of funds */
  oriRec?: string
  /** Bacen's code for the reference rate or index */
  indx?: string
  /** Bacen's code for the exchange rate variation */
  varCamb?: string
  /** Present when the operation is under dispute: "D" for disagreement, "J" for sub judice, "JD" for both */
  subJDisc?: string
  /** Balance of the operation group split across Bacen's maturity vertices */
  resVenc?: ScrMaturityBalances
  /** Guarantees backing the operations in this group */
  lsGar?: ScrGuarantee[]
  /** Complementary information reported for this group */
  lsInfAd?: ScrAdditionalInfo[]
}

/**
 * Balance of the operation group split across Bacen's maturity vertices, in BRL.
 * Each key is a vertex code (`v20`, `v40`, ..., `v320`) as defined by Bacen's DOC3040
 * reference. Only the vertices that carry a value are present.
 */
export type ScrMaturityBalances = {
  [vertex: string]: number
}

export type ScrGuarantee = {
  /** Bacen's code for the guarantee type */
  tp?: string
  /** Number of operations grouped under this type */
  qtd?: number
}

export type ScrAdditionalInfo = {
  /** Type of the complementary information */
  tp?: string
  /** Code of the complementary information */
  cd?: string
  /** Number of operations grouped under this entry */
  qtd?: number
}

export type ScrValidationMessage = {
  codigo?: string
  mensagem?: string
}
