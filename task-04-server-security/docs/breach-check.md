# Breached Password Checks via k-Anonymity Cryptographic Range Search

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Field Agent Registration (Task 04)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. The Threat Model: Credential Stuffing & Password Reuse

Over 80% of data breaches involve stolen or reused credentials. Attackers download public credential dumps (e.g. Collection #1, RockYou2024) containing billions of plaintext passwords and run automated scripts against corporate portals, hoping users reused passwords from breached personal accounts.

To protect fiduciary deal data, RealMe checks every new candidate password during registration against the global database of over 850 million compromised passwords.

---

## 2. The Cryptographic Mechanism: k-Anonymity Range Search

The central architectural challenge is: **How can a server check if a user's password exists in an external breach database without leaking that password to the external service?**

### The 4-Step k-Anonymity Algorithm
1. **Local SHA-1 Digest Generation**:
   The server computes the SHA-1 hash of the candidate password locally:
   ```typescript
   const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
   // E.g., for "password123": CBFDAC6008F9CAB4083784CBD1874F76618D2A97
   ```
2. **Prefix Decoupling (The 5-Character Anonymizer)**:
   The server splits the 40-character hash into two distinct parts:
   * **Prefix**: The first 5 characters (`CBFDA`).
   * **Suffix**: The remaining 35 characters (`C6008F9CAB4083784CBD1874F76618D2A97`).
3. **The Blind Query (k-Anonymity Request)**:
   The server queries the HaveIBeenPwned API sending **strictly the 5-character prefix**:
   ```http
   GET https://api.pwnedpasswords.com/range/CBFDA
   ```
   *The external service receives only `CBFDA`. There are approximately $16^5 = 1,048,576$ possible prefixes; thousands of completely unrelated passwords share this exact prefix.*
4. **Local Range Matching**:
   The external API responds with a list of all hash suffixes sharing that prefix alongside their observed breach counts:
   ```text
   C5E78D9182910AA...:12
   C6008F9CAB40837...:148923  <── LOCAL MATCH FOUND
   C7A119283748291...:3
   ```
   The RealMe server scans the returned list locally in memory. If our suffix matches any entry, the password is confirmed compromised, and registration is rejected.

---

## 3. Why the Naive Version Would Be an Unacceptable Malpractice

* **The Naive Approach**: Sending the user's plaintext password (or even full hash) in an HTTP POST request to an external third-party API:
  ```http
  POST https://api.breachcheck.com/check
  {"password": "UserActualPassword123"}
  ```
* **Why This Is Catastrophic**:
  1. **Breaching Confidentiality**: You are handing your user's plaintext credentials directly to a third party. If that external provider suffers a breach, logs requests, or is compromised by an adversary, your application actively leaks employee credentials.
  2. **Violating NDPA & GDPR**: Sending raw employee credentials outside jurisdictional boundaries without explicit statutory consent constitutes a severe regulatory offense subject to heavy corporate fines.
