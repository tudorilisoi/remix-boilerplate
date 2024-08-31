// see https://www.tailwind-kit.com/started

import plugin from "tailwindcss/plugin"

const textShadowPlugin = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      "text-shadow": (value) => ({
        textShadow: value,
      }),
    },
    { values: theme("textShadow") }
  )
})

module.exports = {
  important: false,
  // Active dark mode on class basis
  darkMode: "class",
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },

  content: ["./{src,app,pages}/**/*.{js,ts,jsx,tsx}"],
  // These options are passed through directly to PurgeCSS

  theme: {
    extend: {
      flexGrow: {
        2: "2",
        3: "3",
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
    },
  },

  daisyui: {
    // themes: ["halloween", "business", "corporate", "garden"],

    // NOTE see https://daisyui.com/theme-generator/
    themes: [
      "garden",
      {
        "e3-dark": {
          "color-scheme": "dark",
          // NOTE may extend or just provide the required colors below
          // ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          // these are required, the others are generated
          // NOTE read about the semantics here: https://daisyui.com/docs/colors/#-2
          primary: "#303f9f",
          secondary: "teal",
          accent: "#06b6d4",
          neutral: "#444",
          error: "#dc2828",
          "base-100": "#222",
        },
      },
    ],
  },
  plugins: [textShadowPlugin, require("@tailwindcss/typography"), require("daisyui")],
  future: {
    purgeLayersByDefault: true,
  },
}
