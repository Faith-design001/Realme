# RealMe Enterprise Design System: Baseline Divergence Analysis

This document records deliberate, principled divergences between RealMe's design token specification (`06-tokens-complete.json`) and the Google Material 3 baseline standard.

---

## Divergence 01: ExtraBold Display Typographic Weight & Aggressive Tracking

### 1. Documented Baseline Default
- **Typeface**: `Roboto`
- **Weight**: `Regular (400)`
- **Material 3 Baseline Standard**: Display Large = 57px size / 64px line height / 400 Regular weight / -0.25px letter spacing.

### 2. RealMe Chosen Specification (from `06-tokens-complete.json`)
- **Typeface**: `Plus Jakarta Sans`
- **Weight**: `ExtraBold (800)` on Display Large and Medium; `Bold (700)` on Display Small and Headlines.
- **RealMe Specification**: Display Large = 64px size / 96px line height / 800 ExtraBold / -2.0px letter spacing.

### 3. Engineering & Field Rationale
RealMe's 400 active field agents operate outdoors across Lekki, Victoria Island, and Ikoyi. They view listings and price floors on budget Android devices under intense tropical sunlight. A light 400-weight stroke washes out completely on low-brightness screens (250–300 nits). RealMe's 800-weight `Plus Jakarta Sans` provides substantial physical stroke density that cuts through glare. Furthermore, the -2.0px tracking condenses long 9-digit Naira amounts (`₦450,000,000`) so they fit on a single line on mobile screens.

### 4. Where This Choice Fails (The Inversion / Wrong-Case Analysis)
Our choice would be completely wrong in:
1. **Long-Form Legal Contract Review**: In dense multi-page land registry documents or legal agreements, 800-weight display text feels loud and aggressive, fatiguing the reader's eyes.
2. **Multi-Column Financial Dashboards**: On high-density desktop views where multiple deal columns are displayed side-by-side, 800-weight text takes up too much visual weight, pulling focus away from secondary warning flags.

---

## Divergence 02: Monospaced Body Typography (`JetBrains Mono`) for Deal Records

### 1. Documented Baseline Default
- **Typeface**: Proportional Sans-Serif (`Roboto` / `Inter`)
- **Weight**: `Regular (400)`
- **Material 3 Baseline Standard**: Body Medium = 14px size / 20px line height / Sans-serif proportional font.

### 2. RealMe Chosen Specification (from `06-tokens-complete.json`)
- **Typeface**: `JetBrains Mono`
- **Weight**: `Regular (400)`
- **RealMe Specification**: 
  - Body Large = 16px / 24px line height / -0.75px letter spacing / `JetBrains Mono`
  - Body Medium = 14px / 21px line height / -0.45px letter spacing / `JetBrains Mono`
  - Body Small = 12px / 18px line height / -0.32px letter spacing / `JetBrains Mono`

### 3. Engineering & Field Rationale
In RealMe, body text is not generic marketing prose. It consists of unredacted structural inspection reports, seller bottom-dollar agreed figures, survey coordinates, and attorney escrow deadlines. These deal records are technical, structured data. `JetBrains Mono` provides tabular figure alignment, distinct character shapes (zero with a dot, clear differentiation between `1`, `l`, and `I`), and fixed-width spacing. When an agent reviews structural notes (*"Foundation crack: 4.5mm at north perimeter"*), monospaced type ensures the numbers and units stand out distinctly without ambiguity.

### 4. Where This Choice Fails (The Inversion / Wrong-Case Analysis)
Our choice would be completely wrong in:
1. **Consumer-Facing Marketing Landing Pages**: Monospaced body copy reads as technical code or machine logs. On a public-facing buyer portal, it creates an intimidating developer-centric impression, reducing emotional appeal and consumer conversion.
2. **High-Speed Prose Reading**: Proportional typefaces (like Inter or Roboto) allow faster saccadic reading speeds for long narrative paragraphs because word shapes vary more naturally. Using monospaced type for long general reading slows reading speed by 10–15%.
