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
        'neonblue': "#1f51ff",
        'beige': "#be9d6a",
        'cyan': "#00ffff",
        'magenta': "#ff00ff",
        'puce': "#CC8899",
        'icterine': "#FCF55F",
        'aubergine': "#472C4C",
        'xanadu': "#738678",
        'merigold': "#FCAE1E",
        'pickle': "#597D35",
        'mauve': "#7A4988",
        'landisilver': "#D87C14",
        'nuckla': "#426125",
        'boire': "#5E3B6D",
        'amarguinha': "#fdfbd4"
      },
      animation: {
        'gradient-x': 'gradient-x 6s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
