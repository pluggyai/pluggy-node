import dotenv from 'dotenv'
import { PluggyClient } from 'pluggy-sdk'
import {
  PLUGGY_BANK_CONNECTOR,
  PLUGGY_BANK_CREDENTIALS,
  PLUGGY_BANK_MFA_2STEP_CONNECTOR,
  sleep,
} from './utils'
import { Item, ItemStatus } from '../../src'

const DEFAULT_MFA_VALUE = '123456'

dotenv.config()

void (async function(): Promise<void> {
  const { CLIENT_ID = '', CLIENT_SECRET = '' } = process.env

  const client = new PluggyClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })

  // Create a connection
  let item: Item = await client.createItem(PLUGGY_BANK_MFA_2STEP_CONNECTOR, PLUGGY_BANK_CREDENTIALS)

  while (item.status === 'UPDATING' || item.status === 'WAITING_USER_INPUT') {
    const { status, parameter } = item

    console.log(
      new Date().toISOString(),
      `Item ${item.id} is syncing with the institution, current status ${status}`
    )

    if (status === 'UPDATING') {
      // wait & fetch Item again, to re-check status
      await sleep(3000)
      item = await client.fetchItem(item.id)
      continue
    }

    // status === 'WAITING_USER_INPUT'

    if (!parameter) {
      console.log(
        new Date().toISOString(),
        'Item is in status WAITING_USER_INPUT but parameter is missing, fetching data again...'
      )
      continue
    }

    console.log(
      new Date().toISOString(),
      `There is a MFA requested, ${parameter.name}, providing value.`
    )

    try {
      item = await client.updateItemMFA(item.id, {
        [parameter.name]: DEFAULT_MFA_VALUE,
      })
    } catch (error) {
      if (error instanceof Error) {
        error.message = `Could not update Item MFA: ${error.message}`
        console.error(new Date().toISOString(), error)
      }
    }
  }

  console.log(new Date().toISOString(), `Item completed execution with status ${item.status}`)

  console.log(new Date().toISOString(), `Deleting retrieved data for item #${item.id}`)
  await client.deleteItem(item.id)
  console.log(new Date().toISOString(), `Item deleted succesfully`)
})()
