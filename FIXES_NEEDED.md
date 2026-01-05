# Remaining TypeScript Fixes

## Summary
We've fixed ~40 errors. Remaining: 87 errors

## Completed Fixes
1. ✅ DashboardPage - Updated DashboardDto usage, removed unused Legend import
2. ✅ ReportsPage - Fixed report service method calls, fixed unused variables
3. ✅ ShiftsPage - Fixed filter method and type declarations
4. ✅ lead.schema.ts - Converted source field to numeric enum (LeadSource)
5. ✅ development.schema.ts - Converted status to numeric enum (DevelopmentStatus)
6. ✅ contract.schema.ts, user.schema.ts - Fixed errorMap usage
7. ✅ ContractModal - Added missing fields (organizationId, type, clientName, clientEmail)
8. ✅ ContractModal & ContractsPage - Fixed unused 'key' variables
9. ✅ DealsPage - Fixed deal.value -> deal.expectedAmount
10. ✅ DealsPage - Fixed deal.probability possibly undefined

## Remaining Critical Fixes

### 1. DealModal.tsx
**Issues:**
- Line 65: `assignedToId` does not exist -> should be `ownerId`
- Line 94, 106: Missing required fields in create mutation (organizationId, ownerId, operation, expectedAmount)
- Line 94: propertyId can't be null
- Line 249: Property 'address' does not exist on type 'Property'

**Fixes Needed:**
```typescript
// Change assignedToId to ownerId everywhere
- assignedToId: deal?.assignedToId
+ ownerId: deal?.ownerId

// Fix create mutation - add missing fields
const createData = {
  ...data,
  propertyId: data.propertyId || undefined, // Remove null
  organizationId: user?.organizationId || '',
  ownerId: user?.id || '',
  operation: DealOperation.Venta, // Default
  expectedAmount: data.value || 0,
};

// Remove or fix 'address' reference
- property.address
+ property.location or remove
```

### 2. DevelopmentModal.tsx
**Issues:**
- Multiple: Properties don't exist on Development type (developer, estimatedCompletionDate, amenities)
- Line 110: Missing organizationId in create mutation
- Type mismatches with status field

**Fixes Needed:**
```typescript
// Add useAuth and get organizationId
const { user } = useAuth();

// In create mutation
const createData = {
  ...data,
  organizationId: user?.organizationId || '',
  endDate: data.estimatedCompletionDate, // Map field
};

// Remove non-existent fields from reset
```

### 3. LeadModal.tsx
**Issues:**
- Line 44: `assignedToId` should be `ownerId`
- Line 47: source type mismatch (string vs LeadSource)
- Line 84: Missing organizationId in create mutation

**Fixes Needed:**
```typescript
// Import useAuth
const { user } = useAuth();

// Fix field name
- assignedToId: lead?.assignedToId
+ ownerId: lead?.ownerId

// Fix reset source value
source: LeadSource.SitioWeb, // Use enum value

// Add organizationId to create
const createData = {
  ...data,
  organizationId: user?.organizationId || '',
  ownerId: data.assignedToId,
};
```

### 4. LeadsPage.tsx
**Issues:**
- Line 3: Unused CardHeader import
- Line 22: 'page' should be 'pageNumber'
- Lines 97-98: Fix pagination (data/total/limit -> items/totalCount/pageSize)

**Fixes Needed:**
```typescript
// Remove unused import
- import { Card, CardHeader, CardBody } from '../../components/ui';
+ import { Card, CardBody } from '../../components/ui';

// Fix filters
page: currentPage  ->  pageNumber: currentPage

// Fix pagination
- leads?.data
+ leads?.items
- leads?.total
+ leads?.totalCount
- leads?.limit
+ leads?.pageSize
```

### 5. DevelopmentsPage.tsx
**Issues:**
- Line 24: statusFilter type (string vs DevelopmentStatus)
- Lines 91-92: Pagination (data/total/limit -> items/totalCount/pageSize)

**Fixes Needed:**
```typescript
// Fix statusFilter initialization
const [statusFilter, setStatusFilter] = useState<DevelopmentStatus | undefined>();

// Fix pagination
- developments?.data
+ developments?.items
- developments?.total
+ developments?.totalCount
- developments?.limit
+ developments?.pageSize
```

### 6. PropertyModal.tsx
**Issues:**
- Missing fields in create mutation (organizationId, operation, type, publishStatus, currency)

**Fixes Needed:**
```typescript
const { user } = useAuth();

const createData = {
  ...data,
  organizationId: user?.organizationId || '',
  operation: data.listingType === 'SALE' ? 1 : 2, // Map to PropertyOperation
  type: 1, // PropertyType enum
  publishStatus: 1, // PropertyPublishStatus enum
  currency: 'MXN',
};
```

### 7. KanbanColumn.tsx
- Line 27: deal.value -> deal.expectedAmount

### 8. DealsPage.tsx (additional)
- Line 137: unused 'event' parameter

### 9. UsersPage.tsx
- Line 98: unused 'key' variable

### 10. UserModal.tsx
- Line 158: unused 'key' variable

### 11. LotModal.tsx & LotsPage.tsx
- Status type mismatches (string vs LotStatus enum)
- Missing properties (dimensions, location)
- Pagination fixes

### 12. OrganizationModal.tsx
- Type mismatch for organization type

## Quick Fix Commands

For unused variables:
```bash
# Replace all .map(([key, value]) with .map(([_key, value])
# Replace all .map((entry, index) with .map((_entry, index)
# Replace (event) => with () =>
```

For pagination:
```bash
# Replace .data with .items
# Replace .total with .totalCount
# Replace .limit with .pageSize
```

## Priority Order
1. Modal files (critical for CRUD operations)
2. Page files (pagination and unused variables)
3. Minor type fixes

## Estimated Time
- Remaining: ~2 hours of focused work
- Most issues are repetitive patterns
