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
  console.log('Item created, id:', item.id)

  while (!['LOGIN_ERROR', 'OUTDATED', 'UPDATED'].includes(item.status)) {
    await sleep(3000)
    item = await client.fetchItem(item.id)
    console.log(`Item status: ${item.status} - executionStatus: ${item.executionStatus}`)
  }

  if (['LOGIN_ERROR', 'OUTDATED'].includes(item.status)) {
    console.log(
      `Item execution not successful, status: ${item.status} - executionStatus: ${item.executionStatus} - error:`,
      item.error
    )
    return
  }

  console.log(
    `Item finished execution with status ${item.status} - executionStatus: ${item.executionStatus}`
  )

  // Once the connection was done successfully, retrieve the collected loans data
  const loans = await client.fetchLoans(item.id)
  console.log(`Collected ${loans.total} loans`)
  if (loans.results.length > 0) {
    console.log(`First loan data:\n`, loans.results[0])
  }
})()
