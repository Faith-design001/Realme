# Vault Enterprise Design System: Typographic Hierarchy & Metrics

## 1. Typographic Foundation
- **Primary Typeface**: `Plus Jakarta Sans`
- **Fallback Font Stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- **Contextual Justification**: Realme's field agents operate mid-range Android devices under high-glare ambient sunlight across Lekki construction sites and client viewings. `Plus Jakarta Sans` features wide geometric counters, clear differentiation between glyphs (such as uppercase `I`, lowercase `l`, and digit `1`), and an elevated x-height. This ensures critical figures—such as multi-million Naira valuation numbers (`₦450,000,000`) and legal clause references—remain instantly legible without zooming on budget TN/IPS smartphone displays.

---

## 2. Line Height Formula & Role Derivation
Vault enforces strict mathematical line height constraints derived directly from base font size:
$$\text{Line Height} = \text{Font Size} \times \text{Multiplier}$$
Where the multiplier is constrained to $1.4$, $1.5$, or $1.6$.

### Multiplier Distribution Across Roles
1. **Display & Headline ($1.4\times$)**:
   - *Multiplier*: $1.4$
   - *Rationale*: Large optical display type (24px to 57px) creates immense natural whitespace between ascenders and descenders. Applying standard body leading ($1.5\times$ or $1.6\times$) causes multi-line property titles and valuation banners to fall apart visually, destroying headline coherence. A tight $1.4\times$ multiplier locks large headings into compact, unified semantic blocks.
2. **Title & Label ($1.5\times$)**:
   - *Multiplier*: $1.5$
   - *Rationale*: Titles and labels serve navigational, card-header, and button contexts. A $1.5\times$ multiplier aligns typographic bounding boxes directly with our $4\text{px}/8\text{px}$ spatial grid, preventing uneven vertical button padding and avoiding line truncation inside tight table headers.
3. **Body Text ($1.6\times$)**:
   - *Multiplier*: $1.6$
   - *Rationale*: Body text communicates legal covenants, escrow riders, and unredacted structural inspection disclosures. Field agents reading multi-sentence inspection summaries on a bumpy drive down the Lekki-Epe expressway cannot afford line-jumping. A generous $1.6\times$ leading creates open horizontal breathing channels, drastically speeding scanning and eliminating eye tracking fatigue.

---

## 3. The 15 Typographic Styles Specification

| Role | Style Name | Font Family | Weight | Size (px) | Multiplier | Line Height (px) | Letter Spacing (px) | Primary Job in Vault Interface |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | Display Large | Plus Jakarta Sans | 700 (Bold) | 57px | 1.4 | 80px | -1.5px | Hero transaction summary numbers |
| **Display** | Display Medium | Plus Jakarta Sans | 700 (Bold) | 45px | 1.4 | 63px | -1.0px | Core portfolio aggregate valuations |
| **Display** | Display Small | Plus Jakarta Sans | 600 (SemiBold) | 36px | 1.4 | 50px | -0.5px | Section splash totals, quarterly milestones |
| **Headline**| Headline Large | Plus Jakarta Sans | 600 (SemiBold) | 32px | 1.4 | 45px | -0.25px | Property deal title (e.g. 45 Lekki Phase 1) |
| **Headline**| Headline Medium| Plus Jakarta Sans | 600 (SemiBold) | 28px | 1.4 | 39px | 0px | Major inspection report modules |
| **Headline**| Headline Small | Plus Jakarta Sans | 500 (Medium) | 24px | 1.4 | 34px | 0px | Modal headers, compliance flag categories |
| **Title** | Title Large | Plus Jakarta Sans | 500 (Medium) | 22px | 1.5 | 33px | 0px | Bottom-dollar agreed price badge |
| **Title** | Title Medium | Plus Jakarta Sans | 600 (SemiBold) | 16px | 1.5 | 24px | +0.15px | Field agent questionnaire section lead |
| **Title** | Title Small | Plus Jakarta Sans | 600 (SemiBold) | 14px | 1.5 | 21px | +0.1px | Escrow milestone step indicator |
| **Body** | Body Large | Plus Jakarta Sans | 400 (Regular) | 16px | 1.6 | 26px | 0px | Unredacted legal counsel correspondence |
| **Body** | Body Medium | Plus Jakarta Sans | 400 (Regular) | 14px | 1.6 | 22px | 0px | Foundation crack & mold hazard inspection notes |
| **Body** | Body Small | Plus Jakarta Sans | 400 (Regular) | 12px | 1.6 | 19px | +0.4px | Timestamps, server-side sync notice |
| **Label** | Label Large | Plus Jakarta Sans | 500 (Medium) | 14px | 1.5 | 21px | +0.1px | Primary action buttons ("Query Vault") |
| **Label** | Label Medium | Plus Jakarta Sans | 500 (Medium) | 12px | 1.5 | 18px | +0.5px | Filter chips, active listing status tags |
| **Label** | Label Small | Plus Jakarta Sans | 500 (Medium) | 11px | 1.5 | 16px | +0.5px | Micro compliance badges, tenant isolation pill |

---

## 4. Letter Spacing Optical Judgement (Display Large Visual Proof)
- **Baseline Default**: `-0.25px` (Standard generic web/Material baseline).
- **Vault Chosen Spacing**: `-1.5px` (Custom compact optical tracking).

### Analysis of What Changed
When Display Large (57px Bold) renders at the generic baseline spacing of `-0.25px`, the wide, open glyph apertures of `Plus Jakarta Sans` spread numbers and capital letters excessively across the mobile viewport, making high-magnitude Naira valuations (e.g., `₦450,000,000`) consume three lines and appear visually fragmented. Tightening tracking to `-1.5px` eliminates loose optical voids between round characters (`O`, `D`, `C`) and numerals (`0`, `5`, `8`). The resulting text block reads as an authoritative, monolithic financial stamp that field agents can digest with a single saccadic eye fixation during high-pressure seller negotiations.

*(See visual proof assets: `evidence/03-spacing-default.png` vs `evidence/04-spacing-chosen.png`)*
