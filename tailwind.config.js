/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'page-bg': '#FBF0F0',
        'sidebar-bg': '#34383A',
        'sidebar-hover': '#3E4346',
        'sidebar-text': '#B8BFC2',
        'content-canvas': '#E9EEF0',
        'card-surface': '#FFFFFF',
        'dusty-rose': {
          DEFAULT: '#D99A9A',
          hover: '#C98787',
          light: '#E8B6B6',
          subtle: '#F4D4D4',
        },
        'light-rose': {
          DEFAULT: '#F2DEDE',
          50: '#FDF7F7',
          100: '#FBF0F0',
          200: '#F2DEDE',
          300: '#E4BFBF',
        },
        'app-text': {
          DEFAULT: '#303437',
          secondary: '#70777B',
          muted: '#8E969B',
        },
        status: {
          critical: '#DC2626',
          warning: '#D97706',
          healthy: '#16A34A',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'frame': '0 12px 40px -8px rgba(52, 56, 58, 0.12), 0 4px 12px -2px rgba(52, 56, 58, 0.06)',
        'card': '0 2px 8px -1px rgba(48, 52, 55, 0.05), 0 1px 3px rgba(48, 52, 55, 0.03)',
        'card-hover': '0 6px 16px -2px rgba(217, 154, 154, 0.15), 0 2px 6px rgba(48, 52, 55, 0.05)',
      },
      width: {
        'sidebar': '200px',
      },
    },
  },
  plugins: [],
};
