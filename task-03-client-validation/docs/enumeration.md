# Information Disclosure & Enumeration Prevention Specification

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Field Agent Authentication (Task 03)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. Sensitive Field Identification: LASRERA Registration Code

In the initial design of the RealMe registration form, the input field for the LASRERA Practitioner Code featured a placeholder and helper text stating:
> *Placeholder*: `"123456"`  
> *Helper Text*: `"Enter your 6-digit numeric practitioner license number"`

### Why the Shape of This Field Is Sensitive
The LASRERA code functions as a restricted authorization credential granting access to off-market seller reserve pricing dossiers (e.g. ₦410,000,000 bottom-dollar prices). Revealing the exact shape (6 digits) gives attackers an immediate mathematical enumeration advantage.

---

## 2. What an Attacker Gains from Knowing the Shape

1. **Drastic Search-Space Reduction**:
   * If an attacker knows the code is strictly 6 numeric digits, the entire keyspace consists of exactly:
     $$10^6 = 1,000,000 \text{ possible combinations}$$
   * If the format is unknown (e.g., alphanumeric 6–12 characters), the search space expands to:
     $$62^6 + \dots + 62^{12} \approx 3.2 \times 10^{21} \text{ combinations}$$
   * By leaking the 6-digit shape in the placeholder, an attacker using automated tools (e.g. Burp Suite or Hydra) can exhaust the entire keyspace within hours over a rotating proxy network.
2. **Targeted Format Fuzzing**:
   * Automated credential-stuffing bots can filter leaked credential databases to match exactly 6 numeric characters, discarding all other entries and drastically increasing attack efficiency.

---

## 3. The Remediation: Removing Format Clues

* **Action Taken**:
  * Removed the `"123456"` placeholder entirely; replaced with neutral text: `"Practitioner License Code"`.
  * Removed the helper text specifying `"6 numeric digits"`.
  * Standardized generic error responses: When an invalid code is entered, the server returns: *"Invalid practitioner credentials"* rather than *"Code must be exactly 6 digits"*.

---

## 4. The Stated Trade-Off (Usability vs Security)

* **The Usability Penalty**: Removing the format hint increases friction for legitimate field agents. An agent who holds both a 6-digit state license and a 10-digit national association ID might mistakenly type their national ID first, triggering a validation failure.
* **Is It Worth It?**: Yes. In a fiduciary real estate platform where confidential seller reserve prices dictate tens of millions of Naira in commission disputes, protecting against automated license enumeration is a critical operational control that far outweighs a minor, one-time onboarding clarification.
