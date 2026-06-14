import typography from '@tailwindcss/typography';
/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme"
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class", // allows toggling dark mode manually
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--shadcn-border, 220 13% 91%))",
        input: "hsl(var(--shadcn-input, 220 13% 91%))",
        ring: "hsl(var(--shadcn-ring, 224 71% 45%))",
        background: "hsl(var(--shadcn-background, 0 0% 100%))",
        foreground: "hsl(var(--shadcn-foreground, 224 71% 4%))",
        primary: {
          DEFAULT: "hsl(var(--shadcn-primary, 224 71% 45%))",
          foreground: "hsl(var(--shadcn-primary-foreground, 210 20% 98%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--shadcn-secondary, 220 14% 96%))",
          foreground: "hsl(var(--shadcn-secondary-foreground, 224 71% 4%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--shadcn-destructive, 0 84% 60%))",
          foreground: "hsl(var(--shadcn-destructive-foreground, 210 20% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--shadcn-muted, 220 14% 96%))",
          foreground: "hsl(var(--shadcn-muted-foreground, 220 9% 46%))",
        },
        accent: {
          DEFAULT: "hsl(var(--shadcn-accent, 220 14% 96%))",
          foreground: "hsl(var(--shadcn-accent-foreground, 224 71% 4%))",
        },
        popover: {
          DEFAULT: "hsl(var(--shadcn-popover, 0 0% 100%))",
          foreground: "hsl(var(--shadcn-popover-foreground, 224 71% 4%))",
        },
        card: {
          DEFAULT: "hsl(var(--shadcn-card, 0 0% 100%))",
          foreground: "hsl(var(--shadcn-card-foreground, 224 71% 4%))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height, 0px)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height, 0px)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [typography],
}


