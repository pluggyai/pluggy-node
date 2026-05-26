# Integration tests

These specs run the SDK against the real Pluggy API (sandbox connector) to catch drift between the SDK and the live service. Patterned after [`plaid/plaid-node`'s test suite](https://github.com/plaid/plaid-node/tree/master/test) — one spec per resource, each owning its own fixture lifecycle.

## Running locally

Set credentials in `.env.test` at the repo root:

```
PLUGGY_CLIENT_ID=...
PLUGGY_CLIENT_SECRET=...
# Optional override; defaults to https://api.pluggy.ai
PLUGGY_API_URL=https://api.pluggy.ai
```

Then:

```bash
pnpm test:integration
```

Without credentials each spec auto-skips via `describe.skip`, so the suite is safe to run in forks.

## Layout

| File | What it covers | Creates an item? |
|------|----------------|------------------|
| `helpers.ts` | Client factory, sandbox item lifecycle, retry helper, error-capture helper | — |
| `connectors.test.ts` | `fetchConnectors`, `fetchConnector`, `validateParameters` | No |
| `categories.test.ts` | `fetchCategories`, `fetchCategory` | No |
| `connectToken.test.ts` | `createConnectToken` | No |
| `webhooks.test.ts` | Webhook CRUD (always cleans up its own webhook) | No |
| `items.test.ts` | `fetchItem` against a freshly-created sandbox item | Yes |
| `accounts.test.ts` | `fetchAccounts`, `fetchAccount`, `fetchAccountStatements` | Yes |
| `transactions.test.ts` | Cursor pagination, `fetchTransaction`, `updateTransactionCategory` | Yes |
| `investments.test.ts` | Investments + `fetchAllInvestmentTransactions` dedup | Yes |
| `identity.test.ts` | `fetchIdentityByItemId`, `fetchIdentity` | Yes |
| `consents.test.ts` | `fetchConsents`, `fetchConsent` | Yes |
| `loans.test.ts` | `fetchLoans`, `fetchLoan` | Yes |
| `bills.test.ts` | `fetchCreditCardBills`, `fetchCreditCardBill` (skip if sandbox has no CREDIT account) | Yes |
| `errors.test.ts` | 4xx responses for known-bad ids on `fetchItem` / `fetchAccount` / `fetchTransaction` / `fetchConnector` | No |

## Fixture pattern

Each spec that needs server state calls `createSandboxItem(client)` in `beforeAll` — this creates a sandbox item, polls until status is `UPDATED`, and returns it. The matching `afterAll` calls `deleteItemSafely` so cleanup never masks the real failure (and orphans are surfaced to stderr).

Plaid's suite does not clean up — it relies on the sandbox being cheap. Pluggy items are heavier, so cleanup is mandatory.

## Resource tagging

Every test run gets a `RUN_ID` derived from `GITHUB_RUN_ID` (in CI) or `local-<timestamp>` (locally). Resources created during the run that accept a free-form identifier (`createConnectToken`'s `clientUserId`, webhook URLs) are tagged `integration-test-<RUN_ID>`. If a future failure leaks resources, they can be identified and swept by the tag.

## CI

The `.github/workflows/integration-tests.yml` workflow runs the suite nightly (cron) and on manual `workflow_dispatch`. Credentials come from repo secrets `PLUGGY_CLIENT_ID` / `PLUGGY_CLIENT_SECRET`.

## Wall time

Per-suite item creation costs one full sandbox sync (~2–4 minutes). With `--runInBand` the suite takes roughly `count(suites with items) × sync_time`. This is intentional: per-suite isolation guarantees one broken test does not poison the next.
