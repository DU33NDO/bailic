import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        custom: "4px 0px 66px 0px rgba(0, 0, 0, 0.2)",
        "custom-hover": "0px 0px 55px 26px rgba(255, 90, 0, 0.2)",
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      boxShadow: ["focus"],
    },
  },
};

export default config;
