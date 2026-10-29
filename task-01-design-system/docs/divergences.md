# Vault Enterprise Design System: Baseline Divergence Analysis

This document records deliberate, principled divergences from the Google Material 3 baseline specification. Every divergence represents a conscious engineering and usability trade-off tailored specifically to Realme Properties Ltd's operational reality in Lekki, Lagos.

---

## Divergence 01: Typographic Family and Weight on Display & Headline Roles

### 1. Documented Baseline Default
- **Typeface**: `Roboto`
- **Weight**: `Regular (400)`
- **Material 3 Baseline Standard**: Display Large = Roboto 57px / 64px line height / 400 Regular weight / -0.25px letter spacing.

### 2. Vault Chosen Specification
- **Typeface**: `Plus Jakarta Sans`
- **Weight**: `Bold (700)` on Display Large and Medium; `SemiBold (600)` on Display Small and Headlines.
- **Vault Specification**: Display Large = Plus Jakarta Sans 57px / 80px line height / 700 Bold weight / -1.5px letter spacing.

### 3. Engineering & Field Rationale
Realme's 400 field agents operate in high-ambient-glare outdoor environments (e.g., direct equatorial sunlight on construction viewings across Lekki Phase 1 and Victoria Garden City). They view the application primarily on mid-range or refurbished Android smartphones with low-brightness TN or budget IPS displays (250–350 nits). 
A light 400-weight `Roboto` glyph stroke at 57px lacks sufficient physical ink-density under harsh midday glare, causing glyph stems to wash out into the light background canvas. Furthermore, high-stakes real estate transactions require immediate, unmistakable visual hierarchy when confirming negotiated valuations (e.g. distinguishing `₦45,000,000` from `₦450,000,000`). `Plus Jakarta Sans` Bold (700) provides heavy, sturdy glyph boundaries and wide geometric counters that remain legible through phone screen glare and surface dust.

### 4. Where This Choice Fails (The Inversion / Wrong-Case Analysis)
Our choice would be completely wrong in:
1. **Dense Legal Contract / Regulatory Document Viewers**: If applied within prolonged reading views—such as deep multi-page land registry gazettes, corporate bylaws, or long-form tenancy contracts—a 700-weight geometric sans creates overwhelming optical heaviness. The excessive ink volume exhausts reader attention, induces visual fatigue, and creates an aggressive visual tone that feels like an alarm rather than legal prose.
2. **High-Density Broker Trading Terminals**: On multi-window desktop displays where fifty deal cards must be visible simultaneously without scrolling, 700-weight display headings demand too much focal gravity, pulling the user's eye away from critical secondary indicators like escrow expiration countdowns and inspection clearance flags.

---

## Divergence 02: Body Medium Line-Height Multiplier Expansion

### 1. Documented Baseline Default
- **Font Size**: 14px
- **Line Height**: 20px (Calculated ratio: $20 / 14 \approx 1.428\times$)
- **Material 3 Baseline Standard**: Body Medium = 14px size / 20px line height / 400 weight / 0.25px tracking.

### 2. Vault Chosen Specification
- **Font Size**: 14px
- **Line Height**: 22px (Enforced ratio: $14 \times 1.6 = 22.4\text{px}$, snapped to $22\text{px}$)
- **Vault Specification**: Body Medium = Plus Jakarta Sans 14px / 22px line height / 400 Regular / 0px tracking.

### 3. Engineering & Field Rationale
In Vault, Body Medium is the workhorse style used for displaying retrieved factual excerpts: private pre-listing questionnaires, structural engineer inspection caveats, and attorney escrow stipulations. These snippets contain highly consequential compound sentences packed with numeric terms, clauses, and technical jargon (e.g. *"Foundation settlement along northern perimeter exceeds 4mm; recommended underpinning before transfer"*).
Under the default Material $1.43\times$ leading (20px), two lines of 14px text leave only 6px of breathing room between the baseline of the upper line and the ascenders of the lower line. When field agents are scrolling rapidly on moving transit (such as an agent scanning inspection reports on an Okada or car between Lekki appointments), this cramped vertical distance leads directly to "line-jumping" (inadvertently re-reading the same line or skipping a critical caveat). Expanding to a strict $1.6\times$ multiplier (22px) creates 8px of clean white channel between lines, stabilizing saccadic eye tracking on vibrating screens.

### 4. Where This Choice Fails (The Inversion / Wrong-Case Analysis)
Our choice would be completely wrong in:
1. **High-Density Financial Ledgers & Commission Tables**: In an administrative accounting view where managing brokers must reconcile 400 agent commission disbursements across 20-row deal spreadsheets, a 22px line height squanders approximately 10% of vertical viewport real estate per table row. Over a standard 1080p laptop display, this forces continuous vertical pagination and scrolling, obscuring total reconciliation balances at the table footer.
2. **Compact Notification Drawers & Toast Notifications**: In constrained UI elements like toast popups or a 320px mobile notification drawer, a $1.6\times$ line height forces 3-line alerts to expand past the modal viewport boundary, clipping action buttons like *"Acknowledge"* or *"Review Escrow Rider"*.
