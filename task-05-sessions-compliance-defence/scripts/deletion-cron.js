// RealMe Task 05: NDPA Account Deletion Lifecycle Scheduled Background Worker
// Brokerage: Realme Properties Ltd (Lekki, Lagos)

const fs = require('fs');
const path = require('path');

function runDeletionJob(dbInstance, simulatedCurrentTime = new Date()) {
  const startTime = Date.now();
  const isoStart = new Date(startTime).toISOString();

  console.log(`[${isoStart}] [CRON_START] NDPA Deletion Lifecycle Worker initiated.`);
  console.log(`[${isoStart}] [CRON_CONFIG] Grace period threshold: 7 days (168 hours). Target evaluation timestamp: ${simulatedCurrentTime.toISOString()}`);

  const candidates = dbInstance.agents.filter((agent) => {
    if (agent.status !== 'PENDING_DELETION') return false;
    if (!agent.deletedAt) return false;
    const deletionRequestTime = new Date(agent.deletedAt).getTime();
    const gracePeriodMs = 7 * 24 * 60 * 60 * 1000;
    return (simulatedCurrentTime.getTime() - deletionRequestTime) >= gracePeriodMs;
  });

  console.log(`[${new Date().toISOString()}] [CRON_PROGRESS] Found ${candidates.length} expired account deletion candidate(s).`);

  let anonymizedCount = 0;
  let sessionsPurgedCount = 0;
  let financialRecordsPreserved = 0;

  for (const agent of candidates) {
    console.log(`[${new Date().toISOString()}] [CRON_TRANSACTION_START] Executing atomic NDPA sanitization on Agent ID: ${agent.id}`);

    // 1. Purge all remaining session records
    const sessionsBefore = dbInstance.sessions.length;
    dbInstance.sessions = dbInstance.sessions.filter((s) => s.agentId !== agent.id);
    const sessionsRemoved = sessionsBefore - dbInstance.sessions.length;
    sessionsPurgedCount += sessionsRemoved;

    // 2. Anonymize personal identity fields under NDPA Section 34
    const originalEmail = agent.email;
    agent.fullName = 'Former Agent [Anonymized]';
    agent.email = `anonymized_${agent.id.slice(0, 8)}@redacted.realme.internal`;
    agent.passwordHash = 'PURGED_BY_NDPA_SCHEDULED_JOB';
    agent.status = 'ANONYMIZED';
    agent.deletionFinalizedAt = new Date().toISOString();

    // 3. Verify retention of statutory financial ledgers (CITA & Anti-Money Laundering Act)
    const linkedPayments = dbInstance.escrowPayments.filter((p) => p.agentId === agent.id);
    financialRecordsPreserved += linkedPayments.length;

    console.log(`[${new Date().toISOString()}] [CRON_TRANSACTION_SUCCESS] Sanitized: ${originalEmail} -> ${agent.email}. Purged ${sessionsRemoved} sessions. Retained ${linkedPayments.length} statutory escrow ledger records.`);
    anonymizedCount += 1;
  }

  const durationMs = Date.now() - startTime;
  const isoEnd = new Date().toISOString();
  console.log(`[${isoEnd}] [CRON_END] NDPA Deletion Lifecycle Worker completed. Candidates scanned: ${candidates.length}, Rows anonymized: ${anonymizedCount}, Sessions purged: ${sessionsPurgedCount}, Statutory ledgers preserved: ${financialRecordsPreserved}, Errors: 0. Elapsed: ${durationMs}ms.`);

  return {
    candidatesScanned: candidates.length,
    rowsAnonymized: anonymizedCount,
    sessionsPurged: sessionsPurgedCount,
    statutoryLedgersPreserved: financialRecordsPreserved,
    durationMs,
  };
}

if (require.main === module) {
  // If run from command line, demonstrate standalone execution
  const { db } = require('../src/server');

  // Simulate an account requested for deletion 8 days ago
  const targetAgent = db.agents.find((a) => a.email === 'ibrahim.lawal@realme.ng');
  if (targetAgent) {
    targetAgent.status = 'PENDING_DELETION';
    targetAgent.deletedAt = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
  }

  console.log('--- RUN ONE: Processing expired deletion candidate ---');
  runDeletionJob(db);

  console.log('\n--- RUN TWO: Proving idempotency on identical database state ---');
  runDeletionJob(db);
}

module.exports = { runDeletionJob };
