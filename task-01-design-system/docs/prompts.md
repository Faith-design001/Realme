# RealMe Enterprise Design System: Agent Instruction Prompts & Telemetry

This document records the exact, verbatim prompts used to instruct the AI agent to convert `06-tokens-complete.json` into production CSS variables for RealMe, including the initial failed attempt, the failure mode, and the corrected final prompt.

---

## 1. Initial Prompt (Failed Attempt)

### Verbatim Prompt Sent to Agent:
```text
Write a Node.js script that converts evidence/06-tokens-complete.json into tokens.css.
Export all the colors, fonts, and shadows as CSS variables so we can use them in RealMe.
```

### What Went Wrong (The Failure Mode):
1. **Architectural Erosion (Primitive Leakage)**: The agent recursively flattened every token in the JSON file, including the primitive palettes. It generated:
   ```css
   --realme-color-primary0: #000000;
   --realme-color-primary40: #0D1F3D;
   --realme-color-neutral2: #181B24;
   ```
   By exposing primitive hex scales directly into `:root`, it allowed components to reference `--realme-color-primary40`. This breaks role-based theming: if dark mode is applied, components referencing `--realme-color-primary40` will not adapt, causing the design system to break.
2. **Unresolved Token Aliases**: The agent outputted the raw un-dereferenced alias strings:
   ```css
   --realme-color-primary: {primitive colors.color palette.primary.primary40}; /* Broken CSS syntax */
   ```
3. **8-Digit Hex and Alpha Mishandling**: The agent left raw 8-digit hex strings with alpha (e.g. `#0d1f3d1f` for shadows and `#0d1f3dff` for colors) uncleaned, leading to inconsistent browser parsing for box-shadows.

---

## 2. Refined Final Prompt (Working Solution)

### Verbatim Prompt Sent to Agent:
```text
You are an enterprise design systems engineer building the token compiler for RealMe Properties Ltd.
Write a standalone Node.js script at `scripts/build-tokens.js` that compiles `evidence/06-tokens-complete.json` into `tokens.css`.

You must enforce three strict architectural invariants:
1. SEMANTIC ROLES ONLY: Do NOT export primitive palette tokens (e.g. `primitive colors.*`) to CSS variables. Only export semantic roles defined under `color roles collection.color roles`. Every CSS variable must be named `--realme-color-{roleName}`. The primitive colors must remain internal to the token resolver and NEVER be made available to components.
2. RECURSIVE ALIAS RESOLUTION: The script must parse curly-brace alias references (e.g. `{primitive colors.color palette.primary.primary40}`) and resolve them to their ultimate clean 6-digit hex values (e.g. `#0D1F3D`).
3. ATOMIC TYPOGRAPHY & SHADOWS:
   - For all 15 typography styles in `schema.font`, export atomic custom properties: `--realme-type-{role}-{size}-font-family`, `--realme-type-{role}-{size}-font-weight`, `--realme-type-{role}-{size}-font-size`, `--realme-type-{role}-{size}-line-height`, and `--realme-type-{role}-{size}-letter-spacing`. Include proper font fallbacks (monospace for JetBrains Mono, sans-serif for Plus Jakarta Sans).
   - For shadows in `schema.effect`, convert hex-with-alpha colors (e.g. `#0d1f3d1f`) to valid `rgba()` format and export: `--realme-shadow-soft-shadow`, `--realme-shadow-medium-shadow`, and `--realme-shadow-hard-shadow`.

Include clean console logging indicating input file, output path, and completion status.
```

### Result & Audit:
The refined prompt produced `scripts/build-tokens.js`. When executed:
- Primitives were completely encapsulated within the Node compiler.
- All 44 semantic color roles dereferenced cleanly into valid hex strings.
- All 15 typographic roles exported complete atomic CSS declarations matching the exact Figma specifications.
- All 3 brand-tinted shadows compiled accurately into valid `rgba()` box-shadow definitions.
