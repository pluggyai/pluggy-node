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

  console.log('Creating item...')
  // We create the sandbox item to review its data
  let item = await client.createItem(PLUGGY_BANK_CONNECTOR, PLUGGY_BANK_CREDENTIALS)
  while (!['LOGIN_ERROR', 'OUTDATED', 'UPDATED'].includes(item.status)) {
    await sleep(3000)
    item = await client.fetchItem(item.id)
  }

  console.log(`Item completed execution with status ${item.status}`)
  if (['LOGIN_ERROR', 'OUTDATED'].includes(item.status)) return

  // Once the connection was done successfully, get the income reports

  const incomeReports = await client.fetchIncomeReports(item.id)

  console.log(`There is a total of ${incomeReports.total} income reports`)

  for (const incomeReport of incomeReports.results) {
    console.log(`Income report for year ${incomeReport.year}`)
    console.log(`Income report url ${incomeReport.url}`)
  }

  await client.deleteItem(item.id)
})()
