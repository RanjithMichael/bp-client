/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // blue-600
        secondary: "#9333ea", // purple-600
        accent: "#f97316",    // orange-500
      },
    },
  },
  plugins: [],
}

