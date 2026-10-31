# Working Tree Manifest & Architectural Audit Trail

## RealMe Deal Intelligence Platform (Task 02 Scaffold)
**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**Author**: Antigravity Technical Architecture Team  
**Date**: October 31, 2026  

---

## 1. Directory Layout & File Manifest

```text
task-02-scaffold-diagnostics/
├── .agent/
│   ├── rules/
│   │   ├── 01-brand-identity.md           # Brand identity, Lekki context, Light Mode canvas
│   │   ├── 02-tenant-isolation-rls.md     # PostgreSQL RLS invariant, client storage ban
│   │   ├── 03-design-tokens-compliance.md # 100% tokens, 0 raw hex, typography math
│   │   ├── 04-scaffold-and-architecture.md# Web app form factor, sub-second boot, 3G optimization
│   │   └── 05-testing-and-diagnostics.md  # Anti-false-success, dependency checking, regression
│   └── skills/
│       ├── add-route.md                   # Direct skill file for adding secure RLS routes
│       └── add-route/
│           └── SKILL.md                   # Packaged Antigravity skill with frontmatter
├── docs/
│   ├── false-success.md                   # Failure boundary testing & dependency probing
│   ├── model-choices.md                   # Two-tier LLM evaluation & latency tradeoffs
│   ├── performance-note.md                # Cold boot benchmarks & 3G payload limits
│   ├── prd.md                             # Comprehensive Product Requirements Document
│   ├── readme-test.md                     # Fresh clone bootstrap verification runbook
│   ├── scaffold-prompt.md                 # Scaffold prompt engineering telemetry & checkpoint
│   └── working-tree.md                    # This file manifest and audit trail
├── evidence/                              # Visual proof sheets and regression artifacts
├── prisma/
│   └── schema.prisma                      # PostgreSQL multi-tenant schema with RLS models
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── diagnostics/route.ts       # Deep telemetry & dependency probe
│   │   │   └── health/route.ts            # Liveness health check endpoint
│   │   ├── globals.css                    # Zero raw hex global stylesheet
│   │   ├── layout.tsx                     # Next.js root layout with metadata & viewport
│   │   └── page.tsx                       # Responsive minimal Home Screen configuration
│   └── styles/
│       └── tokens.css                     # Compiled design tokens from Task 01
├── .env.example                           # Standard environment template
├── next.config.mjs                        # Next.js production configuration
├── package.json                           # Next.js, Prisma, TypeScript manifest
├── README.md                              # Task 02 system overview and execution guide
└── tsconfig.json                          # Strict TypeScript configuration
```

---

## 2. Invariant Compliance Checklist

- [x] **Strict Application Identity**: RealMe (Realme Properties Ltd, Lekki Lagos).
- [x] **Web Application Form Factor**: Zero-install browser web app over HTTPS.
- [x] **100% Token Consumption**: 0 raw hex values in application stylesheets and pages.
- [x] **Light Mode Canvas**: `--realme-color-surface: #FBFCFF`.
- [x] **PostgreSQL RLS Schema**: Multi-tenant models with foreign keys on `tenant_id` and `agent_id`.
- [x] **Anti-False-Success Diagnostics**: Deep dependency inspection via `/api/diagnostics`.

