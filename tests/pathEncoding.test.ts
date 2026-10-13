import nock from 'nock'
import { setupAuth } from './utils'
import { PluggyClient } from '../src/client'
import { urlPath } from '../src/baseApi'

const API_URL = process.env.PLUGGY_API_URL!

describe('urlPath', () => {
  it('leaves a plain UUID untouched', () => {
    const id = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    expect(urlPath`items/${id}/mfa`).toBe(`items/${id}/mfa`)
  })

  it('encodes reserved characters in every interpolated segment', () => {
    expect(urlPath`a/${'x/y'}/b/${'p q'}`).toBe('a/x%2Fy/b/p%20q')
  })
})

describe('path segment encoding', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupAuth()
  })

  const client = new PluggyClient({ clientId: '123', clientSecret: '456' })

  it.each([
    ['a query string', 'abc?x=1&y=2', 'abc%3Fx%3D1%26y%3D2'],
    ['a slash', 'abc/def', 'abc%2Fdef'],
    ['a fragment', 'abc#frag', 'abc%23frag'],
    ['spaces', 'abc def', 'abc%20def'],
  ])('encodes an id containing %s', async (_label, id, encoded) => {
    const mock = nock(API_URL).get(`/accounts/${encoded}`).reply(200, { id })

    await client.fetchAccount(id)

    expect(mock.isDone()).toBeTruthy()
  })

  it('does not change the path for a plain UUID', async () => {
    const id = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    const mock = nock(API_URL).get(`/accounts/${id}`).reply(200, { id })

    await client.fetchAccount(id)

    expect(mock.isDone()).toBeTruthy()
  })

  it('encodes ids on nested paths and mutating requests', async () => {
    const mock = nock(API_URL).delete('/items/a%2Fb%3Fc').reply(200, {})

    await client.deleteItem('a/b?c')

    expect(mock.isDone()).toBeTruthy()
  })

  it('encodes ids on payments paths', async () => {
    const mock = nock(API_URL).get('/payments/requests/a%23b/schedules').reply(200, {})

    await client.payments.fetchScheduledPayments('a#b')

    expect(mock.isDone()).toBeTruthy()
  })

  it('sends the item id of fetchIdentityByItemId as an encoded query value', async () => {
    const mock = nock(API_URL).get('/identity').query({ itemId: 'a&b=c' }).reply(200, {})

    await client.fetchIdentityByItemId('a&b=c')

    expect(mock.isDone()).toBeTruthy()
  })
})
