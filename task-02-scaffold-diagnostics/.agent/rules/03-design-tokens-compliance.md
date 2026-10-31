# Rule 03: Design Tokens & Visual Hierarchy Compliance

## 1. Single Source of Truth
- All visual attributes (colors, elevation shadows, typography) originate exclusively from the canonical Figma token export: `task-01-design-system/evidence/06-tokens-complete.json`.
- The compiler script (`task-01-design-system/scripts/build-tokens.js`) generates the runtime CSS custom properties in `task-01-design-system/tokens.css`.

## 2. Zero Raw Hex Colors Rule
- **Rule**: Hardcoded hex colors (e.g. `#0D1F3D`, `#BA1A1A`, `#FFFFFF`) are strictly prohibited in application stylesheets (`*.css`).
- Every color rule must consume a `--realme-color-*` semantic token variable.
- Any pull request or commit containing raw hex colors in CSS fails CI/CD automated linting:
  ```bash
  git grep -E "#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b" -- "src/*.css" # Must return 0 matches
  ```

## 3. Strict Semantic Role Abstraction
- UI components consume **semantic roles**, never raw primitives:
  - Primary Action / Fiduciary Focus: `var(--realme-color-primary)`
  - Active / Ice Blue Highlights: `var(--realme-color-primary-container)`
  - Warning / Contingency Alerts: `var(--realme-color-warning-container)` & `var(--realme-color-warning)`
  - Structural / Hazard Alerts: `var(--realme-color-error-container)` & `var(--realme-color-error)`
  - Surface Background: `var(--realme-color-surface)` (`#FBFCFF`)
  - Body Text: `var(--realme-color-on-surface)` (`#181B24`)
  - Subtitle / Metadata: `var(--realme-color-on-surface-variant)` (`#2C3136`)
  - Dividers / Outlines: `var(--realme-color-outline-variant)` (`#C1C7CE`)

## 4. Elevation & Shadow Compliance
- Arbitrary CSS `box-shadow` values are strictly prohibited.
- All container elevations must strictly consume:
  - Flat Card: `var(--realme-elevation-level-1)`
  - Hover / Interactive: `var(--realme-elevation-level-2)`
  - Dropdown / Flyout: `var(--realme-elevation-level-3)`
  - Modal Dialog: `var(--realme-elevation-level-4)`
  - High-priority Toast: `var(--realme-elevation-level-5)`

## 5. Typography System Rules
- **Typeface Roles**:
  - `Plus Jakarta Sans`: Display (64px, 48px, 40px), Headlines (32px, 28px, 24px), Titles (22px, 16px, 14px), Labels (Large 14px, Medium 12px, Small 11px).
  - `JetBrains Mono`: Body records (Large 16px, Medium 14px, Small 12px) for tabular numbers, currency valuations (`₦450,000,000`), timestamps, and structural crack dimensions.
- **Line Height Mathematical Formula**:
  $$\text{Line Height} = \text{Font Size} \times 1.5$$
  (Display Large: 64px / 96px LH; Body Medium: 14px / 21px LH; Label Small: 11px / 16.5px LH).
- **Display Large Optical Tracking**: `-2.0px` (locks multi-digit Naira figures into a cohesive monetary stamp).
