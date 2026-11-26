import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { deserializeJSONWithDates } from '../src/transforms'

const ISO = '2024-01-15T10:30:00.000Z'
const IMPOSSIBLE = '2024-13-45T00:00:00.000Z'
const ROLLS_OVER = '2024-02-30T00:00:00.000Z'

type Parsed = Record<string, unknown>
const parse = (value: unknown): Parsed => deserializeJSONWithDates(JSON.stringify(value)) as Parsed

describe('deserializeJSONWithDates', () => {
  // Every field the SDK types declare as a date, plus the date fields typed as strings.
  it.each([
    'accountOpeningDate',
    'balanceCloseDate',
    'balanceDueDate',
    'billClosingDate',
    'billForecastDate',
    'billPostDate',
    'birthDate',
    'consentExpiresAt',
    'contractDate',
    'createdAt',
    'date',
    'disabledAt',
    'documentExpirationDate',
    'documentIssueDate',
    'dueDate',
    'expirationDate',
    'expiresAt',
    'firstInstallmentDueDate',
    'gracePeriodDate',
    'incorporationDate',
    'issueDate',
    'lastUpdatedAt',
    'nextAutoSyncAt',
    'paidAt',
    'paidDate',
    'paymentDate',
    'portabilityApprovalDate',
    'purchaseDate',
    'resourcesCollectedAt',
    'revokedAt',
    'scheduledDate',
    'settlementDate',
    'startDate',
    'startedAt',
    'tradeDate',
    'transactionDateTime',
    'updateDateTime',
    'updatedAt',
  ])('converts the date field %s', field => {
    expect(parse({ [field]: ISO })[field]).toEqual(new Date(ISO))
  })

  it('converts every entry of a date list', () => {
    expect(parse({ disbursementDates: [ISO, ISO] }).disbursementDates).toEqual([
      new Date(ISO),
      new Date(ISO),
    ])
  })

  it('converts date fields in nested objects and lists', () => {
    expect(parse({ results: [{ meta: { createdAt: ISO } }] })).toEqual({
      results: [{ meta: { createdAt: new Date(ISO) } }],
    })
  })

  it.each([
    'description',
    'descriptionRaw',
    'reason',
    'clientUserId',
    'receiverReferenceId',
    'name',
    'message',
    'mandate',
    'format',
  ])('keeps date-shaped text in the non-date field %s', field => {
    expect(parse({ [field]: ISO })[field]).toBe(ISO)
  })

  it('keeps date-shaped text in a list under a non-date field', () => {
    expect(parse({ tags: [ISO] }).tags).toEqual([ISO])
  })

  it.each([
    ['does not exist', IMPOSSIBLE],
    ['would roll over to another day', ROLLS_OVER],
    ['has no milliseconds', '2024-01-15T10:30:00Z'],
  ])('keeps the original text when a date field holds a value that %s', (_label, value) => {
    expect(parse({ createdAt: value }).createdAt).toBe(value)
  })

  it('keeps the original text for an impossible entry in a date list', () => {
    expect(parse({ disbursementDates: [ISO, IMPOSSIBLE] }).disbursementDates).toEqual([
      new Date(ISO),
      IMPOSSIBLE,
    ])
  })

  it('leaves non-string values in date fields alone', () => {
    expect(parse({ createdAt: null, updatedAt: 0 })).toEqual({ createdAt: null, updatedAt: 0 })
  })
})

describe('parsing a real SDK response', () => {
  it('returns free text as a string and dates as Date objects', async () => {
    const API_URL = process.env.PLUGGY_API_URL!
    nock.cleanAll()
    nock.disableNetConnect()
    setupAuth()
    nock(API_URL)
      .get('/transactions/dummy-transaction')
      .reply(200, {
        id: 'dummy-transaction',
        date: ISO,
        description: ISO,
        paymentData: { reason: IMPOSSIBLE },
      })

    const client = new PluggyClient({ clientId: 'dummy-id', clientSecret: 'dummy-secret' })
    const transaction = await client.fetchTransaction('dummy-transaction')

    expect(transaction.date).toEqual(new Date(ISO))
    expect(transaction.description).toBe(ISO)
    expect(transaction.paymentData.reason).toBe(IMPOSSIBLE)
  })
})
