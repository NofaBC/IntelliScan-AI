import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6eef8",
          100: "#ccddf1",
          200: "#99bbe3",
          300: "#6699d5",
          400: "#3377c7",
          500: "#004aad",
          600: "#003b8a",
          700: "#002c68",
          800: "#001e45",
          900: "#000f23",
        },
      },
    },
  },
  plugins: [],
};

export default config;
