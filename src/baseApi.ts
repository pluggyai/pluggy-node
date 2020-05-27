import fetch from 'node-fetch'

export class BaseApi {
  constructor(private apiKey: string, private baseUrl: string = 'https://api.pluggy.ai/v1') {}

  protected async createGetRequest(endpoint: string, params?: any) {
    return fetch(`${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`, {
      method: 'get',
      headers: {
        'X-API-KEY': this.apiKey
      }
    })
    .then(async (response) => {
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
    .catch((error) => {
        console.warn(`[API] HTTP request failed: ${error.message || ''}`, error)
        return Promise.reject(error)
    })
  }

  protected createPostRequest(endpoint: string, params?: any, body?: any) {
    return fetch(`${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`, {
      method: 'post',
      headers: {
        'X-API-KEY': this.apiKey
      },
      body: JSON.stringify(body)
    })
    .then(async (response) => {
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

  protected mapToQueryString(params: any): string {
    if (!params) {
      return ''
    }

    const query = Object.keys(params)
      .map(key => key + '=' + params[key])
      .join('&')
    return `?${query}`
  }    
}