#!/bin/bash

# Fix ContractsPage - Remove unused key variable
sed -i "122s/.map((\[key, value\])/. map(([_key, value])/" src/pages/contracts/ContractsPage.tsx

# Fix DealsPage - Add missing properties and fix unused event
sed -i "s/'assignedToId'/'ownerId'/g" src/pages/deals/DealModal.tsx
sed -i "s/deal.value/deal.expectedAmount/g" src/pages/deals/DealsPage.tsx
sed -i "s/(event)/()/g" src/pages/deals/DealsPage.tsx

# Fix LeadsPage - Fix pagination and remove unused CardHeader
sed -i "s/import { Card, CardHeader/import { Card/g" src/pages/leads/LeadsPage.tsx
sed -i "s/page:/pageNumber:/g" src/pages/leads/LeadsPage.tsx
sed -i "s/leads\?.data/leads?.items/g" src/pages/leads/LeadsPage.tsx
sed -i "s/leads\?.total/leads?.totalCount/g" src/pages/leads/LeadsPage.tsx
sed -i "s/leads\?.limit/leads?.pageSize/g" src/pages/leads/LeadsPage.tsx

# Fix DevelopmentsPage - Fix pagination
sed -i "s/developments\?.data/developments?.items/g" src/pages/developments/DevelopmentsPage.tsx
sed -i "s/developments\?.total/developments?.totalCount/g" src/pages/developments/DevelopmentsPage.tsx
sed -i "s/developments\?.limit/developments?.pageSize/g" src/pages/developments/DevelopmentsPage.tsx

echo "Fixes applied successfully"
