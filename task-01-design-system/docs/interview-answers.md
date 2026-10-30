# RealMe Enterprise Design System: Technical Interview Defence

This document contains written defence answers for the 12 design systems, frontend architecture, and accessibility interview questions. In compliance with assessment rules, each response is strictly capped at under 200 words.

---

### Question 1: How would you structure design tokens?
**Response:**
I structure design tokens in a three-tier hierarchy following the DTCG (Design Tokens Community Group) specification:

1. **Global/Primitive Tokens**: Context-agnostic raw values. In RealMe, this is our `primitive colors` dictionary (e.g. `primary40: #0d1f3dff`, `neutral 2: #181b24ff`) and base typographic definitions. Primitives are never consumed directly by UI components.
2. **Semantic/System Tokens**: Intent-driven aliases that assign a job to a primitive within a specific theme or mode. In RealMe, this is our `color roles collection` (e.g., `primary: {primitive colors...primary40}`, `surface: {neutral99}`, `on-surface: {neutral 2}`). These resolve theme switching (light/dark mode) symmetrically without altering component styles.
3. **Component Tokens (Scoped)**: Optional component-specific overrides scoped to atomic interfaces, such as `btn-primary-bg: {color.primary}` or `deal-card-padding: {space.6}`.

This three-tier abstraction isolates design decisions from implementation. Swapping a brand identity or adjusting dark mode luminance requires modifying only the semantic alias layer. Frontend components reference exclusively semantic tokens, ensuring the codebase remains immune to breaking changes when underlying brand hex palettes evolve. 

---

### Question 2: When is a token change breaking?
**Response:**
A token change is breaking under three distinct architectural scenarios:

1. **Deletion or Renaming of Semantic Aliases**: If `--realme-color-primary` is renamed to `--realme-color-brand-key`, any component or downstream consumer expecting the former fails silently or drops back to unstyled browser defaults, breaking visual contracts.
2. **Semantic Category or Unit Mutation**: Changing the value type of an existing token—such as altering a spatial token from a pixel dimension (`16px`) to a unitless line-height scalar (`1.5`), or modifying a color token to a multi-stop gradient—breaks CSS mathematical functions (`calc()`, `clamp()`) and component layout calculations.
3. **Contrast Regression Below Compliance Thresholds**: Modifying a primitive or semantic mapping such that a text-background pairing drops below WCAG AA ($4.5:1$ for normal text, $3.0:1$ for non-text UI) is a functional breaking change. It violates accessibility compliance and introduces immediate legal and operational liability.

To prevent regressions, token updates require semantic versioning: value adjustments within established contrast bounds are minor/patch releases, whereas token renames, structural shifts, or type modifications mandate major version deprecation cycles. 

---

### Question 3: How would you support multiple brands and themes?
**Response:**
I support multiple brands and themes through a decoupled token architecture separating **shared semantic contracts** from **brand-specific token sets**.

At the component level, UI elements consume only invariant semantic variables:
```css
.deal-card { background-color: var(--realme-color-surface); color: var(--realme-color-on-surface); }
```

Multiple brands are supported by defining separate token dictionaries for each brand (e.g., `brand-realme.json` vs `brand-luxury.json`). Each brand exports its own primitive palette and binds them to the invariant semantic role keys:
- RealMe maps `--realme-color-primary` to `#0D1F3D` (Midnight Navy).
- A luxury affiliate maps `--realme-color-primary` to `#1E3A8A` (Deep Atlantic Cobalt).

Themes (Light vs Dark) operate within the same brand by scoping semantic token overrides to data attributes or media queries:
```css
[data-theme="dark"] {
  --realme-color-surface: var(--realme-primitive-neutral-4);
  --realme-color-on-surface: var(--realme-primitive-neutral-99);
  --realme-color-primary: var(--realme-primitive-primary-80);
}
```

Components remain completely untouched. Switching brands or toggling dark mode is instantaneous, zero-cost, and handled entirely at the CSS custom property boundary without CSS-in-JS runtime overhead. 

---

### Question 4: Can tokens guarantee accessible contrast?
**Response:**
No. Design tokens alone cannot guarantee accessible contrast; they can only guarantee accessible *options*. 

Tokens are passive data dictionaries storing isolated discrete values. A design system can define `neutral 2` (`#181B24`) and `neutral99` (`#FBFCFF`), which achieve an extraordinary $16.76:1$ AAA ratio when paired together. However, tokens cannot inherently prevent a developer or an automated AI agent from writing:
```css
.badge { background: var(--realme-color-primary); color: var(--realme-color-on-surface); }
```
Because both tokens are valid CSS custom properties, the stylesheet compiles without error, yet the resulting contrast ratio collapses to an illegible $1.8:1$.

Guaranteeing contrast requires **composite constraints**:
1. **Paired Role Governance**: Exposing coupled surface-content utilities that apply `background-color` and `color` simultaneously from enforced role pairs.
2. **Automated CI/CD Linting**: Integrating automated linters (e.g., Stylelint accessibility plugins, axe-core) into the continuous delivery pipeline to detect unapproved token pairings.
3. **Rigid Semantic Disciplines**: Banning raw primitives from component CSS so developers can select only tested semantic combinations. 

---

### Question 5: How do you ensure that colour contrast guidelines are met within a website or application's design?
**Response:**
Ensuring contrast compliance requires an end-to-end verification pipeline spanning three development stages:

1. **Mathematical Derivation in Design (Figma)**: Using the perceptual HCT (Hue, Chroma, Tone) color model to derive tonal palettes. Because Tone maps directly to relative luminance ($L^*$), maintaining a tone delta $\Delta T \ge 50$ between foreground and background mathematically guarantees WCAG AA compliance ($\ge 4.5:1$), and $\Delta T \ge 60$ guarantees AAA ($\ge 7.0:1$) before writing a line of code.
2. **Static Architecture & Automated Auditing**: We tabulate every role pairing in an explicit contrast matrix with calculated ratios. In CI, headless testing engines like Axe-core and Lighthouse audit rendered HTML/CSS trees against WCAG 2.1 AA/AAA thresholds, failing builds that contain regressions.
3. **Hardware Emulation & Field Testing**: We test interfaces on actual low-cost mobile hardware (budget Tecno/Infinix displays) and simulate common visual impairments using Chrome DevTools vision deficiency emulators (protanopia, deuteranopia, achromatopsia) to verify that state signals never rely on color alone, reinforcing errors with iconography and monospaced data clarity. 

---

### Question 6: Can you discuss the differences between WCAG levels A, AA and AAA?
**Response:**
WCAG (Web Content Accessibility Guidelines) defines three progressive compliance tiers:

- **Level A (Baseline Minimum)**: Eliminates total barriers that prevent assistive technology users from accessing the web. Requirements include basic keyboard navigation without traps, non-text content having text alternatives (`alt`), forms having associated labels, and content not relying exclusively on sensory characteristics (e.g. "click the red circle"). Without Level A, software is fundamentally unusable for disabled users.
- **Level AA (Industry Enterprise Standard)**: The global legal benchmark for public and commercial applications (mandated by ADA, Section 508, EU EN 301 549). Key requirements include a minimum contrast ratio of $4.5:1$ for normal text ($3.0:1$ for large text $\ge 18\text{pt}$ or $14\text{pt}$ bold), $3.0:1$ for non-text UI components and borders, visible focus indicators, and page layouts that reflow down to 320px viewport width without horizontal scrolling or loss of information.
- **Level AAA (Specialized Enhancement)**: The most stringent standard, applied in specialized institutional, medical, or government contexts. Demands an extreme $7.0:1$ contrast ratio for normal text ($4.5:1$ for large text), context-sensitive inline help, and strict sign-language interpretation for audio. In RealMe, our valuation figures and inspection alerts intentionally satisfy AAA metrics ($16.76:1$). 

---

### Question 7: Discuss the importance of semantic HTML in the context of accessibility.
**Response:**
Semantic HTML is the irreplaceable bedrock of digital accessibility. It provides browsers, screen readers, and search crawlers with structural meaning, hierarchy, and native behavior that arbitrary `<div>` and `<span>` tags cannot deliver.

Key advantages include:
1. **The Accessibility Tree & Roles**: Native elements like `<header>`, `<main>`, `<nav>`, and `<button>` automatically generate the browser Accessibility Object Model (AOM). Assistive tools announce proper roles without requiring manual ARIA intervention.
2. **Native Keyboard Mechanics**: A native `<button>` or `<a href>` provides built-in keyboard focus (`Tab`), activation via `Enter` and `Space`, and proper focus states. Replacing `<button>` with `<div onclick>` strips keyboard accessibility unless a developer laboriously implements `tabindex="0"`, keydown listeners, and ARIA roles.
3. **Screen Reader Landmark Navigation**: Blind users navigate complex platforms by jumping across landmarks (`<main>`, `<section>`, `<h1>`-`<h6>`). Without semantic headers and sectioning, a screen reader user must listen to every word sequentially, turning a 5-second task into a 3-minute ordeal.

ARIA is a supplement to patch gaps, never a substitute for native semantic elements. The first rule of ARIA is: *do not use ARIA when semantic HTML already does the job*. 

---

### Question 8: How do you handle design handoff to developers using Figma?
**Response:**
I treat design handoff not as a static export, but as an engineering contract maintained through shared token architecture:

1. **Figma Variables as Single Source of Truth**: Designs are built strictly with Figma Variables linked to semantic collections (modes: Light, Dark). Raw hex color pickers and arbitrary font sizes are disabled in component libraries.
2. **Automated Token Pipeline**: Token Studio or the Figma Variables API exports tokens as W3C/DTCG JSON (`06-tokens-complete.json`) directly into the repository. A compiler script (`build-tokens.js`) generates CSS custom properties on commit.
3. **Design System Component Parity**: We maintain 1:1 naming symmetry between Figma component properties and code props. A `variant="primary" size="large"` button in Figma maps to the identical interface in CSS.
4. **Interactive States & Edge Cases**: Hand-off frames explicitly define hover, active, disabled, focus-visible, and error states, alongside responsive layout specs driven by Auto Layout (flexbox parity).
5. **Continuous Developer Collaboration**: Designers and engineers conduct live bi-weekly pairing audits to test edge cases (e.g. multi-line currency truncation, screen-reader landmarks), ensuring Figma and code never drift out of sync. 
---

### Question 9: Why do AI-generated interfaces tend to look generic, and what specifically do you hand an agent to stop it?
**Response:**
AI models are statistical sequence predictors trained on millions of generic web templates. When asked to "build a modern real estate dashboard," an agent samples the most probable distribution of web design: standard Tailwind blues (`#3B82F6`), unstyled 16px Inter/Roboto typography, generic rounded cards (`rounded-lg`), centered search bars, and excessive whitespace. The resulting interface lacks industry context, domain utility, and distinctive brand personality.

To stop this, you never give an agent open aesthetic discretion. You hand it an unyielding engineering envelope:
1. **The Compiled Token Dictionary (`tokens.css`)**: Pre-compiled semantic CSS variables declaring pinned brand pigments (`--realme-color-primary: #0D1F3D`), atmospheric shadows, and typography formulas.
2. **Strict Invariant Prompt Directives**: Verbatim constraints prohibiting raw hex codes, arbitrary pixel paddings, or generic utility classes. Every color and typography style must reference a `--realme-*` custom property.
3. **Domain Information Design Brief**: An explicit functional layout mandate (e.g., cached dashboard snapshot, monospaced deal records in `JetBrains Mono`, unredacted inspection alert containers, instant query shortcuts) that forces the agent to solve specific user workflows rather than drawing generic placeholder landing pages. 

---

### Question 10: Your line height for display large is a specific number. Why that number and not one step either side of it? What would you lose with each?
**Response:**
In RealMe, Display Large specifies **96px line height** for 64px font size, derived precisely from our $1.5\times$ optical multiplier ($64 \times 1.5 = 96\text{px}$).

- **One Step Below (80px / $1.25\times$)**: At 80px, the leading becomes dangerously tight for 64px ExtraBold (800) glyphs. When rendering multi-digit valuations (`₦450,000,000`) or multiline property titles, descenders on glyphs like `g` and `y` physically collide with the tall Naira currency sign (`₦`) and capital ascenders on the next line. This degrades legibility and causes misread figures during fast-paced price negotiations.
- **One Step Above (112px / $1.75\times$)**: At 112px, the leading expands too far. Because 64px ExtraBold glyphs carry massive visual weight, excessive leading perceptually decouples the lines (violating the Gestalt law of proximity). A two-line title splits into two isolated visual blocks, squandering vertical space on budget Android viewports and pushing critical inspection alert boxes below the fold.

96px provides the exact optical balance: zero glyph collision with cohesive headline unity. 

---

### Question 11: Point at one place in your own token structure that you would build differently if you started again. Say what you would do instead and what it would cost.
**Response:**
If I started again, I would restructure our typography token schema to export **composite typographic tokens** rather than five individual atomic properties per style.

Currently, our schema compiles five independent variables per role:
```css
--realme-type-display-large-font-family: ...;
--realme-type-display-large-font-weight: ...;
--realme-type-display-large-font-size: ...;
--realme-type-display-large-line-height: ...;
--realme-type-display-large-letter-spacing: ...;
```
This forces developers and agents to declare all five variables whenever styling a headline. If an agent forgets `line-height`, the browser falls back to default `normal` (1.2), causing ascender-descender collisions.

**What I Would Do Instead**:
I would compile CSS class utility mixins or CSS custom property bundles:
```css
.type-display-large {
  font-family: var(--realme-font-sans);
  font-size: 64px;
  line-height: 96px;
  letter-spacing: -2px;
  font-weight: 800;
}
```

**The Cost**:
This would increase CSS bundle size slightly and reduce component-level property overrides (e.g., adjusting letter-spacing independently on a specialized variant would require explicit override rules). However, it would eliminate human and agent omitting errors permanently. 

---

### Question 12: Wrong-answer analysis. A candidate says: "I set up design tokens by exporting the hex values from Figma into a CSS file, so every colour in the codebase comes from one place. That makes it a single source of truth." This sounds correct and is not. Say precisely what is missing and what will go wrong in month four.
**Response:**
**What Is Missing**:
The candidate has exported **raw primitives, not a design system**. They bypassed semantic token abstraction entirely. A CSS file containing `--blue-500: #0D1F3D` or `--grey-100: #FBFCFF` provides zero contextual meaning; it merely renames hex codes without assigning roles or architectural intent.

**What Will Go Wrong in Month Four**:
1. **Erosion and Subjective Misuse**: Because variables are primitive colors rather than roles, Developer A uses `--blue-500` for a button, Developer B uses `--blue-400`, and Developer C uses `--blue-600`. The interface rapidly becomes fragmented with inconsistent shades across screens.
2. **Catastrophic Dark Mode & Multi-Theming Failure**: In month four, product leadership requests Dark Mode. Because components reference `--grey-100` for card backgrounds and `--blue-500` for text, swapping values forces engineers to manually hunt down every component in the codebase. You cannot simply invert `--grey-100` to black without breaking elements that actually required a light grey.
3. **Destruction of the Single Source of Truth**: Modifying a primitive breaks unintended components globally. The team abandons the tokens and reverts to hardcoding hex values directly in CSS, destroying governance completely. 
