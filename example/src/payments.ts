import dotenv from 'dotenv'
import { PluggyClient } from 'pluggy-sdk'

dotenv.config()

void (async function(): Promise<void> {
  const { CLIENT_ID = '', CLIENT_SECRET = '' } = process.env

  const client = new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })

  // We create a dummy payment request
  const paymentRequest = await client.payments.createPaymentRequest({
    amount: 100,
    description: 'Test payment',
  })

  console.log('Payment request created, open this url: ', paymentRequest.paymentUrl)
})()
