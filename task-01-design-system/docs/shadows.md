# RealMe Enterprise Design System: Atmospheric Shadow System

## 1. System Philosophy: Brand-Pigmented Elevation
Unlike generic component libraries that use flat carbon black (`rgba(0, 0, 0, alpha)`), RealMe builds its entire elevation hierarchy directly from the primary brand key: **`#0D1F3D`** (`rgb(13, 31, 61)`).

### Why a Brand-Pigmented Shadow Reads Differently from Black
In natural physical lighting, an occluded surface is illuminated by ambient bounce light reflecting the colors of surrounding materials. Pure black shadows create harsh, muddy grey rims around interface cards that make them look artificially superimposed. A shadow tinted with RealMe's primary midnight navy (`rgba(13, 31, 61, alpha)`) mimics natural ambient scattering, embedding listing cards and deal flyouts into the viewport with warm optical depth while preserving surface brightness.

---

## 2. Shadow Specifications Matrix (from `06-tokens-complete.json`)

| Level | Token Key | X Offset | Y Offset | Blur Radius | Spread | Raw Hex with Alpha | Computed CSS Declaration | Usage in RealMe Interface |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Soft** | `soft shadow` | `1.5px` | `6px` | `30px` | `0px` | `#0d1f3d1f` (12% alpha) | `1.5px 6px 30px 0px rgba(13, 31, 61, 0.12)` | Resting property listing cards, metrics tiles |
| **Medium** | `medium shadow` | `4px` | `6px` | `24px` | `0px` | `#0d1f3d2e` (18% alpha) | `4px 6px 24px 0px rgba(13, 31, 61, 0.18)` | Active query shortcuts, deal dropdowns, hover cards |
| **Hard** | `hard shadow` | `0px` | `10px` | `20px` | `0px` | `#0d1f3d33` (20% alpha) | `0px 10px 20px 0px rgba(13, 31, 61, 0.20)` | Compliance alert modals, escrow execution dialogs |

---

## 3. CSS Custom Properties
```css
:root {
  --realme-shadow-soft-shadow: 1.5px 6px 30px 0px rgba(13, 31, 61, 0.12);
  --realme-shadow-medium-shadow: 4px 6px 24px 0px rgba(13, 31, 61, 0.18);
  --realme-shadow-hard-shadow: 0px 10px 20px 0px rgba(13, 31, 61, 0.20);
}
```
