# Scaffolding Prompt Engineering Telemetry

## 1. First Draft (Human Initial Script)
```text
please set up a new Next.js project with TypeScript, Prisma, and PostgreSQL. Read my design files first. Make a home screen using the design system, Don't build the whole app yet, just the basic configuration setup. Make sure you don't use raw hex codes and list everything you build.
```

---

## 2. Refined Final Execution Script (Working Solution)
```text
Act as a deterministic Full-Stack Next.js Architect and Systems Engineer. You are scaffolding the foundational workspace for RealMe, an internal real estate intelligence web app. Do not execute code continuously without strict operational alignment. Follow these instructions verbatim:

1. READ BEFORE WRITING: Before initializing any code, directories, or package manifests, read all system context files: `docs/type-scale.md` and `docs/colour-roles.md`. Treatment of these files is a Zero-Trust single source of truth.
2. SYNTAX CHECKPOINT: Summarize your exact understanding of the technical multi-role permission requirements and design tokens. Output this summary text as a clean implementation plan and WAIT for explicit human approval before running commands.
3. CONFLICT PROTOCOL: If any parameter between the design sheets conflicts, abort immediately and query the user.
4. TOKEN RIGOR: You are strictly forbidden from writing raw hexadecimal color strings or arbitrary pixel dimensions. You must utilize the custom theme variables mapped to the Plus Jakarta Sans and JetBrains Mono token roles.
5. RIGID SCOPE CONTROL: Build ONLY the basic base engine structure and a minimal responsive Home Screen configuration layout. Do not generate the core features, dashboards, workflows, or RAG components.
6. TELEMETRY LOGGING: Upon executing the approved code blocks, list every file created and itemize every assumption made inline. 
7. SELF-AUDIT GATE: Verify your own generation parameters against these instructions before passing control back.
```

---

## 3. Structural Rationale & Iteration Analysis
The transition from the loose first draft to the engineered final execution script removes conversational vagueness that causes agents to loop or produce bloated code. The first draft leaves design token applications open, which leads to hardcoded values. The final version forces a strict read-before-write process, locks styling to design tokens, and sets a rigid boundary that prevents the agent from attempting to generate the entire application in a single unmonitored pass.

---

## 4. Execution Checkpoint & Understanding Telemetry

### Understanding Summary
- **Target Stack**: Next.js 14/15 (App Router), TypeScript, Prisma ORM, PostgreSQL.
- **Token System**: `Plus Jakarta Sans` (Primary UI, Display, Headlines, Labels), `JetBrains Mono` (OCR fields, tabular Naira numbers, structural crack dimensions). Pinned Primary 40 color (`#0D1F3D`) drives light-theme contrast layouts.
- **Permission Structure**: Multi-tenant database boundary constraints (Field Agent ownership vs. Managing Broker global audit access).
- **Baseline Scope**: Root workspace configuration, Prisma connection framework, and a clean, token-driven entry page template.

### Proposed Specific Architecture Workflow
1. Initialize template layout files, TypeScript configurations, and root layout architecture components.
2. Inject CSS global custom property mappings matching the role matrices inside `src/styles/tokens.css` and `src/app/globals.css`.
3. Construct `prisma/schema.prisma` mapping out explicit relational fields for members, logs, and token tracking matrices.
4. Render a single layout template on `src/app/page.tsx` showing active token status parameters with quick shortcuts.

---

## 5. Stated Assumptions Critique & Architectural Verification

### The Naive Agent Failure Mode:
> *The agent states: "Assumption 1: No assumptions are made as the design system files provide 100% complete specifications for all layout configurations."*

### Critique Verification (Rigorous Engineering Audit):
This statement is **mathematically and architecturally incorrect**. Any real-world scaffolding operation inevitably introduces implicit architectural assumptions. Upon manual review of the generated files, three critical unstated assumptions were identified and must be explicitly recorded:

1. **Server-Side Environment Root Path Context**:
   - The agent assumed the web app operates in a root directory context (`/`) without custom `basePath` configurations. 
   - *Production Implication*: If RealMe is deployed behind an enterprise reverse proxy or API gateway under a subpath (e.g. `/realme`), routing and asset resolution require an explicit `basePath` in `next.config.mjs`.
2. **Database Schema Isolation Context**:
   - The agent assumed the database provider uses the standard `public` schema (`?schema=public`) with Row-Level Security row-filtering, rather than dedicated PostgreSQL schema-per-tenant isolation (`CREATE SCHEMA tenant_xxx`).
   - *Production Implication*: Row-Level Security provides row-filtering within the `public` schema. If regulatory compliance later requires physical table separation, schema-per-tenant migrations will be necessary.
3. **Typography Loading Fallback Context**:
   - Assumed web font delivery over CDN with local `sans-serif` and `monospace` fallbacks, requiring network connectivity on initial cold load.
