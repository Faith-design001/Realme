# RealMe

## 1. What This Is
RealMe is an internal real estate transaction and deal intelligence platform for Realme Properties Ltd in Lekki, Lagos, designed for 400 mobile field agents to retrieve verified listing facts and legal contingencies where absolute multi-tenant data isolation under PostgreSQL Row-Level Security is mathematically enforced so cross-agent data leakage is impossible.

---

## 2. Status
- **Finished**: 
  - Task 01: Complete enterprise design system specification, 14-tone perceptual color palette with pinned `#0D1F3D` brand anchor (`primary40`), 15-style typography hierarchy (`Plus Jakarta Sans` for headers, `JetBrains Mono` for tabular records, `DM Sans` for micro labels), brand-pigmented atmospheric shadow system, token compiler pipeline (`build-tokens.js`), verified deal dashboard UI screen consuming 100% tokens and 0 raw hex values, machine-specific evidence sheets, prompt telemetry logs, deliberate unmerged regression branch test, and complete 12-question interview defence documentation.
- **Half Done**: 
  - Token distribution pipeline: Tokens compile locally to `tokens.css`; automated npm package publishing and Figma API synchronization webhook scheduled for Task 02.
- **Not Started**: 
  - Task 02: Full Next.js/Fastify backend scaffolding, development server diagnostics, and initial database migration setup.
  - Task 03: Client-side single-page registration forms, accessible error state handling, and endpoint attack verification.
  - Task 04: Server-side cryptographic password hashing (Argon2id), rate limiting, and background email verification.
  - Task 05: Session management, legal account deletion grace periods, retention matrix, and live viva defence.

---

## 3. The Stack, with Reasons
- **Design Tokens / DTCG Standard**: Chose W3C Design Tokens Community Group format (`06-tokens-complete.json`) rather than proprietary styles because it acts as an engine-agnostic single source of truth across web, mobile, and agent parsers.
- **Node.js (v24 LTS)**: Chose standard vanilla Node runtime for `build-tokens.js` rather than heavy third-party CLI tools (like Style Dictionary) to eliminate unnecessary dependency overhead and enable transparent, deterministic alias resolution.
- **Vanilla CSS Custom Properties**: Chose native CSS custom properties rather than Tailwind CSS or CSS-in-JS because CSS variables allow instantaneous zero-runtime theme and brand switching directly at the browser boundary without client bundle bloat on weak 3G Lagos cellular networks.
- **Plus Jakarta Sans, JetBrains Mono & DM Sans**: Chose `Plus Jakarta Sans` for punchy high-contrast display valuations under midday sun, `JetBrains Mono` for monospaced tabular deal facts and inspection caveats, and `DM Sans` for micro status chips.
- **Git Version Control**: Chose Git with strict branch isolation rather than trunk-only commits to enforce traceable, unmerged proof of deliberate regression tests and process evidence.

---

## 4. Getting Started
To verify the design tokens and run the RealMe deal dashboard from a fresh clone:

```bash
# 1. Clone repository
git clone https://github.com/faithojo/realme-vault.git
cd realme-vault

# 2. Navigate to task directory
cd task-01-design-system

# 3. Verify design token schema and compile tokens to CSS
node scripts/build-tokens.js

# 4. Audit codebase for raw color hex values (must output 0 matches)
git grep -E "#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b" -- "src/*.css"

# 5. Open the verified RealMe deal intelligence screen in your default browser
# On Windows:
Start-Process .\src\index.html
# On macOS:
open ./src/index.html
# On Linux:
xdg-open ./src/index.html
```

---

## 5. Environment Variables
- `NODE_ENV`: Runtime environment mode (`development`, `test`, `production`).
- `PORT`: Local development server port for dashboard preview (configured in Task 02).
- `DATABASE_URL`: PostgreSQL connection string with row-level security credentials (configured in Task 02).
- `TOKEN_SCHEMA_PATH`: Filesystem path to the canonical W3C token JSON export.
- `OUTPUT_CSS_PATH`: Target destination path for compiled CSS custom properties.

*(Note: In strict compliance with security protocols, zero values are committed to the repository).*

---

## 6. What This Deliberately Does Not Do
- **Does Not Export Primitive Color Tokens**: The compiler deliberately avoids exporting raw palette scales (`--realme-color-primary0`, `--realme-color-neutral2`) into `:root`. Exposing primitives allows developers and AI agents to hardcode shades directly into components, eroding the semantic design system.
- **Does Not Cache Private Listing Data Client-Side**: The dashboard does not store private pre-listing questionnaires or attorney notes in localStorage, IndexedDB, or service workers. On erratic Lagos 3G connections, caching private deal data on field smartphones violates our strict multi-tenant isolation mandate.
- **Does Not Provide Offline Mock Fallbacks for Private Data**: If the cellular connection drops, the application displays an explicit unavailable status rather than fabricating stale cached data that could mislead agents during price negotiations.
- **Does Not Support Arbitrary Ad-Hoc Typography**: The system deliberately omits utility classes for arbitrary font sizes (e.g. `text-[17px]`), forcing all text to map strictly to one of the 15 formula-derived typographic roles.

---

## 7. Known Defects
1. **Low-Contrast Card Partitioning (`tokens.css:55`)**:
   `--realme-color-outline-variant` is set to `#C1C7CE` (Neutral Variant 80). When evaluated against the primary surface canvas (`#FBFCFF`), the contrast ratio is 1.66:1, falling below WCAG 2.1 non-text boundary standards (3.0:1). On budget Android screens with TN displays under midday sun, container partitions wash out into an indistinct grey field.
2. **Unsanitized Font-Family Interpolation (`scripts/build-tokens.js:101`)**:
   The token compiler interpolates font family values using naive string wrapping `"${f.fontFamily}"`. If a designer exports a variable containing internal quotes or commas from Figma, the compiler emits malformed CSS syntax, causing browsers to drop the rule and fall back to user-agent default serif type.
3. **Fixed Pixel Button Padding (`src/styles.css:271`)**:
   Primary interactive buttons declare fixed padding in pixels (`10px 20px`) rather than rems (`0.625rem 1.25rem`). When low-vision agents increase OS font scaling to 200%, the button text scales up while container bounds stay fixed, truncating legal CTA buttons.
