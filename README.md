# RealMe: Fiduciary Deal Intelligence Platform

## 1. What This Is
RealMe is an internal real estate transaction and deal intelligence platform for Realme Properties Ltd in Lekki, Lagos, designed for 400 mobile field agents to retrieve verified listing facts, escrow deposit statuses, and legal contingencies where absolute multi-tenant data isolation under PostgreSQL Row-Level Security is mathematically enforced so cross-agent data leakage is impossible.

---

## 2. Status
- **Finished (100% Complete Across All 5 Assessment Tasks)**:
  - **Task 01: Enterprise Design System (15% Weighting)**:
    - 14-tone perceptual palette anchored to pinned `#0D1F3D` (Midnight Navy Blue, WCAG AAA 16.76:1 contrast).
    - 15 formula-derived typographic styles ($\text{Line Height} = \text{Font Size} \times 1.5$) using `Plus Jakarta Sans` and `JetBrains Mono`.
    - Brand-pigmented atmospheric shadow system derived from `#0D1F3D`.
    - Canonical W3C/DTCG JSON token exports (`05-tokens-incomplete.json` vs `06-tokens-complete.json`), standalone Node compiler (`scripts/build-tokens.js`), verified deal dashboard screen consuming 100% design tokens and 0 raw hex values, and 12 interview answers.
  - **Task 02: Scaffold & Diagnostics (20% Weighting)**:
    - Next.js 14 App Router scaffold, strict TypeScript, edge middleware, multi-tenant PostgreSQL Prisma schema.
    - Production build verified: 87.2 kB First Load JS ($\le 120\text{KB}$ 3G budget), middleware 26.7 kB.
    - Empirical dev server benchmarks: dev server ready in 1.8s, cold JIT route compile in 940ms (10,420ms first load), 42ms steady-state reload.
    - Deal mutation route (`/api/enquiries`) + client form returning `HTTP 201 Created` on write and `HTTP 503 Service Unavailable` on database disconnection, eliminating false-success masking.
    - All 15 interview answers, hand-drawn working tree drawing (`evidence/14-working-tree-drawing.jpg`), and 20 machine evidence files.
  - **Task 03: The Form, Attacked from Both Sides (15% Weighting)**:
    - Single-Page Auth architecture holding view in URL query params (`?tab=signup|login|reset`) with 0 full-page reloads and 12ms switching.
    - 4 client validation categories: empty field blur, multi-word legal name regex (`^[a-zA-Z]{2,}(?:\s+[a-zA-Z]{2,})+$`), real-time RFC email check on registration, and numeric text input for 6-digit LASRERA code (banning `<input type="number">` spinner artifacts).
    - Screen reader accessibility audit with Windows Narrator verbatim transcripts before and after remediation; caution SVG icons for colorblindness; accessible click alerts on disabled submit buttons (`aria-disabled="true"`).
    - Direct HTTP bypass attack executed via `curl`: unvalidated server accepted malformed data with `HTTP 201 Created`, empirically proving that 0 out of 8 client validation rules are enforced when bypassing the browser (`docs/client-side-is-not-security.md`).
    - Deterministic Git rollback to commit `2188e4d` via `git revert` without AI hallucination (`docs/rollback.md`), plus 14 interview answers.
  - **Task 04: The Server Is the Source of Truth (30% Weighting)**:
    - Authoritative Prisma schema defining 5 tables: `agents`, `sessions`, `escrow_payments`, `escrow_payment_attempts`, and `deal_knowledge_chunks`. Monetary amounts modeled in `BigInt` `amountKobo` to prevent IEEE 754 floating-point drift.
    - Forward-only migrations and 3-step pattern for adding `NOT NULL` columns to populated tables (`docs/migrations.md`).
    - Live local hardware hashing benchmark: SHA-256 single hash at `0.00504 ms` ($198,412\text{ guesses/sec}$) vs Adaptive Scrypt/Argon2id at `55.19 ms` ($18.12\text{ guesses/sec}$), establishing an empirical slowdown ratio of `10,951×`.
    - Authoritative Zod boundary validation on `/api/v1/agents/register`: re-tested the Task 03 bypass `curl` command and proved the server now strictly rejects it with `HTTP 422 Unprocessable Entity`.
    - Breached password checking via HaveIBeenPwned k-anonymity 5-char SHA-1 prefix API, rejecting compromised passwords (`HTTP 422 PASSWORD_BREACHED`).
    - Rate limiting (5 req / 15 mins returning `HTTP 429`) and live proof of defeating IP limits by rotating `X-Forwarded-For`.
    - Asynchronous background verification code dispatch, cutting registration latency by 98.7% (from 2,840ms to 35ms), plus 19 interview answers.
  - **Task 05: Sessions, Deletion, and the Defence (20% Weighting)**:
    - 256-bit cryptographic session tokens via `crypto.randomBytes(32)` with SHA-256 session cookie hashing in PostgreSQL.
    - Hardened cookie flags (`HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`).
    - Evaluated Soft Gating (91.2% completion) vs Hard Gating (74.8% completion; 16.4% drop-off penalty), defending our production hard-gating choice for confidential deal data (`docs/gating.md`).
    - Authoritative login flow with generic error messages ("Incorrect email or password", indistinguishable between wrong password and nonexistent email).
    - True server-side session deletion on logout (`POST /api/v1/auth/logout`) and resolution of the offline network-drop edge case (`evidence/09` & `10`).
    - Password reset unconditionally invalidating all concurrent active sessions across all devices.
    - NDPA Section 34 Account Deletion Lifecycle: Immediate Lockout $\to$ 7-Day Grace Period $\to$ Automated Scheduled Background Cron Worker (`scripts/deletion-cron.js`) executing atomic transaction to anonymize personal identity while preserving statutory escrow ledgers, proved safe to run twice (`evidence/13` & `14`).
    - Statutory Data Retention Matrix (`docs/retention-matrix.md`) reconciling NDPA erasure rights with Nigerian tax (CITA), Anti-Money Laundering (AML Act 2022), and LASRERA 6-year retention mandates.
    - Front-end zero-cost state management (`docs/state-management.md` and `evidence/15`).
    - Protected admin route (`/api/v1/admin/fiduciary-audit`) enforcing `MANAGING_BROKER` RBAC authorization, rejecting ordinary agents with `HTTP 403 Forbidden` (`evidence/16`).
    - Primary research interview with Mr. Olumide Adeleke, Managing Partner at Lekki Haven Properties Ltd (`docs/interview-with-owner.md`).
    - Comprehensive 7-section technical handbook written for the next cohort featuring 7 real mistakes of our own (`docs/handbook.md`).
    - 8 authentic technical boundaries documented in `docs/what-i-do-not-know.md`.
    - All 22 viva defence interview answers authored under 200 words each with exact cross-task numerical citations (`docs/interview-answers.md`).
- **Half Done**:
  - None. All requirements across all five assessment tasks are fully implemented and evidenced.
- **Not Started**:
  - Future enterprise roadmap (Q3 2027): WebAuthn FIDO2 biometric passkey authentication and distributed multi-region Redis cluster failover.

---

## 3. The Stack, with Reasons
- **Next.js 14 (App Router) & Node.js v24 LTS**: Chosen for server components and deterministic streaming rather than a pure SPA to minimize client-side bundle size on congested Lagos 3G cellular connections.
- **PostgreSQL with Prisma ORM**: Chosen for relational referential integrity and Row-Level Security rather than MongoDB/document stores, ensuring multi-million Naira escrow transactions cannot exist orphaned from audit logs.
- **Scrypt Password Key Derivation ($N=16384, r=8, p=1$)**: Chosen for memory-hard CPU/GPU resistance (~55.19ms) rather than SHA-256 (0.00504ms), preventing rapid offline cracking if the database is leaked.
- **W3C Design Tokens & Native CSS Variables**: Chosen rather than hardcoded Tailwind utilities to maintain an engine-agnostic single source of truth bridging Figma directly to code with 0 raw hex values in stylesheets.
- **Zod Schema Validation at the Edge**: Chosen rather than manual `if/else` checks to enforce immutable schema parsing at the network boundary, returning strongly-typed `HTTP 422 Unprocessable Entity` errors before malformed payloads touch business logic.
- **Cryptographic Server-Side Sessions with `HttpOnly; Secure; SameSite=Lax` Cookies**: Chosen over stateless JWTs to guarantee immediate, global revocation when an agent departs or an account is flagged.

---

## 4. Getting Started
To clone and run the complete RealMe platform across tasks:

```powershell
# 1. Clone the repository
git clone https://github.com/Faith-design001/Realme.git
cd Realme

# 2. Run Task 01 Design System Compiler & Audit
cd task-01-design-system
node scripts/build-tokens.js
# Verify zero raw hex values in styling (100% token compliance)
git grep -E "#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b" -- "src/*.css"

# 3. Boot Task 02 Diagnostic Server (Port 3000)
cd ../task-02-scaffold-diagnostics
npm.cmd install
npm.cmd run build
npm.cmd start

# 4. Boot Task 04 Boundary Validation & Security Server (Port 3006)
cd ../task-04-server-security
npm.cmd install
npm.cmd start

# 5. Boot Task 05 Session Management, NDPA Deletion & RBAC Server (Port 3007)
cd ../task-05-sessions-compliance-defence
npm.cmd install
npm.cmd run evidence:run
npm.cmd run cron:deletion
npm.cmd start
```

---

## 5. Environment Variables
- `DATABASE_URL`: PostgreSQL connection string with multi-tenant credentials.
- `NODE_ENV`: Runtime execution environment (`development`, `test`, `production`).
- `PORT`: TCP listening port for individual task server instances (`3000`, `3006`, `3007`).
- `SESSION_SECRET`: Cryptographic secret pepper for HMAC and token digesting.
- `RATE_LIMIT_WINDOW_MS`: Window duration for unauthenticated rate limiting (`900000` = 15 minutes).
- `RATE_LIMIT_MAX`: Request cap per window per client identifier (`5`).
- `DELETION_GRACE_PERIOD_DAYS`: Statutory dormancy window under NDPA Section 34 (`7`).

*(Zero secrets or credentials are committed to repository history).*

---

## 6. What This Deliberately Does Not Do
- **Does Not Build a Gym Application**: Strictly models the commercial operations, fiduciary reserves, and LASRERA regulations of Realme Properties Ltd.
- **Does Not Rely on Client-Side Checks for Security**: Every client validation rule (length, regex, email format) is re-enforced at the server boundary with Zod; unvalidated direct API bypasses are rejected with `HTTP 422`.
- **Does Not Issue Stateless JWT Bearer Tokens**: Revocation is paramount in fiduciary property deals; server-side database sessions are required to allow instant cross-device termination.
- **Does Not Hard-Delete Statutory Records Immediately**: Immediate deletion violates Nigerian tax (CITA) and Anti-Money Laundering statutes requiring 6-year retention; personal identifiers are anonymized while transaction ledgers are permanently preserved.
- **Does Not Permit Migrations or Purges via AI Agents**: All migrations and production deletion cron runs are governed by human-reviewed scripts to prevent catastrophic cascading deletions.

---

## 7. Known Defects
1. **Logout State Desynchronization on Cellular Drop (`task-05-sessions-compliance-defence/src/server.js:255`)**: When an agent logs out on an erratic 3G connection in Lekki, a network timeout causes the client UI to show "Logged Out" while the session record remains active in PostgreSQL. Fixed via persistent IndexedDB retry queues and background service worker sync (`task-05/docs/defects.md`, Defect 1).
2. **Non-Transactional Account Deletion Purge (`task-05-sessions-compliance-defence/scripts/deletion-cron.js:38`)**: Early deletion runner executed personal anonymization and session purging in separate calls; an unhandled exception between operations left an agent anonymized with live active sessions. Remediated by wrapping both mutations in an atomic database transaction (`task-05/docs/defects.md`, Defect 2).
3. **Missing Role Guard on Administrative Audit Route (`task-05-sessions-compliance-defence/src/server.js:338`)**: Early route checked authentication but omitted `auth.agent.role === 'MANAGING_BROKER'`, permitting ordinary field agents to read confidential ₦410M reserve pricing if they pasted the URL. Remediated by enforcing explicit RBAC returning `HTTP 403 Forbidden` (`task-05/docs/defects.md`, Defect 3).
4. **Daylight Saving Time / Timezone Drift in Grace Period Calculation (`task-05-sessions-compliance-defence/scripts/deletion-cron.js:19`)**: Calculating grace expiration using naive 24-hour millisecond addition (`7 * 86400000`) caused an off-by-one hour drift when server timestamps crossed boundary daylight shifts in foreign cloud regions. Remediated by anchoring all cron timestamps strictly to UTC ISO strings (`task-05/docs/defects.md`, Defect 4).
5. **Native `<button disabled>` Screen Reader Tab-Order Drop (`task-03-client-validation/src/index.html:142`)**: Native `disabled` buttons drop from browser keyboard tab sequences, stranding screen reader users without announcing missing fields. Remediated by replacing with `<button aria-disabled="true">` paired with accessible click alerts (`task-03/docs/defects.md`, Defect 1).
6. **Required Column Addition Failure on Populated Table (`task-04-server-security/prisma/schema.prisma:35`)**: Adding `lasrera_code` as `NOT NULL` to a populated PostgreSQL table caused migration failure code `P3006`. Remediated by applying the 3-step migration pattern: add optional $\to$ backfill data $\to$ alter column to required (`task-04/docs/defects.md`, Defect 1).
