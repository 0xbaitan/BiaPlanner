/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "@shared": path.resolve(__dirname, "..", "shared/build"),
    },
    configure: (webpackConfig) => {
      // Modify webpackConfig here if needed
      webpackConfig.watchOptions = {
        poll: 1000, // Polling interval in milliseconds
      };
      return webpackConfig;
    },
  },

  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },

  eslint: {
    enable: true, // Enable or disable ESLint
    mode: "extends", // Use "extends" mode for the ESLint configuration
    configure: {
      // Your custom ESLint configuration goes here
      extends: ["react-app", "react-app/jest"],
      rules: {
        // Customize ESLint rules here
        "no-unused-vars": "warn",
        "react/prop-types": "off",
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, "node_modules", "bootstrap"),
                  path.resolve(__dirname, "src"),
                  path.resolve(__dirname, "src/styles/common.scss"),
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
