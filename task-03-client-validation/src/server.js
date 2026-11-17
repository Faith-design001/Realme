const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3005;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // Log incoming HTTP requests
  console.log(`[HTTP ${req.method}] ${pathname}${parsedUrl.search} - ${new Date().toISOString()}`);

  // 1. Static Asset Delivery
  if (req.method === 'GET' && (pathname === '/' || pathname === '/auth')) {
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, must-revalidate',
      });
      res.end(data);
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/tokens.css') {
    const cssPath = path.join(__dirname, 'tokens.css');
    fs.readFile(cssPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('tokens.css not found');
      }
      res.writeHead(200, {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      });
      res.end(data);
    });
    return;
  }

  // 2. The Naive Agent Registration Endpoint (Task 03 Vulnerability Demonstration)
  // This endpoint deliberately lacks server-side Zod validation to prove that client-side validation
  // provides zero defense against direct HTTP requests.
  if (req.method === 'POST' && pathname === '/api/v1/agents/register') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const assignedId = crypto.randomUUID();

        console.log('[AGENT_REGISTRATION_RECEIVED]', JSON.stringify(payload));

        // Naive server accepts whatever was posted, returning HTTP 201 Created
        res.writeHead(201, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store, must-revalidate',
        });
        res.end(JSON.stringify({
          status: 'created',
          message: 'Agent registration record accepted',
          data: {
            id: assignedId,
            fullName: payload.fullName,
            email: payload.email,
            lasreraCode: payload.lasreraCode,
            createdAt: new Date().toISOString(),
          },
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
      }
    });
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`RealMe Task 03 Auth Server running on http://localhost:${PORT}`);
});
