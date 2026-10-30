# RealMe Enterprise Design System: Colour Roles & Contrast Architecture

## 1. Brand Colour Origin & Strategic Selection
- **Brand Hex**: `#0D1F3D` (Primary Key Color: Midnight Navy Blue, `primary40`)
- **Origin**: The primary brand color was chosen for **RealMe Properties Ltd** in Lekki, Lagos. Real estate in Lagos involves high-value transactions, legal due diligence, and escrow agreements. The deep midnight navy (`#0D1F3D`) conveys fiduciary authority, legal rigor, and corporate institutional trust. It differentiates RealMe's internal platform from consumer-grade listing classifieds and unverified social media property ads.

---

## 2. Pinned as Primary 40 (Brand Anchor Override)
In the Material 3 / HCT (Hue, Chroma, Tone) design token system:
- **Default (Unpinned)**: The generator takes `#0D1F3D` and algorithmically maps tone 40 along a standardized luminance curve, which shifts the navy hue and desaturates it into a lighter, generic blue (`#1A3F75`).
- **Pinned (Brand Override)**: Tone 40 is explicitly pinned directly to `#0D1F3D`. The palette generates around this anchor (`primary40: #0d1f3dff`).

### Visible Difference Paragraph
*Before pinning*, the algorithmic extraction produced an unanchored slate-blue (`#1A3F75`) at Tone 40, eroding the deep midnight ink-density required for corporate authority. *After pinning*, `#0D1F3D` anchors `primary40` with uncompromising fidelity. The derived tonal palette generates cohesive tones from `primary0` (`#000000`) through `primary 100` (`#FFFFFF`). Primary buttons and active badges exhibit commanding visual weight in light mode (`#0D1F3D` on `#FBFCFF` yielding an extraordinary **16.40:1** AAA contrast), while high-tone containers (`primary 90: #D4E1F6`) maintain clean oceanic clarity.

---

## 3. Tonal Palette & Light/Dark Theme Derivation
RealMe defines 14 tonal steps in its primary palette (`0, 4, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100`).

### Why This Tonal Depth Suffices for Light and Dark Themes
Each tone corresponds to a calibrated perceptual lightness ($L^*$). By referencing semantic roles rather than primitives:
1. **Light Mode**: Maps `surface` to `neutral99` (`#FBFCFF`), `on-surface` to `neutral 2` (`#181B24`), and `primary` to `primary40` (`#0D1F3D`).
2. **Dark Mode**: Automatically inverts roles by mapping `surface` to `neutral4` (`#222631`), `on-surface` to `neutral99` (`#FBFCFF`), and `primary` to `primary80` (`#AAC3ED`).
3. **Mathematical Predictability**: Contrast ratios invert symmetrically without hand-tuning individual component styles.

---

## 4. RealMe Tonal Palette Matrix (from `06-tokens-complete.json`)

### Primary Palette (Anchor: `#0D1F3D`)
- **Tone 0**: `#000000`
- **Tone 4**: `#030810`
- **Tone 10**: `#08152A`
- **Tone 20**: `#112A54`
- **Tone 30**: `#1A407E`
- **Tone 40**: `#0D1F3D` (**PINNED BRAND ANCHOR**)
- **Tone 50**: `#2C6AD2`
- **Tone 60**: `#5688DB`
- **Tone 70**: `#80A6E4`
- **Tone 80**: `#AAC3ED`
- **Tone 90**: `#D4E1F6` (Primary Container)
- **Tone 95**: `#E9F0FA`
- **Tone 99**: `#FAFCFE`
- **Tone 100**: `#FFFFFF` (On-Primary)

### Neutral & Neutral Variant Palettes
- **Neutral 0**: `#000000` (Scrim)
- **Neutral 2**: `#181B24` (On-Surface Text)
- **Neutral 4**: `#222631` (Surface Container Lowest)
- **Neutral 10**: `#2C3136` (On-Surface Variant)
- **Neutral 60**: `#8D909C` (Surface Container Highest)
- **Neutral 70**: `#A6ACB3` (Outline)
- **Neutral 80**: `#C1C7CE` (Outline Variant)
- **Neutral 87**: `#B0B2B7` (Surface Dim)
- **Neutral 90**: `#DFE2EE` (Surface Bright)
- **Neutral 94**: `#DADBE0` (Surface Container)
- **Neutral 96**: `#F0F0F2` (Surface Container Low)
- **Neutral 99**: `#FBFCFF` (Surface Canvas / Background)

### Functional Palettes (Error & Warning)
- **Error (Key: `#B6092F`)**:
  - `error30`: `#910725` (Error Role Anchor)
  - `error100`: `#FFFFFF` (On-Error)
  - `error95`: `#FDE6EB` (Error Container)
  - `error10`: `#30020C` (On-Error Container)
- **Warning (Key: `#D77505`)**:
  - `warning20`: `#633602` (Warning Role Anchor)
  - `warning95`: `#FEF3E6` (Warning Container / On-Warning)
  - `warning10`: `#311B01` (On-Warning Container)

---

## 5. Semantic Colour Roles & WCAG Contrast Audit Matrix
A role is a job, never a color. All values derived from `06-tokens-complete.json`:

| Foreground Role | Background Role | Foreground Hex | Background Hex | Contrast Ratio | WCAG Compliance | Evaluation & Remediation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `on-surface` | `surface` | `#181B24` | `#FBFCFF` | **16.76:1** | **Pass AAA** (Threshold 7.0:1) | Optimal legibility for valuations and legal terms under bright Lagos sunlight |
| `on-surface` | `surface-container` | `#181B24` | `#DADBE0` | **12.44:1** | **Pass AAA** | Exceptional contrast on card backgrounds |
| `on-surface-variant`| `surface` | `#2C3136` | `#FBFCFF` | **12.80:1** | **Pass AAA** | Secondary metadata, dates, and agent IDs easily readable |
| `on-primary` | `primary` | `#FFFFFF` | `#0D1F3D` | **16.40:1** | **Pass AAA** | Primary action CTAs deliver commanding contrast |
| `on-primary-container` | `primary-container` | `#112A54` | `#D4E1F6` | **10.72:1** | **Pass AAA** | Filter chips and selected listing states clear and legible |
| `on-error` | `error` | `#FFFFFF` | `#910725` | **9.29:1** | **Pass AAA** | Destructive action confirmation passes AAA |
| `on-error-container` | `error-container` | `#30020C` | `#FDE6EB` | **15.53:1** | **Pass AAA** | Structural crack and foundation defect alert text |
| `on-warning-container`| `warning-container`| `#311B01` | `#FEF3E6` | **14.89:1** | **Pass AAA** | Escrow deadline penalty warning callout text |
| `outline` | `surface` | `#A6ACB3` | `#FBFCFF` | **2.23:1** | **Border Only** | Used for non-text card boundaries. Fails 3.0:1 for critical controls; backed by background tint. |
| `outline-variant` | `surface` | `#C1C7CE` | `#FBFCFF` | **1.66:1** | **FAIL for Text** | **STRICTLY RESTRICTED**: Permitted only as decorative hairline separator; never used for text. |
