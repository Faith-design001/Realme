# Rule 04: Scaffold & Technical Architecture Guidelines

## 1. Web Application Platform & Minimal Footprint
- **Form Factor**: Strictly a **Browser-Based Web Application** delivered over HTTPS. No native mobile wrappers, no APKs, and no heavy runtime app bundles.
- **Target Audience Constraint**: 400 field agents and managing brokers in Lagos accessing the web app across desktop laptops and mobile web browsers (Chrome/Blink/WebKit) on weak 3G cellular connections.
- **Rule**: Minimize client-side bundle size ($\le 120\text{KB}$ total payload). Avoid heavy frontend monolithic runtimes, bloated UI kits, or large runtime CSS-in-JS libraries.
- Prefer vanilla semantic HTML5, native CSS Custom Properties, and lightweight deterministic JavaScript/TypeScript modules.

## 2. Server Architecture & Telemetry
- **Runtime**: Node.js (v24 LTS Runtime).
- **Development Server Requirements**:
  - Sub-second bootstrap startup time.
  - Standard development port: `PORT=3000`.
  - Transparent diagnostic health check endpoints (`/health`, `/diagnostics`).
  - Structured JSON logging with ISO-8601 timestamps and request correlation IDs.
  - Zero unhandled promise rejections or silent exit codes.
- **Database Access Layer**:
  - Direct PostgreSQL driver with connection pooling.
  - Explicit session context setting on every client connection before executing queries (`SET LOCAL app.current_tenant_id = ...`).

## 3. WCAG Accessibility Mandate
- Meet **WCAG 2.1 AA** standards across all screens (contrast ratio $\ge 4.5:1$ for normal text, $\ge 3.0:1$ for UI components and borders).
- Key financial valuations and inspection alerts must meet **Level AAA** ($16.4:1+$ contrast).
- All interactive controls must use native semantic HTML (`<button>`, `<a>`, `<input>`) with full keyboard accessibility (`Tab`, `Enter`, `Space`) and visible focus indicators.
