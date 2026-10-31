# Task 02: RealMe Scaffold & Diagnostics Engine

**Application**: RealMe (Fiduciary Deal Intelligence & Transaction Web App)  
**Organization**: Realme Properties Ltd (Lekki, Lagos, Nigeria)  
**Status**: Scaffolding Complete & Verified  

---

## 1. Overview

Task 02 establishes the foundational, high-performance web application scaffold and diagnostic engine for **RealMe**. It translates the design system tokens from Task 01 into an operational Next.js, TypeScript, and Prisma workspace built under strict operational invariants:

- **Strict Web Application Form Factor**: Zero-install, browser-based web application delivered over HTTPS.
- **Absolute Multi-Tenant RLS Data Isolation**: Mathematical isolation enforced at the PostgreSQL database engine layer.
- **Zero Raw Hex Colors**: 100% of UI styling consumes `--realme-*` custom CSS properties.
- **Light Mode Canvas**: Crisp off-white (`#FBFCFF`) optimized for harsh equatorial sunlight (3,000+ lux).
- **Anti-False-Success Diagnostics**: Deep telemetry inspecting active dependencies, returning HTTP 503 on service drops.

---

## 2. Directory Layout

- `.agent/rules/`: Five core operational context rules (Brand, RLS, Tokens, Scaffold, Testing).
- `.agent/skills/`: Skills runbook including `add-route` for adding RLS-guarded API endpoints.
- `docs/`: Technical telemetry documents (`prd.md`, `scaffold-prompt.md`, `model-choices.md`, `performance-note.md`, `false-success.md`, `readme-test.md`, `working-tree.md`).
- `prisma/`: Prisma PostgreSQL schema modeling multi-tenant isolation.
- `src/app/`: Next.js App Router root layout, minimal Home Screen, and `/api/diagnostics` / `/api/health` routes.
- `src/styles/`: Canonical compiled design tokens (`tokens.css`).

---

## 3. Quick Start & Execution

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Lint Design Tokens (Zero Raw Hex Gate)
```bash
npm run lint:tokens
```

### Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the minimal responsive Home Screen configuration layout.
Navigate to `http://localhost:3000/api/diagnostics` to inspect live system health and telemetry.

