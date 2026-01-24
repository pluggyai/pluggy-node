# Pluggy Node.js SDK - Claude Code Knowledge Base

## Project Overview

This is the official Pluggy Node.js/TypeScript SDK for the Pluggy financial data API. The SDK provides typed access to Pluggy's REST API for financial data aggregation, payments, and Open Finance.

- **Package**: pluggy-sdk (NPM)
- **Language**: TypeScript
- **License**: MIT

## Project Structure

```
/src/
  ├── index.ts              # Main entry point (exports client & types)
  ├── client.ts             # PluggyClient class (main SDK client)
  ├── paymentsClient.ts     # PluggyPaymentsClient class (payments operations)
  ├── baseApi.ts            # BaseApi class with HTTP methods
  ├── transforms.ts         # JSON transformation utilities
  └── types/                # Type definitions
      ├── index.ts          # Re-exports all types
      ├── account.ts
      ├── accountStatement.ts
      ├── category.ts
      ├── common.ts
      ├── connector.ts
      ├── consent.ts
      ├── execution.ts
      ├── identity.ts
      ├── investment.ts
      ├── item.ts
      ├── loan.ts
      ├── transaction.ts
      ├── webhook.ts
      └── payments/         # Payment-related types
          ├── index.ts
          ├── paymentRequest.ts
          ├── paymentIntent.ts
          ├── paymentCustomer.ts
          ├── paymentRecipient.ts
          └── ...
/dist/                      # Compiled JavaScript output
```

## API Reference

- **OpenAPI Spec**: https://api.pluggy.ai/oas3.json
- **Documentation**: https://docs.pluggy.ai
- **Base URL**: https://api.pluggy.ai/

## SDK Sync Process

When syncing the SDK with the API, follow these steps:

### 1. Fetch Current API Specification
```
GET https://api.pluggy.ai/oas3.json
```

### 2. Compare Client Methods

Current SDK methods in `client.ts` (PluggyClient):

| Resource | SDK Method | API Endpoint |
|----------|------------|--------------|
| Connectors | `fetchConnectors()`, `fetchConnector()` | GET /connectors |
| Connector Validation | `validateParameters()` | POST /connectors/{id}/validate |
| Items | `createItem()`, `fetchItem()`, `updateItem()`, `deleteItem()` | /items |
| Item MFA | `updateItemMFA()` | POST /items/{id}/mfa |
| Accounts | `fetchAccounts()`, `fetchAccount()` | /accounts |
| Account Statements | `fetchAccountStatements()` | GET /accounts/{id}/statements |
| Transactions | `fetchTransactions()`, `fetchTransaction()`, `fetchAllTransactions()` | /transactions |
| Transaction Update | `updateTransactionCategory()` | PATCH /transactions/{id} |
| Investments | `fetchInvestments()`, `fetchInvestment()` | /investments |
| Investment Transactions | `fetchInvestmentTransactions()`, `fetchAllInvestmentTransactions()` | GET /investments/{id}/transactions |
| Loans | `fetchLoans()`, `fetchLoan()` | /loans |
| Consents | `fetchConsents()`, `fetchConsent()` | /consents |
| Identity | `fetchIdentity()`, `fetchIdentityByItemId()` | /identity |
| Credit Card Bills | `fetchCreditCardBills()`, `fetchCreditCardBill()` | /bills |
| Categories | `fetchCategories()`, `fetchCategory()` | /categories |
| Webhooks | Full CRUD | /webhooks |
| Connect Token | `createConnectToken()` | POST /connect_token |

Current SDK methods in `paymentsClient.ts` (PluggyPaymentsClient):

| Resource | SDK Methods |
|----------|-------------|
| Payment Recipients | `createPaymentRecipient()`, `fetchPaymentRecipient()`, `fetchPaymentRecipients()`, `updatePaymentRecipient()`, `deletePaymentRecipient()` |
| Payment Requests | `createPaymentRequest()`, `fetchPaymentRequest()`, `fetchPaymentRequests()`, `deletePaymentRequest()` |
| Payment Intents | `createPaymentIntent()`, `fetchPaymentIntent()`, `fetchPaymentIntents()` |
| Payment Customers | Full CRUD |
| Payment Institutions | `fetchPaymentInstitution()`, `fetchPaymentInstitutions()` |
| Bulk Payments | Full CRUD |
| Smart Accounts | `createSmartAccount()`, `fetchSmartAccount()`, `fetchSmartAccountBalance()`, `fetchSmartAccounts()` |
| Automatic PIX | Multiple methods for PIX automático |
| Scheduled Payments | Multiple methods |
| Smart Transfers | Multiple methods |

### 3. Type Definition Patterns

When creating new types, follow existing patterns:

```typescript
import { PageFilters } from './common'

export type ModelName = {
  /** Primary identifier */
  id: string
  /** Related item ID */
  itemId: string
  /** Optional field */
  optionalField?: string
  /** Nullable field */
  nullableField: string | null
  /** Date field */
  createdAt: Date
}

export type ModelFilters = PageFilters & {
  /** Custom filter */
  customFilter?: string
}
```

### 4. Client Method Patterns

```typescript
// GET with query parameters
async fetchModels(itemId: string, options: ModelFilters = {}): Promise<PageResponse<Model>> {
  return await this.createGetRequest('models', { ...options, itemId })
}

// GET by ID
async fetchModel(id: string): Promise<Model> {
  return await this.createGetRequest(`models/${id}`)
}

// POST
async createModel(payload: CreateModelPayload): Promise<Model> {
  return await this.createPostRequest('models', null, payload)
}

// PATCH
async updateModel(id: string, payload: UpdateModelPayload): Promise<Model> {
  return await this.createPatchRequest(`models/${id}`, null, payload)
}

// DELETE
async deleteModel(id: string): Promise<void> {
  return await this.createDeleteRequest(`models/${id}`)
}
```

## Build and Test

```bash
# Install dependencies
npm ci

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

## Current SDK Status (Last Updated: 2026-01-23)

### SDK Coverage
The Node SDK has comprehensive coverage including:
- All core aggregation endpoints
- Full payment initiation support
- Automatic PIX payments
- Smart accounts and transfers
- Bulk payments
- Scheduled payments

### Not Implemented (Intentional)
- Boleto Management: Beta feature, not added to SDK
