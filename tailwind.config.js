/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF9",
        surface: "#FFFFFF",
        hairline: "#E7E5E4",
        ink: {
          DEFAULT: "#1E293B",
          muted: "#64748B",
          faint: "#94A3B8",
        },
        accent: {
          DEFAULT: "#4338CA",
          hover: "#3730A3",
          ink: "#1E293B",
        },
        danger: "#DC2626",
        warn: "#D97706",
        info: "#0369A1",
        success: "#059669",
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
