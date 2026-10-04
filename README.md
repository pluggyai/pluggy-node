# Pluggy Node.js SDK (`pluggy-sdk`)

Official Node.js/TypeScript SDK for the Pluggy API.

- **API Docs**: https://docs.pluggy.ai
- **Base URL**: https://api.pluggy.ai/

## Installation

```bash
npm install pluggy-sdk
```

### Requirements

- **Node.js**: `>=12.0.0`

## Quickstart

```ts
import { PluggyClient } from 'pluggy-sdk'

const client = new PluggyClient({
  clientId: process.env.PLUGGY_CLIENT_ID!,
  clientSecret: process.env.PLUGGY_CLIENT_SECRET!,
})

async function main() {
  // Example: list connectors
  const connectors = await client.fetchConnectors()
  console.log('connectors', connectors.length)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
```

## Authentication

The SDK uses your Pluggy credentials:

- `PLUGGY_CLIENT_ID`
- `PLUGGY_CLIENT_SECRET`

If you don’t have credentials yet, generate them in the Pluggy dashboard and refer to the docs for environment setup.

## Core API examples

### Create a Connect Token

```ts
import { PluggyClient } from 'pluggy-sdk'

const client = new PluggyClient({
  clientId: process.env.PLUGGY_CLIENT_ID!,
  clientSecret: process.env.PLUGGY_CLIENT_SECRET!,
})

const connectToken = await client.createConnectToken({
  // Tip: pass the fields required by your integration
  // (e.g. options, itemId, connectorId, etc.)
})
```

### Items

```ts
// Create an item
const item = await client.createItem({
  connectorId: 123,
  parameters: {
    // connector-specific parameters
  },
})

// Fetch an item
const fetched = await client.fetchItem(item.id)

// Update item MFA (when required)
await client.updateItemMFA(item.id, {
  // mfa payload from Pluggy
})
```

#### Listing items (opt-in, paid plans only)

> ⚠️ **Opt-in, paid plans only.** Listing items is disabled by default and is only available to paid-plan teams that have explicitly requested it from Pluggy support. Teams without it enabled get `403 LIST_ITEMS_FEATURE_NOT_ENABLED`. For most integrations, store each `itemId` when it is created (Pluggy Connect `onSuccess` or the `item/created` webhook) and use `fetchItem(id)` instead.

`GET /v2/items` returns the team's items newest first, with cursor-based pagination. The only accepted filters are `clientUserId`, `connectorId` and `after`.

- `fetchItemsCursor(options)` — fetch a single page (`{ results, next }`). `next` is a query string such as `?connectorId=201&after=<cursor>`, or `null` on the last page.
- `fetchAllItems(options)` — follow the cursor through every page and return the full list.

```ts
// Single page
const page = await client.fetchItemsCursor({ clientUserId: 'user-123' })

// Next page: read `after` from the `next` query string
if (page.next) {
  const after = new URLSearchParams(page.next).get('after')!
  const nextPage = await client.fetchItemsCursor({ clientUserId: 'user-123', after })
}

// Or every item at once
const items = await client.fetchAllItems({ connectorId: 201 })
```

### Accounts and transactions (with pagination)

Transactions use **cursor-based pagination** against `GET /v2/transactions`. The SDK exposes two helpers:

- `fetchTransactionsCursor(accountId, options)` — fetch a single page and the cursor to the next one.
- `fetchAllTransactions(accountId, options)` — iterate through every page and return the full list.

```ts
const accounts = await client.fetchAccounts(item.id)
const account = accounts.results[0]

// Single page (returns { results, next })
const page = await client.fetchTransactionsCursor(account.id, {
  dateFrom: '2024-01-01',
})

// Manual pagination: follow the cursor until `next` is null
let cursor = page.next
while (cursor) {
  const url = new URL(cursor)
  const after = url.searchParams.get('after')!
  const next = await client.fetchTransactionsCursor(account.id, {
    dateFrom: '2024-01-01',
    after,
  })
  // ...do something with next.results
  cursor = next.next
}

// Or fetch all transactions in one call
const all = await client.fetchAllTransactions(account.id, {
  dateFrom: '2024-01-01',
})
```

> **Deprecation note:** the legacy page-based `fetchTransactions(accountId, options)` method (`GET /transactions`) is `@deprecated` and will be removed in a future major release. Migrate to `fetchTransactionsCursor` / `fetchAllTransactions` — the cursor endpoint is more stable for long lists and supports the full filter set (`dateTo`, `ids`, etc.).

### Webhooks

```ts
const webhook = await client.createWebhook({
  url: 'https://example.com/webhooks/pluggy',
  event: 'item.created',
})

const webhooks = await client.fetchWebhooks()

await client.deleteWebhook(webhook.id)
```

## Payments API examples

Use `PluggyPaymentsClient` for payment initiation features.

```ts
import { PluggyPaymentsClient } from 'pluggy-sdk'

const payments = new PluggyPaymentsClient({
  clientId: process.env.PLUGGY_CLIENT_ID!,
  clientSecret: process.env.PLUGGY_CLIENT_SECRET!,
})
```

### Create and fetch a payment recipient

```ts
const recipient = await payments.createPaymentRecipient({
  // recipient payload (PIX / bank account details, etc.)
})

const fetched = await payments.fetchPaymentRecipient(recipient.id)
```

### Create a payment request

```ts
const request = await payments.createPaymentRequest({
  // payment request payload
})
```

## Error handling

The SDK throws on non-2xx responses. Recommended pattern:

```ts
try {
  const item = await client.fetchItem('item_id')
  console.log(item)
} catch (err) {
  // Surface the error message and/or response details in your app logs
  console.error(err)
}
```

## TypeScript

This package is written in TypeScript and ships with types. You can import types from the package directly:

```ts
import type { Item, Transaction } from 'pluggy-sdk'
```

## Support

- **API documentation**: https://docs.pluggy.ai
- **OpenAPI spec**: https://api.pluggy.ai/oas3.json

## License

MIT
