/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 20%, 98%)',
        text: 'hsl(210, 15%, 20%)',
        accent: 'hsl(160, 75%, 50%)',
        primary: 'hsl(210, 90%, 55%)',
        surface: 'hsl(0, 0%, 100%)',
        dark: {
          bg: 'hsl(220, 13%, 9%)',
          surface: 'hsl(220, 13%, 12%)',
          border: 'hsl(220, 13%, 18%)',
          text: 'hsl(220, 13%, 90%)',
          muted: 'hsl(220, 13%, 60%)',
        }
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 15%, 20%, 0.1)',
        'modal': '0 16px 48px hsla(210, 15%, 20%, 0.16)',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
        'xl': '32px',
      },
    },
  },
  plugins: [],
}