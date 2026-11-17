# Client-Side Validation Is Not Security: Empirical Bypass Report

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Field Agent Registration Endpoint (Task 03)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. Executive Summary & The Cardinal Finding

The most dangerous assumption in software engineering is believing that client-side validation provides application security. 

To demonstrate this empirically, we constructed eight strict client-side validation rules on the RealMe registration form (multi-word names, real-time email regex, 6-digit numeric LASRERA code constraints, 12-character password minimums, and terms acceptance checkboxes).

We then completely ignored the browser interface and fired a raw HTTP POST request directly against the backend endpoint using a command-line HTTP client.

**The Result**: The server **accepted the invalid request and returned HTTP 201 Created**. Every single client-side validation rule was completely bypassed. 

---

## 2. The Direct Command-Line Attack

### The Request Sent
Using `curl` / `Invoke-RestMethod`, we bypassed the browser entirely and posted garbage data that violates every client-side constraint:
```bash
curl -X POST http://localhost:3000/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: 00000000-0000-0000-0000-000000000001" \
  -d '{
    "fullName": "a",
    "email": "malformed_email_no_domain",
    "lasreraCode": "ABC-NOT-A-NUMBER",
    "password": "   ",
    "termsAccepted": false
  }'
```

### The Server's Live Response
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Cache-Control: no-store, must-revalidate

{
  "status": "created",
  "message": "Agent registration record accepted",
  "data": {
    "id": "7f8b9102-4211-4991-8812-74819201991a",
    "fullName": "a",
    "email": "malformed_email_no_domain",
    "lasreraCode": "ABC-NOT-A-NUMBER",
    "createdAt": "2026-11-17T13:38:12.441Z"
  }
}
```

---

## 3. Enforcement Audit: Which Rules Were Enforced?

| Client-Side Rule | Form Behavior in Browser | Direct HTTP Server Behavior | Enforced? |
| :--- | :--- | :--- | :---: |
| **1. Name $\ge 2$ words** | Blocked with inline error | Accepted `"a"` | **NO** |
| **2. Email RFC syntax** | Real-time red outline & icon | Accepted `"malformed_email_no_domain"` | **NO** |
| **3. LASRERA 6 digits** | Input mode restricts to digits| Accepted `"ABC-NOT-A-NUMBER"` | **NO** |
| **4. Password $\ge 12$ chars**| Submit button disabled | Accepted `"   "` (3 whitespace chars) | **NO** |
| **5. Password trim whitespace**| Trimmed on submit | Accepted raw spaces | **NO** |
| **6. Password not empty** | Blocked on focus leave | Accepted | **NO** |
| **7. Terms checked** | Alert fired on button tap | Accepted `termsAccepted: false` | **NO** |
| **8. Accessible error banner**| Vocalized by Narrator | Zero screen reader context | **NO** |

**Total Client Rules Enforced by Server**: **0 out of 8.**

---

## 4. What This Proves About Client Validation vs Security

1. **Client-Side Validation is a UX Courtesy, Not a Security Barrier**:
   * Client-side validation exists solely to save the user a network round trip and provide immediate, responsive feedback. It protects the cooperative sighted user from making honest typos.
2. **The Client is Completely Under Attacker Control**:
   * Any attacker, botnet, or automated script interacts with your software over raw TCP/HTTP sockets. They do not run your React JavaScript, they do not execute your Tailwind classes, and they do not care about your `disabled` button attributes.
3. **A Beautiful Form With a Defenseless Endpoint is Malpractice**:
   * Shipping strong client-side regex while leaving the backend route unvalidated creates an illusion of security. The business owner sees a working form in a demo, while the database fills with unvalidated, dangerous bot records.

---

## 5. What We Will Do About It in Task 04

In **Task 04 (The Server Is the Source of Truth)**, we will permanently eliminate this vulnerability:
1. **Zod Boundary Validation**: Implement backend schema validation on `/api/v1/agents/register` that parses and validates incoming payloads *before* database logic executes.
2. **Duplicating All 8 Rules on the Server**: Every single rule derived in Task 03 will be strictly re-enforced server-side.
3. **Argon2id Password Hashing**: Passwords containing pure whitespace will be rejected, and valid passwords will be cryptographically hashed.
4. **Re-executing the Direct Attack**: We will resend the exact same `curl` command and capture the server rejecting it with `HTTP 422 Unprocessable Entity`.

