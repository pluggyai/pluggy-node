# Add Model Fields

Add missing fields to existing types in the Pluggy Node.js SDK.

## Required Information

- **Type name**: e.g., `Transaction`, `Investment`
- **Field name**: e.g., `operationType`
- **Field type**: e.g., `string`, `number`, `Date`, custom type
- **Nullability**: Required, optional (`?`), or nullable (`| null`)
- **Description**: JSDoc comment for the field

## Steps

### 1. Locate Type File

Types are in `src/types/`. Common locations:
- `account.ts` - Account types
- `transaction.ts` - Transaction types
- `investment.ts` - Investment types
- `identity.ts` - Identity types
- `consent.ts` - Consent types
- `loan.ts` - Loan types
- `connector.ts` - Connector types
- `item.ts` - Item types

### 2. Determine Field Type Pattern

```typescript
// Required field
fieldName: string

// Optional field (may not be present in response)
fieldName?: string

// Nullable field (present but may be null)
fieldName: string | null

// Optional and nullable
fieldName?: string | null

// Date fields
createdAt: Date
updatedAt: Date | null

// Nested objects
metadata: ModelMetadata | null

// Arrays
tags: string[]
items: SubModel[]
```

### 3. Add Field to Type

Add the field with JSDoc comment:

```typescript
export type Transaction = {
  // ... existing fields ...

  /** Description of the new field */
  newField: string | null
}
```

### 4. Add Nested Types (if needed)

If the field requires a new type:

```typescript
export type NewFieldMetadata = {
  /** Sub-field description */
  subField: string
  /** Another sub-field */
  amount: number | null
}

export type Transaction = {
  // ... existing fields ...

  /** New field with nested data */
  newField: NewFieldMetadata | null
}
```

### 5. Add Enum Types (if needed)

For fields with fixed values:

```typescript
export const NEW_FIELD_STATUS = ['ACTIVE', 'INACTIVE', 'PENDING'] as const
export type NewFieldStatus = typeof NEW_FIELD_STATUS[number]

export type Transaction = {
  // ... existing fields ...

  /** Status of the new field */
  newFieldStatus: NewFieldStatus | null
}
```

### 6. Build and Test

```bash
npm run build
npm test
npm run lint
```

## Common Field Patterns

### String Fields
```typescript
/** Description */
name: string
code: string | null
optionalCode?: string
```

### Number Fields
```typescript
/** Amount in cents */
amount: number
balance: number | null
optionalRate?: number
```

### Date Fields
```typescript
/** When the record was created */
createdAt: Date
updatedAt: Date | null
dueDate?: Date
```

### Boolean Fields
```typescript
/** Whether the item is active */
isActive: boolean
isVerified: boolean | null
```

### Enum Fields
```typescript
export const STATUSES = ['ACTIVE', 'INACTIVE'] as const
export type Status = typeof STATUSES[number]

status: Status
previousStatus: Status | null
```

### Nested Object Fields
```typescript
export type Metadata = {
  key: string
  value: string | null
}

metadata: Metadata | null
```

### Array Fields
```typescript
tags: string[]
items: SubModel[]
permissions: string[] | null
```

## Type File Structure

Each type file should follow this pattern:

```typescript
import { PageFilters } from './common'

// Constants/Enums at top
export const MODEL_STATUSES = ['ACTIVE', 'INACTIVE'] as const
export type ModelStatus = typeof MODEL_STATUSES[number]

// Helper/nested types
export type ModelMetadata = {
  key: string
}

// Main type
export type Model = {
  id: string
  // ... fields
}

// Filter types at bottom
export type ModelFilters = PageFilters & {
  status?: ModelStatus
}
```
