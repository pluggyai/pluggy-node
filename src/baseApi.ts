import fetch from 'node-fetch'

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

    const response = await fetch(`${this.baseUrl}/auth`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        nonExpiring: false,
      }),
    })

    const { apiKey } = await response.json()
    this.apiKey = apiKey
    return apiKey
  }

  protected async createGetRequest<T>(endpoint: string, params?: QueryParameters): Promise<T> {
    const apiKey = await this.getApiKey()
    const url = `${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`
    if (this.showUrls) {
      console.log(url)
    }

    return fetch(url, {
      method: 'get',
      headers: {
        'X-API-KEY': apiKey,
      },
    })
      .then(async response => {
        try {
          const json = await response.json()
          if (response.status !== 200) {
            return Promise.reject(json)
          } else {
            return Promise.resolve(json)
          }
        } catch {
          const message = await response.text()
          return Promise.reject({ message })
        }
      })
      .catch(error => {
        console.warn(`[API] HTTP request failed: ${error.message || ''}`, error)
        return Promise.reject(error)
      })
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
    method: string,
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
    return fetch(url, {
      method,
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(async response => {
      try {
        const json = await response.json()
        if (response.status !== 200) {
          return Promise.reject(json)
        } else {
          return Promise.resolve(json)
        }
      } catch {
        const message = await response.text()
        return Promise.reject({ message })
      }
    })
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
