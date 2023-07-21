import got, { HTTPError, Method } from 'got'
import * as jwt from 'jsonwebtoken'
import { deserializeJSONWithDates } from './transforms'

const {
  version: pluggyNodeVersion,
  dependencies: { got: gotVersion },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../package.json')

type QueryParameters = { [key: string]: number | number[] | string | string[] | boolean }

export type ClientParams = {
  /** Pluggy Client ID */
  clientId: string
  /** Pluggy Client Secret */
  clientSecret: string
  baseUrl?: string
}

export class BaseApi {
  protected apiKey: string
  protected clientId: string
  protected clientSecret: string
  protected baseUrl?: string
  protected defaultHeaders: Record<string, string>

  constructor(params: ClientParams) {
    const { clientId, clientSecret } = params
    const { PLUGGY_API_URL } = process.env
    this.baseUrl = PLUGGY_API_URL || 'https://api.pluggy.ai'

    if (clientSecret && clientId) {
      this.clientId = clientId
      this.clientSecret = clientSecret
    } else {
      throw new Error('Missing authorization for API communication')
    }

    this.defaultHeaders = {
      'User-Agent': `PluggyNode/${pluggyNodeVersion} node.js/${process.version.replace(
        'v',
        ''
      )} Got/${gotVersion}`,
      'Content-Type': 'application/json',
    }
  }

  protected async getApiKey(): Promise<string> {
    if (this.apiKey && !this.isJwtExpired(this.apiKey)) {
      return this.apiKey
    }

    const response = await got.post<{ apiKey: string }>(`${this.baseUrl}/auth`, {
      json: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        nonExpiring: false,
      },
      responseType: 'json',
    })

    this.apiKey = response.body.apiKey
    return this.apiKey
  }

  protected async createGetRequest<T, K>(
    endpoint: string,
    params?: QueryParameters,
    transformCb?: (response: K) => T
  ): Promise<T> {
    const apiKey = await this.getApiKey()
    const url = `${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`

    try {
      const { statusCode, body } = await got<K>(url, {
        headers: {
          ...this.defaultHeaders,
          'X-API-KEY': apiKey,
        },
        responseType: 'json',
        parseJson: deserializeJSONWithDates,
      })

      if (statusCode < 200 || statusCode >= 300) {
        return Promise.reject(body)
      }

      try {
        const obj = transformCb ? transformCb(body) : ((body as unknown) as T)
        return Promise.resolve(obj)
      } catch (error) {
        console.error(`[Pluggy SDK] JSON parsing failed: ${error.message || ''}`, error)
        console.warn(`[Pluggy SDK] Are you sure you are using the latest version of "pluggy-sdk"?`)
      }
    } catch (error) {
      if (error instanceof HTTPError) {
        console.error(
          `[Pluggy SDK] HTTP request failed: ${error.message || ''}`,
          error.response.body
        )
        return Promise.reject(error.response.body)
      }
      return Promise.reject(error)
    }
  }

  protected createPostRequest<T, K>(
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>,
    transformCb?: (response: K) => T
  ): Promise<T> {
    return this.createMutationRequest('post', endpoint, params, body, transformCb)
  }

  protected createPutRequest<T, K>(
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>,
    transformCb?: (response: K) => T
  ): Promise<T> {
    return this.createMutationRequest('put', endpoint, params, body, transformCb)
  }

  protected createPatchRequest<T, K>(
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>,
    transformCb?: (response: K) => T
  ): Promise<T> {
    return this.createMutationRequest('patch', endpoint, params, body, transformCb)
  }

  protected createDeleteRequest<T, K>(
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>,
    transformCb?: (response: K) => T
  ): Promise<T> {
    return this.createMutationRequest('delete', endpoint, params, body, transformCb)
  }

  protected async createMutationRequest<T, K>(
    method: Method,
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>,
    transformCb?: (response: K) => T
  ): Promise<T> {
    const apiKey = await this.getApiKey()
    const url = `${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`
    if (body) {
      Object.keys(body).forEach(key => (body[key] === undefined ? delete body[key] : {}))
    }

    try {
      const { statusCode, body: responseBody } = await got<K>(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          'X-API-KEY': apiKey,
        },
        json: body,
        responseType: 'json',
        parseJson: deserializeJSONWithDates,
      })

      if (statusCode !== 200) {
        return Promise.reject(body)
      }

      try {
        const obj = transformCb ? transformCb(responseBody) : ((responseBody as unknown) as T)
        return Promise.resolve(obj)
      } catch (error) {
        console.error(`[Pluggy SDK] JSON parsing failed: ${error.message || ''}`, error)
        console.warn(`[Pluggy SDK] Are you sure you are using the latest version of "pluggy-sdk"?`)
      }
    } catch (error) {
      if (error instanceof HTTPError) {
        console.error(
          `[Pluggy SDK] HTTP request failed: ${error.message || ''}`,
          error.response.body
        )
        return Promise.reject(error.response.body)
      }
      return Promise.reject(error)
    }
  }

  protected mapToQueryString(params: QueryParameters): string {
    if (!params) {
      return ''
    }

    const query = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => key + '=' + params[key])
      .join('&')
    return `?${query}`
  }

  protected isJwtExpired(token: string): boolean {
    const decoded = jwt.decode(token, { complete: true })
    return decoded.payload.exp <= Math.floor(Date.now() / 1000)
  }
}
