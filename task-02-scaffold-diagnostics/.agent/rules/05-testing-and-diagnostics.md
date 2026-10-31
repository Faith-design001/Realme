# Rule 05: Diagnostics, Testing & Evidence Standards

## 1. Truth in Diagnostics (Avoiding "False Success")
- Never write tests or diagnostic scripts that pass trivially by asserting truthy values without checking actual system state.
- Diagnostic endpoints must inspect:
  1. Live database connectivity and active RLS session state.
  2. Memory footprint and event loop latency.
  3. Design token schema integrity and compilation parity.
- When an upstream dependency fails (e.g. database unreachable), diagnostics must return an unambiguous HTTP 503 with exact failure reasons, never a masked HTTP 200 with empty mock data.
- **Diagnostics Response Schema**:
  ```json
  {
    "status": "healthy | degraded | down",
    "timestamp": "2026-10-30T20:00:00.000Z",
    "uptime_seconds": 124.5,
    "checks": {
      "database": { "status": "ok", "latency_ms": 4.2, "rls_enforced": true },
      "tokens": { "status": "ok", "parity": true },
      "memory": { "status": "ok", "heap_used_mb": 42.1 }
    }
  }
  ```

## 2. Automated Token & Linter Audits
- Every build and commit must pass automated verification:
  - `tokens.css` matches the latest `06-tokens-complete.json` export.
  - Zero raw hex values in `src/*.css`.
  - Zero arbitrary un-tokenized font sizes in CSS.

## 3. Deliberate Regression & Branch Discipline
- When performing architectural failure tests (e.g., proving token reference breakage under Step 8), always:
  1. Branch off `main` to a dedicated test branch (e.g. `test/broken-token-referencing`).
  2. Introduce the deliberate breakage and capture diagnostic logs and visual proof sheets.
  3. Switch back to `main` and delete the test branch **unmerged** (`git branch -D ...`).
  4. Preserve the audit trail in `evidence/`.
  5. Never allow unmerged regression tests to pollute `main`.
