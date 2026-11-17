# Cryptographic Session Architecture, Hijacking & Threat Mitigation

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Fiduciary Access Architecture (Task 05)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. What Session Hijacking Is

Session hijacking (or cookie theft) is an attack vector where an adversary obtains the valid session identifier belonging to an authenticated user. 

In a web application, the session identifier serves as an electronic bearer badge. Once an agent logs in, the browser presents this identifier on every subsequent HTTP request to prove identity. If an attacker intercepts or steals this identifier, they present it to the server from their own machine. Because the server only checks whether the token exists in the active sessions table, the server treats the attacker as the legitimate agent. The attacker then reads private seller bottom-dollar valuations (₦410M) and issues unauthorized deal notes, while the audit logs falsely report that the legitimate agent performed the actions.

---

## 2. How a Stolen Identifier Is Intercepted and Used

Adversaries intercept session identifiers through three primary attack vectors:
1. **Network Sniffing on Insecure Wi-Fi**: An agent connects to an unencrypted public Wi-Fi network at a coffee shop on Admiralty Way. If cookies lack the `Secure` flag or TLS is intercepted, the cookie travels in plaintext and is captured using packet sniffers (Wireshark).
2. **Cross-Site Scripting (XSS)**: Malicious JavaScript injected into the application accesses `document.cookie` and transmits the token to an attacker-controlled endpoint.
3. **Physical / Device Theft**: A shared browser or stolen unlocked Android phone retains live session cookies.

---

## 3. What Server-Side Logout Does to a Session Identifier

In poorly constructed applications, "logging out" simply clears the cookie in the client browser. The session record in the database remains active until it expires days later. If an attacker stole the cookie before logout, their stolen token continues to function.

In **RealMe**, logout is strictly a **Server-Side Mutation**:
1. The client issues a `POST /api/v1/auth/logout` request presenting the session cookie.
2. The server computes the SHA-256 digest of the cookie token.
3. The server executes:
   ```sql
   DELETE FROM sessions WHERE session_hash = $1;
   ```
4. The server instructs the browser to destroy the cookie by emitting:
   ```http
   Set-Cookie: realme_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax
   ```
Once the database row is deleted, the token is permanently invalidated. Even if the attacker retains a copy of the cookie, subsequent requests receive `HTTP 401 Unauthorized`.

---

## 4. Damage Limitation Controls Implemented in RealMe

If an active session identifier is intercepted, RealMe deploys defense-in-depth controls that drastically limit attacker capabilities:
1. **Hardened Cookie Flags**:
   * `HttpOnly`: Prevents client-side JavaScript from accessing the cookie, completely neutralizing XSS-based cookie theft.
   * `Secure`: Guarantees the cookie is transmitted strictly over HTTPS TLS connections, preventing network sniffing.
   * `SameSite=Lax`: Blocks Cross-Site Request Forgery (CSRF) attacks originating from external links.
2. **Session Hashing at Rest**:
   * The server never stores plaintext session tokens in the database. It stores the SHA-256 hash. If the database table is dumped, the hashes cannot be converted into valid browser cookies.
3. **IP Subnet & User-Agent Anomaly Detection**:
   * If an active session token suddenly originates from an IP outside Nigeria or a conflicting user agent, the session is quarantined and requires step-up re-authentication.
4. **Password Reset Revokes All Sessions**:
   * Initiating a password reset or deletion request issues a global database purge:
     ```sql
     DELETE FROM sessions WHERE agent_id = $1;
     ```
     This instantly terminates all sessions across all devices globally.
