---
name: add-route
description: >-
  Step-by-step workflow for adding a secure, multi-tenant, RLS-enforced HTTP route
  to the RealMe web application backend. Enforces PostgreSQL session parameterization,
  anti-leak cache headers, idempotency keys, and automated diagnostic registration.
---

# Add Route Skill: RealMe Web Application

This skill defines the mandatory protocol for adding new HTTP API routes to the **RealMe** backend server. Every route must adhere to RealMe's core architectural invariants: PostgreSQL Row-Level Security (RLS) parameterization, zero confidential client-side caching, and anti-false-success diagnostics.

---

## 1. Pre-Flight Route Architecture Checklist

Before creating a route, verify:
- [ ] **HTTP Method & Path**: RESTful conventions (`GET /api/v1/deals/:id`, `POST /api/v1/queries`).
- [ ] **Authentication & Tenant Context**: Does the route require tenant isolation? (Almost all RealMe routes do).
- [ ] **Cache Control**: Sensitive fiduciary routes must return `Cache-Control: no-store, private`.
- [ ] **Mobile 3G Idempotency**: All mutating routes (`POST`, `PUT`, `PATCH`, `DELETE`) must require `Idempotency-Key: <UUIDv4>`.
- [ ] **Input Validation**: Validate route parameters (UUID format for `tenant_id`, `listing_id`, `agent_id`).

---

## 2. Standard Route Implementation Steps

### Step 1: Create Route Handler File
Create the route handler under `src/routes/<domain>.js` or `routes/<domain>.js`.

```javascript
/**
 * RealMe Route: /api/v1/deals/:listingId/valuation
 * Domain: Pre-Listing Bottom-Dollar Valuation Retrieval
 * Security: Enforces PostgreSQL Row-Level Security (RLS)
 */

export async function handleGetValuation(req, res, dbPool) {
  const { listingId } = req.params;
  const { tenantId, agentId, userRole } = req.authContext; // Extracted from verified JWT session

  // 1. UUID Parameter Validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(listingId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error: { code: 'INVALID_LISTING_ID', message: 'listingId must be a valid UUIDv4' }
    }));
  }

  // 2. Execute within RLS Transaction Wrapper
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    
    // Set PostgreSQL session parameters for RLS
    await client.query(`
      SELECT set_config('app.current_tenant_id', $1, true),
             set_config('app.current_agent_id', $2, true),
             set_config('app.user_role', $3, true);
    `, [tenantId, agentId, userRole]);

    // Query listings table protected by RLS
    const result = await client.query(`
      SELECT l.id, l.title, l.address, q.bottom_dollar_price, q.signed_date
      FROM listings l
      JOIN listing_questionnaires q ON l.id = q.listing_id
      WHERE l.id = $1;
    `, [listingId]);

    await client.query('COMMIT');

    // 3. Check for Not Found or Unauthorized (Filtered out by RLS)
    if (result.rows.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        error: { code: 'NOT_FOUND', message: 'Record not found or access unauthorized' }
      }));
    }

    // 4. Return Fiduciary Response with Anti-Caching Headers
    const data = result.rows[0];
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'X-RealMe-RLS-Verified': 'true'
    });

    return res.end(JSON.stringify({
      success: true,
      listing_id: data.id,
      bottom_dollar_price: data.bottom_dollar_price,
      currency: 'NGN',
      currency_symbol: '₦',
      signed_date: data.signed_date
    }));

  } catch (err) {
    await client.query('ROLLBACK');
    req.log.error({ err, listingId, tenantId }, 'Failed to fetch deal valuation');
    
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Database query execution failed' }
    }));
  } finally {
    client.release();
  }
}
```

---

## 3. Mutating Route Pattern (with Idempotency)

For routes that accept submissions (e.g. `POST /api/v1/inspections/caveats`):

```javascript
export async function handleCreateCaveat(req, res, dbPool, idempotencyCache) {
  const idempotencyKey = req.headers['idempotency-key'];
  
  // Enforce Idempotency Key under Lagos 3G conditions
  if (!idempotencyKey) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error: { 
        code: 'MISSING_IDEMPOTENCY_KEY', 
        message: 'Idempotency-Key header is mandatory for all mutating requests.' 
      }
    }));
  }

  // Check deduplication cache
  const cachedResponse = idempotencyCache.get(idempotencyKey);
  if (cachedResponse) {
    res.writeHead(cachedResponse.status, cachedResponse.headers);
    return res.end(cachedResponse.body);
  }

  // Execute mutation and cache response for 120s
  // ...
}
```

---

## 4. Route Registration

Mount the route in `src/server.js` or `server.js`:

```javascript
import { handleGetValuation } from './routes/deals.js';

router.get('/api/v1/deals/:listingId/valuation', authenticateToken, (req, res) => {
  handleGetValuation(req, res, dbPool);
});
```

---

## 5. Verification & Test Protocol

Every newly created route must include an automated integration test verifying:
1. **Valid Authorized Access**: Authenticated agent receives `200 OK` with valid data.
2. **Cross-Tenant Isolation Breach Test**: Agent B from Tenant B attempting to query Agent A's `listingId` must receive `404 Not Found` (guaranteed by RLS, not application code).
3. **Cache-Control Header Audit**: Asserts `Cache-Control: no-store` on fiduciary responses.
4. **Idempotency Test**: Duplicate POST with identical `Idempotency-Key` returns identical cached payload without re-executing.

