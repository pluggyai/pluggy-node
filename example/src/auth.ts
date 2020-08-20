import dotenv from 'dotenv'
import { PluggyClient } from 'pluggy-sdk'

dotenv.config()

void (async function(): Promise<void> {
  const { CLIENT_ID = '', CLIENT_SECRET = '', API_KEY = '', URL = '' } = process.env

  // Authenticate with API using clientId and secret. Valid for 2h.
  let client = new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })

  let connectors = await client.fetchConnectors()
  console.log(
    connectors.results.length > 0
      ? 'Succesfully connected to Pluggy, using ClientID and ClientSecret'
      : `Can't communicate with API, please review client id and secret`
  )

  // Authenticate with API using non-expiring API KEY.
  client = new PluggyClient({
    apiKey: API_KEY,
  })

  connectors = await client.fetchConnectors()
  console.log(
    connectors.results.length > 0
      ? 'Succesfully connected to Pluggy, using API KEY'
      : `Can't communicate with API, please review the API KEY provided`
  )
})()
