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
    console.log('Creating payment recipient...')
    await client.payments.createPaymentRecipient({
      pixKey: '1234567890',
    })

    console.log('Succesfully connected to Pluggy, using ClientID and ClientSecret')
  } catch (error) {
    console.log(error)
  }
})()
