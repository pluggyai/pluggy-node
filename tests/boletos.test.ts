import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { BoletoConnection, CreateBoleto, IssuedBoleto } from '../src/types'

const API_URL = process.env.PLUGGY_API_URL!
const BOLETO_ID = '82da0d63-fbc0-4e20-b191-50e6df030875'
const CONNECTION_ID = 'dc3537ad-13b4-4770-b248-e4578983899c'

const connectionBody = {
  id: CONNECTION_ID,
  connectorId: 225,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}
const expectedConnection: BoletoConnection = {
  id: CONNECTION_ID,
  connectorId: 225,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
}

const boletoBody = {
  id: BOLETO_ID,
  amount: 100,
  status: 'OPEN',
  seuNumero: 'INV-1',
  dueDate: '2026-12-01T00:00:00.000Z',
  payer: {
    taxNumber: '41679495000100',
    name: 'NOME LEGAL EMPRESA',
    addressState: 'SP',
    addressZipCode: '01000000',
  },
  digitableLine: '00190000090000000000000000000000000000000000000',
  barcode: '00190000000000000000000000000000000000000000',
  boletoConnectionId: CONNECTION_ID,
  createdAt: '2026-10-01T00:00:00.000Z',
  amountPaid: null,
  paymentOrigin: null,
}

function client(): PluggyClient {
  return new PluggyClient({ clientId: '123', clientSecret: '456' })
}

describe('boletos (beta)', () => {
  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    setupAuth()
  })

  it('createBoletoConnection POSTs boleto-connections with the payload', async () => {
    const payload = { connectorId: 225, credentials: { clientId: 'id', clientSecret: 'secret' } }
    const mock = nock(API_URL)
      .post('/boleto-connections', payload)
      .reply(200, connectionBody)

    const result = await client().createBoletoConnection(payload)

    expect(result).toEqual(expectedConnection)
    expect(mock.isDone()).toBe(true)
  })

  it('createBoletoConnectionFromItem POSTs boleto-connections/from-item with the item id', async () => {
    const payload = { itemId: '0303c07b-fef0-4903-af9a-007fa086ca8c' }
    const mock = nock(API_URL)
      .post('/boleto-connections/from-item', payload)
      .reply(200, connectionBody)

    const result = await client().createBoletoConnectionFromItem(payload)

    expect(result).toEqual(expectedConnection)
    expect(mock.isDone()).toBe(true)
  })

  it('createBoleto POSTs boletos with the payload and deserializes dates', async () => {
    const payload: CreateBoleto = {
      boletoConnectionId: CONNECTION_ID,
      boleto: {
        seuNumero: 'INV-1',
        amount: 100,
        dueDate: '2026-12-01T00:00:00.000Z',
        payer: {
          taxNumber: '41679495000100',
          name: 'NOME LEGAL EMPRESA',
          addressState: 'SP',
          addressZipCode: '01000000',
        },
        fine: { value: 2, type: 'PERCENTAGE' },
        interest: { value: 1, type: 'PERCENTAGE' },
      },
    }
    const mock = nock(API_URL)
      .post('/boletos', payload)
      .reply(200, boletoBody)

    const result: IssuedBoleto = await client().createBoleto(payload)

    expect(result.id).toBe(BOLETO_ID)
    expect(result.status).toBe('OPEN')
    expect(result.dueDate).toEqual(new Date('2026-12-01T00:00:00.000Z'))
    expect(result.amountPaid).toBeNull()
    expect(mock.isDone()).toBe(true)
  })

  it('fetchBoleto GETs boletos/:id', async () => {
    const mock = nock(API_URL)
      .get(`/boletos/${BOLETO_ID}`)
      .reply(200, boletoBody)

    const result = await client().fetchBoleto(BOLETO_ID)

    expect(result.id).toBe(BOLETO_ID)
    expect(result.digitableLine).toBe(boletoBody.digitableLine)
    expect(mock.isDone()).toBe(true)
  })

  it('cancelBoleto POSTs boletos/:id/cancel', async () => {
    const mock = nock(API_URL)
      .post(`/boletos/${BOLETO_ID}/cancel`)
      .reply(200, { ...boletoBody, status: 'CANCELLED' })

    const result = await client().cancelBoleto(BOLETO_ID)

    expect(result.status).toBe('CANCELLED')
    expect(mock.isDone()).toBe(true)
  })
})
