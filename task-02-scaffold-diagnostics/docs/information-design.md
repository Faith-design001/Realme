# Information Design Specification: RealMe Platform Architecture

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Fiduciary Deal Intelligence Web Application  
**Author**: Antigravity Technical Architecture Team  
**Date**: October 31, 2026  

---

## 1. Executive Summary & Design Invariant

Information design is the intentional structuring of digital interfaces to minimize cognitive friction, eliminate redundant decisions, and guide field agents through high-stakes real estate transactions under erratic outdoor conditions in Lagos.

The interface is decoupled into two distinct structural domains:
1. **The Head (Metadata, Routing & Context Configuration)**: Governs browser context, dynamic document titles, Open Graph sharing cards, and SEO boundaries.
2. **The Body (Content Hierarchy & Layout Typography)**: Governs visual scanning patterns, responsive text wrapping, rem-based touch targets, and role-based design token consumption.

---

## 2. The Head: Configuration & Navigation Metadata

### A. Dynamic Document Title System
Rather than serving a static string across all views, Next.js metadata dynamically tracks the active route and workspace:
* **Root Configuration Route (`/`)**: `"RealMe | Fiduciary Deal Intelligence • Lekki Central"`
* **Diagnostic Telemetry Route (`/api/diagnostics`)**: `"RealMe Diagnostics | Engine & RLS Readiness"`
* **Deal Ingestion View (`/deals/[id]`)**: `"₦410,000,000 Listing Valuation | RealMe Lekki"`

### B. Concise Brand Tagline
Under ten words:
> *"Fiduciary real estate deal intelligence for Lagos field agents."* (9 words)

### C. Contextual SEO & Open Graph Tags
Configured inside `src/app/layout.tsx`:
```html
<title>RealMe | Fiduciary Deal Intelligence</title>
<meta name="description" content="Verified deal intelligence, title status, and structural caveats for 400 field agents in Lekki, Lagos." />
<meta property="og:type" content="website" />
<meta property="og:title" content="RealMe | Fiduciary Deal Intelligence" />
<meta property="og:description" content="Verified listing valuations and legal contingencies." />
<meta property="og:image" content="/og-preview.png" />
<meta name="robots" content="noindex, nofollow" /> <!-- Private internal tool: marketing SEO disabled on fiduciary routes -->
```
*Note on SEO*: Because RealMe is an internal, fiduciary platform housing confidential deal numbers (₦410M bottom-dollar seller reserve prices), public search indexing is actively blocked with `noindex, nofollow` on application routes, while public marketing landing pages carry curated metadata.

---

## 3. The Body: Visual Hierarchy & Cognitive Decision Reduction

### 1. Removing Redundancy (Visual De-cluttering)
* **What was removed**: In the preliminary header layout, an explicit text label stating `"RealMe Properties Ltd Logo"` sat adjacent to the stylized typographic mark `RealMe`.
* **Why removed**: The adjacent text created visual stutter and invited redirection confusion. Field agents on 5.5-inch Android screens scanning for valuation data do not need self-evident branding labels repeating the primary title mark.

### 2. Collapsing Unnecessary Decisions
* **Decision Collapsed**: On unauthenticated landing states, typical portals present two competing primary action buttons: `"Sign In"` and `"Request Workspace Account"`.
* **The Cognitive Cost**: Field agents in the field under direct sunlight should not be forced to pause and categorize their authentication state before accessing deal intelligence.
* **The Fix**: Collapsed into a single unified CTA: **`"Access Deal Workspace"`**. If the agent holds an active session cookie, the edge middleware routes them directly into their isolated tenant dashboard; if unauthenticated, it seamlessly routes to the single-page authentication view.

### 3. Heading Wrapping & Typography Clamping
Large display headings must not break unpredictably across narrow viewports:
* **Bad Wrap (Unconstrained)**: 
  `RealMe Internal Deal Intelligence & Transaction Web Application` breaks into awkward orphans (`"Application"` stranded on line 4).
* **Deliberate Constrained Wrap (`max-width: 580px`)**:
  Wraps deliberately into balanced, scannable typographic blocks:
  ```text
  RealMe
  Internal Deal Intelligence &
  Transaction Web Application
  ```
* **Fluid Typography via CSS Clamp**:
  Display Large uses fluid clamping to prevent horizontal viewport clipping on 320px screens:
  ```css
  font-size: clamp(2.25rem, 5vw + 1rem, 4rem); /* Scales smoothly from 36px to 64px */
  line-height: 1.5;
  ```

### 4. Button Padding in Rem Units (Accessible Touch Targets)
* Fixed pixel buttons (`width: 200px; height: 48px;`) truncate and clip text when users increase OS font scaling to 150% or 200%.
* **RealMe Button Sizing**:
  * **Vertical Padding**: `0.75rem` (12px base)
  * **Horizontal Padding**: `1.25rem` (20px base)
  * **Corner Radius**: `0.375rem` (6px — matching the subtle, authoritative enterprise elevation token)
  * **Touch Target Height**: Meets minimum accessibility guidelines ($\ge 44\text{px}$ / `2.75rem`) while expanding gracefully if agent font preferences increase.

### 5. Interaction & Feedback State
* All interactive elements explicitly declare `cursor: pointer` and visible focus-visible outline states:
  ```css
  button:focus-visible, a:focus-visible {
    outline: 2px solid var(--realme-color-primary);
    outline-offset: 2px;
  }
  ```
* Header logo mark acts as an unambiguous home anchor linking back to `/`.

