/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        acnu: {
          primary: "var(--acnu-primary)",
          dark: "var(--acnu-dark)",
          accent: "var(--acnu-accent)",
        },
        gris: "#F4F6F8",
      },
    },
  },
  plugins: [],
};
