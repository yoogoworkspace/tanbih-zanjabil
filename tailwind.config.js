/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", // warm gray
        input: "var(--color-input)", // subtle warm gray
        ring: "var(--color-ring)", // deep teal
        background: "var(--color-background)", // warm off-white
        foreground: "var(--color-foreground)", // deep charcoal
        primary: {
          DEFAULT: "var(--color-primary)", // deep teal
          foreground: "var(--color-primary-foreground)", // warm off-white
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // warm gold
          foreground: "var(--color-secondary-foreground)", // deep charcoal
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // respectful red
          foreground: "var(--color-destructive-foreground)", // warm off-white
        },
        muted: {
          DEFAULT: "var(--color-muted)", // subtle warm gray
          foreground: "var(--color-muted-foreground)", // medium gray
        },
        accent: {
          DEFAULT: "var(--color-accent)", // sage green
          foreground: "var(--color-accent-foreground)", // warm off-white
        },
        popover: {
          DEFAULT: "var(--color-popover)", // warm off-white
          foreground: "var(--color-popover-foreground)", // deep charcoal
        },
        card: {
          DEFAULT: "var(--color-card)", // subtle warm gray
          foreground: "var(--color-card-foreground)", // deep charcoal
        },
        success: {
          DEFAULT: "var(--color-success)", // islamic green
          foreground: "var(--color-success-foreground)", // warm off-white
        },
        warning: {
          DEFAULT: "var(--color-warning)", // warm amber
          foreground: "var(--color-warning-foreground)", // warm off-white
        },
        error: {
          DEFAULT: "var(--color-error)", // respectful red
          foreground: "var(--color-error-foreground)", // warm off-white
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ['Amiri', 'serif'],
        body: ['Inter', 'sans-serif'],
        caption: ['Nunito Sans', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "prayer-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "dhikr-count": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "prayer-pulse": "prayer-pulse 2s ease-in-out infinite",
        "dhikr-count": "dhikr-count 0.3s ease-out",
      },
      transitionTimingFunction: {
        'islamic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      boxShadow: {
        'islamic': '0 4px 12px rgba(45, 90, 90, 0.08)',
        'islamic-subtle': '0 2px 4px rgba(45, 90, 90, 0.06)',
        'islamic-moderate': '0 8px 16px rgba(45, 90, 90, 0.10)',
        'islamic-prominent': '0 16px 24px rgba(45, 90, 90, 0.12)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}