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

