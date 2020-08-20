import dotenv from 'dotenv'
import { PluggyClient } from 'pluggy-sdk'

dotenv.config()

void (async function(): Promise<void> {
  const { CLIENT_ID = '', CLIENT_SECRET = '' } = process.env

  // Authenticate with API using clientId and secret. Valid for 2h.
  const client = new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })

  try {
    await client.fetchConnectors()
    console.log('Succesfully connected to Pluggy, using ClientID and ClientSecret')
  } catch {
    console.log(`Can't communicate with API, please review client id and secret`)
  }
})()
