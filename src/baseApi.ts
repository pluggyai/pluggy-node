import got, { Got, HTTPError, Method } from 'got'
import * as jwt from 'jsonwebtoken'
import { deserializeJSONWithDates } from './transforms'

const {
  version: pluggyNodeVersion,
  dependencies: { got: gotVersion },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../package.json')

const _60_SECONDS = 60 * 1000

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
  protected serviceInstance: Got

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

  private getServiceInstance(): Got {
    if (!this.serviceInstance) {
      this.serviceInstance = got.extend({
        headers: this.defaultHeaders,
        responseType: 'json',
        parseJson: deserializeJSONWithDates,
        retry: {
          limit: 3,
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          statusCodes: [429],
          calculateDelay: ({ retryAfter }): number => {
            return retryAfter ?? _60_SECONDS
          },
        },
      })
    }
    return this.serviceInstance
  }

  protected async getApiKey(): Promise<string> {
    if (this.apiKey && !this.isJwtExpired(this.apiKey)) {
      return this.apiKey
    }

    const response = await this.getServiceInstance().post<{ apiKey: string }>(
      `${this.baseUrl}/auth`,
      {
        json: {
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          nonExpiring: false,
        },
        responseType: 'json',
      }
    )

    this.apiKey = response.body.apiKey
    return this.apiKey
  }

  protected async createGetRequest<T>(endpoint: string, params?: QueryParameters): Promise<T> {
    const apiKey = await this.getApiKey()
    const url = `${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`

    try {
      const { statusCode, body } = await this.getServiceInstance()<T>(url, {
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

      return body
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

  protected createPostRequest<T>(
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>
  ): Promise<T> {
    return this.createMutationRequest('post', endpoint, params, body)
  }

  protected createPutRequest<T>(
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>
  ): Promise<T> {
    return this.createMutationRequest('put', endpoint, params, body)
  }

  protected createPatchRequest<T>(
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>
  ): Promise<T> {
    return this.createMutationRequest('patch', endpoint, params, body)
  }

  protected createDeleteRequest<T>(
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>
  ): Promise<T> {
    return this.createMutationRequest('delete', endpoint, params, body)
  }

  protected async createMutationRequest<T>(
    method: Method,
    endpoint: string,
    params?: QueryParameters,
    body?: Record<string, unknown>
  ): Promise<T> {
    const apiKey = await this.getApiKey()
    const url = `${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`
    if (body) {
      Object.keys(body).forEach(key => (body[key] === undefined ? delete body[key] : {}))
    }

    try {
      const { statusCode, body: responseBody } = await this.getServiceInstance()<T>(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          'X-API-KEY': apiKey,
        },
        json: body,
      })

      if (statusCode !== 200) {
        return Promise.reject(body)
      }

      return responseBody
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
