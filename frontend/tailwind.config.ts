/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "#0a0c10", // Darker space blue/carbon
        foreground: "#f8fafc", // Slate 50
        card: {
          DEFAULT: "rgba(16, 20, 28, 0.7)", // Deep blue glass
          foreground: "#f1f5f9",
        },
        popover: {
          DEFAULT: "rgba(16, 20, 28, 0.95)",
          foreground: "#f1f5f9",
        },
        primary: {
          DEFAULT: "#0ea5e9", // Vivid Cerulean/Sky Blue (Stitch main)
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#3b82f6", // Royal Blue
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "rgba(30, 41, 59, 0.5)", // Slate muted
          foreground: "#94a3b8",
        },
        accent: {
          DEFAULT: "#06b6d4", // Cyan accent
          foreground: "#ffffff",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-blue': 'radial-gradient(at 0% 0%, hsla(199,89%,48%,0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(217,91%,60%,0.15) 0px, transparent 50%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
        'glow-orange-lg': '0 0 40px rgba(249, 115, 22, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
