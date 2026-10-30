# Vault Enterprise Design System: Technical Interview Defence

This document contains written defence answers for the 12 design systems, frontend architecture, and accessibility interview questions. In compliance with assessment rules, each response is strictly capped at under 200 words.

---

### Question 1: How would you structure design tokens?
**Response:**
I structure design tokens in a three-tier hierarchy following the DTCG (Design Tokens Community Group) specification:

1. **Global/Primitive Tokens**: Raw, context-agnostic physical values. Examples include color palettes (`blue-400: #60A5FA`), typography steps (`size-16: 1rem`), and base spatial increments (`space-4: 16px`). Primitives are never consumed directly by UI components.
2. **Semantic/System Tokens**: Intent-driven aliases that assign a job to a primitive within a specific theme or mode. Examples include `color-surface: {neutral-98}`, `color-primary: {primary-40}`, and `elevation-modal: {shadow-hard}`. These resolve theme switching (light/dark mode) symmetrically without altering component styles.
3. **Component Tokens (Scoped)**: Optional component-specific overrides scoped to atomic interfaces, such as `btn-primary-bg: {color-primary}` or `card-padding: {space-6}`.

This three-tier abstraction isolates design decisions from implementation. Swapping a brand identity or adjusting dark mode luminance requires modifying only the semantic alias layer. Frontend components reference exclusively semantic tokens, ensuring the codebase remains immune to breaking changes when underlying brand hex palettes evolve. *(161 words)*

---

### Question 2: When is a token change breaking?
**Response:**
A token change is breaking under three distinct architectural scenarios:

1. **Deletion or Renaming of Semantic Aliases**: If `--vault-color-primary` is renamed to `--vault-color-brand-key`, any component or downstream consumer expecting the former fails silently or drops back to unstyled browser defaults, breaking visual contracts.
2. **Semantic Category or Unit Mutation**: Changing the value type of an existing token—such as altering a spatial token from a pixel dimension (`16px`) to a unitless line-height scalar (`1.5`), or modifying a color token to a multi-stop gradient—breaks CSS mathematical functions (`calc()`, `clamp()`) and component layout calculations.
3. **Contrast Regression Below Compliance Thresholds**: Modifying a primitive or semantic mapping such that a text-background pairing drops below WCAG AA ($4.5:1$ for normal text, $3.0:1$ for non-text UI) is a functional breaking change. It violates accessibility compliance and introduces immediate legal and operational liability.

To prevent regressions, token updates require semantic versioning: value adjustments within established contrast bounds are minor/patch releases, whereas token renames, structural shifts, or type modifications mandate major version deprecation cycles. *(173 words)*

---

### Question 3: How would you support multiple brands and themes?
**Response:**
I support multiple brands and themes through a decoupled token architecture separating **shared semantic contracts** from **brand-specific token sets**.

At the component level, UI elements consume only invariant semantic variables:
```css
.card { background-color: var(--vault-color-surface); color: var(--vault-color-on-surface); }
```

Multiple brands are supported by defining separate token dictionary dictionaries for each brand (e.g., `brand-realme.json` vs `brand-luxury.json`). Each brand exports its own primitive palette and binds them to the invariant semantic role keys:
- Brand A maps `--vault-color-primary` to `#0F4C5C` (Maritime Teal).
- Brand B maps `--vault-color-primary` to `#1E3A8A` (Deep Atlantic Navy).

Themes (Light vs Dark) operate within the same brand by scoping semantic token overrides to data attributes or media queries:
```css
[data-theme="dark"] {
  --vault-color-surface: var(--vault-primitive-neutral-10);
  --vault-color-on-surface: var(--vault-primitive-neutral-90);
  --vault-color-primary: var(--vault-primitive-primary-80);
}
```

Components remain completely untouched. Switching brands or toggling dark mode is instantaneous, zero-cost, and handled entirely at the CSS custom property boundary without CSS-in-JS runtime overhead. *(163 words)*

---

### Question 4: Can tokens guarantee accessible contrast?
**Response:**
No. Design tokens alone cannot guarantee accessible contrast; they can only guarantee accessible *options*. 

Tokens are passive data dictionaries storing isolated discrete values. A design system can define `neutral-10` (`#191C1D`) and `neutral-98` (`#F8FAFA`), which mathematically achieve a stellar $15.68:1$ AAA ratio when paired together. However, tokens cannot inherently prevent a developer or an automated AI agent from writing:
```css
.badge { background: var(--vault-color-primary); color: var(--vault-color-on-surface); }
```
Because both tokens are valid CSS custom properties, the stylesheet compiles without error, yet the resulting contrast ratio collapses to an illegible $1.8:1$.

Guaranteeing contrast requires **composite constraints**:
1. **Paired Role Governance**: Bundling tokens into inseparable surface-content pairs (e.g., exposing a mixin or macro that applies `background-color` and `color` simultaneously from enforced role pairs).
2. **Automated CI/CD Linting**: Integrating automated linters (e.g., Stylelint accessibility plugins, axe-core) into the continuous delivery pipeline to detect unapproved token pairings.
3. **Rigid Semantic Disciplines**: Banning raw primitives from component CSS so developers can select only tested semantic combinations. *(170 words)*

---

### Question 5: How do you ensure that colour contrast guidelines are met within a website or application's design?
**Response:**
Ensuring contrast compliance requires an end-to-end verification pipeline spanning three development stages:

1. **Mathematical Derivation in Design (Figma)**: Using the perceptual HCT (Hue, Chroma, Tone) color model to derive tonal palettes. Because Tone ($T$) maps directly to relative luminance ($L^*$), maintaining a tone delta $\Delta T \ge 50$ between foreground and background mathematically guarantees WCAG AA compliance ($\ge 4.5:1$), and $\Delta T \ge 60$ guarantees AAA ($\ge 7.0:1$) before writing a line of code.
2. **Static Architecture & Automated Auditing**: We tabulate every role pairing in an explicit contrast matrix with calculated ratios. In CI, headless testing engines like Axe-core and Lighthouse audit rendered HTML/CSS trees against WCAG 2.1 AA/AAA thresholds, failing builds that contain regressions.
3. **Hardware Emulation & Field Testing**: We test interfaces on actual low-cost mobile hardware (budget Tecno/Infinix displays) and simulate common visual impairments using Chrome DevTools vision deficiency emulators (protanopia, deuteranopia, achromatopsia) to verify that state signals never rely on color alone, reinforcing errors with iconography and clear typography. *(168 words)*

---

### Question 6: Can you discuss the differences between WCAG levels A, AA and AAA?
**Response:**
WCAG (Web Content Accessibility Guidelines) defines three progressive compliance tiers:

- **Level A (Baseline Minimum)**: Eliminates total barriers that prevent assistive technology users from accessing the web. Requirements include basic keyboard navigation without traps, non-text content having text alternatives (`alt`), forms having associated labels, and content not relying exclusively on sensory characteristics (e.g. "click the red circle"). Without Level A, the software is fundamentally unusable for disabled users.
- **Level AA (Industry Enterprise Standard)**: The global legal benchmark for public and commercial applications (mandated by ADA, Section 508, EU EN 301 549). Key requirements include a minimum contrast ratio of $4.5:1$ for normal text ($3.0:1$ for large text $\ge 18\text{pt}$ or $14\text{pt}$ bold), $3.0:1$ for non-text UI components and borders, visible focus indicators, and page layouts that reflow down to 320px viewport width without horizontal scrolling or loss of information.
- **Level AAA (Specialized Enhancement)**: The most stringent standard, applied in specialized institutional, medical, or government contexts. Demands an extreme $7.0:1$ contrast ratio for normal text ($4.5:1$ for large text), context-sensitive inline help, and strict sign-language interpretation for audio. Full Level AAA across entire applications is generally considered impractical for rich interactive tools, but specific high-stakes modules—such as Vault's valuation figures and compliance alerts—intentionally satisfy AAA metrics ($15.68:1$). *(198 words)*

---

### Question 7: Discuss the importance of semantic HTML in the context of accessibility.
**Response:**
Semantic HTML is the irreplaceable bedrock of digital accessibility. It provides browsers, screen readers, and search crawlers with structural meaning, hierarchy, and native behavior that arbitrary `<div>` and `<span>` tags cannot deliver.

Key advantages include:
1. **The Accessibility Tree & Roles**: Native elements like `<header>`, `<main>`, `<nav>`, and `<button>` automatically generate the browser Accessibility Object Model (AOM). Assistive tools announce proper roles without requiring manual ARIA intervention.
2. **Native Keyboard Mechanics**: A native `<button>` or `<a href>` provides built-in keyboard focus (`Tab`), activation via `Enter` and `Space`, and proper focus states. Replacing `<button>` with `<div onclick>` strips keyboard accessibility unless a developer laboriously implements `tabindex="0"`, keydown listeners, and ARIA roles.
3. **Screen Reader Landmark Navigation**: Blind users navigate complex platforms by jumping across landmarks (`<main>`, `<section>`, `<h1>`-`<h6>`). Without semantic headers and sectioning, a screen reader user must listen to every word sequentially, turning a 5-second task into a 3-minute ordeal.

ARIA is a supplement to patch gaps, never a substitute for native semantic elements. The first rule of ARIA is: *do not use ARIA when semantic HTML already does the job*. *(186 words)*

---

### Question 8: How do you handle design handoff to developers using Figma?
**Response:**
I treat design handoff not as a static export, but as an engineering contract maintained through shared token architecture:

1. **Figma Variables as Single Source of Truth**: Designs are built strictly with Figma Variables linked to semantic collections (modes: Light, Dark, Density). Raw hex color pickers and arbitrary font sizes are disabled in component libraries.
2. **Automated Token Pipeline**: Token Studio or the Figma Variables API exports tokens as W3C/DTCG JSON directly into a Git repository. A compiler script (`build-tokens.js`) generates CSS custom properties and TypeScript definitions on commit.
3. **Design System Component Parity**: We maintain 1:1 naming symmetry between Figma component properties and React/HTML props. A `variant="primary" size="large"` button in Figma maps to the identical interface in code.
4. **Interactive States & Edge Cases**: Hand-off frames explicitly define hover, active, disabled, focus-visible, and error states, alongside responsive layout specs driven by Auto Layout (flexbox parity).
5. **Continuous Developer Collaboration**: Designers and engineers conduct live bi-weekly pairing audits to test edge cases (e.g. multi-line currency truncation, screen-reader landmarks), ensuring Figma and code never drift out of sync. *(178 words)*

---

### Question 9: Why do AI-generated interfaces tend to look generic, and what specifically do you hand an agent to stop it?
**Response:**
AI models are statistical sequence predictors trained on millions of generic web templates. When asked to "build a modern real estate dashboard," an agent samples the most probable distribution of web design: standard Tailwind blues (`#3B82F6`), unstyled 16px Inter/Roboto typography, generic rounded cards (`rounded-lg`), centered search bars, and excessive whitespace. The resulting interface lacks industry context, domain utility, and distinctive brand personality.

To stop this, you never give an agent open aesthetic discretion. You hand it an unyielding engineering envelope:
1. **The Compiled Token Dictionary (`tokens.css`)**: Pre-compiled semantic CSS variables declaring pinned brand pigments (`--vault-color-primary: #0F4C5C`), atmospheric shadows, and typography formulas.
2. **Strict Invariant Prompt Directives**: Verbatim constraints prohibiting raw hex codes, arbitrary pixel paddings, or generic utility classes. Every color and typography style must reference a `--vault-*` custom property.
3. **Domain Information Design Brief**: An explicit functional layout mandate (e.g., cached dashboard snapshot, unredacted inspection alert containers, instant deal query buttons) that forces the agent to solve specific user workflows rather than drawing generic placeholder landing pages. *(177 words)*

---

### Question 10: Your line height for display large is a specific number. Why that number and not one step either side of it? What would you lose with each?
**Response:**
Our Display Large style specifies **80px line height** for 57px font size, derived precisely from our $1.4\times$ optical multiplier ($57 \times 1.4 = 79.8\text{px}$, snapped to the $8\text{px}$ baseline grid at $80\text{px}$).

- **One Step Below (72px / $\sim 1.25\times$)**: At 72px, the leading becomes dangerously tight. When rendering multi-digit valuations or multi-line property titles on narrow mobile viewports, the descenders of uppercase/lowercase glyphs (`Q`, `J`, `p`, `g`) physically collide with the tall capital ascenders of the subsequent line (`₦`, `B`, `D`). The text block degrades into visual clutter, increasing reading error rates during urgent price confirmations.
- **One Step Above (88px / $\sim 1.55\times$)**: At 88px, the leading expands too far. Because 57px display type has massive physical glyph ink, excessive vertical spacing causes the lines to decouple perceptually (violating the Gestalt law of proximity). A multi-line headline separates into isolated visual bands rather than a single unified monetary unit, squandering precious vertical space on budget Android screens and pushing critical inspection badges below the initial viewport fold.

80px provides optimal optical balance: zero glyph collision with cohesive headline unity. *(190 words)*

---

### Question 11: Point at one place in your own token structure that you would build differently if you started again. Say what you would do instead and what it would cost.
**Response:**
If I started again, I would restructure our typography token schema to export **composite typographic tokens** rather than five individual atomic properties per style.

Currently, our schema compiles five independent variables per role:
```css
--vault-type-display-large-font-family: ...;
--vault-type-display-large-font-weight: ...;
--vault-type-display-large-font-size: ...;
--vault-type-display-large-line-height: ...;
--vault-type-display-large-letter-spacing: ...;
```
This forces developers and agents to declare all five variables whenever styling a headline. If an agent forgets `line-height`, the browser falls back to default `normal` (1.2), causing ascender-descender collisions.

**What I Would Do Instead**:
I would compile CSS class utility mixins or CSS custom property bundles:
```css
.type-display-large {
  font-family: var(--vault-font-sans);
  font-size: 57px;
  line-height: 80px;
  letter-spacing: -1.5px;
  font-weight: 700;
}
```

**The Cost**:
This would increase CSS bundle size slightly and reduce component-level property overrides (e.g., adjusting letter-spacing independently on a specialized variant would require explicit override rules). However, it would eliminate human and agent omitting errors permanently. *(168 words)*

---

### Question 12: Wrong-answer analysis. A candidate says: "I set up design tokens by exporting the hex values from Figma into a CSS file, so every colour in the codebase comes from one place. That makes it a single source of truth." This sounds correct and is not. Say precisely what is missing and what will go wrong in month four.
**Response:**
**What Is Missing**:
The candidate has exported **raw primitives, not a design system**. They bypassed semantic token abstraction entirely. A CSS file containing `--blue-500: #0F4C5C` or `--grey-100: #F8FAFA` provides zero contextual meaning; it merely renames hex codes without assigning roles or architectural intent.

**What Will Go Wrong in Month Four**:
1. **Erosion and Subjective Misuse**: Because variables are primitive colors rather than roles, Developer A uses `--blue-500` for a button, Developer B uses `--blue-400`, and Developer C uses `--blue-600`. The interface rapidly becomes fragmented with inconsistent shades across screens.
2. **Catastrophic Dark Mode & Multi-Theming Failure**: In month four, product leadership requests Dark Mode. Because components reference `--grey-100` for card backgrounds and `--blue-500` for text, swapping values forces engineers to manually hunt down every component in the codebase. You cannot simply invert `--grey-100` to black without breaking elements that actually required a light grey.
3. **Destruction of the Single Source of Truth**: Modifying a primitive breaks unintended components globally. The team abandons the tokens and reverts to hardcoding hex values directly in CSS, destroying governance completely. *(188 words)*
