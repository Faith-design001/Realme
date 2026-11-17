# Form Field Justification & Information Design Audit

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Field Agent Registration & KYC Ingestion (Task 03)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. Field-by-Field Necessity Audit

Every field collected by the RealMe registration form must satisfy three statutory and operational questions:
1. **Why is it needed?** (Operational or compliance rationale)
2. **What does the business do with it?** (Downstream data utilization)
3. **What happens if the user gets it wrong?** (Consequence of erroneous data)

*Any field failing to satisfy all three criteria is permanently eliminated from the schema.*

---

### Field 1: Full Legal Name (`fullName`)
1. **Why needed**: Required under the Lagos State Real Estate Regulatory Authority (LASRERA) Law 2022 and Nigeria Data Protection Act (NDPA) for licensed fiduciary agent identification.
2. **What the business does with it**: Appears on binding escrow letters, commission entitlement agreements, and property inspection affidavits submitted to the Lagos State Lands Bureau.
3. **What happens if wrong**: If an agent inputs an alias or single token (e.g. `"Tunde"` or `"Agent007"`), conveyancing deeds and escrow payouts cannot be legally disbursed by the bank, triggering escrow freeze.

### Field 2: Work Email Address (`email`)
1. **Why needed**: Serves as the unique cryptographic identifier for tenant workspace access, multi-tenant authentication, and background security alerts.
2. **What the business does with it**: Receives 6-digit cryptographic verification codes, deal closure notices, and password reset revocations.
3. **What happens if wrong**: If mistyped (e.g. `agent@realme.con`), account creation cannot complete email verification, rendering the account unreachable and creating orphaned records.

### Field 3: LASRERA Practitioner Registration Code (`lasreraCode`)
1. **Why needed**: Enforces Lagos State regulatory compliance. Only verified, registered real estate practitioners can view off-market seller bottom-dollar reserve prices.
2. **What the business does with it**: Checked against the LASRERA regulatory portal for active practicing status and assigned agent licensing tiers.
3. **What happens if wrong**: The brokerage faces administrative fines up to ₦1,000,000 for allowing unlicensed individuals to access proprietary property title caveats.

### Field 4: Corporate Access Password (`password`)
1. **Why needed**: Authenticates the agent and protects confidential transaction dossiers, structural engineering reports, and client reserve prices.
2. **What the business does with it**: Salted and hashed using Argon2id (Task 04); never stored in plain text.
3. **What happens if wrong**: Weak passwords expose the brokerage to brute-force credential stuffing and unauthorized leakage of private seller pricing notes.

### Field 5: NDPA & Escrow Fiduciary Terms Acceptance (`termsAccepted`)
1. **Why needed**: Statutory compliance under NDPA Section 25 (explicit consent for processing sensitive KYC data) and brokerage non-disclosure agreements regarding seller reserve prices.
2. **What the business does with it**: Records timestamped legal consent linked to the user row in the audit table.
3. **What happens if wrong**: If bypassed, the brokerage cannot legally process the agent's registration or enforce non-disclosure confidentiality in court.

---

## 2. Fields Audited and Permanently Eliminated

To reduce friction on mobile 3G devices under direct sunlight, non-essential fields were eliminated:
1. **"Confirm Password" Field**: Removed in favor of a modern **Show/Hide Password toggle**. Mobile agents on bumpy transit frequently mis-type confirm password fields, doubling registration drop-off.
2. **"Home Address / Street Name"**: Removed from initial registration. Field agents operate remotely across Lekki and Ikoyi; residential location is unnecessary for deal intelligence access and can be requested later during commission payroll onboarding.
3. **"Agent Avatar / Profile Photo Upload"**: Removed from the critical registration path. Uploading multi-megabyte image binaries over weak 3G connections frequently causes HTTP timeouts and registration abandonment.

---

## 3. Removal of Non-Functional Decorative Elements

* **Eliminated Element**: In early mockups, a secondary brand seal graphic (`realme-watermark-crest.svg`) sat directly inside the form container between the email and registration fields.
* **Why Removed**: Clicking the decorative graphic did nothing, yet mobile screen readers announced it as `"Unlabeled image"`, confusing blind agents. Sighted agents tapping near input boundaries accidentally focused the non-interactive SVG. It added zero functional value and bloated the DOM.

