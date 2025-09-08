import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      container: { center: true, padding: "1rem" },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
