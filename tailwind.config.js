/** @type {import('tailwindcss').Config} */

// Every color resolves to a CSS variable holding space-separated RGB channels,
// so a single `.dark` override re-themes the whole app and Tailwind's opacity
// modifiers (bg-surface/90, ring-accent/40) keep working.
const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: withOpacity("--c-canvas"),
        surface: withOpacity("--c-surface"),
        hairline: withOpacity("--c-hairline"),

        // Subtle neutral fills (formerly stone-50 / stone-100).
        muted: {
          DEFAULT: withOpacity("--c-muted"),
          strong: withOpacity("--c-muted-strong"),
        },

        ink: {
          DEFAULT: withOpacity("--c-ink"),
          muted: withOpacity("--c-ink-muted"),
          faint: withOpacity("--c-ink-faint"),
        },

        accent: {
          // `accent` is the FILL (buttons, brand mark); `accent-fg` sits on it.
          DEFAULT: withOpacity("--c-accent"),
          hover: withOpacity("--c-accent-hover"),
          fg: withOpacity("--c-accent-fg"),
          // `accent-ink` is accent used as FOREGROUND (icons, focus rings) —
          // lifted in dark mode so it stays legible on dark surfaces.
          ink: withOpacity("--c-accent-ink"),
        },

        danger: {
          DEFAULT: withOpacity("--c-danger"),
          bg: withOpacity("--c-danger-bg"),
          border: withOpacity("--c-danger-border"),
        },
        warn: {
          DEFAULT: withOpacity("--c-warn"),
          bg: withOpacity("--c-warn-bg"),
          border: withOpacity("--c-warn-border"),
        },
        info: {
          DEFAULT: withOpacity("--c-info"),
          bg: withOpacity("--c-info-bg"),
          border: withOpacity("--c-info-border"),
        },
        success: {
          DEFAULT: withOpacity("--c-success"),
          bg: withOpacity("--c-success-bg"),
          border: withOpacity("--c-success-border"),
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["11px", "16px"],
        xs: ["12px", "16px"],
        sm: ["13px", "18px"],
        base: ["14px", "20px"],
        lg: ["16px", "24px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
      },
      borderRadius: {
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
      },
      maxWidth: {
        content: "1100px",
      },
    },
  },
  plugins: [],
};
