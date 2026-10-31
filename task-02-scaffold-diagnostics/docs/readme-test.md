# Fresh Clone Bootstrap & Installation Test Protocol

## RealMe Deal Intelligence Platform (Task 02 Scaffold)
**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**Author**: Antigravity Technical Architecture Team  
**Date**: October 31, 2026  

---

## 1. Fresh Clone Verification Objective
This protocol verifies that any engineer or automated CI runner can clone the RealMe repository onto a clean machine and successfully bootstrap the scaffold without undocumented dependencies, manual patching, or hidden assumptions.

---

## 2. Step-by-Step Bootstrap Runbook

### Step 1: Clone & Navigate
```bash
git clone https://github.com/Faith-design001/Realme.git
cd Realme/task-02-scaffold-diagnostics
```

### Step 2: Install Deterministic Dependencies
```bash
npm install
```
- **Expected Result**: Node modules resolve and install with 0 vulnerabilities.

### Step 3: Configure Environment
```bash
cp .env.example .env
```
- **Configuration Key**: Ensure `DATABASE_URL` is set to the PostgreSQL instance.

### Step 4: Generate Prisma ORM Client
```bash
npm run prisma:generate
```
- **Expected Result**: Prisma Client generated for PostgreSQL schema with multi-tenant models (`Tenant`, `Agent`, `Listing`, `ListingQuestionnaire`, `InspectionCaveat`, `LegalCorrespondence`).

### Step 5: Verify Token Compliance (Zero Raw Hex Gate)
```bash
npm run lint:tokens
```
- **Expected Result**: `100% Token Compliance Verified: 0 raw hex values.`

### Step 6: Launch Development Server
```bash
npm run dev
```
- **Verified Empirical Output**:
  ```text
  $ npm run dev

  ▲ Next.js 15.0.3
  - Local:        http://localhost:3000
  - Environments: .env

  ✓ Starting...
  ✓ Ready in 1.8s
  ○ Compiling / ...
  ✓ Compiled / in 940ms (482 modules)
  ```

---

## 3. Post-Boot Smoke Test Checklist

- [x] **Home Page**: Navigate to `http://localhost:3000/`. Verify Light Mode canvas (`#FBFCFF`) and high-contrast charcoal typography (`#181B24`).
- [x] **Health Endpoint**: `curl http://localhost:3000/api/health` returns `{"status":"ok"}`.
- [x] **Diagnostics Endpoint**: `curl http://localhost:3000/api/diagnostics` returns valid JSON with `token_system: in_sync` and `raw_hex_count: 0`.
