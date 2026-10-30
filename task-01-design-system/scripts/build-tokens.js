/**
 * Vault Enterprise Design System - Token Compiler
 * Reads W3C/DTCG Figma Variables JSON export and generates production-ready CSS variables.
 * Enforces architectural constraint: Only semantic role tokens are exposed to UI components.
 * Primitives remain unexposed to prevent design system erosion.
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '../evidence/06-tokens-complete.json');
const outputPath = path.resolve(__dirname, '../tokens.css');

function resolveAlias(val, root) {
  if (typeof val !== 'string' || !val.startsWith('{') || !val.endsWith('}')) {
    return val;
  }
  const cleanPath = val.slice(1, -1).split('.');
  let current = root;
  for (const part of cleanPath) {
    if (!current || current[part] === undefined) {
      throw new Error(`Failed to resolve token alias: ${val} at part '${part}'`);
    }
    current = current[part];
  }
  return current.$value !== undefined ? resolveAlias(current.$value, root) : current;
}

function compileTokens() {
  console.log(`[Token Compiler] Reading token schema from: ${inputPath}`);
  
  if (!fs.existsSync(inputPath)) {
    console.error(`[Error] Token file not found: ${inputPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  const schema = JSON.parse(raw);

  let css = `/**\n * Vault Enterprise Design System - Compiled Tokens\n * Auto-generated from Figma Variables (evidence/06-tokens-complete.json)\n * DO NOT EDIT DIRECTLY. Run: node scripts/build-tokens.js\n */\n\n:root {\n`;

  // 1. Color Semantic Roles (Strictly Semantic - No Raw Primitives Exposed)
  css += `  /* ==========================================\n   * 1. SEMANTIC COLOR ROLES\n   * ========================================== */\n`;
  if (schema.color && schema.color.role) {
    for (const [roleName, roleObj] of Object.entries(schema.color.role)) {
      const resolvedValue = resolveAlias(roleObj.$value, schema);
      const varName = `--vault-color-${roleName}`;
      const desc = roleObj.$description ? ` /* ${roleObj.$description} */` : '';
      css += `  ${varName}: ${resolvedValue};${desc}\n`;
    }
  }

  // 2. Shadows (Brand-Pigmented Elevation)
  css += `\n  /* ==========================================\n   * 2. BRAND-DERIVED ELEVATION SHADOWS\n   * ========================================== */\n`;
  if (schema.shadows) {
    for (const [shadowKey, shadowObj] of Object.entries(schema.shadows)) {
      const s = shadowObj.$value;
      const varName = `--vault-shadow-${shadowKey}`;
      css += `  ${varName}: ${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color};\n`;
    }
  }

  // 3. Typography Styles (15 Material 3 derived styles)
  css += `\n  /* ==========================================\n   * 3. TYPOGRAPHY SYSTEM (15 ROLES & STYLES)\n   * ========================================== */\n`;
  if (schema.typography) {
    for (const [groupName, groupObj] of Object.entries(schema.typography)) {
      for (const [sizeName, token] of Object.entries(groupObj)) {
        const prefix = `--vault-type-${groupName}-${sizeName}`;
        css += `  ${prefix}-font-family: "${token.fontFamily.$value}", -apple-system, BlinkMacSystemFont, sans-serif;\n`;
        css += `  ${prefix}-font-weight: ${token.fontWeight.$value};\n`;
        css += `  ${prefix}-font-size: ${token.fontSize.$value};\n`;
        css += `  ${prefix}-line-height: ${token.lineHeight.$value};\n`;
        css += `  ${prefix}-letter-spacing: ${token.letterSpacing.$value};\n\n`;
      }
    }
  }

  css += `}\n`;

  fs.writeFileSync(outputPath, css, 'utf8');
  console.log(`[Token Compiler] Successfully wrote CSS tokens to: ${outputPath}`);
}

compileTokens();
