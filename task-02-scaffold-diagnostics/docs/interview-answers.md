# Technical Interview Defence: Task 02 (Scaffold, Telemetry & Diagnostics)

**Candidate**: RealMe Technical Architecture Lead  
**Application**: RealMe (Fiduciary Deal Intelligence & Transaction Web App, Lekki Lagos)  
**Word Limit**: $\le 200$ words per answer.

---

### Section 1: Version Control & Architecture

#### 1. What is the difference between Git Flow and trunk-based development, and why have a lot of teams moved toward trunk-based?
Git Flow relies on long-lived, dedicated branches (`develop`, `feature/*`, `release/*`, `hotfix/*`) with infrequent, high-ceremony merge windows. This introduces significant "merge debt" and painful drift conflicts when multiple engineers work concurrently. 

Trunk-based development mandates that all engineers commit frequently—often multiple times daily—into a single shared branch (`main` or "trunk"), using short-lived feature branches ($\le 24$–48 hours) guarded by automated CI test suites and feature flags. 

Teams moved to trunk-based development because modern continuous integration and delivery (CI/CD) requires fast feedback loops. Long-lived branches defer conflict resolution until merge day, turning integration into an unpredictable blocker. Trunk-based development forces continuous, incremental integration, drastically reducing blast radiuses, eliminating multi-day merge nightmares, and ensuring production readiness at any given commit.

#### 2. What does git push --force actually do, and why is --force-with-lease generally safer?
`git push --force` (`-f`) instructs the remote Git server to blindly overwrite the target ref with your local commit pointer, completely discarding any commits on the remote branch that do not exist in your local branch history. If a teammate pushed commits to that branch after your last pull, `--force` permanently destroys their work on the remote without warning.

`git push --force-with-lease` provides an atomic guard rail. It checks that the remote ref matches your local remote-tracking ref (i.e. the state of `origin/branch` the last time you fetched). If someone else updated the branch in the interim, the lease check fails and the push is rejected. This prevents silent overwrites of collaborative commits while still permitting clean rebased history updates.

#### 3. Why is rewriting history, through rebase, amend or force push, dangerous on a shared branch?
Git commit hashes are cryptographic SHA-1/SHA-256 digests computed over the tree state, author, timestamp, and parent commit hash. Amending or rebasing modifies metadata, creating brand-new commit hashes even if file contents appear identical.

When you push rewritten history to a shared branch, teammates whose local branches track the original commits find their history diverged. Subsequent pulls produce messy merge loops, duplicate commit entries, or inadvertent re-introduction of discarded code. Furthermore, if continuous deployment pipelines triggered on the original commit SHA, auditing production deployments against repository history becomes unreliable. Rewriting history is strictly reserved for local, unpushed, or private feature branches.

#### 4. What is the difference between git merge and git rebase, and when would you actually pick one over the other?
`git merge` creates a non-destructive 3-way merge commit with two parents, tying the tip of a feature branch to the target branch while preserving the exact chronological sequence and topology of both branch histories.

`git rebase` replays your feature branch's commits sequentially on top of the target branch's latest commit, rewriting commit hashes to create a clean, linear, single-parent history.

**When to pick merge**: Use `git merge` (or GitHub squash-and-merge) when integrating a finished feature branch into `main` to preserve audit records of feature boundaries, or when preserving historical timestamps on shared collaboration branches.  
**When to pick rebase**: Use `git rebase` locally before opening a pull request to incorporate upstream `main` changes into your feature branch, keeping the commit graph linear and free of noisy *"Merge branch 'main' into feature"* commits.

#### 5. What causes a merge conflict, and what is actually happening in the file when you see the conflict markers?
A merge conflict occurs when Git attempts a 3-way merge between two divergent branches and their common ancestor, but finds that both branches have modified the exact same byte range in a file, or one branch deleted a file while the other modified it. Because Git operates deterministically on diff hunks, it cannot determine which human intent takes precedence.

When conflict markers appear (`<<<<<<<`, `=======`, `>>>>>>>`), Git has halted the merge and rewritten the working tree file to juxtapose the colliding changes:
* `<<<<<<< HEAD`: The version existing on your currently checked-out branch.
* `=======`: The midpoint separator.
* `>>>>>>> branch-name`: The incoming version from the branch being merged.
Until you edit the file to select the resolution and stage it, Git maintains the conflict state.

#### 6. What is the difference between the working directory, the staging area and the repository?
* **Working Directory**: The active sandbox on your local file system where you edit files. These changes are uncommitted and invisible to Git until scanned.
* **Staging Area (Index)**: A binary cache file (`.git/index`) recording exact file trees and SHA digests prepared for the next commit. It decouples editing from committing, allowing granular, atomic commits (`git add -p`).
* **Repository (Object Database)**: The immutable local database inside `.git/objects` holding compressed blobs, trees, commits, and tags. Once staged changes are committed (`git commit`), they become permanently recorded within the repository commit graph.

#### 7. What is branch protection, and what does it typically enforce?
Branch protection consists of administrative rules configured on remote repository hosts (e.g., GitHub) to enforce quality and security gates on critical branches (typically `main` or `production`).

It typically enforces:
1. **Mandatory Pull Requests**: Direct `git push` to `main` is blocked; all changes must pass PR review.
2. **Required Approvals**: Mandating code review approvals from designated code owners before merging.
3. **Passing CI Status Checks**: Requiring unit tests, token linters (`npm run lint:tokens`), and build scripts to exit with code 0.
4. **Blocking Force Pushes & Deletions**: Preventing `--force` history destruction or accidental branch deletion.
5. **Signed Commits**: Requiring verified GPG/SSH signatures to prevent author spoofing.

---

### Section 2: Forward Deployed Engineering & Architecture

#### 8. Walk me through a technical project you built end to end.
In RealMe, I architected the core deal intelligence engine for 400 field agents in Lekki, Lagos. Agents needed to verify seller bottom-dollar reserve prices (e.g., ₦410,000,000) and foundation crack logs while standing in front of high-net-worth buyers under midday glare. 

I established the mathematical design token architecture from Figma variables, anchoring the palette to pinned Primary 40 Navy (`#0D1F3D`) with WCAG AAA contrast (16.76:1) and a $1.5\times$ typographic hierarchy. I then scaffolded a Next.js 14 App Router workspace with strict TypeScript and Prisma ORM targeting multi-tenant PostgreSQL Row-Level Security. To ensure resilience over erratic Lagos 3G cellular connections, I optimized the production bundle to 87.2 kB First Load JS and built anti-false-success diagnostic endpoints enforcing zero client-side caching.

#### 9. Tell me about a time when something you built broke in production.
On our Next.js 14 build pipeline running on Node 24, our production static site generation worker threads crashed with an out-of-memory error (`FATAL ERROR: Re-embedded zone allocation failed`). The build failed silently in CI while dev mode was operational.

I isolated the root cause to Node 24’s V8 memory management interacting with Next.js multi-threaded child workers during static page generation. Rather than masking the issue, I pinned `--max-old-space-size=4096` in the build script and configured `experimental: { cpus: 1, workerThreads: false }` inside `next.config.mjs`. This stabilized worker compilation and allowed us to ship a deterministic 87.2 kB production build without risking deployment crashes.

#### 10. How do you approach learning a new technical platform or codebase quickly when starting a new engagement?
I approach codebases from boundaries inward, using a three-phase diagnostic triage:
1. **The Entry & Exit Boundaries**: I inspect the package manifest, environment variables (`.env.example`), entrypoints (`middleware.ts`, `layout.tsx`), and CI/CD pipelines to understand runtime boundaries and deployment invariants.
2. **The Data & Storage Layer**: I read the relational schema (`schema.prisma` or migration SQL) to map entity relationships, foreign keys, and security barriers (e.g., Row-Level Security tenancy). Data shape dictates application behavior.
3. **Execution Tracing with Active Breakage**: I deliberately alter an input parameter or break an endpoint to observe error handling, logging fidelity, and whether the system fails cleanly or masks failures with false successes.

#### 11. What is the difference between code that is correct and code that is complete?
* **Correct Code**: Satisfies the happy path of the specification. It compiles without syntax errors, processes expected input types, and returns valid responses under optimal conditions.
* **Complete Code**: Accounts for the operational realities of production. It handles database socket drops, enforces timeouts, rejects malformed payloads at the network boundary, emits structured machine logs, respects idempotency on retry storms, satisfies accessibility criteria for assistive tech, and fails closed when security context is absent. Correct code works in a demo; complete code survives unattended production.

#### 12. How do you design software for a customer who will need to maintain it after you are gone?
1. **Self-Documenting Architectural Invariants**: Encode rules as executable assertions rather than wiki pages—such as an automated token linter (`npm run lint:tokens`) blocking unapproved hex codes in CI.
2. **Zero-Magic Dependencies**: Avoid complex, undocumented custom abstractions. Rely on standard, well-typed idioms (standard Next.js App Router, Prisma ORM, vanilla CSS custom properties).
3. **Deterministic Runbooks & Failure Playbooks**: Author a comprehensive `README.md` and `docs/readme-test.md` verified on fresh clones, explicitly listing environment flags, error codes, and recovery procedures for inevitable dependency failures.

---

### Section 3: Assessment Telemetry & False-Success Analysis

#### 13. Your first page load took a specific number of milliseconds. Where did that time go? Name the parts you can measure and the parts you are guessing about.
Our empirical first page load clocked **10,420 ms**, while subsequent reloads dropped to **42 ms**. 

**Parts Measured**:
* Dev Server Bootstrap: **1.8 s** (Next.js 14 engine initialization).
* Route Compilation: **940 ms** (482 TypeScript modules compiled to memory ASTs).
* Static CSS Transmission (`layout.css`): **45 ms**.
* Static JS Transmission (`page.js`): **120 ms**.

**Parts Inferred / Unmeasured Breakdown of the Residual Window**:
The remaining ~8.4 seconds were spent on on-demand Just-In-Time (JIT) dependency graph parsing, Tailwind utility scanning, Node v24 module resolution on Windows, and Prisma Client's lazy database connection pool handshake. In production builds (`npm start`), these compilation steps are completely eliminated at build time, yielding steady-state responses $\le 45\text{ms}$.

#### 14. Your application reported success to the user while writing nothing to the database. Explain the mechanism that allowed that, and name the one check that would have caught it in thirty seconds.
This failure occurred because the route handler returned an `HTTP 200 OK` or optimistic UI state inside a `try/catch` block that caught a database rejection (`ECONNREFUSED` / missing client), logged it passively to `console.log`, and returned an empty success payload `{ status: "ok" }`. The browser received an HTTP 200 and displayed a green confirmation banner, while zero rows were inserted.

**The 30-Second Check**: Inspecting the raw server network tab or logs for the absence of an **`HTTP 201 Created`** status code and querying the database directly:
```sql
SELECT COUNT(*) FROM listings;
```
If the count remains unchanged after submission, the success is illusory.

#### 15. Wrong-Answer Analysis: A candidate says: "I always check my app is working by signing up a test user and confirming I get taken to the dashboard. If the dashboard loads, the backend is working." Say what is wrong with this, what it would miss, and what you would do instead.
**What is wrong**: This test conflates client-side UI navigation with backend state mutation. A client-side router (like Next.js `useRouter().push('/dashboard')`) can transition pages purely on an unhandled promise or a mock token stored in browser memory, completely disconnected from backend persistence.

**What it misses**:
1. It misses database socket disconnects, unapplied migrations, and silent transaction rollbacks.
2. It misses whether password hashing, audit timestamps, and tenant IDs were actually recorded.
3. It misses whether Row-Level Security policies isolate that user from other accounts.

**What to do instead**: Check the live HTTP response code (must be `201 Created`, never a masked `200`), verify the database inspector row by UUID and timestamp, and execute the negative test (breaking the database to confirm the UI fails explicitly with HTTP 503).

