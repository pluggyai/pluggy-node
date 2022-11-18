import dotenv from 'dotenv'
import { PluggyClient } from 'pluggy-sdk'
import { sleep, PLUGGY_BANK_CREDENTIALS, PLUGGY_BANK_CONNECTOR } from './utils'

dotenv.config()

void (async function(): Promise<void> {
  const { CLIENT_ID = '', CLIENT_SECRET = '' } = process.env

  const client = new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })

  // We create the sandbox item to review its data
  let item = await client.createItem(PLUGGY_BANK_CONNECTOR, PLUGGY_BANK_CREDENTIALS)
  console.log('Item created', item)

  while (item.status === 'UPDATING') {
    await sleep(3000)
    item = await client.fetchItem(item.id)
  }

  console.log(`Item id ${item.id} completed execution with status '${item.status}'`)

  if (item.status !== 'UPDATED') {
    // Item didn't finish successfully, no data to retrieve
    console.log(`Item id ${item.id} didn't finish successfully, no data to retrieve.`)
    await client.deleteItem(item.id)
    return
  }

  // Once the connection was done successfully, lets review its investments
  const opportunities = await client.fetchOpportunities(item.id)

  console.log(`Opportunities retrieved (total: ${opportunities.total}):`, opportunities.results)

  await client.deleteItem(item.id)
})()
