import got, { Method } from 'got'
import * as jwt from 'jsonwebtoken'

type QueryParameters = { [key: string]: number | number[] | string | string[] | boolean }

export type ClientParams = {
  /** Pluggy Client ID */
  clientId: string
  /** Pluggy Client Secret */
  clientSecret: string
  baseUrl?: string
  showUrls?: boolean
}

export class BaseApi {
  private apiKey: string
  private clientId: string
  private clientSecret: string
  private baseUrl?: string
  private showUrls = false

  constructor(params: ClientParams) {
    const { clientId, clientSecret, baseUrl = 'https://api.pluggy.ai', showUrls = false } = params

    this.baseUrl = baseUrl
    this.showUrls = showUrls

    if (clientSecret && clientId) {
      this.clientId = clientId
      this.clientSecret = clientSecret
    } else {
      throw new Error('Missing authorization for API communication')
    }
  }

  private async getApiKey(): Promise<string> {
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
    if (this.showUrls) {
      console.log(url)
    }

    try {
      const { statusCode, body } = await got<K>(url, {
        headers: {
          'X-API-KEY': apiKey,
        },
        responseType: 'json',
      })

      if (statusCode !== 200) {
        return Promise.reject(body)
      }

      try {
        let obj = transformCb ? transformCb(body) : ((body as unknown) as T)
        return Promise.resolve(obj)
      } catch (error) {
        console.error(`[Pluggy SDK] JSON parsing failed: ${error.message || ''}`, error)
        console.warn(`[Pluggy SDK] Are you sure you are using the latest version of "pluggy-sdk"?`)
      }
    } catch (error) {
      console.error(`[Pluggy SDK] HTTP request failed: ${error.message || ''}`, error)
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
    if (this.showUrls) {
      console.log(url)
    }
    if (body) {
      Object.keys(body).forEach(key => (body[key] === undefined ? delete body[key] : {}))
    }

    try {
      const { statusCode, body: responseBody } = await got<K>(url, {
        method,
        headers: {
          'X-API-KEY': apiKey,
        },
        json: body,
        responseType: 'json',
      })

      if (statusCode !== 200) {
        return Promise.reject(body)
      }

      try {
        let obj = transformCb ? transformCb(responseBody) : ((responseBody as unknown) as T)
        return Promise.resolve(obj)
      } catch (error) {
        console.error(`[Pluggy SDK] JSON parsing failed: ${error.message || ''}`, error)
        console.warn(`[Pluggy SDK] Are you sure you are using the latest version of "pluggy-sdk"?`)
      }
    } catch (error) {
      console.error(`[Pluggy SDK] HTTP request failed: ${error.message || ''}`, error)
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
