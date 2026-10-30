# Vault Enterprise Design System: Production Defect Log

In accordance with engineering audit standards, this document records genuine defects identified in the Task 01 codebase, identified by exact file path and line number, with an honest analysis of their failure mode and production cost.

---

## Defect 01: Low-Contrast Boundary on Outline-Variant
- **File Reference**: `task-01-design-system/tokens.css` (Line 21)
- **Code Snippet**:
  ```css
  --vault-color-outline-variant: #C4C7C7; /* Subtle card dividers (strictly non-text) */
  ```
- **The Defect**:
  `#C4C7C7` measured against our primary canvas `--vault-color-surface` (`#F8FAFA`) yields a contrast ratio of only **1.62:1**. While WCAG 2.1 non-text contrast guidelines require $\ge 3.0:1$ for graphical objects and boundaries necessary to identify component controls, this variant is below threshold.
- **Production Cost**:
  Field agents using inexpensive Tecno or Infinix Android smartphones with budget TN/IPS panels (maximum 280 nits) under direct midday glare in Lekki will experience total washout of subtle card boundaries. When listing cards or tabular inspection riders rely on `outline-variant` to partition adjacent records, the rows blur into a single indistinct grey block. An agent attempting to tap "View Unredacted Inspection" on 45 Lekki Phase 1 risks tapping the adjacent listing below it, reviewing the wrong structural disclosure during high-stakes seller negotiations.

---

## Defect 02: Unsanitized Font-Family Interpolation in Token Compiler
- **File Reference**: `task-01-design-system/scripts/build-tokens.js` (Line 67)
- **Code Snippet**:
  ```javascript
  css += `  ${prefix}-font-family: "${token.fontFamily.$value}", -apple-system, BlinkMacSystemFont, sans-serif;\n`;
  ```
- **The Defect**:
  The compiler naively wraps the JSON token value in raw double quotes. If a design systems designer in Figma exports a font variable that already contains quotes or a comma-separated fallback chain (e.g. `"Plus Jakarta Sans", "Segoe UI"`), the compiled CSS outputs invalid nested quotes:
  `--vault-type-body-large-font-family: ""Plus Jakarta Sans", "Segoe UI"", -apple-system...;`
- **Production Cost**:
  The CSS parser in Blink and WebKit rejects the entire invalid CSS property declaration. The application falls back to user-agent default typography (typically 16px serif `Times New Roman`). In an enterprise deployment with 400 active agents, the entire platform suddenly renders with jarring, unstyled serif glyphs across all viewports until an emergency hotfix deployment is staged.

---

## Defect 03: Hardcoded Pixel Padding on Interactive Primary Buttons
- **File Reference**: `task-01-design-system/src/styles.css` (Line 269)
- **Code Snippet**:
  ```css
  .btn {
    padding: 10px 20px;
    border-radius: 8px;
    ...
  }
  ```
- **The Defect**:
  Interactive button sizing relies on absolute pixel dimensions (`10px 20px`) rather than relative typographic units (`0.625rem 1.25rem`). 
- **Production Cost**:
  Field agents with visual impairments who increase their OS accessibility font scaling to 150% or 200% will experience broken layouts. The button typography scales up while the bounding container remains locked in rigid pixel dimensions. Critical action labels—such as `"Execute Escrow Rider"`—collide with button edges and truncate to `"Execute Esc..."`, obscuring the legal action and causing accessibility audit failure under Section 508 and European EN 301 549 standards.
