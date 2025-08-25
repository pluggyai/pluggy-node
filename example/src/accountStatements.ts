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
  while (!['LOGIN_ERROR', 'OUTDATED', 'UPDATED'].includes(item.status)) {
    await sleep(3000)
    item = await client.fetchItem(item.id)
  }

  console.log(`Item completed execution with status ${item.status}`)
  if (['LOGIN_ERROR', 'OUTDATED'].includes(item.status)) return

  console.log('Fetching accounts')
  const accounts = await client.fetchAccounts(item.id)
  console.log(accounts.results)
  const [{ id: accountId }] = accounts.results

  // Once the connection was done successfully, lets review its account statements
  console.log('Fetching account statements')
  const accountStatements = await client.fetchAccountStatements(accountId)
  console.log(accountStatements.results)

  await client.deleteItem(item.id)
})()
