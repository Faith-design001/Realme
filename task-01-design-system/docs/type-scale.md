# RealMe Enterprise Design System: Typographic Hierarchy & Metrics

## 1. Typographic Foundation
- **Primary Headings & Titles**: `Plus Jakarta Sans`
- **Body & Tabular Records**: `JetBrains Mono`
- **Micro Badges / UI Metadata**: `JetBrains Mono`
- **Contextual Justification**: In RealMe, deal facts, pre-listing bottom-dollar agreed prices, escrow penalty dates, and structural crack inspection dimensions are legally binding data points. Monospaced `JetBrains Mono` for Body and Micro Labels ensures tabular alignment, fixed digit widths, and clear visual separation of clauses and status codes. `Plus Jakarta Sans` provides bold, authoritative weight for display valuations under direct sunlight on budget mobile screens.

---

## 2. Line Height Formula & Role Derivation
The RealMe typographic system enforces a strict mathematical multiplier formula:
$$\text{Line Height} = \text{Font Size} \times 1.5$$

- **Display & Headline (Multiplier $1.5\times$)**: 64px size with 96px line height, 48px with 72px, 32px with 48px. Snaps cleanly to the 8px baseline grid, giving prominent real estate figures authoritative breathing room without line decoupling.
- **Body Text (Multiplier $1.5\times$)**: 16px with 24px line height, 14px with 21px, 12px with 18px. Monospaced reading requires clean vertical separation so field agents scanning structural caveats on low-resolution mobile devices do not suffer from line-jumping.
- **Title & Label (Multiplier $1.5\times$)**: 22px with 33px line height, 14px with 21px, 11px with 16.5px. Aligns with standard UI component padding and button heights.

---

## 3. The 15 Typographic Styles Specification (from `06-tokens-complete.json`)

| Role | Style Name | Font Family | Weight | Size (px) | Multiplier | Line Height (px) | Letter Spacing (px) | Primary Job in RealMe Interface |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | Display Large | Plus Jakarta Sans | 800 (ExtraBold) | 64px | 1.5 | 96px | -2.0px | Hero negotiated deal price figures |
| **Display** | Display Medium | Plus Jakarta Sans | 800 (ExtraBold) | 48px | 1.5 | 72px | -2.0px | Portfolio valuation totals |
| **Display** | Display Small | Plus Jakarta Sans | 700 (Bold) | 40px | 1.5 | 60px | -1.4px | Section summary totals |
| **Headline**| Headline Large | Plus Jakarta Sans | 700 (Bold) | 32px | 1.5 | 48px | -1.0px | Property deal titles (e.g. 45 Lekki Phase 1) |
| **Headline**| Headline Medium| Plus Jakarta Sans | 700 (Bold) | 28px | 1.5 | 42px | -1.0px | Major inspection report module headers |
| **Headline**| Headline Small | Plus Jakarta Sans | 600 (SemiBold) | 24px | 1.5 | 36px | -0.9px | Modal headers, compliance flag titles |
| **Title** | Title Large | Plus Jakarta Sans | 600 (SemiBold) | 22px | 1.5 | 33px | -0.75px | Card headlines, negotiated price label |
| **Title** | Title Medium | Plus Jakarta Sans | 500 (Medium) | 16px | 1.5 | 24px | -0.55px | Pre-listing questionnaire section leads |
| **Title** | Title Small | Plus Jakarta Sans | 500 (Medium) | 14px | 1.7 | 24px | -0.4px | Escrow milestone steps |
| **Body** | Body Large | JetBrains Mono | 400 (Regular) | 16px | 1.5 | 24px | -0.75px | Unredacted legal counsel correspondence |
| **Body** | Body Medium | JetBrains Mono | 400 (Regular) | 14px | 1.5 | 21px | -0.45px | Foundation crack & mold hazard inspection notes |
| **Body** | Body Small | JetBrains Mono | 400 (Regular) | 12px | 1.5 | 18px | -0.32px | Timestamps, server-side sync notices |
| **Label** | Label Large | Plus Jakarta Sans | 600 (SemiBold) | 14px | 1.5 | 21px | -0.45px | Primary action buttons ("Execute Escrow Rider") |
| **Label** | Label Medium | Plus Jakarta Sans | 500 (Medium) | 12px | 1.5 | 18px | -0.35px | Filter chips, active listing status tags |
| **Label** | Label Small | JetBrains Mono | 500 (Medium) | 11px | 1.5 | 16.5px | -0.22px | Micro compliance badges, tenant isolation pill |

---

## 4. Letter Spacing Optical Judgement (Display Large Visual Proof)
- **Baseline Default**: `0px` or `-0.25px` (Standard un-tracked default).
- **RealMe Chosen Spacing**: `-2.0px` (Compact optical tracking from `06-tokens-complete.json`).

### Analysis of What Changed
When Display Large (64px ExtraBold) renders at default 0px tracking, the wide character widths of `Plus Jakarta Sans` cause high-magnitude figures (e.g. `₦450,000,000`) to stretch excessively, exceeding 600px in width and breaking across multiple lines on mobile screens. Tightening tracking to `-2.0px` compresses the character envelope by 20%, binding the currency symbol and nine digits into a solid, authoritative financial stamp that field agents can digest with a single glance during fast-paced seller negotiations.

*(See visual proof assets: `evidence/03-spacing-default.png` vs `evidence/04-spacing-chosen.png`)*
