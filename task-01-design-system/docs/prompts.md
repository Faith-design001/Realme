# Vault Enterprise Design System: Agent Instruction Prompts & Telemetry

This document records the exact, verbatim prompts used to instruct the AI agent to convert the JSON design tokens into production CSS variables, including the initial failed attempt, the failure mode, and the corrected final prompt.

---

## 1. Initial Prompt (Failed Attempt)

### Verbatim Prompt Sent to Agent:
```text
Write a Node.js script that converts evidence/06-tokens-complete.json into a CSS file called tokens.css.
Export all the colors, fonts, and shadows as CSS variables so we can use them in our app.
```

### What Went Wrong (The Failure Mode):
1. **Architectural Erosion (Primitive Leakage)**: The agent recursively flattened every token in the JSON file, including the primitive palettes. It generated:
   ```css
   --color-primary-0: #000000;
   --color-primary-10: #001F28;
   --color-primary-40: #0F4C5C;
   --color-neutral-10: #191C1D;
   ```
   By exporting primitive hex scales directly into `:root`, it allowed frontend developers and subsequent AI agents to write code like `color: var(--color-primary-40)` or `background: var(--color-neutral-10)`. This completely destroys the role-based token architecture: if a dark mode theme or brand theme is applied, components referencing `--color-primary-40` will not adapt, causing the design system to collapse back into hardcoded values with extra steps.
2. **Unresolved Token Aliases**: The agent outputted the literal JSON string alias values rather than dereferencing them:
   ```css
   --color-surface: {color.primitive.neutral.98}; /* Broken CSS syntax */
   ```
3. **Inconsistent Typography Properties**: Instead of outputting individual atomic CSS properties (`font-size`, `line-height`, `letter-spacing`, `font-weight`), it attempted to create shorthand `font:` declarations which broke when custom line heights and letter spacings were declared.

---

## 2. Refined Final Prompt (Working Solution)

### Verbatim Prompt Sent to Agent:
```text
You are an enterprise design systems engineer building the token compiler for Vault (Realme Properties Ltd).
Write a standalone Node.js script at `scripts/build-tokens.js` that compiles `evidence/06-tokens-complete.json` into `tokens.css`.

You must enforce three strict architectural invariants:
1. SEMANTIC ROLES ONLY: Do NOT export primitive palette tokens (e.g. `color.primitive.*`) to CSS variables. Only export semantic roles defined under `color.role.*`. Every CSS variable must be named `--vault-color-{roleName}`. The primitive colors must remain internal to the token resolver and NEVER be made available to components, ensuring the design system is the single source of truth and prevents developer/agent erosion.
2. RECURSIVE ALIAS RESOLUTION: The script must parse curly-brace alias references (e.g. `{color.primitive.neutral.98}`) and recursively dereference them to their ultimate hex values.
3. ATOMIC TYPOGRAPHY & SHADOWS:
   - For all 15 typography styles (display, headline, title, body, label across large, medium, small), export distinct atomic custom properties: `--vault-type-{role}-{size}-font-family`, `--vault-type-{role}-{size}-font-weight`, `--vault-type-{role}-{size}-font-size`, `--vault-type-{role}-{size}-line-height`, and `--vault-type-{role}-{size}-letter-spacing`.
   - For shadows, export brand-tinted elevation tokens: `--vault-shadow-soft`, `--vault-shadow-medium`, and `--vault-shadow-hard`.

Include clean console logging indicating input file, output path, and completion status.
```

### Result & Audit:
The refined prompt produced `scripts/build-tokens.js`. When executed:
- Primitives were completely encapsulated within the Node compiler.
- All 19 semantic color roles dereferenced cleanly into valid hex strings.
- All 15 typographic roles exported complete atomic CSS declarations.
- All 3 brand-tinted shadows compiled accurately.
