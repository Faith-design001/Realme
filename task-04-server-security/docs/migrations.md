# Migration Philosophy, Schema Drift & Deliberate Execution

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Fiduciary Deal Platform (Task 04)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. Core Principles: Why Forward-Only Migrations?

A database migration is an immutable, ordered instruction given to the database engine to transition storage structures from version $N$ to version $N+1$.

### Principle 1: Forward-Only Discipline (No Rollback Scripts)
In production enterprise architectures, database migrations are strictly **forward-only**:
* You never run `DOWN` migrations in production.
* If a migration introduces a bug, you write a new migration ($N+1$) that repairs or alters the structure forward.
* *Why*: "Rollback" scripts are dangerous illusions. In an active production system with concurrent transactions, rolling back a schema drops newly inserted columns and permanently destroys live user data generated while the migration was active.

### Principle 2: Never Edit a Migration That Has Already Run
Once a migration file (`20261117_add_agents.sql`) has been applied to any environment (staging or production), its content is permanently immutable:
* The ORM tracks applied migrations via an internal metadata table (`_prisma_migrations`) recording the SHA-256 checksum of the migration file.
* If a developer edits an existing migration file, the checksums diverge. The ORM halts with a fatal checksum mismatch error, blocking all future releases across the team.

### Principle 3: Keep AI Agents Out of Database Migrations
Our governance rules strictly prohibit AI agents from executing migration commands (`prisma migrate dev` or `prisma migrate deploy`):
* Agents lack situational awareness of live data volumes and lock contention risks.
* An agent prompted to "make a column required" will gladly execute `ALTER TABLE agents ADD COLUMN bvn VARCHAR(11) NOT NULL`, instantaneously crashing the database on populated tables.
* Migrations must be designed by human engineers, reviewed via pull requests, and executed deliberately.

**The Honest Cost of This Choice**: Running migrations manually is undeniably slower. It introduces human friction into deployment pipelines, and when team members forget to run a migration after pulling code, local environments throw schema drift errors until manual intervention occurs.

---

## 2. The 3-Step Pattern for Adding Required Columns to Populated Tables

Attempting to add a non-nullable (`NOT NULL`) column to a table with existing rows fails immediately:
```sql
ALTER TABLE agents ADD COLUMN bvn_verified BOOLEAN NOT NULL;
-- ERROR: column "bvn_verified" contains null values
```

### The Production 3-Step Migration Solution
1. **Step 1: Add Column as Optional (Nullable)**:
   ```sql
   ALTER TABLE agents ADD COLUMN bvn_verified BOOLEAN DEFAULT NULL;
   ```
   *The migration succeeds without locking tables or violating null constraints.*
2. **Step 2: Backfill Data for All Existing Rows**:
   ```sql
   UPDATE agents SET bvn_verified = false WHERE bvn_verified IS NULL;
   ```
   *Populates every legacy record with a deterministic default.*
3. **Step 3: Alter Column Constraint to NOT NULL**:
   ```sql
   ALTER TABLE agents ALTER COLUMN bvn_verified SET NOT NULL;
   ```
   *Enforces schema strictness for all future transactions without dropping existing data.*

---

## 3. Schema Drift: Cause, Detection & Resolution

### What Is Schema Drift?
Schema drift occurs when the ORM's in-memory TypeScript definitions diverge from the physical database engine state:
1. A developer modifies `schema.prisma` (e.g. adding a new field `referralCode`).
2. They run `prisma generate` (which rebuilds the `@prisma/client` TypeScript types in memory).
3. They start the application *without* running `prisma migrate dev`.
4. The application executes: `prisma.agent.findFirst({ select: { referralCode: true } })`.
5. **The Crash**: PostgreSQL throws: `P2021: The table or column does not exist in the current database`.

**The Resolution**: Re-align physical database state with ORM types by generating and applying the explicit migration file before starting the runtime process.
