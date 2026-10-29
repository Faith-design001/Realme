# Vault Enterprise Design System: Atmospheric Shadow System

## 1. System Philosophy: Brand-Pigmented Elevation
Unlike generic component libraries that cast desaturated carbon-black shadows (`rgba(0, 0, 0, alpha)`), Vault derives its entire elevation hierarchy directly from the primary brand anchor: **`#0F4C5C`** (`rgb(15, 76, 92)`).

### Why a Brand-Pigmented Shadow Reads Differently from Black
In real-world optical physics, objects rarely cast pure black shadows because ambient light reflected from surrounding atmospheric surfaces illuminates the occluded area with ambient color bounce. In digital interfaces, black shadows create harsh, muddy grey rings around cards that dirty the background canvas and make UI layers feel artificially glued on. A shadow built from the primary brand color (`rgba(15, 76, 92, alpha)`) mimics natural environmental scattering, embedding cards, flyout panels, and modals into the interface with warm optical richness and perceived depth while preserving clean surface luminance.

---

## 2. Shadow Specifications Matrix

| Level | Token Name | X Offset | Y Offset | Blur Radius | Spread Radius | Opacity | CSS Declaration | Primary Role in Vault Interface |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Soft** | `shadow-soft` | `0px` | `2px` | `8px` | `0px` | `0.08` | `0 2px 8px 0 rgba(15, 76, 92, 0.08)` | Resting property listing cards, metrics cards, summary tiles |
| **Medium** | `shadow-medium` | `0px` | `8px` | `24px` | `-4px` | `0.16` | `0 8px 24px -4px rgba(15, 76, 92, 0.16)` | Active deal query dropdowns, floating filter bars, hover cards |
| **Hard** | `shadow-hard` | `0px` | `16px` | `48px` | `-8px` | `0.28` | `0 16px 48px -8px rgba(15, 76, 92, 0.28)` | Critical compliance alert dialogs, escrow lock confirmation modals |

---

## 3. Engineering Implementation (CSS Custom Properties)
```css
:root {
  /* Brand-Derived Elevation Shadows */
  --vault-shadow-soft: 0 2px 8px 0 rgba(15, 76, 92, 0.08);
  --vault-shadow-medium: 0 8px 24px -4px rgba(15, 76, 92, 0.16);
  --vault-shadow-hard: 0 16px 48px -8px rgba(15, 76, 92, 0.28);
}
```
