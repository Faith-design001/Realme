// RealMe Task 05: Cryptographic Session Management, Middleware, NDPA Deletion & RBAC Server
// Brokerage: Realme Properties Ltd (Lekki, Lagos)

const http = require('http');
const crypto = require('crypto');
const url = require('url');

const PORT = 3007;

// 1. In-Memory Store mirroring PostgreSQL Schema with Seed Records
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$N=16384,r=8,p=1$${salt.toString('hex')}$${key.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  try {
    const parts = storedHash.split('$');
    const salt = Buffer.from(parts[2], 'hex');
    const originalKey = parts[3];
    const derivedKey = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(originalKey, 'hex'), Buffer.from(derivedKey, 'hex'));
  } catch (err) {
    return false;
  }
}

const db = {
  agents: [
    {
      id: '8f2b3e4a-912c-4e89-b1d5-aa728e94e501',
      tenantId: 'd0e8f7a6-b5c4-4d3e-8f2a-1b0c9d8e7f6a',
      fullName: 'Tunde Bakare',
      email: 'tunde.bakare@realme.ng',
      passwordHash: hashPassword('LekkiDeal2026!Secured'),
      lasreraCode: '748291',
      role: 'AGENT',
      status: 'ACTIVE',
      emailVerified: true,
      deletedAt: null,
      deletionScheduledFor: null,
      createdAt: '2026-09-15T08:30:00.000Z',
    },
    {
      id: '3c1d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
      tenantId: 'd0e8f7a6-b5c4-4d3e-8f2a-1b0c9d8e7f6a',
      fullName: 'Olumide Adeleke',
      email: 'adeleke.olumide@realme.ng',
      passwordHash: hashPassword('ManagingBroker!2026Secure'),
      lasreraCode: '109283',
      role: 'MANAGING_BROKER',
      status: 'ACTIVE',
      emailVerified: true,
      deletedAt: null,
      deletionScheduledFor: null,
      createdAt: '2026-08-01T09:00:00.000Z',
    },
    {
      id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
      tenantId: 'd0e8f7a6-b5c4-4d3e-8f2a-1b0c9d8e7f6a',
      fullName: 'Ibrahim Lawal',
      email: 'ibrahim.lawal@realme.ng',
      passwordHash: hashPassword('IbrahimLekki2026$#'),
      lasreraCode: '615243',
      role: 'AGENT',
      status: 'ACTIVE',
      emailVerified: true,
      deletedAt: null,
      deletionScheduledFor: null,
      createdAt: '2026-10-10T11:15:00.000Z',
    },
  ],
  sessions: [], // { id, agentId, sessionHash, ipAddress, userAgent, expiresAt, createdAt }
  escrowPayments: [
    {
      id: 'pay-001',
      agentId: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', // Ibrahim Lawal
      reference: 'REALME-ESCROW-2026-98124',
      amountKobo: BigInt(4100000000), // ₦41,000,000.00 (10% deposit on ₦410M listing)
      status: 'SETTLED',
      escrowClauseRef: 'CLAUSE-4B-TITLE-WARRANTY',
      settledAt: '2026-10-25T14:20:00.000Z',
    },
  ],
  dealKnowledgeChunks: [
    {
      id: 'chunk-101',
      authorAgentId: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
      listingAddress: 'Plot 14, Admiralty Way, Lekki Phase 1',
      category: 'VALUATION_RESERVE',
      chunkText: 'Seller bottom-dollar confidential reserve is ₦410,000,000. Do not quote below ₦435,000,000.',
      confidentiality: 'RESTRICTED_BROKER_ONLY',
    },
    {
      id: 'chunk-102',
      authorAgentId: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
      listingAddress: 'Plot 14, Admiralty Way, Lekki Phase 1',
      category: 'STRUCTURAL_DEFECT',
      chunkText: 'Sub-surface ground water seepage detected in eastern basement wall following September 2026 tidal surge.',
      confidentiality: 'CONFIDENTIAL_FIDUCIARY',
    },
  ],
  rateLimitMap: new Map(),
};

// 2. Cookie Parser & Security Utilities
function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (!rc) return list;
  rc.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  const rawToken = cookies['realme_session'];
  if (!rawToken) return null;

  const sessionHash = hashSessionToken(rawToken);
  const now = new Date();
  const session = db.sessions.find((s) => s.sessionHash === sessionHash && new Date(s.expiresAt) > now);
  if (!session) return null;

  const agent = db.agents.find((a) => a.id === session.agentId);
  if (!agent) return null;

  return { session, agent, rawToken };
}

// Rate Limiter: 5 attempts per 15 minutes per IP
function checkRateLimit(ip) {
  const now = Date.now();
  const record = db.rateLimitMap.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + 15 * 60 * 1000;
  }
  record.count += 1;
  db.rateLimitMap.set(ip, record);
  return record.count <= 5;
}

// 3. HTTP Request Dispatcher
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    let payload = {};
    if (body) {
      try { payload = JSON.parse(body); } catch (e) {}
    }

    // CORS & JSON Headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');

    // ROUTE: Health & Telemetry
    if (pathname === '/api/v1/health' && method === 'GET') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        status: 'HEALTHY',
        activeSessions: db.sessions.length,
        totalAgents: db.agents.length,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      }));
    }

    // ROUTE: POST /api/v1/auth/login
    if (pathname === '/api/v1/auth/login' && method === 'POST') {
      if (!checkRateLimit(clientIp)) {
        res.writeHead(429);
        return res.end(JSON.stringify({
          error: 'Rate limit exceeded: Maximum 5 login attempts per 15 minutes',
          retryAfterSeconds: 900,
        }));
      }

      const email = (payload.email || '').trim().toLowerCase();
      const password = payload.password || '';

      if (!email || !password) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'Email and password are required' }));
      }

      const agent = db.agents.find((a) => a.email === email);

      // Generic error check: Ensure attacker cannot enumerate whether email or password was wrong
      if (!agent || !verifyPassword(password, agent.passwordHash)) {
        res.writeHead(401);
        return res.end(JSON.stringify({
          error: 'Incorrect email or password',
          code: 'AUTH_CREDENTIALS_INVALID',
        }));
      }

      // Check if account is pending deletion
      if (agent.status === 'PENDING_DELETION') {
        res.writeHead(403);
        return res.end(JSON.stringify({
          error: 'Account is locked pending NDPA deletion grace period. Contact managing broker to cancel.',
          code: 'ACCOUNT_PENDING_DELETION',
          deletionScheduledFor: agent.deletionScheduledFor,
        }));
      }

      // Generate 256-bit cryptographic session token
      const rawSessionToken = crypto.randomBytes(32).toString('hex');
      const sessionHash = hashSessionToken(rawSessionToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days TTL

      const newSession = {
        id: crypto.randomUUID(),
        agentId: agent.id,
        sessionHash: sessionHash,
        ipAddress: clientIp,
        userAgent: req.headers['user-agent'] || 'RealMe-FieldAgent-Mobile',
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      };

      db.sessions.push(newSession);

      // Issue hardened session cookie with HttpOnly; Secure; SameSite=Lax
      res.setHeader('Set-Cookie', [
        `realme_session=${rawSessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 86400}`,
      ]);

      res.writeHead(200);
      return res.end(JSON.stringify({
        status: 'AUTHENTICATED',
        sessionId: newSession.id,
        sessionTokenPrefix: rawSessionToken.slice(0, 8) + '...',
        agent: {
          id: agent.id,
          fullName: agent.fullName,
          email: agent.email,
          lasreraCode: agent.lasreraCode,
          role: agent.role,
          status: agent.status,
        },
      }));
    }

    // ROUTE: GET /api/v1/auth/me (Current Session & Identity)
    if (pathname === '/api/v1/auth/me' && method === 'GET') {
      const auth = getSessionFromRequest(req);
      if (!auth) {
        res.writeHead(401);
        return res.end(JSON.stringify({ error: 'Unauthenticated: No valid session token presented' }));
      }

      res.writeHead(200);
      return res.end(JSON.stringify({
        authenticated: true,
        session: {
          id: auth.session.id,
          expiresAt: auth.session.expiresAt,
          ipAddress: auth.session.ipAddress,
        },
        agent: {
          id: auth.agent.id,
          fullName: auth.agent.fullName,
          email: auth.agent.email,
          role: auth.agent.role,
          status: auth.agent.status,
        },
      }));
    }

    // ROUTE: POST /api/v1/auth/logout (Server-side Session Revocation)
    if (pathname === '/api/v1/auth/logout' && method === 'POST') {
      const auth = getSessionFromRequest(req);

      // Reproduce offline / network failure edge case if requested
      if (parsedUrl.query.simulate_network_drop === 'true') {
        res.writeHead(504);
        return res.end(JSON.stringify({
          error: 'Gateway Timeout: Network dropped before server could delete session row',
          sessionRemainsActive: true,
        }));
      }

      if (auth) {
        // Atomic server-side revocation: Delete session row from database
        const index = db.sessions.findIndex((s) => s.id === auth.session.id);
        if (index !== -1) {
          db.sessions.splice(index, 1);
        }
      }

      // Expire browser cookie immediately
      res.setHeader('Set-Cookie', [
        'realme_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
      ]);

      res.writeHead(200);
      return res.end(JSON.stringify({
        status: 'LOGGED_OUT',
        serverRevocation: true,
        message: 'Session row deleted from database and browser cookie cleared',
      }));
    }

    // ROUTE: POST /api/v1/auth/reset-password (Password reset invalidates ALL sessions)
    if (pathname === '/api/v1/auth/reset-password' && method === 'POST') {
      const email = (payload.email || '').trim().toLowerCase();
      const newPassword = payload.newPassword || '';

      const agent = db.agents.find((a) => a.email === email);
      if (!agent) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: 'Agent not found' }));
      }

      agent.passwordHash = hashPassword(newPassword);

      // Invalidate ALL sessions belonging to this agent across all devices
      const sessionsBefore = db.sessions.length;
      db.sessions = db.sessions.filter((s) => s.agentId !== agent.id);
      const revokedCount = sessionsBefore - db.sessions.length;

      res.setHeader('Set-Cookie', [
        'realme_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
      ]);

      res.writeHead(200);
      return res.end(JSON.stringify({
        status: 'PASSWORD_RESET_SUCCESS',
        agentEmail: agent.email,
        allSessionsRevokedCount: revokedCount,
        message: 'Password updated. Every active session across all devices has been terminated.',
      }));
    }

    // ROUTE: POST /api/v1/auth/delete-account (NDPA Step 1: Immediate Lockout + 7-Day Grace Period)
    if (pathname === '/api/v1/auth/delete-account' && method === 'POST') {
      const auth = getSessionFromRequest(req);
      if (!auth) {
        res.writeHead(401);
        return res.end(JSON.stringify({ error: 'Authentication required to initiate account deletion' }));
      }

      const agent = auth.agent;
      const now = new Date();
      const scheduledDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Lock account immediately
      agent.status = 'PENDING_DELETION';
      agent.deletedAt = now.toISOString();
      agent.deletionScheduledFor = scheduledDate.toISOString();

      // Immediately revoke ALL sessions across all devices
      const revokedSessions = db.sessions.filter((s) => s.agentId === agent.id).length;
      db.sessions = db.sessions.filter((s) => s.agentId !== agent.id);

      // Clear cookie
      res.setHeader('Set-Cookie', [
        'realme_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
      ]);

      res.writeHead(200);
      return res.end(JSON.stringify({
        status: 'DELETION_SCHEDULED',
        agentId: agent.id,
        accountLocked: true,
        sessionsRevoked: revokedSessions,
        gracePeriodDays: 7,
        hardDeletionDate: scheduledDate.toISOString(),
        message: 'Account locked immediately. 7-day grace period initiated under NDPA Section 34.',
      }));
    }

    // ROUTE: GET /api/v1/admin/fiduciary-audit (Protected Admin Route with RBAC)
    if (pathname === '/api/v1/admin/fiduciary-audit' && method === 'GET') {
      const auth = getSessionFromRequest(req);

      // Step 1: Authentication Check (Are you logged in?)
      if (!auth) {
        res.writeHead(401);
        return res.end(JSON.stringify({
          error: 'HTTP 401 Unauthorized: Authentication required to view administrative route',
          code: 'UNAUTHENTICATED',
        }));
      }

      // Step 2: Authorisation Check (Do you have the MANAGING_BROKER role?)
      if (auth.agent.role !== 'MANAGING_BROKER') {
        res.writeHead(403);
        return res.end(JSON.stringify({
          error: 'HTTP 403 Forbidden: Access Denied. Managing Broker credentials required to view fiduciary audit ledgers.',
          code: 'INSUFFICIENT_PRIVILEGES',
          currentUserRole: auth.agent.role,
          requiredRole: 'MANAGING_BROKER',
        }));
      }

      // Authorized Access Granted to Managing Broker
      res.writeHead(200);
      return res.end(JSON.stringify({
        status: 'ACCESS_GRANTED',
        fiduciaryDossier: {
          brokerage: 'Realme Properties Ltd (Lekki Phase 1)',
          managingBroker: auth.agent.fullName,
          confidentialListings: [
            {
              property: 'Plot 14, Admiralty Way, Lekki Phase 1',
              publicAskPrice: 475000000,
              confidentialBottomDollarReserve: 410000000,
              escrowDepositHeld: 41000000,
              activeLitigationCaveat: "Lagos High Court Suit LD/2410/2025: Governor's Consent dispute with former developer.",
            },
          ],
          totalEscrowDepositsKobo: '4100000000',
        },
      }));
    }

    // Fallback 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: `Route ${method} ${pathname} not found` }));
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[REALME_TASK_05_SERVER] Listening on port ${PORT}`);
  });
}

module.exports = { server, db, hashSessionToken };
