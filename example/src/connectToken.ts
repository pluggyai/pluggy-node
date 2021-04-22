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
    const ITEM_ID_TO_UPDATE: string | undefined = undefined
    const { accessToken: connectToken } = await client.createConnectToken(ITEM_ID_TO_UPDATE, {
      clientUserId: 'my-user-id',
      webhookUrl: 'https://app.myapp.com/notifications'
    })
    console.log(`Succesfully create connectToken: ${connectToken}`)
  } catch {
    console.log(`Can't communicate with API, please review client id and secret`)
  }
})()
