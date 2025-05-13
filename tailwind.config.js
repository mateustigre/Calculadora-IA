/** @type {import('tailwindcss').Config} */

import svgr from 'vite-plugin-svgr';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        artegra: ['ArtegraSans', 'sans-serif'],
      },
      colors: {
        mindblack: '#26252B',
        mindpurple: '#C16AD5',
        minddeep: '#7042BF',
        mindgreen: '#78CF48',
        mindsoft: '#F1D4EF',
        minddark: '#261542',
      },
    },
  },
  plugins: [],
};