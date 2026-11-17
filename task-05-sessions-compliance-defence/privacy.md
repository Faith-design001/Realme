# RealMe Privacy & Data Retention Notice (Authoritative Production Policy)

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**Regulatory Framework**: Nigeria Data Protection Act (NDPA) 2023 & LASRERA Law 2022  
**Effective Date**: November 17, 2026  

---

## 1. Introduction: Our Commitment to Fiduciary Privacy
Realme Properties Ltd ("RealMe") operates an internal deal intelligence and fiduciary transaction platform for 400 licensed real estate agents in Lekki Phase 1, Victoria Island, and Ikoyi. 

This document explains in plain language what personal data we collect, why we collect it, how your session data is handled, and how lawful account deletion operates under Nigerian law.

---

## 2. Information We Collect and Retain
We collect only the minimum data required to deliver verified deal intelligence:
1. **Practitioner Identification**: Full legal name, verified corporate email, and LASRERA practitioner license code.
2. **Session Security Metadata**: Cryptographic session tokens, IPv4/IPv6 addresses, browser user agent strings, and login timestamps.
3. **Fiduciary Transaction Logs**: Escrow deposit attempts, fee payments, and authored deal intelligence chunks (property valuation reserves and structural inspection defect notes).

---

## 3. Account Deletion Workflow & The 7-Day Grace Period

Under Section 34 of the NDPA, you have the right to request erasure of your personal data. Because real estate transactions carry multi-million Naira liabilities, deletion operates through a structured statutory process:

### Step 1: Immediate Account Lockout (Soft Delete)
The moment you initiate account deletion in your profile settings:
* Your account status transitions to `PENDING_DELETION`.
* All active browser sessions and session cookies are immediately revoked across all devices.
* You cannot log in, query deal intelligence, or view reserve pricing.

### Step 2: The 7-Day Grace Period
Your account remains locked for exactly **7 days (168 hours)**. 
* *Purpose*: Prevents irreversible loss from accidental clicks, emotional resignations, or compromised credentials.
* *Reactivation*: During this 7-day window, you may contact the Managing Broker to cancel the deletion request.

### Step 3: Hard Deletion & Transactional Anonymization
Once the 7-day grace period expires, an automated background job executes the following in a single atomic database transaction:
* **Purged Permanently**: Your password hash, active and expired session tokens, login IP logs, and unverified verification codes.
* **Anonymized**: Your user record in the `agents` table is stripped of identifiable data. Your name is overwritten with `"Former Agent [Anonymized]"`, and your email is scrambled into a one-way cryptographic SHA-256 digest (`anonymized_3f91a@deleted.realme.ng`).
* **Retained Permanently (Statutory Mandate)**: Settled escrow payments, banking references, and authored property inspection defect caveats are retained under Nigerian Tax and Conveyancing Acts. Fiduciary deal records remain attached to the anonymized ID so property buyers and tax auditors maintain an unbroken legal chain of custody.

---

## 4. How to Request Deletion
To request account deletion:
1. Navigate to `/auth/settings/security` within the RealMe application.
2. Click **"Request Account Deletion & Revoke Fiduciary Access"**.
3. Confirm your password. An automated notification will confirm the initiation of your 7-day grace period.
