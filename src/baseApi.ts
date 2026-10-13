import got, { Got, HTTPError, Method } from 'got'
import * as jwt from 'jsonwebtoken'
import { deserializeJSONWithDates } from './transforms'

const {
  version: pluggyNodeVersion,
  dependencies: { got: gotVersion },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../package.json')

const _30_SECONDS = 30 * 1000

type QueryParameters = { [key: string]: number | number[] | string | string[] | boolean }

export type ClientParams = {
  /** Pluggy Client ID */
  clientId: string
  /** Pluggy Client Secret */
  clientSecret: string
  baseUrl?: string
}

/**
 * Endpoints are built by interpolating caller-provided ids into a path. Query
 * parameters always go through `params`, so a legitimate endpoint never has a
 * query or fragment delimiter, a percent-encoded sequence, a backslash, a
 * control character or whitespace, a dot segment, or an empty segment. Any of
 * those means an id changed the shape of the request, so refuse to send it.
 */
const UNSAFE_ENDPOINT = /[?#%\\\u0000-\u0020\u007f]|(^|\/)\.{1,2}(\/|$)|\/\/|^\/|\/$/

export function assertSafeEndpoint(endpoint: string): void {
  if (!endpoint || UNSAFE_ENDPOINT.test(endpoint)) {
    throw new Error(`Refusing to request an unsafe endpoint: ${JSON.stringify(endpoint)}`)
  }
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
        timeout: _30_SECONDS,
        retry: {
          limit: 2,
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          statusCodes: [429],
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
    assertSafeEndpoint(endpoint)
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
    assertSafeEndpoint(endpoint)
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

      if (statusCode < 200 || statusCode >= 300) {
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

    // Values must be URL-encoded: cursors are base64 and carry '+', '/' and '=', and an unencoded
    // '+' reaches the server as a space. Array items are encoded one by one and joined with a
    // literal comma, which is how the API expects list params such as `ids`.
    const encode = (value: number | string | boolean): string => encodeURIComponent(String(value))
    const query = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => {
        const value = params[key]
        const encoded = Array.isArray(value) ? value.map(encode).join(',') : encode(value)
        return `${encodeURIComponent(key)}=${encoded}`
      })
      .join('&')
    return `?${query}`
  }

  protected isJwtExpired(token: string): boolean {
    const decoded = jwt.decode(token, { complete: true })
    // Pluggy auth tokens always carry a JSON payload with `exp`. The
    // `string | JwtPayload` union surfaced by @types/jsonwebtoken@9 is
    // not reachable for tokens minted by the Pluggy API, so narrow it
    // explicitly to keep the previous (pre-v9-types) behaviour.
    const payload = decoded.payload as jwt.JwtPayload
    return payload.exp <= Math.floor(Date.now() / 1000)
  }
}
