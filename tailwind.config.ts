import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        scout: {
          green: "#1EDD7D",
          "green-dim": "rgba(30,221,125,0.12)",
          "green-mid": "rgba(30,221,125,0.25)",
          bg: "#f4f6f9",
          card: "#ffffff",
          border: "#e2e8f0",
          border2: "#cbd5e1",
          text: "#374151",
          muted: "#6b7280",
          navy: "#0f2644",
          dark: "#1a2620",
          gd: "#15b865",
          gbg: "#edfdf5",
          gbdr: "#a7f3d0",
          link: "#2563eb",
          "link-dim": "#eff6ff",
          tag: "rgba(30,221,125,0.1)",
          shell: "#fafcfb",
          "copy-ok": "#0a6636",
          overlay: "rgba(10, 20, 15, 0.5)",
          "logo-bg": "#f5f8f6",
          red: "#dc2626",
          amb: "#d97706",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        icon: {
          DEFAULT: "hsl(var(--icon))",
          updated: "var(--icon-updates)",
        },
        "stat-card": "hsl(var(--stat-card))",
        "stat-card-border": "hsl(var(--stat-card-border))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-subtle": "var(--gradient-subtle)",
        "gradient-card": "var(--gradient-card)",
        "gradient-stat": "var(--gradient-stat)",
      },
      boxShadow: {
        elegant: "var(--shadow-elegant)",
        card: "var(--shadow-card)",
        glow: "var(--shadow-glow)",
        scout: "0 1px 3px rgba(0,0,0,0.06)",
        "scout-lg": "0 8px 24px rgba(0,0,0,0.12)",
        panel: "0 24px 80px rgba(0,0,0,0.2)",
        float: "0 20px 60px rgba(0,0,0,0.15)",
        "float-lg": "0 20px 60px rgba(0,0,0,0.18)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      transitionTimingFunction: {
        smooth: "var(--transition-smooth)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))",
        20: "repeat(20, minmax(0, 1fr))",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slide-left": {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        "slide-right": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "tick-pop": {
          "0%": {
            transform: "scale(0)",
            opacity: "0",
          },
          "60%": {
            transform: "scale(1.15)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "circle-draw": {
          "0%": {
            transform: "scale(0)",
            opacity: "0",
          },
          "50%": {
            opacity: "1",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scout-poll-shimmer": {
          "0%": { backgroundPosition: "-600px 0" },
          "100%": { backgroundPosition: "600px 0" },
        },
        "scout-poll-ld": {
          "0%, 80%, 100%": { transform: "scale(0.5)", opacity: "0.35" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        "scout-msg-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scout-kpi-pop": {
          from: { opacity: "0", transform: "translateY(10px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "scout-tbl-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scout-row-reveal": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "60%": { opacity: "1", transform: "translateY(-1px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-left": "slide-left 0.5s ease-in-out",
        "slide-right": "slide-right 0.5s ease-in-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "tick-pop": "tick-pop 0.4s ease-out 0.15s forwards",
        "circle-draw": "circle-draw 0.35s ease-out forwards",
        shimmer: "shimmer 2s infinite",
        "slide-in": "slide-in 0.6s ease-out forwards",
        "scout-poll-shimmer": "scout-poll-shimmer 1.3s infinite linear",
        "scout-poll-ld": "scout-poll-ld 0.75s infinite both",
        "scout-msg-in":
          "scout-msg-in 0.35s cubic-bezier(0.22, 0.68, 0, 1.2) forwards",
        "scout-kpi-pop": "scout-kpi-pop 0.4s cubic-bezier(0.22, 0.68, 0, 1.2)",
        "scout-tbl-in": "scout-tbl-in 0.35s ease both",
        "scout-row-reveal":
          "scout-row-reveal 0.32s cubic-bezier(0.22, 0.68, 0, 1.1) both",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
