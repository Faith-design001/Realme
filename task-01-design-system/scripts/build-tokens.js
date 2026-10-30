/**
 * RealMe Enterprise Design System - Token Compiler
 * Reads canonical Figma Design Tokens JSON export (06-tokens-complete.json)
 * Compiles semantic color roles, brand-derived shadows, and 15 typographic styles into tokens.css.
 * Enforces architectural constraint: Only semantic role tokens are exposed to UI components.
 * Primitives remain unexposed to prevent design system erosion.
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '../evidence/06-tokens-complete.json');
const outputPath = path.resolve(__dirname, '../tokens.css');

function resolvePath(obj, pathStr) {
  if (typeof pathStr !== 'string') return pathStr;
  if (!pathStr.startsWith('{') || !pathStr.endsWith('}')) return pathStr;
  const parts = pathStr.slice(1, -1).split('.');
  let cur = obj;
  for (const p of parts) {
    if (!cur) return undefined;
    cur = cur[p];
  }
  return cur ? (cur.value || cur) : undefined;
}

function cleanHex(hex) {
  if (typeof hex !== 'string') return hex;
  if (hex.startsWith('#') && hex.length === 9) {
    const alpha = hex.slice(7);
    if (alpha.toLowerCase() === 'ff') {
      return hex.slice(0, 7).toUpperCase();
    }
  }
  return hex;
}

function formatShadowColor(hexWithAlpha) {
  if (typeof hexWithAlpha !== 'string') return hexWithAlpha;
  if (hexWithAlpha.startsWith('#') && hexWithAlpha.length === 9) {
    const r = parseInt(hexWithAlpha.slice(1, 3), 16);
    const g = parseInt(hexWithAlpha.slice(3, 5), 16);
    const b = parseInt(hexWithAlpha.slice(5, 7), 16);
    const a = (parseInt(hexWithAlpha.slice(7, 9), 16) / 255).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return hexWithAlpha;
}

function compileTokens() {
  console.log(`[RealMe Token Compiler] Reading token schema from: ${inputPath}`);
  
  if (!fs.existsSync(inputPath)) {
    console.error(`[Error] Token file not found: ${inputPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  const schema = JSON.parse(raw);

  let css = `/**\n * RealMe Enterprise Design System - Compiled Tokens\n * Auto-generated from Figma Design Tokens (evidence/06-tokens-complete.json)\n * DO NOT EDIT DIRECTLY. Run: node scripts/build-tokens.js\n */\n\n:root {\n`;

  // 1. Color Semantic Roles (Strictly Semantic - No Raw Primitives Exposed)
  css += `  /* ==========================================\n   * 1. SEMANTIC COLOR ROLES\n   * Single Source of Truth: Pinned Primary 40 (#0D1F3D)\n   * ========================================== */\n`;
  
  const rolesGroup = schema['color roles collection']?.['color roles'];
  if (rolesGroup) {
    for (const [groupKey, groupObj] of Object.entries(rolesGroup)) {
      for (const [roleKey, roleObj] of Object.entries(groupObj)) {
        const rawVal = roleObj.value;
        const resolved = resolvePath(schema, rawVal);
        const hex = cleanHex(resolved);
        // Normalize role name into clean CSS custom property: e.g. "primary color" -> "primary"
        let normalized = roleKey
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/-color$/, '')
          .replace(/-color-/, '-');
        
        css += `  --realme-color-${normalized}: ${hex};\n`;
      }
    }
  }

  // 2. Shadows (Brand-Pigmented Elevation built from #0D1F3D)
  css += `\n  /* ==========================================\n   * 2. BRAND-DERIVED ELEVATION SHADOWS\n   * Key: #0D1F3D (Midnight Navy)\n   * ========================================== */\n`;
  if (schema.effect) {
    for (const [shadowKey, shadowObj] of Object.entries(schema.effect)) {
      const s = shadowObj.value;
      const varName = `--realme-shadow-${shadowKey.replace(/\s+/g, '-')}`;
      const colorFormatted = formatShadowColor(s.color);
      css += `  ${varName}: ${s.offsetX}px ${s.offsetY}px ${s.radius}px ${s.spread}px ${colorFormatted};\n`;
    }
  }

  // 3. Typography Styles (15 Material 3 derived styles in schema.font)
  css += `\n  /* ==========================================\n   * 3. TYPOGRAPHY SYSTEM (15 ROLES & STYLES)\n   * Plus Jakarta Sans (Headings), JetBrains Mono (Body), DM Sans (Micro)\n   * ========================================== */\n`;
  if (schema.font) {
    for (const [fontKey, fontObj] of Object.entries(schema.font)) {
      const f = fontObj.value;
      const prefix = `--realme-type-${fontKey.replace(/\s+/g, '-')}`;
      const fallback = f.fontFamily === 'JetBrains Mono' ? 'monospace' : 'sans-serif';
      
      css += `  ${prefix}-font-family: "${f.fontFamily}", ${fallback};\n`;
      css += `  ${prefix}-font-weight: ${f.fontWeight};\n`;
      css += `  ${prefix}-font-size: ${f.fontSize}px;\n`;
      css += `  ${prefix}-line-height: ${f.lineHeight}px;\n`;
      css += `  ${prefix}-letter-spacing: ${f.letterSpacing}px;\n\n`;
    }
  }

  css += `}\n`;

  fs.writeFileSync(outputPath, css, 'utf8');
  console.log(`[RealMe Token Compiler] Successfully wrote CSS tokens to: ${outputPath}`);
}

compileTokens();
