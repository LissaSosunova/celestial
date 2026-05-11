import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ... ваши настройки
    },
  },
  plugins: [
    function({ addComponents }: any) {
      addComponents({
        '.btn': {
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontWeight: '500',
          transition: 'all 0.2s',
          '&:focus': {
            outline: 'none',
            ring: '2px solid #3b82f6',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          backgroundColor: '#3b82f6',
          color: 'white',
          '&:hover': {
            backgroundColor: '#2563eb',
          },
        },
        '.btn-dark': {
          padding: '1rem 2.5rem',
          backgroundColor: '#2D2A26',
          color: 'white',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          borderRadius: '9999px',
          '&:hover': {
            backgroundColor: 'black',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
      });
    },
  ],
};

export default config;