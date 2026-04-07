# Pluggy Node.js SDK (`pluggy-sdk`)

Official Node.js/TypeScript SDK for the Pluggy API.

- **API Docs**: https://docs.pluggy.ai
- **Base URL**: https://api.pluggy.ai/

## Installation

```bash
npm install pluggy-sdk
```

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

### Accounts and transactions (with pagination)

Most list endpoints support filters/pagination via an `options` object.

```ts
const accounts = await client.fetchAccounts(item.id)

const firstPage = await client.fetchTransactions({
  itemId: item.id,
  page: 1,
  pageSize: 20,
})

// If you need to iterate across all pages:
const all = await client.fetchAllTransactions({
  itemId: item.id,
  pageSize: 500,
})
```

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
