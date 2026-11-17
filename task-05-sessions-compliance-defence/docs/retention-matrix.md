# Statutory Data Retention Matrix & Legal Conflict Reconciliation

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Fiduciary Deal Intelligence Platform (Task 05)  
**Regulatory Framework**: Nigeria Data Protection Act (NDPA) 2023, Money Laundering (Prevention and Prohibition) Act 2022, Companies Income Tax Act (CITA), and Lagos State Real Estate Regulatory Authority (LASRERA) Law 2022.  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. Exhaustive Schema Retention Matrix

Every table and significant column across the RealMe PostgreSQL architecture is classified below into its lifecycle retention disposition:

| Table Name | Column Name | Disposition | Operational / Legal Reason | Legal or Business Basis | Retention Period |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **`agents`** | `full_name` | **ANONYMIZED** | Replaced with `"Former Agent [Anonymized]"` upon deletion | NDPA Section 34 (Right to Erasure) | Anonymized after 7-day grace period |
| **`agents`** | `email` | **ANONYMIZED** | Overwritten with SHA-256 digest (`hash@deleted.realme.ng`) | NDPA Section 34 | Anonymized after 7-day grace period |
| **`agents`** | `password_hash` | **PURGED** | Cryptographic hash permanently deleted | Zero business utility post-separation | Purged immediately at grace end |
| **`agents`** | `lasrera_code` | **RETAINED** | Regulatory audit of which license authored transaction | LASRERA Law 2022 Section 18 | 6 Years |
| **`agents`** | `id` (UUID) | **RETAINED** | Foreign key anchor tying payments to history | Relational database referential integrity | Permanent |
| **`sessions`** | `session_hash` | **PURGED** | Active authentication credential | Security risk; session ends on logout/deletion | Purged on logout or expiry |
| **`sessions`** | `ip_address` | **PURGED** | Dynamic client tracking address | NDPA Data Minimization Principle | Purged after 30 days |
| **`sessions`** | `user_agent` | **PURGED** | Browser device fingerprint | NDPA Data Minimization Principle | Purged after 30 days |
| **`escrow_payments`** | `reference` | **RETAINED** | Banking NIBSS transaction reference | Money Laundering Act 2022 & CITA | 7 Years Minimum |
| **`escrow_payments`** | `amount_kobo` | **RETAINED** | Statutory brokerage commission ledger | Federal Inland Revenue Service (FIRS) | 7 Years Minimum |
| **`escrow_payments`** | `bank_audit_stamp`| **RETAINED** | Cryptographic signature of settling bank | Evidence in civil financial litigation | Permanent |
| **`escrow_payment_attempts`**| `attempt_ref`| **RETAINED** | Proves transaction failure vs concealment | FIRS / EFCC anti-fraud investigations | 3 Years |
| **`escrow_payment_attempts`**| `failure_reason`| **RETAINED** | Proves why deposit aborted (e.g. 3G drop) | Dispute resolution with property sellers | 3 Years |
| **`deal_knowledge_chunks`** | `chunk_text` | **RETAINED** | Structural defect caveats & foundation cracks | Lagos State Urban and Regional Planning Law | Permanent (Tied to property asset) |
| **`deal_knowledge_chunks`** | `category` | **RETAINED** | Classification of structural vs financial data | Title conveyance due diligence | Permanent |

---

## 2. The Legal Conflict: Right to Erasure vs Statutory Retention Obligations

Per assessment requirements, we identify the exact case where two legal mandates point in directly opposite directions:

### The Conflict Identified
* **Mandate A: Right to Erasure (NDPA 2023, Section 34)**:  
  Agent Tunde Bakare resigns from Realme Properties Ltd, demands the complete erasure of his user record, and requests the deletion of all structural inspection logs and deal questionnaire notes he authored for a Lekki Phase 1 waterfront property.
* **Mandate B: Mandatory Financial & Conveyancing Disclosure (Money Laundering Act 2022, Section 7 & LASRERA Law 2022)**:  
  Real estate brokerages are designated non-financial businesses and professions (DNFBPs) strictly mandated to retain all transaction records, client identification logs, and property defect affidavits for a minimum of **5 to 7 years** to assist regulatory inquiries and prevent undisclosed structural fraud.

### Which Mandate Wins, and on What Basis?
**Mandate B (Statutory Retention) Wins Over Erasure.**

**Legal Basis**:  
Under **Section 34(2)(b) of the Nigeria Data Protection Act 2023**, the Right to Erasure is explicitly restricted when processing is necessary:
> *"For compliance with a legal obligation to which the data controller is subject by law, or for the establishment, exercise or defence of legal claims."*

If RealMe wiped Tunde's inspection caveat disclosing an active structural crack in the foundation of the ₦410,000,000 Lekki property, and the building subsequently suffered structural settlement, the brokerage would face criminal charges for concealing structural defects. Therefore, the physical records are retained, but the personal identifier is severed through **anonymization**.

---

## 3. Anonymisation Against Deletion: Why Anonymised Data Can Be Kept

* **The Statutory Definition**: Data is considered "Personal Data" under NDPA Section 65 only if it relates to an identified or identifiable natural person. 
* Once data is irreversibly anonymized—meaning the connection between the record and the natural human being is permanently broken such that re-identification is mathematically impossible without external data—it ceases to be personal data.
* **Why This Protects the Brokerage**:  
  By replacing Tunde's name with `"Former Agent [Anonymized]"` and hashing his email, the brokerage respects his privacy rights by ensuring his name no longer appears in marketing registries, while preserving the structural defect caveat (`"Borehole soil settlement observed on east boundary"`) required by the property buyer.

---

## 4. Backup Synchronization & The Retention Dilemma

A common failure mode in database architectures is purging live database rows while leaving the deleted personal data permanently embedded inside unmanaged database backup snapshots.

### Backup Strategy & Synchronization Interval:
1. **Automated Point-in-Time Backups (PITR)**: Database write-ahead logs (WAL) are streamed to encrypted S3 storage (AWS `af-south-1` Cape Town region, ensuring African data residency under NDPA guidelines).
2. **Snapshot Lifecycle Retention**: Automated daily database snapshots are retained for exactly **30 days**, after which they are permanently expired and overwritten via automated S3 lifecycle rules.
3. **Backup Rehydration Policy**: If a disaster recovery event forces a database restore from a 14-day-old backup snapshot, our post-restore orchestration script immediately executes a synchronization pass:
   ```sql
   DELETE FROM agents WHERE id IN (SELECT agent_id FROM deletion_audit_log WHERE hard_deleted_at < NOW());
   ```
   This ensures that previously purged accounts are not resurrected during disaster recovery.
