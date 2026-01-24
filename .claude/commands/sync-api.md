# Sync SDK with API

Synchronize the Pluggy Node.js SDK with the current production API.

## Steps

### 1. Fetch Current API Specification

Use WebFetch to retrieve the OpenAPI spec:
```
GET https://api.pluggy.ai/oas3.json
```

### 2. Compare Endpoints

Review current SDK methods in `src/client.ts` (PluggyClient) and `src/paymentsClient.ts` (PluggyPaymentsClient) against the OpenAPI paths.

**Check for:**
- Missing endpoints (new API paths not in SDK)
- Missing HTTP methods on existing endpoints
- Changed request/response schemas

### 3. Compare Types

Review types in `src/types/` against OpenAPI component schemas.

**Check for:**
- Missing fields in existing types
- New types not yet defined
- Changed field types or nullability

### 4. Document Findings

Create a gap analysis with:
- Missing endpoints with priority
- Missing fields by type
- Breaking changes (if any)

### 5. Implementation Order

1. **Phase 1 - Missing Fields**: Add new fields to existing types
2. **Phase 2 - Core Endpoints**: Implement missing aggregation endpoints
3. **Phase 3 - Payment Endpoints**: Implement missing payment endpoints

### 6. Type Patterns

When adding types, follow existing patterns in `src/types/`:

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

### 7. Client Method Patterns

When adding methods to `src/client.ts`:

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

### 8. Validation

After implementation:
```bash
npm run build
npm test
npm run lint
```

### 9. Update CLAUDE.md

Update the "Current SDK Status" section with:
- Date of sync
- New endpoints added
- New fields added
- Any intentionally skipped items
