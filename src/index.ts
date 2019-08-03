import fetch from 'node-fetch'

/**
 * Creates a new client instance for interacting with Hermes API
 * @constructor
 * @param API_KEY for authenticating to the API
 * @returns {HermesClient} a client for making Hermes requests
 */
export class HermesClient {
  private apiKey: string

  constructor(API_KEY: string, private HERMES_ENDPOINT: string = 'https://api.hermesapi.com/v1') {
    this.apiKey = API_KEY
  }

  /**
   * Fetch all available from Hermes API
   * @returns {Robot[]} an array robots
   */
  async fetchRobots() {
    const response = await this.createGetRequest('robots')
    return response.json()
  }

  /**
   * Fetch a single robot
   * @param id The robot ID
   * @returns {Robot} a robot object
   */
  async fetchRobot(id: number) {
    const response = await this.createGetRequest(`robots/${id}`)
    return response.json()
  }

  /**
   * Creates a new execution of a robot
   * @param robotId the ID of the robot to be executed
   * @param executionParameters The executions parameters
   * @returns {Execution} an object with the info to retrieve the data when the execution
   * is already finished
   */
  async execute(
    robotId: number,
    executionParameters: {
      credentials: any
      startDate: string
      endDate: string
    }
  ) {
    const response = await this.createPostRequest(
      `executions`,
      { robot_id: `${robotId}` },
      executionParameters
    )
    return response.json()
  }

  /**
   * Fetch a single execution
   * @param id the execution ID
   * @returns {Execution} with status info or result
   */
  async fetchExecution(id: string) {
    const response = await this.createGetRequest(`executions/${id}`)
    return response.json()
  }

  private createGetRequest(endpoint: string, params?: any) {
    return fetch(`${this.HERMES_ENDPOINT}/${endpoint}${this.mapToQueryString(params)}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    })
  }

  private createPostRequest(endpoint: string, params?: any, body?: any) {
    return fetch(`${this.HERMES_ENDPOINT}/${endpoint}${this.mapToQueryString(params)}`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    })
  }

  private mapToQueryString(params: any): string {
    if (!params) {
      return ''
    }

    const query = Object.keys(params)
      .map(key => key + '=' + params[key])
      .join('&')
    return `?${query}`
  }
}
