import got, { Method } from 'got'

type QueryParameters = { [key: string]: number | number[] | string | string[] | boolean }

export type ClientParams = {
  /** primary client identifier */
  clientId: string
  /** client password secret */
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
    if (this.apiKey) {
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

  protected async createGetRequest<T>(endpoint: string, params?: QueryParameters): Promise<T> {
    const apiKey = await this.getApiKey()
    const url = `${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`
    if (this.showUrls) {
      console.log(url)
    }

    try {
      const { statusCode, body } = await got<T>(url, {
        headers: {
          'X-API-KEY': apiKey,
        },
        responseType: 'json',
      })

      if (statusCode !== 200) {
        return Promise.reject(body)
      }

      return Promise.resolve(body)
    } catch (error) {
      console.error(`[API] HTTP request failed: ${error.message || ''}`, error)
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
    if (this.showUrls) {
      console.log(url)
    }
    if (body) {
      Object.keys(body).forEach(key => (body[key] === undefined ? delete body[key] : {}))
    }

    try {
      const { statusCode, body: responseBody } = await got<T>(url, {
        method,
        headers: {
          'X-API-KEY': apiKey,
        },
        json: body,
        responseType: 'json',
      })

      if (statusCode !== 200) {
        return Promise.reject(responseBody)
      }

      return Promise.resolve(responseBody)
    } catch (error) {
      console.error(`[API] HTTP request failed: ${error.message || ''}`, error)
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
}
