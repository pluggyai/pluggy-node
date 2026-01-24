# Add New Endpoint

Add a new API endpoint to the Pluggy Node.js SDK.

## Required Information

- **Endpoint path**: e.g., `/models`, `/models/{id}`
- **HTTP method**: GET, POST, PATCH, PUT, DELETE
- **Request schema**: Query parameters or body payload
- **Response schema**: Expected response type
- **Client class**: PluggyClient or PluggyPaymentsClient

## Steps

### 1. Create Type Definition

Create or update type file in `src/types/`:

```typescript
// src/types/model.ts
import { PageFilters } from './common'

/** Model description */
export type Model = {
  /** Primary identifier */
  id: string
  /** Other fields... */
  name: string
  createdAt: Date
}

/** Filters for fetching models */
export type ModelFilters = PageFilters & {
  status?: string
}

/** Payload for creating a model */
export type CreateModelPayload = {
  name: string
}

/** Payload for updating a model */
export type UpdateModelPayload = {
  name?: string
}
```

### 2. Export from Types Index

Add export to `src/types/index.ts`:

```typescript
export * from './model'
```

### 3. Import in Client

Add import to the appropriate client (`src/client.ts` or `src/paymentsClient.ts`):

```typescript
import {
  Model,
  ModelFilters,
  CreateModelPayload,
  UpdateModelPayload,
} from './types'
```

### 4. Add Client Method

Add the method following existing patterns:

```typescript
// List with pagination
async fetchModels(itemId: string, options: ModelFilters = {}): Promise<PageResponse<Model>> {
  return await this.createGetRequest('models', { ...options, itemId })
}

// Get by ID
async fetchModel(id: string): Promise<Model> {
  return await this.createGetRequest(`models/${id}`)
}

// Create
async createModel(payload: CreateModelPayload): Promise<Model> {
  return await this.createPostRequest('models', null, payload)
}

// Update
async updateModel(id: string, payload: UpdateModelPayload): Promise<Model> {
  return await this.createPatchRequest(`models/${id}`, null, payload)
}

// Delete
async deleteModel(id: string): Promise<void> {
  return await this.createDeleteRequest(`models/${id}`)
}
```

### 5. Build and Test

```bash
npm run build
npm test
npm run lint
```

### 6. Add Integration Test (Optional)

Add test to `tests/integration.test.ts`:

```typescript
describe('Models', () => {
  it('fetchModels returns models', async () => {
    expect(item).not.toBeNull()

    const models = await client.fetchModels(item!.id)

    expect(models).toBeDefined()
    console.log(`Found ${models.total} models`)

    for (const model of models.results) {
      console.log(`Model: ${model.id}, Name: ${model.name}`)

      // Verify we can fetch individual model
      const fetchedModel = await client.fetchModel(model.id)
      expect(fetchedModel).toBeDefined()
      expect(fetchedModel.id).toBe(model.id)
    }
  })
})
```

### 7. Update CLAUDE.md

Add the new endpoint to the SDK method table in CLAUDE.md.

## Method Signatures Reference

| Pattern | Signature |
|---------|-----------|
| List | `fetchModels(itemId: string, options?: ModelFilters): Promise<PageResponse<Model>>` |
| Get | `fetchModel(id: string): Promise<Model>` |
| Create | `createModel(payload: CreateModelPayload): Promise<Model>` |
| Update | `updateModel(id: string, payload: UpdateModelPayload): Promise<Model>` |
| Delete | `deleteModel(id: string): Promise<void>` |
