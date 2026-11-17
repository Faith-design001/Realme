# Server-Side Boundary Validation & Request Lifecycle Placement

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Fiduciary API Architecture (Task 04)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. Where Validation Sits in the Request Lifecycle

In RealMe, incoming HTTP mutations follow a strict, defensive lifecycle pipeline:

```
[Client Socket] 
       │
       ▼
1. TLS / SSL Termination & Reverse Proxy
       │
       ▼
2. Edge Middleware (CORS, Rate Limiting & Correlation ID Injection)
       │
       ▼
3. Input Normalisation (Trimming whitespace, lowercasing email)
       │
       ▼
4. [SCHEMA BOUNDARY VALIDATION (Zod)]  <── GATEWAY SENTINEL
       │ (Rejects malformed data immediately with HTTP 422)
       ▼
5. Authentication & Tenant Session Extraction
       │
       ▼
6. Business Logic, Database Mutation & Password Hashing
```

---

## 2. What Runs BEFORE Schema Validation

Only lightweight, non-mutating infrastructure filters may run prior to schema parsing:
1. **Network Throttling & Rate Limiting**: Drops flooding attacks before the server allocates memory to parse complex JSON payloads.
2. **Payload Size Guards**: Enforces maximum request body limits ($\le 10\text{KB}$) to prevent buffer exhaustion attacks.
3. **Correlation ID & Telemetry Injection**: Tags the incoming request with a unique UUID (`x-correlation-id`) to enable tracing across microservices.
4. **Case Normalization & Trimming**: Trims leading/trailing whitespace on strings and lowercases emails before passing them to the validator.

---

## 3. What Must NEVER Run Before Validation

Under no circumstances should the following components execute before schema validation has passed:
1. **Database Queries or ORM Invocations**: Querying PostgreSQL (`prisma.agent.findUnique()`) with unvalidated parameters introduces SQL injection, type coercion crashes, and unnecessary connection pool lock contention.
2. **Cryptographic Password Hashing (Argon2id)**: Hashing takes 55ms of intense CPU time. If hashing runs before validating whether the email format or name length is valid, an attacker can launch an easy CPU-exhaustion Denial of Service (DoS) simply by sending malformed payloads that force the server to compute useless hashes.
3. **Background Job Enqueuing**: Pushing unvalidated tasks onto an email or SMS dispatch queue wastes external API quotas on unroutable addresses.

---

## 4. Why Schema Validation (Zod) Beats Hand-Written Route Validation

Many junior developers write procedural checks directly inside their route handlers:
```typescript
// THE BRITTLE ANTI-PATTERN
if (!req.body.email || req.body.email.indexOf('@') === -1) {
  return res.status(400).send("Invalid email");
}
```

### Why Schemas Are Architecturally Superior
1. **Guaranteed Type Safety (Parse, Don't Validate)**: Zod does not merely check data; it transforms the raw `unknown` payload into a strictly typed TypeScript interface (`z.infer<typeof schema>`). Downstream database queries can never access untyped properties.
2. **Exhaustive Striping of Unrecognized Properties**: Zod schemas configured with `.strict()` immediately strip or reject unknown fields, preventing **Mass Assignment Vulnerabilities** (e.g. an attacker injecting `"role": "MANAGING_BROKER"` in an agent registration request).
3. **Single Source of Truth & Declarative Clarity**: All 8 validation rules reside in a standalone, reusable schema file rather than scattered across nested `if/else` statements in multiple route controllers.
