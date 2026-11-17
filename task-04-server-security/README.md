# RealMe Task 04: Server-Side Security, Relational Schemas, and Authoritative Boundary Defence

## 1. What This Is
An authoritative server-side security architecture for 400 RealMe field agents in Lekki, Lagos, that enforces Zod schema boundary validation, adaptive Argon2id password hashing, and rate limiting to guarantee backend data integrity when attackers completely bypass browser forms.

---

## 2. Status
* **Finished**:
  * Authoritative multi-tenant PostgreSQL schema (`prisma/schema.prisma`) defining 5 core tables: `agents`, `sessions`, `escrow_payments`, `escrow_payment_attempts`, and `deal_knowledge_chunks`.
  * Forward-only database migration runbook and deliberate 3-step migration pattern for adding non-null columns (`docs/migrations.md`).
  * Live hardware hashing benchmark: measured SHA-256 (0.00504ms) vs Adaptive Scrypt/Argon2 (55.19ms), proving a 10,951x attacker slowdown with brute-force math (`docs/hashing.md`).
  * Zod boundary validation re-enforcing all 8 client rules at `/api/v1/agents/register` and rejecting the Task 03 direct `curl` attack with `HTTP 422 Unprocessable Entity` (`docs/validation-placement.md`).
  * k-Anonymity breached password checking against HaveIBeenPwned API using 5-character SHA-1 prefixes (`docs/breach-check.md`).
  * Rate limiting (HTTP 429) and empirical proof of defeating IP-only limits via proxy rotation (`docs/rate-limiting.md`).
  * Asynchronous background verification code dispatch (`crypto.randomInt`), dropping registration latency from 2,840ms to 35ms (`docs/verification-design.md`).
  * Full 19-question interview defence and four weighted skipped controls (`docs/not-implemented.md`, `docs/interview-answers.md`).
* **Half Done**:
  * Optional 7-minute unscripted video walkthrough (`evidence/24-walkthrough.mp4`).
* **Not Started**:
  * Task 05: Session management, 7-day NDPA account deletion grace period, statutory retention matrix, and final live viva defence.

---

## 3. The Stack, with Reasons
* **Zod v3**: Selected for declarative backend boundary validation rather than manual procedural checks to achieve compile-time TypeScript type inference while guaranteeing runtime whitelist stripping of mass-assignment fields.
* **Node.js Native Crypto (Scrypt / PBKDF2 / Argon2id)**: Selected native hardware-backed cryptographic primitives rather than fast hashes to eliminate external native binary compilation issues on Windows while enforcing strict memory-hardness against GPU cracking.
* **Prisma ORM v5**: Selected for type-safe relational database modeling, automated foreign key migrations, and strict schema synchronization across multi-tenant PostgreSQL environments.
* **HaveIBeenPwned k-Anonymity API**: Selected for compromised password detection because its 5-character prefix search prevents leaking employee credentials across jurisdictional boundaries under NDPA compliance.

---

## 4. Getting Started
From a fresh clone of the repository, execute the following commands in order:

```powershell
# 1. Navigate to Task 04 directory
cd task-04-server-security

# 2. Install dependencies (Zod schema validation engine)
npm install

# 3. Start the Authoritative Security Server
npm start
# Server listens on http://localhost:3006

# 4. In a second terminal, verify rejection of the Task 03 bypass attack (Returns HTTP 422)
curl -i -X POST http://localhost:3006/api/v1/agents/register `
  -H "Content-Type: application/json" `
  -d '{"fullName":"a","email":"bad_email","lasreraCode":"ABC","password":"   ","termsAccepted":false}'

# 5. Verify valid agent registration with adaptive password hashing (Returns HTTP 201)
curl -i -X POST http://localhost:3006/api/v1/agents/register `
  -H "Content-Type: application/json" `
  -d '{"fullName":"Babatunde Adeleke","email":"babatunde.adeleke@realme.ng","lasreraCode":"041289","password":"LekkiFiduciary2026#","termsAccepted":true}'

# 6. Verify breached password rejection (Returns HTTP 422 PASSWORD_BREACHED)
curl -i -X POST http://localhost:3006/api/v1/agents/register `
  -H "Content-Type: application/json" `
  -d '{"fullName":"Babatunde Adeleke","email":"babatunde.adeleke@realme.ng","lasreraCode":"041289","password":"password123456","termsAccepted":true}'
```

---

## 5. Environment Variables
* `DATABASE_URL`: PostgreSQL connection string with Row-Level Security parameters.
* `PORT`: Server listening TCP port (defaults to `3006`).
* `NODE_ENV`: Runtime execution environment mode (`development` | `production`).
* `SMTP_HOST`: Fiduciary outbound transactional mail server host.
* `SMTP_PORT`: Transactional mail server TLS port (`587` | `465`).

*(Note: Per assessment invariants, never commit or share actual values.)*

---

## 6. What This Deliberately Does Not Do
1. **Does Not Enforce WebAuthn / FIDO2 Hardware Passkeys**: Skipped because 400 field agents operate diverse Android handsets with variable biometric support; wet fingers on dusty construction sites cause field lockouts.
2. **Does Not Enforce Mutual TLS (mTLS)**: Skipped because managing PKI client certificates across mobile browsers requires heavy MDM infrastructure unsuitable for 1099 contractor agents.
3. **Does Not Mandate App-Based TOTP Authenticators**: Skipped due to onboarding friction and phone theft recovery overhead in Lagos; reserved for Task 05 broker tiers.
4. **Does Not Enforce Visual Captchas**: Skipped to protect 3G bandwidth budgets (saving 300KB JS) and avoid blocking visually impaired agents.

---

## 7. Known Defects
1. **Floating-Point Rounding Drift in Escrow Ledgers (`prisma/schema.prisma:60`)**: Preliminary models using `Float` introduced fractional Kobo rounding errors (`.000000004`) during 5% commission calculations. Resolved by migrating to `BigInt` storing currency in base atomic Kobo.
2. **Missing B-Tree Index on Session Expiry (`prisma/schema.prisma:45`)**: Background cleanup queries triggered full sequential scans, causing transient 504 timeouts. Resolved by adding `@@index([expiresAt])`.
3. **Synchronous Mail Delivery Event Loop Starvation (`src/server.js:78`)**: Awaiting SMTP network transmission inside HTTP handlers caused 2,840ms request latency. Resolved by offloading email dispatch to asynchronous background task queues (reducing latency to 35ms).
