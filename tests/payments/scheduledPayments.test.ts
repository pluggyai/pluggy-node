import { SchedulePayment, PageResponse } from '../../src/types'
import { API_URL, createPaymentsClient, mockAs, nock } from './utils'

describe('PluggyPaymentsClient — scheduled payments', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it('fetchScheduledPayments GETs payments/requests/:id/schedules', async () => {
    const page: PageResponse<SchedulePayment> = {
      page: 1,
      total: 1,
      totalPages: 1,
      results: [mockAs<SchedulePayment>({ id: 'sched-1' })],
    }
    const mock = nock(API_URL)
      .get('/payments/requests/req-1/schedules')
      .reply(200, page)

    const client = createPaymentsClient()
    const result = await client.fetchScheduledPayments('req-1')

    expect(result.results).toHaveLength(1)
    expect(mock.isDone()).toBe(true)
  })

  it('fetchScheduledPayment GETs payments/requests/:id/schedules/:scheduleId', async () => {
    const mock = nock(API_URL)
      .get('/payments/requests/req-1/schedules/sched-1')
      .reply(200, mockAs<SchedulePayment>({ id: 'sched-1' }))

    const client = createPaymentsClient()
    const result = await client.fetchScheduledPayment('req-1', 'sched-1')

    expect(result.id).toBe('sched-1')
    expect(mock.isDone()).toBe(true)
  })

  it('cancelScheduledPayment POSTs payments/requests/:id/schedules/:scheduleId/cancel', async () => {
    const mock = nock(API_URL)
      .post('/payments/requests/req-1/schedules/sched-1/cancel')
      .reply(200, {})

    const client = createPaymentsClient()
    await client.cancelScheduledPayment('req-1', 'sched-1')

    expect(mock.isDone()).toBe(true)
  })

  it('cancelScheduledPayments POSTs payments/requests/:id/schedules/cancel', async () => {
    const mock = nock(API_URL)
      .post('/payments/requests/req-1/schedules/cancel')
      .reply(200, {})

    const client = createPaymentsClient()
    await client.cancelScheduledPayments('req-1')

    expect(mock.isDone()).toBe(true)
  })
})
