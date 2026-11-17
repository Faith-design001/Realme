# RealMe Task 03: Client Validation, Accessible Form Architecture, and The Direct Attack

## 1. What This Is
An accessible, single-page authentication interface for 400 RealMe field agents in Lekki, Lagos, that enforces four categories of client-side validation while demonstrating empirically that client checks provide zero defense when an attacker bypasses the browser with direct HTTP requests.

---

## 2. Status
* **Finished**:
  * Unified single-page authentication interface (`src/index.html`) supporting instant form switching between Registration, Login, and Password Reset via URL query parameters (`?tab=signup|login|reset`) with 0 full-page reloads.
  * Four client validation categories: empty field blur detection, multi-word legal name regex, RFC email validation in real time on registration, and 6-digit numeric constraint on LASRERA codes without browser spinner artifacts.
  * Comprehensive accessibility compliance: inline caution SVG icons for red/green colorblindness, explicit `aria-invalid` and `aria-describedby` bindings, and keyboard-reachable submit button (`aria-disabled="true"`).
  * Direct HTTP bypass attack execution and empirical proof that the unvalidated backend accepts malformed payloads (`docs/client-side-is-not-security.md`).
  * Full 14-question interview defence and user enumeration analysis (`docs/interview-answers.md`).
* **Half Done**:
  * Screen reader audio recordings (Windows Narrator transcript completed in full; optional MP3 pending).
* **Not Started**:
  * Task 04: Server-side Zod boundary validation and Argon2id cryptographic hashing.
  * Task 05: Session management, 7-day NDPA account deletion lifecycle, and statutory retention matrix.

---

## 3. The Stack, with Reasons
* **Vanilla HTML5 & Semantic ARIA Elements**: Selected standard HTML5 semantics (`<form>`, `<label>`, `<button>`, `role="tab"`) rather than unsemantic `<div>` elements to guarantee built-in screen reader navigation and keyboard focus reachability.
* **Tokens CSS Custom Properties**: Consumes `tokens.css` compiled from Task 01 (`--realme-color-*`, `--realme-type-*`) with 100% token compliance and 0 raw hex values in application stylesheets.
* **HTML5 History API (`window.history.pushState`)**: Selected native browser history manipulation to hold the active view in URL query parameters without triggering full page unloads or round-trip network latency on weak Lagos 3G connections.
* **Node.js Native HTTP Runtime**: Selected standard Node HTTP server for local serving and endpoint testing to deliver sub-millisecond route responses with zero external framework dependencies.

---

## 4. Getting Started
From a fresh clone of the repository, execute the following commands in order:

```powershell
# 1. Navigate to Task 03 directory
cd task-03-client-validation

# 2. Verify 100% design token compliance (0 raw hex values)
npm run lint:tokens

# 3. Start the local single-page authentication server
npm start
# Server listens on http://localhost:3005

# 4. Open in browser to test accessible tab switching
# http://localhost:3005/auth?tab=signup
# http://localhost:3005/auth?tab=login
# http://localhost:3005/auth?tab=reset

# 5. In a second terminal, execute the direct endpoint attack
curl -X POST http://localhost:3005/api/v1/agents/register `
  -H "Content-Type: application/json" `
  -H "x-tenant-id: 00000000-0000-0000-0000-000000000001" `
  -d '{"fullName":"a","email":"bad_email","lasreraCode":"ABC","password":"   ","termsAccepted":false}'
```

---

## 5. Environment Variables
* `PORT`: The local TCP port on which the authentication server listens (defaults to `3005`).
* `NODE_ENV`: Runtime execution environment mode (`development` | `production`).
* `NEXT_PUBLIC_APP_NAME`: Platform identity display string (`RealMe`).

*(Note: Per assessment invariants, never commit or share actual values.)*

---

## 6. What This Deliberately Does Not Do
1. **Does Not Block Malformed Requests on the Server**: The backend endpoint deliberately lacks Zod schema validation in Task 03. It accepts invalid requests to empirically prove the vulnerability. Server-side validation is strictly reserved for Task 04.
2. **Does Not Store Cryptographic Session Cookies**: Task 03 focuses on form mechanics and client validation. State retention, session tokens, and cookie encryption belong to Tasks 04 and 05.
3. **Does Not Enforce Email Verification Codes**: Verification code dispatch requires background SMTP job queues, scheduled for Task 04.

---

## 7. Known Defects
1. **Disabled Submit Button Dropping From Accessibility Tree (`src/index.html:142`)**: If implemented with native `<button disabled>`, the button completely vanishes from the keyboard tab sequence. Corrected by utilizing `aria-disabled="true"` to keep the button focusable while announcing incomplete fields when activated.
2. **Strict Regex Rejecting Corporate Sub-Addresses (`src/index.html:284`)**: Naive regex parsing originally rejected legitimate plus-addressing emails (`tunde+deals@realme.ng`). Corrected by updating pattern to RFC 5322 syntax.
3. **Unvalidated Pure Whitespace Passwords (`src/server.js:52`)**: The backend server accepts `"   "` as a valid password string and returns HTTP 201 Created. Documented in `docs/client-side-is-not-security.md` and scheduled for resolution in Task 04.
