import { CreatePixQrPaymentRequest, PaymentRequest } from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — PIX QR payment requests', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('createPixQrPaymentRequest POSTs payments/requests/pix-qr with payload', async () => {
    const payload: CreatePixQrPaymentRequest = {
      pixQrCode: '00020126490014br.gov.bcb.pix0108dict-key5204000053039865802BR6304ABCD',
      callbackUrls: null,
      isSandbox: true,
    }
    const mock = nock(API_URL)
      .post('/payments/requests/pix-qr', payload)
      .reply(
        200,
        mockAs<PaymentRequest>({ id: 'pr-1', amount: 100.5, status: 'CREATED' })
      )

    const client = createPaymentsClient()
    const result = await client.createPixQrPaymentRequest(payload)

    expect(result).toEqual({ id: 'pr-1', amount: 100.5, status: 'CREATED' })
    expect(mock.isDone()).toBe(true)
  })
})
