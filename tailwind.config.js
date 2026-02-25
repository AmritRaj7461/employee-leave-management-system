/** @type {import('tailwindcss').Config} */
export default {
  // 1. Content tells Tailwind which files to scan
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // 2. CRITICAL: This must be 'class' for your ThemeContext to work
  darkMode: "class",

  // 3. Safelist must be at this level (Top Level)
  safelist: [
    "bg-orange-50",
    "text-orange-500",
    "dark:bg-orange-900/20",
    "bg-emerald-50",
    "text-emerald-500",
    "dark:bg-emerald-900/20",
    "bg-blue-50",
    "text-blue-500",
    "dark:bg-blue-900/20",
    "text-orange-600",
    "text-emerald-600",
    "text-blue-600",
    "dark:text-orange-400",
    "dark:text-emerald-400",
    "dark:text-blue-400",
  ],

  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
