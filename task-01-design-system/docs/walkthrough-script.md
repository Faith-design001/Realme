# Task 01: Typographic Walkthrough Defence & Telemetry Script

*Format: 4-minute technical walkthrough defending the three hardest typography values to settle.*

---

## Walkthrough Metadata
- **Speaker**: Faith Ojo (Design Engineer / Full Stack Developer)
- **Project**: Realme Vault (Enterprise Design System for Realme Properties Ltd, Lekki, Lagos)
- **Target Audience**: Technical Assessment Panel & Engineering Hiring Committee
- **Video Reference Asset**: `evidence/13-walkthrough-transcript.md`

---

## The Three Hardest Values to Settle (Spoken Defense Script)

### [00:00 - 00:45] Introduction & System Overview
"Hello. Today I'm walking through the type scale for **Vault**, the internal deal intelligence platform for Realme Properties Ltd in Lekki, Lagos. 

Our typographic foundation uses `Plus Jakarta Sans`, configured into five roles—Display, Headline, Title, Body, and Label—with three sizes each, giving us fifteen cohesive styles. Every single line height in this system strictly obeys our mathematical formula constraint: font size multiplied by 1.4, 1.5, or 1.6.

While building this system, three values in particular were intensely difficult to settle because they sat right at the intersection of mathematical theory, physical device constraints, and high-stakes financial operations. Here is why we picked them, and why settling them was hard."

---

### [00:45 - 01:50] Hard Value #1: Display Large Line Height — `80px` (Font Size: 57px, Multiplier: 1.4×)
"The first hardest value to settle was the **Display Large line height of 80px**. 

Our Display Large font size is 57px, Bold 700. Under our formula, applying the tightest allowed multiplier of 1.4 gives:
$$57\text{px} \times 1.4 = 79.8\text{px}$$
We snapped this to our 8px spatial grid at **80px**. 

Why was this so hard to settle? Because standard web conventions push for looser leading—around 1.5 or 1.6—which would produce 88px or 92px. But when you test an 88px line height with a 57px bold geometric sans on a mobile screen, the vertical gap between lines becomes massive. If a property title wraps to two lines—like '45 Lekki Phase 1 / Commercial Villa'—the lines perceptually decouple. Field agents scanning the screen perceive them as two unrelated headings rather than one cohesive entity.

On the other hand, if we had tightened it just one step lower to 72px (a 1.26 multiplier), the descenders of lowercase letters like `g` and `y` and uppercase accents physically collide with the tall Naira currency sign (`₦`) and capital ascenders on the next line. 

Settling on exactly **80px** was the only value that achieved optical cohesion without physical glyph collision."

---

### [01:50 - 02:55] Hard Value #2: Body Medium Line Height — `22px` (Font Size: 14px, Multiplier: 1.6×)
"The second hardest value to settle was the **Body Medium line height of 22px**. 

The documented Google Material 3 baseline standard for Body Medium is 14px font size with 20px line height—a multiplier of approximately 1.43. We deliberately diverged and fought hard to set this to **22px** ($14\text{px} \times 1.6 = 22.4\text{px}$, snapped to 22px).

In Vault, Body Medium is not generic placeholder text. It carries unredacted structural inspection caveats and attorney escrow penalties—such as active foundation cracks along northern retaining walls or 5% liquidated damages clauses. 

Our primary users are 400 field agents riding in cars or on transit along the Lekki-Epe expressway, reviewing these deal facts on budget Android phones under intense equatorial sunlight. At the default 20px leading, you only have 6px of breathing room between lines. On a vibrating phone screen with low screen brightness, 6px causes severe 'line-jumping'—agents lose their spot and accidentally skip critical legal caveats. 

Expanding to a generous 1.6 multiplier (22px) creates 8px of clear horizontal breathing channel. It slightly increases vertical card height, but in a multi-tenant escrow system, preventing an agent from missing a structural defect notice is worth ten times the cost of a few extra pixels."

---

### [02:55 - 03:45] Hard Value #3: Display Large Optical Letter Spacing — `-1.5px`
"The third hardest value to settle was the **Display Large letter spacing of -1.5px**.

The Material baseline default tracking is `-0.25px`. But `Plus Jakarta Sans` has exceptionally wide geometric counters and round apertures. When a multi-million Naira valuation like `₦450,000,000` is rendered at 57px with `-0.25px` tracking, it spans 580 pixels horizontally. 

On a standard 360px-wide Android viewport, that price breaks across three ugly, fragmented lines: `₦450,` / `000,` / `000`. That introduces dangerous numerical hesitation when an agent is negotiating with a seller at an on-site meeting.

We experimented with tracking values from `-0.5px` to `-2.0px`. At `-2.0px`, glyphs like `0` and `0` begin to touch and bleed together under low display resolutions. At **`-1.5px`**, we achieved the exact optical threshold: the 12 characters compress by 18%, locking the entire valuation into a solid, authoritative financial stamp that renders cleanly on one line without character collision."

---

### [03:45 - 04:00] Conclusion
"Every typographic choice in Vault was derived directly from the physical constraints of our users and our business in Lagos. Thank you."
