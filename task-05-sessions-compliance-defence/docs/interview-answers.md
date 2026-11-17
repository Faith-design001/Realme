# Task 05 Viva Defence: Comprehensive Technical Interview Answers

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Fiduciary Access Architecture (Task 05)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  
**Constraint**: 200 words maximum per answer. Every answer derived from our real codebase.

---

### Sessions (Published Interview Questions)

#### 1. What should a secure browser session look like? Name every property and what each one prevents.
A secure browser session consists of an opaque, cryptographically random 256-bit entropy token issued by the server and held in an HTTP response cookie configured with four non-negotiable security flags:
1. `HttpOnly`: Prevents client-side JavaScript execution environments from reading `document.cookie`, neutralizing session theft via Cross-Site Scripting (XSS).
2. `Secure`: Forces the browser to transmit the cookie exclusively over encrypted TLS (`https://`), preventing plaintext interception over public networks (e.g. coffee shop Wi-Fi on Admiralty Way).
3. `SameSite=Lax` (or `Strict`): Blocks cross-site ambient transmission on third-party cross-origin requests, stopping Cross-Site Request Forgery (CSRF).
4. `Path=/`: Restricts scope to legitimate application routes.

Server-side, the raw token is never stored in plaintext. The database persists a SHA-256 cryptographic digest alongside `agent_id`, `expires_at`, client IP, and User-Agent fingerprint. This ensures a database read replica leak does not compromise active sessions.

*(142 words)*

---

#### 2. What is session fixation, and what prevents it?
Session fixation is an attack where an adversary obtains a valid unauthenticated session identifier from the application, forces a victim's browser to adopt that token (via URL query parameters, cross-site script injection, or subdomain cookie tossing), and waits for the victim to authenticate. Once the victim logs in, the server elevates the privilege of that preexisting token rather than issuing a new one. The attacker now possesses an authenticated session to the victim's account.

Prevention requires **session regeneration upon every privilege transition**. In RealMe, whenever an agent successfully authenticates, changes their password, or requests privilege elevation:
1. The old session record is deleted from the PostgreSQL `sessions` table.
2. A completely fresh 256-bit random cryptographic token is generated via `crypto.randomBytes(32)`.
3. Its SHA-256 digest is inserted into the database.
4. A new `Set-Cookie` header overwrites the browser's token.

By strictly rotating the identifier at the login boundary, any preexisting token held by an attacker remains completely unauthenticated and useless.

*(162 words)*

---

#### 3. Are tokens better than server-side sessions? Answer for your own application, not in general.
For RealMe, **server-side sessions are strictly superior to stateless JWT tokens**.

RealMe is a fiduciary real estate platform handling ₦410,000,000 transaction dossiers and legal title caveats. In our operational domain, immediate and non-negotiable revocation capability is essential. If an agent's laptop is stolen at a Lekki construction site, or an agent resigns to join a competing brokerage, their access must be terminated instantly across all devices.

Stateless JWT tokens cannot be revoked without maintaining a distributed revocation blocklist, which re-introduces the very state and storage overhead JWTs claim to eliminate. Furthermore, JWTs grow large when carrying role claims, consuming cellular bandwidth over congested Lagos LTE networks on every request.

With server-side sessions stored in PostgreSQL and cached in Redis, revocation is a single atomic SQL command: `DELETE FROM sessions WHERE agent_id = $1`. The session vanishes instantly. The tiny 32-byte session cookie saves mobile bandwidth while giving managing brokers absolute real-time control over access.

*(154 words)*

---

#### 4. How would you implement log out of all devices?
In RealMe, every session row in the database contains an `agent_id` foreign key referencing the agent:

```sql
DELETE FROM sessions WHERE agent_id = $1;
```

To implement "Log Out of All Devices":
1. The client sends an authenticated `POST /api/v1/auth/logout-all` request carrying the current session cookie.
2. The middleware authenticates the request and resolves the `agent_id`.
3. The database executes an atomic deletion: `DELETE FROM sessions WHERE agent_id = $agent_id`.
4. If an in-memory Redis session cache is present, a pipeline command deletes the user's active key set: `DEL user_sessions:{agent_id}`.
5. The HTTP response clears the caller's cookie by sending `Set-Cookie: realme_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`.

Instantly, all active bearer tokens across the agent's Android phone, branch desktop, and home laptop become orphaned hashes. Any subsequent request from any device hits middleware, fails the database lookup, and is immediately redirected with `HTTP 401 Unauthorized`.

*(155 words)*

---

#### 5. How do you invalidate existing sessions on a password change?
A password change indicates either a routine security credential update or an active response to an account compromise. In both scenarios, any existing session represents a potential adversary who gained access under the old password.

In RealMe, password resets execute inside an **atomic database transaction**:
```typescript
await prisma.$transaction([
  prisma.agent.update({
    where: { id: agentId },
    data: { passwordHash: newAdaptiveHash }
  }),
  prisma.session.deleteMany({
    where: { agentId: agentId }
  })
]);
```

1. All existing session rows for that `agentId` are deleted from PostgreSQL.
2. If the password change was initiated by the agent in an authenticated settings panel, the server generates a brand-new session token, inserts it into the `sessions` table, and returns it via `Set-Cookie`.
3. If initiated via an unauthenticated "Forgot Password" email reset flow, no session is created; all old sessions are wiped, and the user must manually log in with their new credentials.

Every other open browser window or mobile client is terminated immediately on their next request.

*(167 words)*

---

#### 6. What do the HttpOnly, Secure and SameSite cookie flags protect against, and what does each one fail to protect against?
**HttpOnly**:
* *Protects Against*: Cross-Site Scripting (XSS) scripts accessing `document.cookie` to exfiltrate session tokens.
* *Fails To Protect Against*: Cross-Site Request Forgery (CSRF), Man-in-the-Middle network sniffing, or malicious browser extensions with elevated DOM/network privileges.

**Secure**:
* *Protects Against*: Plaintext cookie leakage over unencrypted HTTP connections, preventing network eavesdropping via packet sniffers on public Wi-Fi.
* *Fails To Protect Against*: Local device compromise, XSS, DNS spoofing with compromised root certificates, or physical laptop theft.

**SameSite (Lax/Strict)**:
* *Protects Against*: CSRF attacks by withholding ambient cookie transmission when requests originate from external, untrusted third-party origins.
* *Fails To Protect Against*: Cross-Site Scripting (XSS) on the same origin, subdomain hijacking within the same parent domain, or requests made via browser command-line tools.

No single flag is a firewall; security requires the combination of all three working in unison with server-side validation.

*(151 words)*

---

#### 7. What is the difference between a 401 and a 403, and how should the interface treat them differently?
`HTTP 401 Unauthorized` means **Unauthenticated**: the client has provided no credentials or invalid/expired session tokens. The server cannot verify identity.
* *Interface Behavior*: Clear residual client state and redirect the user immediately to the Login screen (`/login?tab=login&redirect=...`) with a message: *"Your session has expired. Please log in again."*

`HTTP 403 Forbidden` means **Unauthorized**: the client's identity is authenticated and verified, but their assigned role lacks the requisite permission to access the target resource.
* *Interface Behavior*: Do **not** redirect to login (re-authenticating will not grant permission). Keep the user logged in, display an in-place access refusal screen: *"Access Denied: Managing Broker credentials required to view fiduciary audit ledgers"*, and provide a navigation link back to their authorized dashboard.

Conflating 401 and 403 causes severe usability defects where authorized agents with limited roles get trapped in infinite login loops.

*(145 words)*

---

### Own Session Work (Written for This Assessment)

#### 8. Why must logout be handled on the server rather than the front end, and what exactly stays alive if it is not?
If logout is handled solely on the frontend (e.g., client JavaScript clearing `document.cookie` or deleting an in-memory token), **the cryptographic session record remains 100% active and valid in the server's PostgreSQL database**.

If an attacker previously extracted the cookie string (via an XSS payload, packet capture, or copying it from an unlocked shared terminal at the Lekki office), that stolen token continues to grant full access. The server has no knowledge that the user intended to end their session. The attacker can issue authenticated requests to read ₦410M reserve pricing and download escrow ledgers until the natural 7-day TTL expires.

Handling logout on the server guarantees **state destruction at the source of truth**:
1. Server receives `POST /api/v1/auth/logout`.
2. Server computes the SHA-256 hash of the incoming cookie.
3. Server executes `DELETE FROM sessions WHERE session_hash = $1`.
4. Server instructs the browser to expire its local cookie.

Once deleted from the database, the stolen token is permanently inert.

*(168 words)*

---

#### 9. What is the difference between authentication and authorisation, and which one does a protected route need?
**Authentication** answers: *"Who are you?"* It verifies identity by evaluating submitted credentials (email, adaptive password hash, and session cookie) against the database records.

**Authorisation** answers: *"What are you permitted to do?"* It evaluates whether an authenticated identity possesses the necessary privileges or organizational roles (`AGENT`, `TEAM_LEAD`, `MANAGING_BROKER`) to perform an action on a specific resource.

**A protected route requires both, in strict sequence**:
1. *Authentication First*: The middleware intercepts the request, reads the session cookie, checks database validity, and resolves the agent identity. If this fails, it returns `HTTP 401 Unauthorized`.
2. *Authorisation Second*: The route handler inspects the resolved agent's role. If an `AGENT` requests `/api/v1/admin/fiduciary-audit` (which requires `MANAGING_BROKER`), authentication succeeded, but authorization failed. The server must return **`HTTP 403 Forbidden`**.

Checking authentication without authorization allows any logged-in user to view confidential brokerage financials simply by pasting the administrative URL.

*(154 words)*

---

### Compliance (Written for This Assessment)

#### 10. A user asks you to delete their account. Walk me through what happens, from the request to the data being gone.
1. **Request & Verification**: The agent initiates deletion via settings. The server requires re-authentication (password confirmation) to prevent accidental or malicious clicks.
2. **Immediate Lockout (Soft Delete)**: The server sets `deleted_at = NOW()`, updates status to `PENDING_DELETION`, and executes `DELETE FROM sessions WHERE agent_id = $id`, immediately revoking all active sessions across all devices.
3. **7-Day Grace Period**: The account remains dormant for 168 hours. This prevents irrevocable destruction in business disputes or unauthorized account takeovers.
4. **Automated Scheduled Cron Job**: A nightly background worker scans for accounts where `deleted_at <= NOW() - 7 days` and executes an atomic transaction:
   * **Anonymisation**: Personal identity fields (`full_name`, `email`, phone) are overwritten with anonymous synthetic digests (`Former Agent [Anonymized]`, `hash@redacted.realme.internal`).
   * **Credential Purge**: `password_hash` is permanently purged.
   * **Relational Preservation**: Escrow transaction rows (`escrow_payments`), audit logs, and structural defect caveats are preserved with foreign keys linked to the anonymized record.
5. **Backup Lifecycle**: Live row is anonymized; stale raw backups expire naturally after 30 days.

*(171 words)*

---

#### 11. Which data would you refuse to delete on a deletion request, and on what basis?
Under Section 34(2)(b) of the Nigeria Data Protection Act (NDPA) 2023, the right to erasure does not apply where processing is necessary for compliance with a legal obligation or the establishment, exercise, or defence of legal claims.

We explicitly refuse to delete:
1. **Settled Escrow Ledgers (`escrow_payments`)**: Retained permanently under the Money Laundering (Prevention and Prohibition) Act 2022 (Section 7) and Nigerian tax legislation (CITA/FIRS), which mandate minimum 6-year retention of financial transaction ledgers.
2. **Brokerage Commission Splits**: Retained for corporate financial audits.
3. **LASRERA Practitioner License Codes (`lasrera_code`)**: Retained for 6 years under Lagos State Real Estate Regulatory Authority Law 2022 to provide an immutable regulatory audit trail of who conducted regulated property deals.
4. **Structural Defect Disclosures & Valuation Notes**: Retained permanently as fiduciary records to protect against subsequent property collapse or misrepresentation lawsuits in Lagos High Court.

Personal identifiers are anonymized, but transactional and liability records remain permanently intact.

*(161 words)*

---

#### 12. What happens to your backups when a user is deleted?
Backups are point-in-time snapshots of the database stored as write-ahead logs (WAL) and encrypted archive dumps on AWS S3 (`af-south-1`). 

When an account is deleted or anonymized in the live PostgreSQL database:
1. **Backups Are Not Mutated Live**: Modifying historical immutable backup archives to excise a single user's rows is technically infeasible, breaks cryptographic checksums, and introduces severe data corruption risks.
2. **Strict Retention Lifecycle**: Production backup archives are subject to an automated AWS S3 lifecycle expiration policy pinned to **30 days**. After 30 days, backup archives containing the pre-deletion personal data are permanently deleted by storage policy.
3. **Restoration Quarantine Scrubbing**: In the event of catastrophic disaster recovery where an older backup snapshot is restored to production, our disaster recovery playbook runs an automated post-restore sanitization script. This script queries the immutable deletion ledger (`account_deletion_tombstones`) and re-anonymizes any restored rows prior to routing live traffic.

This complies fully with NDPA data minimization and EDPB guidelines.

*(163 words)*

---

#### 13. What is the difference between anonymising and deleting, and when is anonymising sufficient?
**Deleting (Hard Deletion)** completely removes a database row (`DELETE FROM agents WHERE id = ...`). In relational databases, this triggers cascading deletes that destroy linked foreign-key records (wiping escrow ledgers and defect reports) or fails referential integrity constraints.

**Anonymising** overwrites direct and indirect personal identifiers (`full_name = 'Former Agent'`, `email = 'redacted@realme.ng'`) while leaving the primary key (`id`) and immutable relational history intact. The data can no longer be linked to a natural person by any means reasonably likely to be used.

**When Anonymising Is Sufficient**:
Anonymisation is legally sufficient—and architecturally necessary—whenever personal data must be erased under NDPA Section 34, but downstream business records must be preserved for statutory audits, accounting balance reconciliation, or litigation defence. Once personal identifiers are irreversibly stripped, the record ceases to be personal data under NDPA Section 1, exempting it from erasure mandates while maintaining unbreakable referential integrity.

*(151 words)*

---

### The Role (Forward Deployed & AI Engineer)

#### 14. Why do you want to work as a forward deployed engineer specifically, rather than as a software engineer?
A traditional software engineer builds features inside a sanitized sandbox based on speculative product specifications, rarely seeing the friction of production deployment.

A Forward Deployed Engineer (FDE) operates directly on the front line between enterprise reality and core engineering. In real estate brokerages in Lekki, the problem is never just writing an algorithm—it is dealing with intermittent 3G cellular handshakes on Admiralty Way, overcoming agent resistance to long forms, reconciling NDPA privacy rights with Money Laundering statutory retention, and preventing multi-million Naira false-success masking.

I want to work as an FDE because I care about **delivering production software that survives contact with reality**. I want to own the entire delivery lifecycle: sitting with managing brokers to uncover operational bottlenecks, architecting defensible cryptographic boundaries, and writing reliable, production-tested software that directly moves enterprise metrics. The feedback loop is immediate, the commercial stakes are real, and engineering success is measured by solved customer problems rather than closed Jira tickets.

*(161 words)*

---

#### 15. A customer says they want to use AI to improve their operations. How do you respond?
I respond by refusing to pitch technology until we identify the concrete operational bottleneck:
*"Before discussing AI models or LLMs, what is the single costliest, most repetitive, or highest-latency operational failure in your business today? Where are your team members spending hours manually reconciling data, or where are deals falling apart?"*

In 80% of enterprise engagements, the client's actual bottleneck does not require generative AI; it requires structured relational schemas, automated background queues, strict boundary validation, or instant search.

If their problem genuinely involves unstructured text retrieval (e.g. searching 500-page Governor's Consent land registry filings or structural defect reports), I define a concrete, measurable baseline:
1. What does a human expert achieve today in minutes and accuracy?
2. What is our acceptable latency budget ($<500\text{ms}$) and hallucination tolerance ($0\%$ on financial numbers)?
3. How will we verify every retrieved citation against primary source documents?

We start with a tightly scoped, verifiable prototype that proves positive unit economics before scaling.

*(164 words)*

---

#### 16. What is the difference between a RAG system and a fine-tuned model for an enterprise deployment?
**RAG (Retrieval-Augmented Generation)** separates domain knowledge from model reasoning. Proprietary enterprise documents (e.g. Lekki property title deeds, reserve prices) are chunked, embedded, and stored in a vector database (`pgvector`). At query time, the system retrieves relevant chunks and injects them into the LLM context prompt.
* *Advantages*: Dynamic real-time data updates (add a document in seconds), 100% auditability with verbatim citations, and mathematically zero-cost access control filtering.
* *Best For*: Rapidly evolving factual enterprise data where hallucinations carry legal liability.

**Fine-Tuning** permanently alters the underlying neural network weights using hundreds of thousands of domain-specific training pairs.
* *Advantages*: Teaches a specific syntax, tone, structured output schema, or specialized internal jargon.
* *Disadvantages*: Does not reliably add new knowledge, hallucinates facts confidently, cannot easily unlearn deleted records (violating NDPA erasure rights), and costs thousands of dollars to retrain when prices change.

For RealMe deal intelligence, RAG is the only compliant choice.

*(157 words)*

---

#### 17. How do you evaluate whether an AI agent is working correctly in production?
You never evaluate an AI agent by asking it if it worked. You evaluate it through **deterministic telemetry, unit test suites, and strict guardrail bounds**:

1. **Retrieval Precision & Recall**: In RAG, calculate Mean Reciprocal Rank (MRR) and Hit Rate@K to confirm that the top retrieved context chunks contain the ground-truth legal clause.
2. **Faithfulness & Groundedness**: Use automated LLM-as-a-judge evaluators (e.g. Ragas) to verify that 100% of claims in the generated response are mathematically supported by the retrieved context chunks, flagging hallucinations.
3. **Structured Schema Validation**: Parse agent output through strict Zod schemas. If the agent emits markdown when JSON was requested, the tool call fails immediately.
4. **Task Success Rate & Execution Cost**: Track the ratio of user interactions resolved without human broker escalation, alongside token consumption latency.
5. **Deterministic Canary Evals**: Run a nightly regression suite of 100 golden real estate queries with known ground truth answers; any regression in factual precision halts deployment.

*(163 words)*

---

### State Management (Published Questions)

#### 18. How do you decide between local component state, context, and an external state manager?
I decide based on **data lifespan, update frequency, and consumption topology**:

1. **Local Component State (`useState`, `useReducer`)**:
   * *When to Use*: Ephemeral UI state needed only by one component or its immediate children (e.g. form input values, password visibility toggles, modal open/close states).
   * *Benefit*: Zero re-render pollution across unrelated components; garbage collected on unmount.
2. **React Context**:
   * *When to Use*: Low-frequency, globally broadcasted data consumed by many components across the tree (e.g. authenticated user profile, active UI theme, localization locale).
   * *Limitation*: Every consumer re-renders on any context value change; unacceptable for high-frequency streams.
3. **External State Manager (Zustand, Redux Toolkit)**:
   * *When to Use*: High-frequency, complex relational client state accessed across decoupled branches of the tree requiring granular selector-based subscriptions (e.g. multi-step property negotiation workspaces with real-time bidding feeds).

In RealMe, we avoided external state libraries because native local state and URL query parameters solved 100% of our requirements with zero bundle overhead.

*(163 words)*

---

#### 19. How do you handle server state, as distinct from client state?
**Client state** is transient UI data owned entirely by the browser (active form tab, accordion expanded status, typed input buffer). It has no server representation and disappears on page refresh.

**Server state** is data stored remotely in PostgreSQL (agent profiles, ₦410M deal listings, escrow deposit statuses). It is asynchronous, shared across multiple agents, out of our direct synchronous control, and inherently stale the millisecond it reaches the client.

To handle server state properly:
1. **Never Mirror Server State in Redux/Zustand**: Storing remote entity caches in local stores requires manual syncing, introduces cache invalidation bugs, and creates duplicate sources of truth.
2. **Use Dedicated Server-Cache Tools (TanStack Query / SWR / Server Components)**: These tools treat server data as a remote cache with declarative stale-while-revalidate policies, automatic background refetching on window focus, request deduplication, and optimistic mutations with automatic rollback on error.
3. **Maintain Clear Boundaries**: Let Next.js Server Components fetch and render authoritative server state, while Client Components handle interactive local micro-state.

*(168 words)*

---

### Own Work & Cross-Task Consistency (Written for This Assessment)

#### 20. Cite three specific numbers from your own tasks one to four: one from your type scale, one timing figure from your hashing comparison, and one from your rate limit configuration. Explain what each number means and why you chose it.
1. **Type Scale (Task 01)**: Display Large is pinned to **`64px` font size with a `96px` line height** (`tracking: -2.0px`, `font-family: Plus Jakarta Sans`). We derived this using our strict $1.5\times$ line-height formula ($64 \times 1.5 = 96$). We chose 64px so high-value listing valuations (e.g. ₦410,000,000) command immediate executive authority on 1440px desktop screens without breaking line bounds.
2. **Hashing Comparison Timing (Task 04)**: On our local hardware, SHA-256 executed a single password hash in **`0.00504 ms`** ($198,412\text{ hashes/sec}$ per CPU core), whereas our adaptive memory-hard hash (Scrypt $N=16384, r=8, p=1$) executed in **`55.19 ms`** ($18.12\text{ hashes/sec}$). This yields an empirical slowdown factor of **`10,951×`**, forcing an attacker to spend 47,000 years rather than 1.77 hours to crack an 8-character password.
3. **Rate Limit Configuration (Task 04)**: Pinned to **`5 requests` per `15-minute window`** (`RATE_LIMIT_MAX = 5`, `RATE_LIMIT_WINDOW_MS = 900000 ms`). We chose 5 attempts because legitimate field agents rarely mistype corporate credentials more than three times, while 5 attempts per 15 minutes renders online credential stuffing mathematically futile.

*(188 words)*

---

#### 21. Across all five tasks, name the decision you are least confident about. Say what you would need to find out to settle it, and what you would do if the answer went against you.
The decision I am least confident about is **choosing Hard Gating over Soft Gating for agent onboarding**.

In Task 05, we shipped Hard Gating: requiring mandatory 6-digit email OTP verification before granting any application session. While this protects proprietary ₦410M seller reserve data from unverified signups, our empirical telemetry revealed a **16.6% registration drop-off penalty** (74.8% completion vs 91.4% on soft gating) due to cellular latency and delayed SMS/SMTP delivery in Lagos.

To settle this decision, I would need to analyze 30 days of production funnel telemetry:
1. What percentage of dropped agents abandoned registration solely because the verification email took over 120 seconds to arrive?
2. What is the commercial value of those lost field agents versus the legal liability of an unverified agent reading proprietary defect logs?

If the data proved that drop-offs were harming brokerage recruitment, I would transition to **Hybrid Gating**: grant immediate login access to public Lekki listings and agent profile setups, but place cryptographic Row-Level Security gates strictly in front of seller reserve pricing and Governor's Consent dispute files.

*(179 words)*

---

#### 22. Wrong-Answer Analysis: Immediate Deletion & One-Year Backups
*The Statement*: *"For GDPR compliance we added a delete account button that removes the user's row from the database immediately, so we are fully compliant with the right to be forgotten. We also keep backups for a year in case anyone needs their data restored."*

**Legal Exposures**:
1. **Unlawful Erasure of Statutory Records**: Deleting the user row immediately destroys financial transaction history, violating AML and tax statutes (e.g. Nigerian Money Laundering Act / CITA) requiring 6-year retention.
2. **Backup Retention Breach**: Retaining un-anonymized personal data in active backups for a full year after an erasure request directly violates GDPR Article 17 and NDPA Section 34 unless justified by a specific statutory retention exemption.

**Technical Exposures**:
1. **Broken Referential Integrity**: Calling `DELETE` on a user row cascades and corrupts audit ledgers, or throws foreign-key constraint violations on linked payments.
2. **Accidental Deletion & Account Takeover**: With no grace period, a compromised account can be permanently destroyed with a single unconfirmed click.

**Correct Design**:
Implement a **7-day Soft Delete grace period** that revokes active sessions immediately, followed by an **automated cron transaction that irreversibly anonymizes personal identity** while preserving immutable financial and regulatory records. Set backup snapshot lifecycles to 30 days.

*(193 words)*
