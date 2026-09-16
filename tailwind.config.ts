import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tenant: {
          primary: 'var(--primary-color, #2563eb)',
          secondary: 'var(--secondary-color, #1e293b)',
          bg: 'var(--bg-color, #ffffff)',
          // Material You Tonal Tokens
          'primary-container': 'var(--primary-container, #dbeafe)',
          'on-primary-container': 'var(--on-primary-container, #1e3a8a)',
          'surface-variant': 'var(--surface-variant, #f1f5f9)',
          'outline-variant': 'var(--outline-variant, #e2e8f0)',
        }
      },
      borderRadius: {
        '4xl': '2rem',     // 32px - Material You extra large
        '5xl': '2.5rem',   // 40px
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.12)',
        'glass-glow': '0 0 25px -5px var(--primary-color, rgba(37, 99, 235, 0.25))',
        'm3-1': '0 1px 3px 1px rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'm3-2': '0 2px 6px 2px rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'm3-3': '0 4px 12px 3px rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '40px',
      }
    },
  },
  plugins: [],
};
export default config;
