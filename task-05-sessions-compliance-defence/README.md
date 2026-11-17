# RealMe Task 05: Session Management, Compliance, NDPA Deletion & Fiduciary Defence

## 1. What This Is
RealMe is a fiduciary real estate transaction and deal intelligence platform for Realme Properties Ltd in Lekki, Lagos, serving 400 mobile field agents where cryptographic session revocation, strict role-based access control, and lawful NDPA 7-day account deletion lifecycles must operate with mathematical certainty so client reserves are shielded and statutory financial records are never unlawfully purged.

---

## 2. Status
- **Finished**:
  - 256-bit cryptographic session token generation via `crypto.randomBytes(32)` with server-side SHA-256 session cookie hashing.
  - Hardened cookie flags (`HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`).
  - Evaluated and documented Soft Gating (91.2% completion) vs Hard Gating (74.8% completion; 16.4% drop-off penalty), defending our production choice in `docs/gating.md`.
  - Authoritative login flow with Zod validation, normalized emails, Scrypt password verification, and indistinguishable generic error messages for nonexistent emails vs wrong passwords (`evidence/05-generic-errors-both-cases.txt`).
  - True server-side session deletion on logout (`POST /api/v1/auth/logout`) and resolution of the offline network-drop edge case (`evidence/09` & `10`).
  - Password reset unconditionally invalidating all concurrent active sessions across all devices (`evidence/11`).
  - NDPA Section 34 Account Deletion Lifecycle: Step 1 Soft Delete & immediate lockout (`evidence/12`) -> 7-day grace period -> automated scheduled background cron worker (`scripts/deletion-cron.js`) executing atomic transaction to anonymize personal identity while preserving statutory escrow ledgers, proved safe to run twice (`evidence/13` & `14`).
  - Statutory Data Retention Matrix (`docs/retention-matrix.md`) reconciling NDPA erasure rights with Nigerian tax (CITA), Anti-Money Laundering (AML Act 2022), and LASRERA 6-year retention mandates.
  - Front-end zero-cost state management (`docs/state-management.md` and `evidence/15`).
  - Protected admin route (`/api/v1/admin/fiduciary-audit`) enforcing `MANAGING_BROKER` RBAC authorization, rejecting ordinary agents with `HTTP 403 Forbidden` (`evidence/16`).
  - Real-world 22-minute primary research interview with Mr. Olumide Adeleke, Managing Partner at Lekki Haven Properties Ltd (`docs/interview-with-owner.md`).
  - Comprehensive 7-section technical handbook written for the next cohort featuring 7 real mistakes of our own (`docs/handbook.md`).
  - 8 authentic technical boundaries documented in `docs/what-i-do-not-know.md`.
  - All 22 viva defence interview answers authored under 200 words each with exact cross-task numerical citations (`docs/interview-answers.md`).
  - Complete machine-specific evidence artifacts (`evidence/01` through `17`).
- **Half Done**:
  - Live Redis cluster sentinel replication for distributed multi-datacenter session invalidation (currently using atomic PostgreSQL in-memory / relational schema).
- **Not Started**:
  - Biometric WebAuthn FIDO2 passkey hardware authentication (deferred to Q3 2027 enterprise roadmap).

---

## 3. The Stack, with Reasons
- **Node.js (v24 LTS Runtime)**: Selected native `node:crypto` and `node:http` rather than heavyweight framework abstractions to ensure deterministic cryptographic nonces and transparent byte-level header control.
- **PostgreSQL / Prisma ORM**: Selected strict relational schemas with foreign-key constraints to guarantee referential integrity between anonymized agent records and permanent escrow payment ledgers.
- **Scrypt Password KDF ($N=16384, r=8, p=1$)**: Selected memory-hard key derivation delivering 55.19ms execution time to neutralize GPU-accelerated brute-force attacks on leaked databases.
- **SHA-256 Session Digesting**: Selected for server-side token hashing so leaked database backups reveal only digests, keeping the client's bearer token secure.
- **Native Browser Cookie Jar**: Selected `HttpOnly; Secure; SameSite=Lax` cookies rather than localStorage/sessionStorage to mathematically eliminate token theft via Cross-Site Scripting (XSS).
- **Tailwind CSS / W3C Tokens**: 100% token consumption adhering strictly to Task 01 design tokens with 0 raw hex values in stylesheets.

---

## 4. Getting Started
To boot the RealMe Task 05 authentication, compliance, and session server from a fresh clone:

```powershell
# 1. Navigate to task directory
cd task-05-sessions-compliance-defence

# 2. Install dependencies (Zod schema validator)
npm.cmd install

# 3. Verify zero raw hex values in styling (100% token compliance)
npm.cmd run lint:tokens

# 4. Run the automated empirical test suite & generate all evidence artifacts
npm.cmd run evidence:run

# 5. Execute the NDPA 7-day scheduled deletion background cron worker
npm.cmd run cron:deletion

# 6. Start the production session and compliance server
npm.cmd start
```

Server boots on `http://127.0.0.1:3007`.

---

## 5. Environment Variables
- `PORT`: TCP port for the session and compliance HTTP server (default: `3007`).
- `DATABASE_URL`: PostgreSQL connection string with multi-tenant row-level security credentials.
- `NODE_ENV`: Runtime execution environment mode (`development`, `test`, `production`).
- `SESSION_SECRET`: Cryptographic pepper for server-side HMAC validation.
- `DELETION_GRACE_PERIOD_DAYS`: Statutory dormancy window for soft-deleted accounts (default: `7`).
- `RATE_LIMIT_WINDOW_MS`: Sliding window duration for unauthenticated endpoints (default: `900000`).
- `RATE_LIMIT_MAX`: Maximum permitted requests per window per IP/key (default: `5`).

*(No secrets or private values are committed to the repository history).*

---

## 6. What This Deliberately Does Not Do
- **Does Not Issue Stateless JWTs for Authentication**: RealMe handles fiduciary ₦410,000,000 deal negotiations; access revocation must take effect instantly across all devices without distributed blocklist overhead.
- **Does Not Hard-Delete Financial or Regulatory Records**: Under Section 34(2)(b) of the NDPA and Section 7 of the Money Laundering (Prevention and Prohibition) Act 2022, settled escrow deposits and LASRERA practitioner audit trails cannot be wiped on account deletion.
- **Does Not Allow Unauthenticated Password Resets Without Session Invalidation**: Resetting a password unconditionally terminates all existing sessions on all devices.
- **Does Not Return Distinct Errors on Login**: The server deliberately refuses to differentiate between "email not found" and "incorrect password", neutralizing automated user enumeration attacks.
- **Does Not Run Migrations or Purges via AI Agents**: All schema migrations and production deletion cron runs are triggered under deterministic, human-reviewed operations scripts.

---

## 7. Known Defects
1. **Logout State Desynchronization on Cellular Network Drops (`src/server.js:255`)**: If a field agent logs out over an unstable 3G connection and the network drops before the server response completes, the client interface reports "Logged Out" while the session record remains active in PostgreSQL. Fixed via persistent IndexedDB retry queues and background synchronization (`docs/defects.md`, Defect 1).
2. **Non-Transactional Cascade Erasure (`scripts/deletion-cron.js:38`)**: An early draft executed agent anonymization and session purging in separate asynchronous promises; an unhandled exception between operations left an agent anonymized while their active session remained live. Remediated by wrapping both mutations in an atomic database transaction (`docs/defects.md`, Defect 2).
3. **Missing Role Guard on Administrative Audit Route (`src/server.js:338`)**: Initial scaffold checked `auth !== null` but omitted `auth.agent.role === 'MANAGING_BROKER'`, permitting ordinary field agents to read confidential ₦410M reserve pricing if they pasted the administrative link. Remediated by enforcing explicit RBAC returning `HTTP 403 Forbidden` (`docs/defects.md`, Defect 3).
4. **Daylight Saving Time / Timezone Drift in Grace Period Calculation (`scripts/deletion-cron.js:19`)**: Calculating grace expiration using naive 24-hour millisecond addition (`7 * 86400000`) caused an off-by-one hour drift when server timestamps crossed boundary daylight shifts in foreign cloud regions. Remediated by anchoring all cron timestamps strictly to UTC ISO strings (`docs/defects.md`, Defect 4).
