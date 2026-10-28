# Realme Business Brief

## 1. THE BUSINESS

Realme Properties Ltd is a proposed mid-sized brokerage based in Lekki, Lagos. It has 400 active field agents, organized into teams managed by team leads, and one principal managing broker. It has a central office, while agents spend most days in the field. Deal facts sit across private messages, questionnaires, inspection reports, and legal correspondence. Staff cannot compare them reliably by hand.

## 2. THE USER

The primary user is a field agent aged 25 to 40. They use an inexpensive or mid-range Android smartphone and may use a basic work laptop in the office. Mobile connectivity is highly unstable, with erratic 3G or 4G data bundles in the field. Technical literacy is low to medium. They use WhatsApp and banking apps but are not technical users. Realme must use plain language, clear status messages, and minimal typing.

## 3. THE ONE THING THAT MUST WORK

**Absolute multi-tenant data isolation is non-negotiable.** A field agent may retrieve text chunks only from their own private listings and records, plus shared corporate policy cards allowed for their jurisdiction. Another agent’s private records must never enter retrieval results or an AI prompt. Enforce this at the database layer with owner-ID filters, forced PostgreSQL row-level security, and no global vector index for private chunks. Cross-agent data snooping must be mathematically impossible under the enforced access rules, not merely blocked by the interface.

## 4. THREE REPETITIVE QUESTIONS

1. What was the absolute bottom-dollar price the seller agreed to in our private pre-listing questionnaire for 45 Lekki Phase 1?
2. Did the structural engineer note any active foundation cracks or mold hazards in the unredacted July inspection report?
3. What specific escrow timeline penalties did our corporate legal counsel outline in the private broker-to-attorney email thread?

## 5. THE INTERFACE STRATEGY

The desktop-optimized web app must feel immediate and utility-driven. Agents may open Realme on a Tuesday evening between viewings, using a weak connection and a small screen. Do not make them start with a blank chat box. Show a cached dashboard first, with active listing counts and open compliance flags at the top. Put common query shortcuts below to reduce typing. Keep the dashboard snapshot server-side, show its last-updated time, and never cache private answers or records on the device. If the connection fails, explain what is unavailable instead of pretending the app works offline.
