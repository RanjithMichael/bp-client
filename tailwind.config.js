/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"], 
      },
      colors: {
        brand: {
          blue: "#1e40af",   // Tailwind blue-800
          green: "#16a34a",  // Tailwind green-600
          red: "#dc2626",    // Tailwind red-600
        },
      },
    },
  },
  plugins: [],
};
