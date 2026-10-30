# Task 01: RealMe Enterprise Design System & Agent Consumption Proof

*Written for a technical interviewer who has four minutes.*

---

## 1. What This Task Was
Task 01 establishes the foundational enterprise design system for **RealMe**—the internal real estate deal intelligence platform built for **Realme Properties Ltd** (a 400-agent brokerage based in Lekki, Lagos). The objective was to build a rigorous, accessible token architecture, export it from Figma into an agent-consumable format (`06-tokens-complete.json`), enforce semantic-only role abstraction, and mathematically prove that an AI coding agent consumed the system without leaking raw values or reverting to generic defaults.

---

## 2. What We Built
1. **Mathematical Tonal Color System**:
   - Pinned brand anchor at Tone 40 (`#0D1F3D` - Midnight Navy Blue) across 14 perceptual HCT tones (`0` to `100`).
   - Symmetrical light/dark theme derivations and functional scales for Error (`#910725`), Warning (`#633602`), and Accent (`#2A0808`).
   - 44 semantic role tokens with verified WCAG contrast ratios (e.g. `on-surface` on `surface` = **16.76:1** AAA; `on-primary` on `primary` = **16.40:1** AAA).
2. **Typographic Scale & Formula Constraints**:
   - 15 styles across 5 roles (Display, Headline, Title, Body, Label) combining `Plus Jakarta Sans` for headers and `JetBrains Mono` for tabular deal records and micro status chips.
   - Strict formula-driven line heights: $1.5\times$ multiplier applied across the scale (e.g. Display Large: 64px size $\times 1.5 = 96\text{px}$ line height; Body Medium: 14px size $\times 1.5 = 21\text{px}$ line height).
   - Visually judged compact letter spacing (-2.0px on Display Large) preventing multi-digit currency truncation.
3. **Atmospheric Shadow System**:
   - Soft, Medium, and Hard elevation tokens tinted with primary brand pigment (`rgba(13, 31, 61, alpha)`) rather than generic black, simulating physical ambient bounce light.
4. **Token Pipeline & Compiler**:
   - Canonical Figma Design Tokens exports (`evidence/05-tokens-incomplete.json` vs `evidence/06-tokens-complete.json`).
   - Standalone Node compiler (`scripts/build-tokens.js`) resolving nested aliases and emitting `tokens.css` exposing exclusively semantic roles.
5. **Verified Screen Implementation**:
   - Live RealMe Deal Dashboard (`src/index.html` + `src/styles.css`) consuming 100% tokens and 0 raw hex values.
   - Proof telemetry assets, prompt logs, and unmerged deliberate regression test branch (`test/broken-token-referencing`).

---

## 3. What We Decided
- **Pinning Over Algorithmic Normalization**: We explicitly pinned `#0D1F3D` as Primary 40. Without pinning, the default HCT generator absorbed the midnight navy into a desaturated slate-cyan (`#1A3F75`), diluting the brand.
- **Strict Role Encapsulation (Primitive Banning)**: We forbade exporting primitive palette tokens to CSS variables. Components can only consume semantic roles (`--realme-color-primary`, `--realme-color-surface`). This prevents developers and AI agents from hardcoding primitive shades that break during theme switching.
- **Material Baseline Divergences**:
  1. *Typeface/Weight*: Swapped Roboto Regular (400) for Plus Jakarta Sans ExtraBold (800) with -2.0px tracking on Display Large to withstand harsh Lagos equatorial glare on budget 250-nit phone screens.
  2. *Monospaced Body Records*: Set Body typography in `JetBrains Mono` (1.5x leading) because RealMe deal facts, bottom-dollar pricing numbers, and inspection crack measurements are tabular, structured data requiring zero glyph ambiguity.

---

## 4. What We Got Wrong (Failures & Defect Audit)
1. **The Figma Variables Export Omission**: In our initial export, variable collections were unchecked, producing `evidence/05-tokens-incomplete.json` where the entire color system was omitted, leaving only `effect` and `typography`. The compiler failed to resolve color roles. We identified the omission and re-exported `evidence/06-tokens-complete.json` with variable collections included.
2. **Agent Token Compiler Primitive Leakage**: In our first prompt, the agent naively flattened primitive palettes directly into `:root`, exposing `--realme-color-primary40` and un-dereferenced aliases (`{primitive colors...}`). We stopped the agent, rewrote the prompt with strict architectural invariants, and enforced recursive alias dereferencing.
3. **Outline-Variant Contrast Boundary Defect**: Our compiled `--realme-color-outline-variant` (`#C1C7CE`, `tokens.css:55`) has a 1.66:1 contrast ratio against the surface canvas. On cheap Android TN panels under midday sun, container partitions wash out completely. We documented this failure in `docs/defects.md` and restricted the token strictly to non-functional decorative lines.

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
