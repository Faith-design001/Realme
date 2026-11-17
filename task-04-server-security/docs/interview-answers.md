# Technical Interview Defence: Task 04 (Server Security, Hashing & Migrations)

**Candidate**: RealMe Technical Architecture Lead  
**Application**: RealMe (Fiduciary Deal Platform, Lekki Lagos)  
**Word Limit**: $\le 200$ words per answer.

---

### Section 1: Hashing & Cryptography

#### 1. Why should you hash passwords?
Passwords must never be stored in plaintext or reversible encryption because database breaches are an operational inevitability. If an attacker gains read access to the database (via SQL injection, insider threat, or unencrypted snapshot leaks), plaintext passwords immediately compromise every user across all services where they reuse credentials. 

Hashing applies an irreversible, one-way mathematical function that maps the password to a fixed-length digest. The original password cannot be decrypted or mathematically reversed from the hash; the server verifies authentication by hashing the candidate password provided at login and comparing the resulting digests. Hashing ensures that even complete database compromise does not directly disclose user credentials.

#### 2. Why use bcrypt/Argon2id instead of SHA-256 for passwords?
SHA-256 is an exceptionally fast, general-purpose cryptographic hash designed for verifying file integrity and message signatures at high throughput. Because it requires zero memory allocations and executes in microseconds, attackers running consumer GPUs or ASICs can compute billions of SHA-256 hashes per second to crack stolen tables using dictionary attacks.

Argon2id and bcrypt are **adaptive, slow hashes** designed specifically for passwords. They introduce tunable work factors and require significant dedicated memory (memory-hardness). This neutralizes GPU parallelism, reducing an attacker's cracking throughput from billions of guesses per second down to single digits, rendering large-scale brute-force attacks mathematically infeasible.

#### 3. What is a salt and why do you need it?
A salt is a cryptographically secure random sequence of bytes generated uniquely for every user and concatenated with their password before hashing. 

You need it for two critical reasons:
1. **Pre-computed Rainbow Table Defense**: Without salts, an attacker uses pre-calculated tables of billions of common password hashes to crack passwords in instantaneous $O(1)$ lookups. Salts render rainbow tables useless because the attacker would have to recompute a distinct table for every user's unique salt.
2. **Duplicate Password Masking**: If two agents choose `"Lekki2026#"`, unsalted hashing produces identical digests in the database, revealing to attackers that both accounts share the same password. Salting ensures identical passwords generate completely different hashes.

#### 4. What salt rounds, or what work factor, should you use? Give a number and defend it.
For bcrypt, use **cost factor 12**; for Argon2id, use **$m=64\text{MB}, t=3, p=1$**. 

**Defending the Number**:
The goal is to calibrate hashing duration to approximately **50–100 milliseconds** on production server hardware. A 55ms delay is completely unnoticeable to a human field agent logging in once or twice daily, but creates an insurmountable barrier for an adversary attempting billions of offline dictionary guesses. Setting work factor below 10 allows modern cloud clusters to crack hashes too quickly; setting it above 14 adds noticeable latency ($>1$ second per login) that can saturate server CPU threads during peak morning login spikes.

#### 5. Storing passwords in a database: plain text, SHA-256, AES-256 encryption, and adaptive hashing. Which is correct and why are the other three wrong?
**Adaptive hashing (Argon2id/bcrypt) is the only correct choice.**

**Why the Other Three Are Wrong**:
* **Plain Text**: Catastrophic failure; zero protection. Any read leak directly exposes credentials.
* **SHA-256**: Computationally far too fast. Attackers test billions of guesses per second on commodity GPUs, rendering offline dictionary attacks trivial.
* **AES-256 Encryption**: Wrong for a fundamentally different reason—**encryption is two-way (reversible)**. AES requires a secret decryption key. If an attacker breaches the server or environment variables to steal the key, they can decrypt the entire database back into plaintext passwords. Passwords do not need to be reversible; they must be verified via one-way hashes.

---

### Section 2: Validation Principles

#### 6. Why is client-side validation not enough?
Client-side validation runs in the browser, an environment under complete user control. An attacker does not submit data through your React form; they fire raw HTTP requests using `curl` or automated scripts. These requests bypass client JavaScript and HTML attributes entirely. Relying on frontend checks leaves your backend database completely unprotected against malformed data, bot spam, and injection vectors.

#### 7. What security checks belong in the frontend, and what must the server enforce regardless?
* **Frontend**: Immediate user feedback (real-time regex syntax highlighting, character count guidance, accessible ARIA announcements).
* **Server**: Exhaustive schema parsing (Zod), input sanitization, database parameterization (SQL injection defense), authentication verification, RBAC authorization, and rate limiting. The server must assume all incoming data is hostile.

#### 8. The user interface hides the delete button for non-administrators. Is that enough? If not, what does an attacker do instead?
No. Hiding a button in the client provides zero authorization security. An attacker opens browser dev tools to unhide the button, or inspects network traffic and fires `DELETE /api/v1/deals/:id` directly using `curl` with their own session cookie. If the server handler fails to explicitly verify that `session.user.role === 'MANAGING_BROKER'`, the deletion executes regardless.

#### 9. What is the difference between validation, encoding and sanitisation?
* **Validation**: Rejecting data that does not conform to expected schema types, lengths, or business rules (returns HTTP 422).
* **Sanitisation**: Cleansing data prior to processing or storage (trimming whitespace, lowercasing emails, stripping HTML script tags).
* **Encoding**: Transforming data into safe output representations so an interpreter treats it as data rather than executable code (converting `<` to `&lt;` to prevent XSS).

#### 10. Why replace the incoming request body with parsed and validated data rather than leaving both available?
Leaving raw unvalidated data on `req.body` creates **Mass Assignment Vulnerabilities**. Downstream handlers or ORM queries might inadvertently reference unparsed properties injected by an attacker (e.g. `"role": "MANAGING_BROKER"`). Replacing `req.body` with the Zod-parsed schema output ensures downstream code only accesses validated, typed, and whitelist-sanitized fields.

#### 11. Why validate route parameters and query strings, not just the body?
Route parameters (`/deals/:id`) and query strings (`?limit=100`) are untrusted user input vectors. Unvalidated parameters can trigger SQL injection, ORM type-coercion exceptions, or Denial of Service attacks (e.g. requesting `?limit=999999999`, which forces the server to allocate massive in-memory buffers).

---

### Section 3: Rate Limiting Architecture

#### 12. How do you rate limit unauthenticated requests, and what is the problem with the header you would reach for first?
Rate limit using sliding-window counters keyed on client identifiers. The header developers reach for first is `X-Forwarded-For`. 

**The Problem**: Unless the reverse proxy is hardened to strip untrusted incoming headers, `X-Forwarded-For` is trivially spoofed. An attacker injects a random IP on every request (`curl -H "X-Forwarded-For: 1.2.3.4"`), bypassing the limiter completely. Furthermore, shared office Wi-Fi networks share a single IP, causing one user's lockout to block innocent colleagues.

#### 13. Which rate limiting algorithm for a production API, and what is the boundary burst problem?
Choose the **Token Bucket** or **Sliding Window Counter** algorithm.

**The Boundary Burst Problem**: In a naive Fixed Window algorithm (e.g. 100 requests per hour resetting at :00), an attacker can send 100 requests at 11:59 and another 100 requests at 12:00. In a 2-minute window spanning the boundary, the server absorbs 200 requests—twice the allowable quota—potentially crashing the service. Sliding window algorithms eliminate this by smoothing rate evaluation across rolling intervals.

#### 14. Why use a shared store for counters rather than in-memory counters on each server?
In modern cloud architectures, applications run across multiple load-balanced container instances. In-memory counters live inside a single Node process. If you have 5 server instances, an attacker round-robined across instances can execute $5\times$ their permitted request quota before any single server triggers a lockout. A shared distributed store (Redis) maintains global atomic counters across all application instances.

#### 15. What HTTP status code should a rate limiter return, and why is 403 the wrong choice?
A rate limiter must return **`HTTP 429 Too Many Requests`**. 

`HTTP 403 Forbidden` indicates an authorization failure—the user lacks permission to access the resource, and repeating the request will not succeed. `HTTP 429` explicitly communicates that the request is valid but throttled due to rate exhaustion, and includes standard retry headers (`Retry-After: 60`) informing the client when they may attempt again.

#### 16. What do you do when your rate limit store is unavailable: fail open or fail closed? Answer for your own application specifically.
For **RealMe**, we **Fail Open** on general deal intelligence reads, but **Fail Closed** on authentication and financial mutations (`/login`, `/register`, `/payments`). 

*Why*: If Redis drops, we cannot halt 400 field agents who need to verify property titles while standing in front of buyers in Lekki. However, for authentication and payments, failing open allows automated botnets to launch unrestricted brute-force attacks during the outage window.

---

### Section 4: Assessment Telemetry & Synthesis

#### 17. You have two timing numbers for hashing from your machine. Walk me through what they mean for an attacker who has stolen your user table.
On our machine:
* **SHA-256**: **$0.00504\text{ ms}$** per hash ($\approx 198,412\text{ guesses/sec}$ per core).
* **Adaptive Hash (Argon2id/Scrypt)**: **$55.19\text{ ms}$** per hash ($\approx 18.12\text{ guesses/sec}$ per core).

For an attacker with a stolen user table:
Against SHA-256, an 8-core machine tests $\approx 1.58\text{ million guesses/sec}$, and a consumer GPU cluster testing billions of hashes cracks an 8-character password in **under 2 hours**. Against our Argon2id configuration, memory-hardness neutralizes GPU parallelism; an 8-core machine is restricted to $\approx 145\text{ guesses/sec}$, requiring over **47,000 years** to exhaust the same keyspace.

#### 18. How does a breached password check avoid sending the password anywhere? Explain the mechanism, then say what the naive version would leak.
Using **k-Anonymity**: The server computes the SHA-1 hash of the password locally and sends only the **first 5 characters of the hash** to HaveIBeenPwned API. The API returns all known breach hash suffixes matching that 5-character prefix. The server checks locally whether the remaining 35 characters match any returned suffix. The full password or hash never leaves the server.

The naive version would send the plaintext password (or full hash) over HTTP to the third-party API, actively leaking user credentials to an external server and violating NDPA compliance.

#### 19. Wrong-Answer Analysis: A candidate says: "I hash passwords with SHA-256 plus a random salt per user, which means even if the database is stolen the passwords cannot be reversed, because hashing is one-way. I also rate limit login attempts by IP, so brute force is not possible."
**Severity 1 (Critical)**: Using SHA-256 for passwords. While salts defeat rainbow tables, they do not stop brute-force attacks. SHA-256 is computationally trivial; an attacker tests millions of salted hashes per second on GPUs.  
**Severity 2 (High)**: Believing IP rate limiting stops brute force. Attackers rotate IPs using proxy botnets or Tor, easily defeating IP-only throttles.  
**What the Candidate Misunderstood**: The candidate misunderstood the **threat model of an offline database breach**. Rate limiting only protects the live online login form; once the database table is stolen, the attacker cracks hashes offline on their own hardware with zero network rate limits.
