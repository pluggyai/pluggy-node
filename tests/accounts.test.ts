import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { Account } from '../src/types'

const ACCOUNT_ID = 'account-abc'
const API_URL = process.env.PLUGGY_API_URL!

/**
 * Account with reserved balances ("caixinhas"), shaped like a real
 * `GET /accounts/{id}` response from an Open Finance connector.
 *
 * Typed as `Account` on purpose: the reserved balance field is named
 * `availableAmounts` in the API (and in `oas3.json`), but the SDK originally
 * typed it as `amounts`, so every reservation read as `undefined` at runtime.
 * Keeping the fixture typed means renaming the field back is a compile error.
 *
 * Note this only surfaces under `tsc` / in the editor — `pnpm test` does not
 * type-check, because `isolatedModules: true` makes ts-jest transpile only.
 */
const accountWithReservedBalances: Account = {
  id: ACCOUNT_ID,
  itemId: 'item-abc',
  type: 'BANK',
  subtype: 'CHECKING_ACCOUNT',
  number: '123456',
  balance: 1500.0,
  name: 'Conta Corrente',
  marketingName: null,
  owner: 'John Doe',
  taxNumber: null,
  currencyCode: 'BRL',
  creditData: null,
  bankData: {
    transferNumber: '001/1234/123456',
    closingBalance: 1500.0,
    automaticallyInvestedBalance: null,
    overdraftContractedLimit: null,
    overdraftUsedLimit: null,
    unarrangedOverdraftAmount: null,
    hasReservedBalance: true,
    reservedBalances: [
      {
        name: 'Caixinha Para Férias',
        identification: 'reservation-1',
        availableAmounts: [
          {
            amount: 250.5,
            currencyCode: 'BRL',
            remuneration: {
              preFixedRate: null,
              postFixedIndexerPercentage: 1.1,
              rateType: 'LINEAR',
              indexer: 'CDI',
              calculation: 'DIAS_UTEIS',
              ratePeriodicity: 'ANUAL',
              indexerAdditionalInfo: null,
            },
          },
        ],
      },
    ],
  },
}

describe('fetchAccount with reserved balances', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  it('exposes reserved balance amounts under availableAmounts', async () => {
    const mock = nock(API_URL)
      .get(`/accounts/${ACCOUNT_ID}`)
      .reply(200, accountWithReservedBalances)

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const account = await client.fetchAccount(ACCOUNT_ID)

    expect(account.bankData.hasReservedBalance).toBe(true)

    const [reserved] = account.bankData.reservedBalances
    expect(reserved.name).toBe('Caixinha Para Férias')
    expect(reserved.identification).toBe('reservation-1')

    expect(reserved.availableAmounts).toHaveLength(1)
    expect(reserved.availableAmounts[0].amount).toBe(250.5)
    expect(reserved.availableAmounts[0].currencyCode).toBe('BRL')
    expect(reserved.availableAmounts[0].remuneration.indexer).toBe('CDI')

    expect(mock.isDone()).toBeTruthy()
  })

  it('leaves reserved balance fields null when the account has none', async () => {
    const mock = nock(API_URL)
      .get(`/accounts/${ACCOUNT_ID}`)
      .reply(200, {
        ...accountWithReservedBalances,
        bankData: {
          ...accountWithReservedBalances.bankData,
          hasReservedBalance: false,
          reservedBalances: null,
        },
      })

    const client = new PluggyClient({ clientId: '123', clientSecret: '456' })
    const account = await client.fetchAccount(ACCOUNT_ID)

    expect(account.bankData.hasReservedBalance).toBe(false)
    expect(account.bankData.reservedBalances).toBeNull()
    expect(mock.isDone()).toBeTruthy()
  })
})
