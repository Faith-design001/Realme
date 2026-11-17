# Client-Side Validation Rules & Derivation Derivation

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Field Agent Registration (Task 03)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. Rule Derivation Framework

Every client-side validation rule implemented on the RealMe registration form has been explicitly derived from the operational and statutory demands of the brokerage.

For each rule, three explicit factors are recorded:
1. **What the rule is**
2. **What goes wrong without it**
3. **What legitimate user it will wrongly block (The Stated Cost)**

*Rule of Invariant*: Every validation rule blocks someone. Pretending a rule has zero legitimate false positives is an engineering failure.

---

### Rule 1: Multi-Word Full Legal Name
* **The Rule**: Minimum 5 characters total, containing at least two words separated by whitespace, each word having at least 2 characters (Regex: `^[a-zA-Z]{2,}(?:\s+[a-zA-Z]{2,})+$`).
* **What goes wrong without it**: Automated bots and careless users fill the field with single tokens (e.g. `"Tunde"`, `"agent"`, `"test"`). Under Lagos State conveyance law, real estate title deeds and escrow split agreements cannot be executed under a single mononym.
* **Who it wrongly blocks**: Legitimate individuals who legally possess only a single mononym (e.g., certain Northern Nigerian citizens or international expatriates whose passports display only one legal name).
* **The Trade-off**: We accept this constraint for the primary self-service onboarding flow; mononymous agents must be manually onboarded through Managing Broker administrative override.

---

### Rule 2: Corporate Email Structure & Real-Time Enforcement
* **The Rule**: Enforces standard email syntax (`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`). Evaluated in real time on registration, but enforced only upon submit on login.
* **What goes wrong without it**: Users mistype emails (e.g., omitting `@` or entering trailing periods). Without early format checking, the server attempts to enqueue verification codes to unroutable addresses, burning SMTP quotas and leaving the agent confused when no code arrives.
* **Who it wrongly blocks**: Legitimate users using emerging valid Top-Level Domains (TLDs) with unusual character sets or plus-addressing sub-address aliases (e.g., `agent+deals@realme.estate`).
* **The Trade-off**: Real-time evaluation is strictly restricted to registration to guide new agents. On login, aggressive typing checks are disabled to prevent annoying existing users who are simply typing their known email.

---

### Rule 3: LASRERA Registration Code Formatting (Text with Numeric Constraint)
* **The Rule**: Exactly 6 numeric digits (`^\d{6}$`). Implemented as `<input type="text" inputmode="numeric">` (NOT `<input type="number">`).
* **What goes wrong without it**: Users type alphanumeric garbage, or if implemented as `<input type="number">`, the browser automatically strips leading zeros (turning `041289` into `41289`) and introduces spinner arrows that corrupt inputs during mobile touch scrolling.
* **Who it wrongly blocks**: Legitimate newly licensed practitioners whose LASRERA registration is pending or who hold temporary alphanumeric clearance letters (e.g., `TEMP-8912`).
* **The Trade-off**: Protects the brokerage from regulatory fines for unlicensed off-market deal access. Unlicensed trainees cannot use self-service deal registration.

---

### Rule 4: Password Length Over Complexity
* **The Rule**: Minimum 12 characters. No arbitrary requirements for special characters, uppercase, or numbers.
* **What goes wrong without it**: Users choose predictable 6-character passwords (`lekki123`) that are easily reversed through offline dictionary attacks and credential stuffing.
* **Who it wrongly blocks**: Older field agents who are accustomed to short 8-character passwords and struggle with password length fatigue on mobile keyboards.
* **The Trade-off**: NIST SP 800-63B standards conclusively prove that character length provides far superior entropy against brute-force attacks than artificial complexity rules (which simply result in users substituting `@` for `a` and ending with `1!`).

---

### Rule 5: Fiduciary Terms & NDPA Acceptance Checkbox
* **The Rule**: Explicit boolean checked state (`checked === true`) before form submission is permitted.
* **What goes wrong without it**: Non-consensual processing of personal data under NDPA Section 25, exposing the brokerage to regulatory sanctions and invalidating non-disclosure agreements regarding confidential seller reserve pricing.
* **Who it wrongly blocks**: Legitimate fast-moving agents who scan on small screens and tap "Register" without noticing the agreement box.
* **The Trade-off**: When an agent taps the disabled submit button without checking terms, an explicit alert fires: *"You must accept the Fiduciary Non-Disclosure Agreement before registering."* The button does not silently fail.
