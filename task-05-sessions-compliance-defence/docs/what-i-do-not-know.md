# Architectural Boundaries: What I Do Not Know

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Fiduciary Deal Platform (Task 05)  
**Author**: Antigravity Technical Architecture Lead  
**Date**: November 17, 2026  

---

## 1. Overview: The Discipline of Locating Technical Ignorance

Engineering maturity is defined by the ability to delineate precisely where your verified knowledge ends and where assumptions begin. Per assessment specifications, this document details **eight concrete technical mechanisms** within the RealMe stack that I currently do not fully understand, explaining how I know I do not understand them, and the specific research or experimentation required to master them.

---

### 1. Database Lock Escalation During Zero-Downtime PostgreSQL Schema Alterations
* **What It Is**: How PostgreSQL manages AccessExclusiveLocks when executing `ALTER TABLE agents ADD COLUMN ...` on high-concurrency production databases with active transactions.
* **How I Know I Do Not Understand It**: While I know the 3-step migration pattern avoids default-value rewrites, I cannot predict at what transaction queue depth PostgreSQL will queue incoming `SELECT` queries behind an `AccessExclusiveLock`, causing connection pool exhaustion during a migration.
* **What I Would Need to Learn It**: Set up a local test harness using `pgbench` to simulate 500 concurrent read/write transactions per second, execute concurrent DDL migrations, and inspect `pg_locks` and `pg_stat_activity` to observe queue starvation in real time.

### 2. Transactional Atomicity Failure in Partial ORM Migrations
* **What It Is**: The exact recovery state of PostgreSQL and Prisma when a multi-statement DDL migration script fails halfway through execution.
* **How I Know I Do Not Understand It**: PostgreSQL supports transactional DDL (`BEGIN ... COMMIT`), meaning most migrations roll back cleanly on error. However, certain operations (like creating indexes concurrently: `CREATE INDEX CONCURRENTLY`) cannot run inside a transaction block. If a multi-statement migration fails after a non-transactional index creation, I do not know how Prisma marks the migration state in `_prisma_migrations` without inspecting the ORM engine source code.
* **What I Would Need to Learn It**: Deliberately author a flawed multi-step migration mixing `CREATE INDEX CONCURRENTLY` with a failing `ALTER TABLE` statement, inspect the `_prisma_migrations` table, and execute manual resolution commands (`prisma migrate resolve`).

### 3. Distributed Redis Rate Limiting Under Split-Brain Network Partitions
* **What It Is**: How distributed rate limiting algorithms (e.g. Redis sliding window with Lua scripts) behave when a network partition isolates multiple Redis replicas.
* **How I Know I Do Not Understand It**: While I can implement sliding-window rate limiting on a single Redis instance, I do not understand how Redis Sentinel or Redis Cluster handles counter increments during asynchronous replication lag. If node A accepts 3 requests and node B accepts 3 requests before replicating, an attacker could burst 6 requests past the limit.
* **What I Would Need to Learn It**: Deploy a multi-node Redis cluster with simulated network partitions (using Jepsen or Linux `iptables` packet dropping) and benchmark counter synchronization latency under partition conditions.

### 4. Kernel-Level CryptoAPI Entropy Depletion Under Massive Concurrent Code Generation
* **What It Is**: How the Windows CryptoAPI / Linux `/dev/urandom` kernel pools manage entropy under high-concurrency spikes generating thousands of verification codes simultaneously.
* **How I Know I Do Not Understand It**: I know `crypto.randomInt` calls the operating system's CSPRNG, but I do not know the exact kernel threshold at which Windows CSPRNG locks or degrades performance if thousands of worker threads request entropy in the same millisecond.
* **What I Would Need to Learn It**: Write a multi-threaded Node.js cluster script invoking `crypto.randomInt` 1,000,000 times concurrently across worker threads and profile CPU wait times and OS entropy pool exhaustion metrics using Windows Performance Monitor.

### 5. Legal Enforceability of Cryptographic Hashes Under the Nigerian Evidence Act 2011
* **What It Is**: The legal admissibility of digital SHA-256 session audit logs and bank audit stamps in a Nigerian High Court commercial property litigation.
* **How I Know I Do Not Understand It**: While I understand the mathematical properties of cryptographic hashing, Section 84 of the Nigerian Evidence Act mandates strict conditions for admitting computer-generated evidence, including certificates of compliance signed by system managers. I do not know whether a judge would accept our digital retention logs as conclusive proof without a physical subpoena of the AWS database server.
* **What I Would Need to Learn It**: Conduct a formal consultation with a Nigerian litigation attorney specializing in electronic evidence and land law arbitration to review our audit schema.

### 6. Cron Job Failover Behavior During Unscheduled Server Container Restarts
* **What It Is**: What happens to scheduled background tasks (such as our 7-day hard deletion cron job) when the host container crashes or restarts exactly at the scheduled execution window.
* **How I Know I Do Not Understand It**: In our current implementation, the deletion job runs on a local Node timer (`setInterval`). If the container restarts or crashes at 02:00 AM when the job is scheduled, the execution tick is lost until the next interval. I do not know how to design a distributed lock with stateful leader election in Kubernetes without adding complex orchestrators.
* **What I Would Need to Learn It**: Study distributed job schedulers like Temporal or pg_cron, and simulate container termination during scheduled triggers to test automated catch-up semantics.

### 7. V8 Garbage Collector De-Optimization During Large In-Memory Token Audits
* **What It Is**: How the Node.js V8 garbage collector handles memory compaction when parsing large JSON datasets (like checking 10,000 token styles against regex).
* **How I Know I Do Not Understand It**: In Task 02, we hit a V8 memory crash (`FATAL ERROR: Re-embedded zone allocation failed`). While I solved it by single-threading workers and expanding old-space-size to 4096MB, I do not understand the internal C++ heap pointer structures that caused V8 to crash rather than gracefully compacting memory.
* **What I Would Need to Learn It**: Run Node.js with `--trace-gc` and profile heap snapshots inside Chrome DevTools Memory Inspector during large compilation workloads.

### 8. Session Cookie Revocation Across Active Distributed HTTP/2 Multiplexed Connections
* **What It Is**: How HTTP/2 and HTTP/3 connection multiplexing affects instantaneous server-side session revocation.
* **How I Know I Do Not Understand It**: Under HTTP/2, a browser holds a single persistent TCP connection open and multiplexes dozens of concurrent requests over streams. When the server deletes a session row and sends a `Set-Cookie` expiration header on stream 3, I do not know if in-flight requests on stream 5 already past the middleware layer can still execute before the connection terminates.
* **What I Would Need to Learn It**: Set up an HTTP/2 server with multiplexed stream benchmarks, fire concurrent read requests while issuing a logout command, and trace the exact millisecond boundary where in-flight requests fail.
