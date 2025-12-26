import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            code: {
              color: "#78350f",
              backgroundColor: "#fef3c7",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
              fontWeight: "400",
            },
            "pre code": {
              color: "inherit",
              backgroundColor: "inherit",
              padding: "0",
              borderRadius: "0",
            },
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
