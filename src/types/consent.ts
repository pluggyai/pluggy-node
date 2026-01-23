import { PageFilters } from './common'

/**
 * Consent response object representing user consent for data access
 */
export type Consent = {
  /** Primary identifier of the consent */
  id: string
  /** Primary identifier of the Item */
  itemId: string
  /** List of products that the consent covers */
  products: string[]
  /** List of Open Finance permissions granted */
  openFinancePermissionsGranted: string[]
  /** Date when the consent was created */
  createdAt: Date
  /** Date when the consent expires */
  expiresAt: Date | null
  /** Date when the consent was revoked (null if not revoked) */
  revokedAt: Date | null
}

export type ConsentFilters = PageFilters
