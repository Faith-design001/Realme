# The RealMe Architectural Handbook: A Field Guide to Enterprise Systems

**Author**: Antigravity Technical Architecture Team  
**System**: RealMe Fiduciary Deal Intelligence Platform  
**Target Audience**: Software Engineers & AI Agentic Developers (One Cohort Behind)  
**Date**: November 17, 2026  

---

## Section 1: Typography, Shadows, and the Design System Export

### 1. The Concept in Plain Words
A design system is not a visual preference; it is an engineering contract that translates design tokens (named variables for colors, typography, and elevation) into immutable CSS custom properties (`--realme-*`). Components in your codebase consume semantic roles (like `var(--realme-color-primary)`), never raw hex primitives (`#0D1F3D`).

### 2. Why It Exists
It prevents "interface dilution" and hardcoded drift. Without tokens, an AI agent prompted to "make a nice dashboard" hardcodes arbitrary hex strings (`#1E3A8A`, `#2563EB`) across dozens of components. Changing a brand color later requires searching and replacing thousands of lines of code.

### 3. A Real Scenario
Emeka, a lead UI designer at a Lagos brokerage, created an authoritative navy theme for mobile agents. When the development team used an AI agent to build the deal cards, the agent defaulted to standard Tailwind indigo. Under direct equatorial sunlight in Lekki, the pale indigo washed out into an illegible haze, causing field agents to misread reserve prices.

### 4. How It Is Done
1. Export DTCG-compliant tokens from Figma variables (`tokens-complete.json`).
2. Pin Tone 40 explicitly to brand navy (`#0D1F3D`).
3. Compile tokens into CSS custom properties (`tokens.css`) using a deterministic Node.js compiler.
4. Enforce mathematical typography formulas: $\text{Line Height} = \text{Font Size} \times 1.5$.

### 5. Where It Goes Wrong
Developers export Figma variables but omit the variable collections in the export dialogue. The JSON file exports without color definitions, causing token compilers to crash on missing references.

### 6. What We Got Wrong in This Project
In Task 01 (Commit [`b507ab2`](https://github.com/Faith-design001/Realme/commit/b507ab2)), our automated linter crashed because we included `#FBFCFF` inside an informational CSS comment in `globals.css`. Our regex linter flagged the comment as a raw hex violation, blocking the CI build until comments were sanitized to use variable tokens.

---

## Section 2: Scaffolding, the Development Server, and Database Diagnostics

### 1. The Concept in Plain Words
Scaffolding is establishing the absolute minimal, working operational skeleton of an application (runtime, ORM, strict types, diagnostic health probes) *before* writing any product features.

### 2. Why It Exists
It prevents the single most common failure in AI engineering: generating a beautiful, multi-page application that renders forms and optimistic success banners while connected to a dead or non-existent database.

### 3. A Real Scenario
Folake hired a contractor to build an agent deal registration portal. In demo meetings, the contractor submitted test listings and showed a green "Listing Registered!" banner. When investors performed due diligence, they opened the database and found 0 rows. The contractor's code caught database disconnect errors and returned mock HTTP 200 responses.

### 4. How It Is Done
1. Construct `/api/health` for process liveness.
2. Construct `/api/diagnostics` executing an active TCP socket query against PostgreSQL (`SELECT 1`).
3. If the database socket is closed (`ECONNREFUSED`), the endpoint must fail closed and return **`HTTP 503 Service Unavailable`**, refusing to mask the failure with mock data.

### 5. Where It Goes Wrong
Checking `Boolean(process.env.DATABASE_URL)` instead of running an active query. The string variable exists in `.env`, so the health probe reports `status: "healthy"` while the database container is completely dead.

### 6. What We Got Wrong in This Project
In Task 02 (Commit [`2188e4d`](https://github.com/Faith-design001/Realme/commit/2188e4d)), our initial diagnostic probe in `src/app/api/diagnostics/route.ts` checked `Boolean(process.env.DATABASE_URL)` rather than issuing an active query, committing the exact "False Success" vulnerability we set out to eliminate. We refactored it to execute active Prisma queries emitting HTTP 503 on connection failure.

---

## Section 3: Information Design, the Browser Head, and Responsive Type

### 1. The Concept in Plain Words
Information design is the intentional structuring of head metadata (dynamic titles, Open Graph, SEO tags) and body content (fluid typography, rem padding, cognitive action collapse) to eliminate user friction.

### 2. Why It Exists
It stops applications from serving static document titles across dynamic views, prevents text clipping on small mobile viewports, and eliminates redundant decision fatigue for field workers.

### 3. A Real Scenario
Chinedu built a listing valuation calculator for mobile field agents. He used fixed pixel button heights (`height: 44px; padding: 0 10px;`). When an older broker with 175% OS font scaling opened the app in Ikoyi, the text `"Verify Governor's Consent"` clipped into `"Verify Gov..."`, causing the broker to confuse consent clearance with mortgage clearance.

### 4. How It Is Done
1. Use fluid CSS clamp for display typography: `font-size: clamp(2rem, 4vw + 1rem, 3.5rem)`.
2. Size interactive touch targets with rem padding (`padding: 0.75rem 1.25rem`) so buttons scale proportionally with user font preferences.
3. Collapse competing choices: Replace separate "Login" and "Register" buttons with a single unified CTA.

### 5. Where It Goes Wrong
Allowing large display headings to wrap arbitrarily without width constraints, resulting in orphan words stranded on isolated lines.

### 6. What We Got Wrong in This Project
In Task 02 (Commit [`f5f89ba`](https://github.com/Faith-design001/Realme/commit/f5f89ba)), our root header rendered an unsemantic branding graphic adjacent to the text title, which screen readers announced redundantly. We removed the non-functional element and constrained the headline width to 580px to direct visual scanning.

---

## Section 4: The Working Tree, Branching, and Client-Side Validation

### 1. The Concept in Plain Words
Client-side validation is immediate user feedback implemented in browser JavaScript (regex format checks, length counters, accessible error states) to guide cooperative users through forms.

### 2. Why It Exists
It provides sub-millisecond feedback on typos before a network round-trip. Crucially, engineers must recognize that **client-side validation is a UX convenience, not security**. Anyone can bypass it with `curl`.

### 3. A Real Scenario
Hauwa, a visually impaired broker in Lagos using Windows Narrator, attempted to sign up for RealMe. The form used `<button disabled>` for incomplete states. In standard browser accessibility trees, native `disabled` elements vanish from the keyboard tab sequence. Hauwa pressed Tab, skipped the button, landed in the footer, and assumed the site was broken.

### 4. How It Is Done
1. Keep buttons in the tab order using `aria-disabled="true"`.
2. Pair red error borders with explicit SVG caution icons for red/green colorblindness.
3. Link input errors explicitly via `aria-describedby="err-field"`.
4. Collapse auth pages into a single SPA holding state in URL query parameters (`?tab=signup|login|reset`).

### 5. Where It Goes Wrong
Believing that frontend regex sanitizes backend data. Developers ship client validation, skip server-side checks, and wake up to find their database filled with automated bot spam.

### 6. What We Got Wrong in This Project
In Task 03 (Commit [`28e3f58`](https://github.com/Faith-design001/Realme/commit/28e3f58)), our initial email regex rejected valid corporate emails containing sub-addressing plus signs (`tunde+deals@realme.ng`). We had to rewrite the regex to RFC 5322 compliance.

---

## Section 5: Migrations, Schema Design, and Email Delivery

### 1. The Concept in Plain Words
Database migrations are immutable, forward-only SQL instructions that transition relational structures. Schema design establishes entity relationships and constraints before code is written.

### 2. Why It Exists
It prevents data loss, schema drift, and transaction deadlocks. It ensures that critical financial ledgers are decoupled from volatile attempt logs.

### 3. A Real Scenario
Seyi ran a driving school with 300 students. When asked to add a required National Identity Number column, he wrote `ALTER TABLE students ADD COLUMN nin VARCHAR(11) NOT NULL` directly against production. The migration crashed, aborted in-flight payment transactions, and corrupted table indexes during morning peak registrations.

### 4. How It Is Done
1. Follow the **3-Step Migration Pattern** for required columns on populated tables: Add as nullable $\to$ backfill data $\to$ alter constraint to `NOT NULL`.
2. Decouple settled `payments` from `payment_attempts`.
3. Store currency in atomic integer units (`BigInt` Kobo) to eliminate floating-point rounding drift.
4. Offload transactional emails to asynchronous background queues, dropping HTTP request latency by over 95%.

### 5. Where It Goes Wrong
Editing a migration file that has already been executed on another developer's machine. The migration checksum in `_prisma_migrations` diverges, halting all future CI releases.

### 6. What We Got Wrong in This Project
In Task 04 (Commit [`114034e`](https://github.com/Faith-design001/Realme/commit/114034e)), our preliminary money model declared `amount Float`. Computing a 5% commission split on a ₦410M deal introduced a 12-kobo IEEE 754 representation discrepancy (`.000000004`). We migrated the column to `BigInt` `amountKobo`.

---

## Section 6: Server-Side Validation, Hashing, Rate Limiting and Verification

### 1. The Concept in Plain Words
Server-side security establishes the backend boundary as the single source of truth. It validates all incoming payloads with Zod, hashes passwords with memory-hard adaptive algorithms (Argon2id), and throttles requests.

### 2. Why It Exists
It ensures that when an attacker bypasses the browser form using command-line HTTP tools, the backend strictly rejects malformed data. It protects stolen databases against GPU brute-force attacks.

### 3. A Real Scenario
Chijioke's platform hashed passwords using fast SHA-256. When an attacker compromised the database backup, the attacker used a consumer gaming GPU to crack 90% of the passwords in under 2 hours because SHA-256 requires zero memory allocations.

### 4. How It Is Done
1. Deploy Zod schemas at route boundaries rejecting invalid data with **`HTTP 422 Unprocessable Entity`**.
2. Hash passwords with memory-hard algorithms (Argon2id or Scrypt) tuned to **50–100ms** on server hardware.
3. Check passwords against HaveIBeenPwned API using **k-Anonymity** (sending strictly the 5-character SHA-1 prefix).
4. Implement composite rate limiting (IP + target account identifier) emitting **`HTTP 429 Too Many Requests`**.

### 5. Where It Goes Wrong
Rate limiting exclusively on `X-Forwarded-For`. Attackers rotate proxy IPs on every request, bypassing the limiter entirely while locking out innocent users sharing office Wi-Fi.

### 6. What We Got Wrong in This Project
In Task 04 (Commit [`114034e`](https://github.com/Faith-design001/Realme/commit/114034e)), our initial server handler attempted synchronous SMTP transmission inside the request lifecycle, adding 2,840ms of latency. We refactored delivery to an asynchronous `setImmediate` task queue, dropping response times to 35ms.

---

## Section 7: Sessions, Logout, Account Deletion and Compliance

### 1. The Concept in Plain Words
Session management governs how authentication state is tracked, persisted, and terminated. Account deletion is the statutory process governing how user data is anonymized and purged in compliance with the Nigeria Data Protection Act (NDPA).

### 2. Why It Exists
It prevents session hijacking, ensures that logging out actually revokes database authorization tokens, and prevents unlawful data wipes that destroy statutory financial records.

### 3. A Real Scenario
Hauwa ran a 400-member cooperative society in Lagos. When member Ibrahim requested deletion, Hauwa opened PostgreSQL and executed `DELETE FROM members WHERE id = 12`. Ibrahim's two years of contribution records were permanently deleted. Six weeks later, Ibrahim disputed a ₦2.4M payout. Hauwa had zero audit logs, and tax auditors treated the gap as financial fraud.

### 4. How It Is Done
1. Issue unique 256-bit random session tokens via `crypto.randomBytes(32)`; store SHA-256 hash in database.
2. Set hardened cookie flags: `HttpOnly; Secure; SameSite=Lax`.
3. Server-side logout: Delete database row on `POST /logout` and clear cookie.
4. Lawful Deletion: Soft delete account $\to$ enforce 7-day grace period $\to$ run idempotent hard-delete cron job that anonymizes identity while retaining financial ledgers.

### 5. Where It Goes Wrong
Deleting a user record on the frontend only, leaving active session tokens in the database until natural expiration.

### 6. What We Got Wrong in This Project
In Task 05 (Commit [`28e3f58`](https://github.com/Faith-design001/Realme/commit/28e3f58)), our initial privacy draft promised that all deal notes and inspection caveats would be deleted upon request. We discovered this violated LASRERA conveyancing laws, which mandate retaining structural defect caveats. We rewrote the policy to anonymize personal names while retaining property defect records.
