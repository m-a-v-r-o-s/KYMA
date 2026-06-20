import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Villa Kyma — Aegean palette
        whitewash: "#FCFCFA",
        ink: "#20242A",
        aegean: {
          DEFAULT: "#123A5C", // deep sea blue (primary)
          dark: "#0E2C45",
          sea: "#2C6E8F", // mid sea
          wash: "#DCEAF0", // pale sky fill
        },
        sand: "#E8E0D2", // limestone
        sun: "#C9A24B", // warm accent, used sparingly
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: { container: "1180px" },
    },
  },
  plugins: [],
};
export default config;
