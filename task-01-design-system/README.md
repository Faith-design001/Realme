# Task 01: Vault Enterprise Design System & Agent Consumption Proof

*Written for a technical interviewer who has four minutes.*

---

## 1. What This Task Was
Task 01 establishes the foundational enterprise design system for **Vault**—the internal real estate deal intelligence platform built for **Realme Properties Ltd** (a 400-agent brokerage based in Lekki, Lagos). The objective was to build a rigorous, accessible token architecture, export it from Figma into an agent-consumable format, enforce semantic-only role abstraction, and mathematically prove that an AI coding agent consumed the system without leaking raw values or reverting to generic defaults.

---

## 2. What We Built
1. **Mathematical Tonal Color System**:
   - Pinned brand anchor at Tone 40 (`#0F4C5C` - Lekki Deep Cyan-Teal) across 13 perceptual HCT tones (`0` to `100`).
   - Symmetrical light/dark theme derivations and functional scales for Error (`#BA1A1A`), Warning (`#7A5900`), and Success (`#196538`).
   - 19 semantic role tokens with verified WCAG contrast ratios (e.g. `on-surface` on `surface` = 15.68:1 AAA; `on-primary` on `primary` = 7.84:1 AAA).
2. **Typographic Scale & Formula Constraints**:
   - 15 styles across 5 roles (Display, Headline, Title, Body, Label) in `Plus Jakarta Sans`.
   - Strict formula-driven line heights: $1.4\times$ for Display/Headlines (preventing multi-line title collapse), $1.5\times$ for Titles/Labels (grid alignment), and $1.6\times$ for Body (preventing line-jumping on vibrating Android displays).
   - Visually judged compact letter spacing (-1.5px on Display Large) preventing multi-digit currency truncation.
3. **Atmospheric Shadow System**:
   - Soft, Medium, and Hard elevation tokens tinted with primary brand pigment (`rgba(15, 76, 92, alpha)`) rather than generic black, simulating physical ambient bounce light.
4. **Token Pipeline & Compiler**:
   - DTCG/W3C token exports (`evidence/05-tokens-incomplete.json` vs `evidence/06-tokens-complete.json`).
   - Standalone Node compiler (`scripts/build-tokens.js`) resolving nested aliases and emitting `tokens.css` exposing exclusively semantic roles.
5. **Verified Screen Implementation**:
   - Live Vault Deal Dashboard (`src/index.html` + `src/styles.css`) consuming 100% tokens and 0 raw hex values.
   - Proof telemetry assets, prompt logs, and unmerged deliberate regression test branch (`test/broken-token-referencing`).

---

## 3. What We Decided
- **Pinning Over Algorithmic Normalization**: We explicitly pinned `#0F4C5C` as Primary 40. Without pinning, the default HCT generator absorbed the maritime teal into a desaturated blue-slate (`#1B6578`), diluting the brand.
- **Strict Role Encapsulation (Primitive Banning)**: We forbade exporting primitive palette tokens to CSS variables. Components can only consume semantic roles (`--vault-color-primary`, `--vault-color-surface`). This prevents developers and AI agents from hardcoding primitive shades that break during theme switching.
- **Material Baseline Divergences**:
  1. *Typeface/Weight*: Swapped Roboto Regular (400) for Plus Jakarta Sans Bold (700) on Display/Headlines to withstand harsh Lagos equatorial glare on budget 250-nit phone screens.
  2. *Body Leading*: Expanded Body Medium line-height from $1.43\times$ (20px) to $1.6\times$ (22px) to prevent line-jumping when field agents read dense structural caveats on transit.

---

## 4. What We Got Wrong (Failures & Defect Audit)
1. **The Figma Variables Export Omission**: In our initial export, variable collections were unchecked, producing `evidence/05-tokens-incomplete.json` where the entire color system was an empty object `{}`. The compiler crashed with `Cannot read properties of undefined (reading primary)`. We identified the omission and re-exported `evidence/06-tokens-complete.json`.
2. **Agent Token Compiler Primitive Leakage**: In our first prompt, the agent naively flattened primitive palettes directly into `:root`, exposing `--color-primary-40` and un-dereferenced aliases (`{color.primitive...}`). We stopped the agent, rewrote the prompt with strict architectural invariants, and enforced recursive alias dereferencing.
3. **Outline-Variant Contrast Boundary Defect**: Our compiled `--vault-color-outline-variant` (`#C4C7C7`, `tokens.css:21`) has a 1.62:1 contrast ratio against the surface canvas. On cheap Android TN panels under midday sun, container partitions wash out completely. We documented this failure in `docs/defects.md` and restricted the token strictly to non-functional decorative lines.

---

## Deliverables Directory Index
- `docs/business-brief.md`: Business, user profile, core RLS invariant, 3 repetitive deal queries.
- `docs/colour-roles.md`: Pinned primary 40 rationale, tonal derivation, semantic role map, contrast audit.
- `docs/type-scale.md`: All 15 typographic styles, formula multipliers, optical tracking proof.
- `docs/divergences.md`: Two deliberate Material baseline divergences with failure boundary analyses.
- `docs/shadows.md`: Brand-pigmented elevation specifications and optical physics justification.
- `docs/prompts.md`: Verbatim agent compiler prompts, failed attempt breakdown, architectural fix.
- `docs/defects.md`: Three real defects named by file and line number with production impact.
- `docs/interview-answers.md`: 12 technical interview answers (all under 200 words each).
- `evidence/`: 7 high-resolution proof sheets, 2 JSON exports, search logs, typography audit, and unmerged Git log.
