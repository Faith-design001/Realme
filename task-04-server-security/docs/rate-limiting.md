# Rate Limiting Architecture, Counter Storage & Evasion Analysis

**Brokerage**: Realme Properties Ltd (Lekki, Lagos)  
**System**: RealMe Fiduciary Access Gateway (Task 04)  
**Author**: Antigravity Technical Architecture Team  
**Date**: November 17, 2026  

---

## 1. Rate Limiting Configuration & Justification

We enforce strict rate limits across all unauthenticated authentication endpoints:

| Endpoint | Threshold | Time Window | Failure Status | Architectural Justification |
| :--- | :---: | :---: | :---: | :--- |
| **Registration (`/api/v1/agents/register`)** | 5 requests | 60 minutes | **HTTP 429** | Blocks automated bot account creation while giving legitimate human agents ample attempts to complete onboarding. |
| **Login (`/api/v1/agents/login`)** | 5 attempts | 15 minutes | **HTTP 429** | Throttles online dictionary attacks; aligns with banking standards for credential protection. |
| **Password Reset (`/api/v1/agents/reset`)** | 3 requests | 60 minutes | **HTTP 429** | Prevents SMS/SMTP credit exhaustion and harassment of agents via repeated code dispatch. |

---

## 2. Why IP-Address-Based Limiting Alone Is Insufficient

Relying exclusively on the client's IP address (`req.ip` or `X-Forwarded-For`) is a critical security vulnerability:
1. **Trivial Attacker Evasion**:
   * An attacker using modern botnets, Tor exit nodes, or rotating residential proxy networks (e.g. Bright Data) rotates their apparent IP on every single HTTP request. An IP-based rate limiter never counts more than 1 attempt per IP, rendering the limiter completely ineffective.
2. **Header Spoofing**:
   * Unless the reverse proxy is hardened to strip untrusted upstream headers, an attacker can spoof client IPs simply by passing custom headers:
     ```bash
     curl -H "X-Forwarded-For: 102.89.23.44" http://localhost:3000/login
     curl -H "X-Forwarded-For: 102.89.23.45" http://localhost:3000/login
     ```

---

## 3. What Serious Applications Key On (Composite Rate Limiting)

Production enterprise platforms employ **Composite Keys** combining multiple entropy sources:
1. **The Target Account Identifier**: Rate limiting on `lowercase(email)`. Even if an attacker rotates across 10,000 distinct IP addresses, attempting to guess the password for `tunde@realme.ng` will lock out that specific account target after 5 attempts across any IP.
2. **Client Hardware Fingerprints**: Combining WebGL render hashes, canvas entropy, screen metrics, and TLS cipher suite fingerprints to detect automated headless browser instances regardless of reported IP.
3. **Subnet / ASN Aggregation**: Throttling across entire `/24` CIDR blocks or cloud hosting Autonomous System Numbers (ASNs) such as AWS, DigitalOcean, or Hetzner where legitimate mobile agents do not originate.

---

## 4. The Shared Campus / Corporate Wi-Fi Collateral Damage

* **The Problem**: In Lagos, multiple brokerage field agents frequently gather at shared co-working spaces or the Lekki Central branch office, sharing a single public NAT IP address.
* **The Collateral Damage**: If one careless agent forgets their password and triggers 5 failed login attempts from the office Wi-Fi, an IP-only rate limiter locks out the entire office. All 40 other agents connected to that router suddenly receive `HTTP 429 Too Many Requests`, halting brokerage operations.
* **The Solution**: Key login throttles primarily on `ip:target_email`. A failed attempt on agent A does not penalize agent B sharing the same office gateway.

---

## 5. Counter Storage: In-Memory vs Distributed Redis

* **Current Dev Implementation**: In-memory sliding-window counter map (`Map<string, { count, resetAt }>`).
  * *Trade-off*: Zero external dependencies, fast execution (~0.01ms), but counters are wiped whenever the Node server restarts or autoscales across multiple container instances.
* **Production Architecture**: Distributed Redis with atomic Lua scripts (`EVAL`) utilizing the Token Bucket or Sliding Window Log algorithm. Ensures consistent enforcement across horizontal server clusters.
