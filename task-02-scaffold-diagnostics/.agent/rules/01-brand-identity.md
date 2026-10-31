# Rule 01: Brand Identity & Domain Context

## 1. Project & Business Identity
- **Application Name**: Strictly **RealMe**.
- **Form Factor**: Strictly a **Browser-Based Web Application** (desktop-optimized, mobile-responsive WebKit/Blink web app; zero app store installation, zero native binary).
- **Organization**: **Realme Properties Ltd**, headquartered in Lekki, Lagos, Nigeria.
- **Scale & Users**: 400 active field agents operating across Lekki Phase 1, Victoria Island, and Ikoyi Corridor.
- **Hardware & Environment**: Field agents use mid-range Android smartphones over erratic 3G/4G cellular connections under harsh equatorial sunlight (3,000+ lux ambient glare).

## 2. Invariant Naming Rules
- The application name is **RealMe** at all times. Never use generic or legacy placeholder names (e.g. "Vault", "EstateApp", "Portal").
- All file headers, package names, logs, user-facing UI, documentation, and database schemas must reflect the RealMe identity.

## 3. Brand Aesthetic & Theme Mode
- **Primary Brand Key**: Pinned Tone 40 Midnight Navy Blue (`#0D1F3D`).
- **Default Theme Mode**: **Light Mode** enterprise interface:
  - Surface Canvas: Crisp off-white (`--realme-color-surface: #FBFCFF`).
  - Primary Text: High-contrast charcoal (`--realme-color-on-surface: #181B24`).
  - Secondary Text: Slate (`--realme-color-on-surface-variant: #2C3136`).
  - Container Borders: `--realme-color-outline-variant` (`#C1C7CE`).
- **Voice & Tone**: High-stakes fiduciary intelligence, legal precision, operational clarity, and zero fluff.

## 4. Currency & Numerical Standards
- **Currency Symbol**: Strictly the Nigerian Naira sign (`₦`).
- **Valuation Formatting**: Format currency figures with standard comma delimiters (e.g. `₦450,000,000` or `₦450M` for compact metrics). Never use generic currency signs (`$`, `€`) or bare un-denominated numbers.
