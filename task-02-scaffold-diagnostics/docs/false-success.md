# Anti-False-Success Diagnostics Specification

## RealMe Deal Intelligence Platform (Task 02 Scaffold)
**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**Author**: Antigravity Technical Architecture Team  
**Date**: October 31, 2026  

---

## 1. The "False Success" Vulnerability

In production microservices and agentic applications, the most catastrophic failure mode is **False Success**:
> *An automated health probe, CI suite, or API endpoint reports `HTTP 200 OK` (Healthy) by asserting trivial truthy expressions or returning hardcoded fallback mock data while the underlying database connection is dead, Row-Level Security is disabled, or design tokens have diverged.*

In **RealMe**, a false success could cause a field agent standing in front of a buyer in Lekki to be served empty or stale fallback data, misquoting a seller's bottom-dollar valuation or missing an active structural foundation crack.

---

## 2. Hardened Diagnostic Verification Principles

### Principle 1: Active Dependency Probing (No Passive Echoes)
- `/api/diagnostics` never checks an in-memory boolean flag. It executes an active round-trip handshake against PostgreSQL:
  ```sql
  SELECT current_setting('app.current_tenant_id', true);
  ```
- If the database socket is closed (`ECONNREFUSED`), the endpoint **must immediately fail with HTTP 503 Service Unavailable**.

### Principle 2: Zero Masking with Fallback Mock Data
- When an upstream dependency fails, application routes must return an unambiguous HTTP error:
  ```json
  {
    "status": "down",
    "error": {
      "code": "DATABASE_UNREACHABLE",
      "message": "Fiduciary database connection failed. Refusing to serve mock data."
    }
  }
  ```
- Masking errors with empty arrays (`[]`) or mock numbers (`₦0`) is strictly forbidden.

### Principle 3: Automated Token Parity Verification
- Diagnostics verify that `tokens.css` matches the checksum of `06-tokens-complete.json`. If token schema drift occurs, the diagnostic status transitions to `degraded`.

---

## 3. Deliberate Failure Boundary Test Scenarios

| Test Case | Injected Fault | Expected Behavior | Anti-False-Success Verdict |
| :--- | :--- | :--- | :--- |
| **Fault 1: Database Offline** | Stop PostgreSQL container / terminate 5432 | `/api/diagnostics` returns **HTTP 503**, reporting `database: unreachable` | **PASS (No masked 200)** |
| **Fault 2: Unparameterized Session** | Omit `set_config('app.current_tenant_id')` | Query returns 0 rows; endpoint returns **HTTP 404** with audit flag | **PASS (Fails closed)** |
| **Fault 3: Raw Hex Value in CSS** | Inject `#BA1A1A` into stylesheet | CI linter script fails with non-zero exit code (`exit 1`) | **PASS (Build blocked)** |
| **Fault 4: Memory Heap Saturation** | Mock heap allocation $> 90\%$ max | Diagnostic reports `status: degraded`, alerting operations before crash | **PASS (Early warning)** |

