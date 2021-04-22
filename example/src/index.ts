import dotenv from 'dotenv'
import { PluggyClient } from 'pluggy-sdk'
import { sleep, PLUGGY_BANK_CREDENTIALS, PLUGGY_BANK_CONNECTOR } from './utils'

dotenv.config()

void (async function(): Promise<void> {
  const { CLIENT_ID = '', CLIENT_SECRET = '' } = process.env

  const client = new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    baseUrl: process.env.URL
  })

  // Review connectors endpoint
  const response = await client.fetchConnectors({
    sandbox: true
  })
  console.log('We support the following connectors: ')
  response.results.forEach(connector => {
    console.log(`(# ${connector.id} ) - ${connector.name}`)
  })

  // View credentials
  const connector = await client.fetchConnector(PLUGGY_BANK_CONNECTOR)
  console.log(`We are going to connect with ${connector.name}`)

  console.log('We will send the parameters that are OK.')
  console.log(PLUGGY_BANK_CREDENTIALS)

  // Create a connection
  let item = await client.createItem(PLUGGY_BANK_CONNECTOR, PLUGGY_BANK_CREDENTIALS)

  while (!['LOGIN_ERROR', 'OUTDATED', 'UPDATED'].includes(item.status)) {
    console.log(`Item ${item.id} its syncing with the institution`)
    await sleep(3000)
    item = await client.fetchItem(item.id)
  }

  console.log(`Item completed execution with status ${item.status}`)

  if (['LOGIN_ERROR', 'OUTDATED'].includes(item.status)) return

  console.log(`Retrieving accounts for item # ${item.id}`)

  const accounts = await client.fetchAccounts(item.id)
  for (let i = 0; i < accounts.results.length; i++) {
    const account = accounts.results[i]
    console.log(
      `Account # ${account.id} has a balance of ${account.balance}, its number is ${account.number}`
    )
    const transactions = await client.fetchTransactions(account.id)
    transactions.results.forEach(tx => {
      console.log(
        `Transaction # ${tx.id} made at ${tx.date}, description: ${tx.description}, amount: ${tx.amount}`
      )
    })
  }

  console.log(`Retrieving identity for item # ${item.id}`)
  const identity = await client.fetchIdentityByItemId(item.id)
  console.log(`Identity of the account name is ${identity.fullName}`)

  console.log(`Deleting retrieved data for item #${item.id}`)
  await client.deleteItem(item.id)
  console.log(`Item deleted succesfully`)
})()
