# Task 01: Typographic Walkthrough Defence & Telemetry Script

*Format: 4-minute technical walkthrough defending the three hardest typography values to settle in RealMe.*

---

## Walkthrough Metadata
- **Speaker**: Faith Ojo (RealMe Properties Ltd)
- **Project**: RealMe Enterprise Design System (Lekki, Lagos)
- **Target Audience**: Technical Assessment Panel & Engineering Hiring Committee
- **Video Reference Asset**: `evidence/13-walkthrough-transcript.md`

---

## The Three Hardest Values to Settle (Spoken Defense Script)

### [00:00 - 00:45] Introduction & System Overview
"Hello. Today I'm walking through the type scale for **RealMe**, the internal deal intelligence platform for Realme Properties Ltd in Lekki, Lagos. 

Our typographic foundation is configured into five roles—Display, Headline, Title, Body, and Label—with three sizes each, giving us fifteen styles derived directly from our Figma variables export `06-tokens-complete.json`. We use `Plus Jakarta Sans` for bold headings, and `JetBrains Mono` for tabular deal records, legal clauses, and micro status chips. Every single style obeys our strict mathematical line-height multiplier formula: font size times 1.5.

While building this system, three values were intensely difficult to settle because they sat right at the intersection of mathematical theory, physical device constraints, and high-stakes real estate transactions. Here is why we picked them, and why settling them was hard."

---

### [00:45 - 01:50] Hard Value #1: Display Large Line Height — `96px` (Font Size: 64px, Multiplier: 1.5×)
"The first hardest value to settle was the **Display Large line height of 96px**. 

Our Display Large font size is 64px, ExtraBold 800. Under our formula, applying our 1.5 multiplier gives:
$$64\text{px} \times 1.5 = 96\text{px}$$

Why was this so hard to settle? Because standard web conventions push for tighter leading on massive display headings—around 1.2 or 1.25—which would produce 76px or 80px. But when you render 64px ExtraBold characters, glyph ink-density is enormous. Descenders on glyphs like `g` and `y` physically collide with the tall Naira currency sign (`₦`) and capital ascenders on the next line. In high-pressure price negotiations where millions of Naira are on the line, glyph collisions cause misread numbers.

Conversely, if we had loosened it to 1.75 (112px), multi-line property titles perceptually decouple into two isolated visual blocks, squandering vertical space on budget Android viewports and pushing critical inspection alert boxes below the fold.

Settling on exactly **96px** was the only value that achieved optical cohesion without physical glyph collision."

---

### [01:50 - 02:55] Hard Value #2: Body Medium Line Height & Monospace — `21px` (Font Size: 14px, `JetBrains Mono`)
"The second hardest value to settle was setting **Body Medium to 14px / 21px in `JetBrains Mono`**. 

The documented Google Material 3 baseline standard for Body Medium is 14px font size with 20px line height in a proportional sans-serif font like Roboto or Inter. We deliberately diverged to **`JetBrains Mono`** with a strict $1.5\times$ multiplier ($14 \times 1.5 = 21\text{px}$).

In RealMe, body text is not generic marketing prose. It carries unredacted structural inspection caveats—such as active hairline settlement cracks along retaining walls—and attorney escrow penalty clauses. 

Our primary users are 400 field agents riding along the Lekki-Epe expressway, reviewing these deal facts on budget Android phones under intense tropical sunlight. A proportional font causes numbers and punctuation to vary in width, creating visual clutter. `JetBrains Mono` provides tabular figure alignment and distinct character glyphs. The 21px line height provides 7px of clean white channel between lines, eliminating 'line-jumping' on moving transit."

---

### [02:55 - 03:45] Hard Value #3: Display Large Optical Letter Spacing — `-2.0px`
"The third hardest value to settle was the **Display Large letter spacing of -2.0px**.

The default baseline tracking is `0px` or `-0.25px`. But `Plus Jakarta Sans` has wide geometric counters and round apertures. When a multi-million Naira valuation like `₦450,000,000` is rendered at 64px ExtraBold with 0px tracking, it spans over 600 pixels horizontally. 

On a standard 360px-wide Android viewport, that price breaks across three separate lines: `₦450,` / `000,` / `000`. That introduces dangerous numerical hesitation during negotiations.

We tested tracking values from `-1.0px` to `-3.0px`. At `-3.0px`, adjacent zeros in `₦450,000,000` touch and blur together on budget low-resolution panels. At **`-2.0px`**, we achieved the exact optical threshold: the 12 characters compress by 20%, locking the entire valuation into a solid, authoritative financial stamp that fits cleanly on a single line."

---

### [03:45 - 04:00] Conclusion
"Every typographic choice in RealMe was derived directly from the physical constraints of our users and our business in Lagos. Thank you."
