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
| Transactions | `fetchTransactionsCursor()` (single page) + `fetchAllTransactions()` (full sweep) for the v2 cursor endpoint; `fetchTransactions()` page-based is `@deprecated`; `fetchTransaction()` by id | GET /v2/transactions, GET /transactions/{id} |
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

This repo uses **pnpm 11** (managed via corepack — the `packageManager` field in `package.json` pins the version). Development requires **Node 24+** (declared in `devEngines`); the published package itself supports **Node 12+** for consumers (`engines.node`).

```bash
# Install dependencies (corepack activates the pinned pnpm version)
pnpm install --frozen-lockfile

# Build
pnpm build

# Test
pnpm test

# Lint. ⚠️ This script first runs `prettier --write src/**/*.ts`. Since
# prettier is pinned to 1.19.1 (last 1.x, kept on purpose to avoid mass
# reformatting), running `pnpm lint` WILL rewrite files. To lint
# without touching formatting, use `pnpm exec eslint .` instead.
pnpm lint

# Run the same strict supply-chain audit CI runs (any vuln, any
# severity fails — prod + dev — plus signature verification).
pnpm audit:supply-chain
```

### Test structure

Three layers, by directory:

- **Unit (default, offline)** — `tests/*.test.ts` (e.g. `transactions.test.ts`, `auth.test.ts`) and `tests/payments/*.test.ts`. Run by `pnpm test`, which ignores `tests/integration`. They mock HTTP with **nock** (`/auth` + the target endpoint) and assert the SDK builds the right request (method, path, query, body) and parses the response — no network, no credentials. The payments suite (`tests/payments/`) has one spec per public `PluggyPaymentsClient` method and calls `nock.disableNetConnect()` (scoped in `tests/payments/utils.ts`, **not** the shared `setupTests.ts`, so the integration suite keeps live connections) — a wrong path then fails hard instead of reaching the wire.
- **Integration (real sandbox, opt-in)** — `tests/integration/*.test.ts`, run by `pnpm test:integration` (`--runInBand`). These hit the **real Pluggy API** against the sandbox connector (id `0`, `user-ok`/`password-ok`), create an item, poll until `UPDATED`, assert, then delete it defensively. Each spec owns its own item lifecycle (per-suite isolation), so wall time is ~30+ min. They **auto-skip** (`describe.skip`) when `PLUGGY_CLIENT_ID` / `PLUGGY_CLIENT_SECRET` are absent, so they're safe to run locally/in forks without creds. Credentials come from `.env.test` at the repo root (loaded by `tests/setupTests.ts`); CI runs them nightly + `workflow_dispatch`. See `tests/integration/README.md`.
- **Shared** — `tests/utils.ts` (`setupAuth`, mock JWT) and `tests/setupTests.ts` (loads `.env.test`) back the unit suites; `tests/integration/helpers.ts` backs the integration suite.

### TypeScript & Build setup

Two tsconfigs by design:
- `tsconfig.json` — used by the IDE and ts-jest. Includes `src/` AND `tests/`, `noEmit: true`, `types: ["jest", "node"]`. Keeps editor errors silent on test files.
- `tsconfig.build.json` — used only by `pnpm build`. Emits only `src/` to `dist/` with declarations. The `build` script wires this in.

Other intentional settings worth knowing about:
- `strict: false` — TypeScript 6 flipped the `strict` default to `true`; we keep it `false` to preserve the legacy laxness on null / undefined / unintialised class members. Enabling strict surfaces real but unrelated work and belongs in a dedicated PR.
- `target: "ES2019"`, `lib: ["ES2019"]`, `module: "node16"` — follows the Microsoft-recommended config for Node 12 consumers (output stays CommonJS because the package has no `"type": "module"`).

### Supply-chain hardening

`pnpm-workspace.yaml` enforces:
- `minimumReleaseAge: 14d` — versions younger than 14 days are blocked at resolve time (CVE bypasses go through `minimumReleaseAgeExclude` with a documented removal date).
- `trustPolicy: no-downgrade`, `blockExoticSubdeps`, `engineStrict`.
- `savePrefix: ""` — `pnpm add` saves exact versions.
- `allowBuilds: { unrs-resolver: false }` — postinstall scripts are blocked by default; each one needs an explicit decision.
- `overrides: { ... }` — exact-version patches for transitive vulnerabilities (lodash, braces, micromatch, @babel/helpers, js-yaml, brace-expansion). **Review these whenever you bump a parent dep**: once the parent picks up the fix natively, the override should come back out.

Full inline reasoning lives in `pnpm-workspace.yaml`.

### Node version surface

- `engines.node: ">=12.0.0"` — the floor we promise to consumers (real minimum that the runtime deps require; `jsonwebtoken` is the strictest).
- `devEngines.runtime.version: ">=24.10.0"` — required to develop the SDK (pnpm 11 + semantic-release v25 both require it).
- `@types/node: 16.18.126` — the closest match to `engines.node` that compiles cleanly with TS 6 (the 12.x types do not).
- `eslint-plugin-n` reads `engines.node` and statically rejects any Node API call not available in the supported range (e.g. `fs.promises.cp` would fail). Scoped to `src/**/*.ts` only.

## Current SDK Status (Last Updated: 2026-06-08)

### SDK Coverage
The Node SDK has comprehensive coverage including:
- All core aggregation endpoints
- Cursor-based transactions (`GET /v2/transactions` via `fetchTransactionsCursor` / `fetchAllTransactions`); the page-based `fetchTransactions` is `@deprecated`
- Identity PF/PJ fields (new in Pluggy API 0.24)
- Full payment initiation support
- Automatic PIX payments
- Smart accounts and transfers
- Bulk payments
- Scheduled payments

### Last API Sync (2026-06-08)
Type-only gap fixes from comparing `src/types/` against the OpenAPI spec (`oas3.json`). No new endpoints — all paths already covered. Added fields:
- **Connector**: `supportsAutomaticPix`, `supportsBoletoManagement`, `updatedAt?`
- **Item**: `consentExpiresAt`
- **Loan**: `kind` (new `LoanKind` enum: `LOAN` | `FINANCING` | `INVOICE_FINANCING` | `UNARRANGED_ACCOUNT_OVERDRAFT`)
- **CreditCardBills**: `payments` (new `CreditCardBillPayment` type + `valueType`/`paymentMode` enums)
- Re-exported `creditCardBills` types from `src/types/index.ts` (were public via `fetchCreditCardBill()` return type but not importable)

### Not Implemented (Intentional)
- Boleto Management: Beta feature, not added to SDK (the `Connector.supportsBoletoManagement` flag is exposed as read-only metadata, but no boleto endpoints/types are implemented)
