# Rule 02: Multi-Tenant Data Isolation & Security Invariant

## 1. The Core Architectural Invariant
**Absolute multi-tenant data isolation is non-negotiable.**
RealMe manages sensitive real estate intelligence, unredacted seller bottom-dollar agreed prices, structural engineering inspection caveats, and legal escrow penalty stipulations. Cross-agent or cross-tenant data leakage is mathematically prevented at the database layer.

## 2. PostgreSQL Row-Level Security (RLS) Mandate
- Every listing chunk, inspection caveat, deal negotiation record, and questionnaire table in PostgreSQL must have Row-Level Security enabled:
  ```sql
  ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE inspection_caveats ENABLE ROW LEVEL SECURITY;
  ALTER TABLE deal_records ENABLE ROW LEVEL SECURITY;
  ```
- All access policies must filter strictly by authenticated tenant and owner ID:
  ```sql
  CREATE POLICY tenant_isolation_policy ON listings
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid
           AND agent_id = current_setting('app.current_agent_id')::uuid);
  ```
- Never bypass RLS with administrative database connections in application code.
- **Connection Pooling Mandate**: When using pooled client connections, every transaction or checkout must explicitly parameterize tenant context before querying:
  ```sql
  BEGIN;
  SELECT set_config('app.current_tenant_id', $1, true);
  SELECT set_config('app.current_agent_id', $2, true);
  -- Execute business logic queries here
  COMMIT;
  ```

## 3. Client-Side Data Handling Rules
- **No Private Data in Client Storage**: Never cache unredacted deal facts, seller bottom-dollar prices, or attorney correspondence in `localStorage`, `sessionStorage`, `IndexedDB`, or service workers. Field smartphones may be shared, stolen, or inspected.
- **Offline Failure Behavior**: If the network connection drops on a Lagos cellular tower, the UI must display an explicit "Data Unavailable - Reconnecting" state rather than serving stale or fabricated mock data that could mislead agents during live price negotiations.
