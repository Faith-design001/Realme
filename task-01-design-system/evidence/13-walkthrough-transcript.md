# 13: Typographic Walkthrough Telemetry Transcript (Optional Bonus Marks)

Timestamped against evidence assets: `evidence/03-spacing-default.png` and `evidence/04-spacing-chosen.png`.
Recorded by: Faith Ojo (RealMe Properties Ltd / RealMe Design System)

---

### [00:00 - 00:45] Overview of RealMe 15-Style Typographic Hierarchy
- Typography Foundation: `Plus Jakarta Sans` (Display/Headline/Title/Label), `JetBrains Mono` (Body), `DM Sans` (Label Small).
- Derived directly from `06-tokens-complete.json`.
- Mathematical Multiplier: 1.5x formula applied across all roles.

---

### [00:45 - 01:50] Value 01: Display Large Line Height = 96px (Formula: 64px * 1.5 = 96px)
- **Why it was hard to settle**: At 64px ExtraBold (800), standard tight leading (1.25x / 80px) caused descenders on 'g' and 'y' to physically collide with the tall Naira currency sign ('₦') and uppercase characters on the subsequent line.
- **Why 112px failed**: At 112px (1.75x), multiline titles ('45 Lekki Phase 1 / Admiralty Way') perceptually decoupled into disconnected text blocks.
- **Decision**: 96px provides cohesive headline unity with zero physical glyph collision.

---

### [01:50 - 02:55] Value 02: Body Medium in JetBrains Mono = 14px / 21px (Formula: 14px * 1.5 = 21px)
- **Why it was hard to settle**: Material 3 baseline specifies 14px/20px in a proportional sans-serif (Roboto).
- **The Operational Reality**: Body text in RealMe contains unredacted structural engineer inspection caveats (foundation cracks, mold reports) and attorney escrow penalty terms.
- **Field Constraint**: 400 field agents read these on low-cost Android phones in moving vehicles along Lekki-Epe expressway. Proportional fonts vary in character width, increasing scanning friction.
- **Decision**: `JetBrains Mono` with 21px line height ensures monospaced tabular alignment, eliminating line-jumping on vibrating screens.

---

### [02:55 - 03:45] Value 03: Display Large Optical Letter Spacing = -2.0px (vs Default 0px)
- **Visual Proof Reference**: `evidence/03-spacing-default.png` vs `evidence/04-spacing-chosen.png`.
- **Why it was hard to settle**: Default 0px tracking causes 12-character valuations ('₦450,000,000') to span over 600px, breaking across three lines on standard 360px Android viewports.
- **Why -3.0px failed**: At -3.0px, repeated zero digits touched and blurred on budget TN displays.
- **Decision**: -2.0px compresses horizontal width by 20%, locking the valuation into a monolithic financial stamp on a single line.

---

### [03:45 - 04:00] Conclusion & Verification
All 15 typographic styles in RealMe are implemented in `tokens.css` and verified in `src/styles.css`.
