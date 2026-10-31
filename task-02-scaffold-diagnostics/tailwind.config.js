/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        realme: {
          primary: 'var(--realme-color-primary)',
          'on-primary': 'var(--realme-color-on-primary)',
          'primary-container': 'var(--realme-color-primary-container)',
          'on-primary-container': 'var(--realme-color-on-primary-container)',
          secondary: 'var(--realme-color-secondary)',
          'on-secondary': 'var(--realme-color-on-secondary)',
          'secondary-container': 'var(--realme-color-secondary-container)',
          'on-secondary-container': 'var(--realme-color-on-secondary-container)',
          tertiary: 'var(--realme-color-tertiary)',
          'on-tertiary': 'var(--realme-color-on-tertiary)',
          'tertiary-container': 'var(--realme-color-tertiary-container)',
          'on-tertiary-container': 'var(--realme-color-on-tertiary-container)',
          surface: 'var(--realme-color-surface)',
          'on-surface': 'var(--realme-color-on-surface)',
          'surface-variant': 'var(--realme-color-surface-variant)',
          'on-surface-variant': 'var(--realme-color-on-surface-variant)',
          'surface-container': 'var(--realme-color-surface-container)',
          'surface-bright': 'var(--realme-color-surface-bright)',
          'surface-dim': 'var(--realme-color-surface-dim)',
          outline: 'var(--realme-color-outline)',
          'outline-variant': 'var(--realme-color-outline-variant)',
          warning: 'var(--realme-color-warning)',
          'on-warning': 'var(--realme-color-on-warning)',
          'warning-container': 'var(--realme-color-warning-container)',
          'on-warning-container': 'var(--realme-color-on-warning-container)',
          error: 'var(--realme-color-error)',
          'on-error': 'var(--realme-color-on-error)',
          'error-container': 'var(--realme-color-error-container)',
          'on-error-container': 'var(--realme-color-on-error-container)',
        },
      },
      fontFamily: {
        sans: ['var(--realme-type-display-large-font-family)', 'sans-serif'],
        mono: ['var(--realme-type-body-large-font-family)', 'monospace'],
        headline: ['var(--realme-type-headline-large-font-family)', 'sans-serif'],
      },
      boxShadow: {
        'realme-1': 'var(--realme-elevation-level-1)',
        'realme-2': 'var(--realme-elevation-level-2)',
        'realme-3': 'var(--realme-elevation-level-3)',
        'realme-4': 'var(--realme-elevation-level-4)',
        'realme-5': 'var(--realme-elevation-level-5)',
      },
    },
  },
  plugins: [],
};

