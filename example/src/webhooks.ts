import dotenv from 'dotenv'
import { PluggyClient } from 'pluggy-sdk'
import { sleep } from './utils'

dotenv.config()

void (async function(): Promise<void> {
  const { CLIENT_ID = '', CLIENT_SECRET = '', WEBHOOK_URL = '' } = process.env

  // Authenticate with API using clientId and secret.
  let client = new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })

  const webhooks = await client.fetchWebhooks();
  console.log(`Currently there are ${webhooks.results.length} webhook(s) configured.`)

  let webhook = await client.createWebhook('all', WEBHOOK_URL)
  const recoveredWebhook = await client.fetchWebhook(webhook.id)
  console.log(recoveredWebhook ? `Webhook was created successfully` : `There was a problem creating the webhook`)

  await client.createItem(0, {
    user: 'user-ok',
    password: 'password-ok',
  })

  console.log('You will receive notifications for created and updated events in the url provided')
  await sleep(10000)

  console.log('You can update the webhook for specific events or url')
  webhook = await client.updateWebhook(webhook.id, { event: 'item/updated' })

  console.log('If the webhook is not needed anymore, you can delete it.')
  await client.deleteWebhook(webhook.id)
})()
