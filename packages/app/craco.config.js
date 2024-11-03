/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * References:
 *
 * [1] Wieruch, R. (2020). How to use ESLint in Webpack 5 - Setup Tutorial. [online] robinwieruch.de.
 *     Available at: https://www.robinwieruch.de/webpack-eslint/ [Accessed 16 Oct. 2024].
 *
 */
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { url } = require("inspector");

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4000", // Your backend server address
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },

  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
    configure: (webpackConfig) => {
      // Modify webpackConfig here if needed
      webpackConfig.watchOptions = {
        poll: 300, // Polling interval in milliseconds
      };
      return webpackConfig;
    },
    plugins: [new NodePolyfillPlugin()],
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        url: require.resolve("url"),
        perf_hooks: false,
        async_hooks: false,
        repl: false,
        net: false,
        "class-transformer/storage": false,
      },
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
                includePaths: [path.resolve(__dirname, "node_modules", "bootstrap"), path.resolve(__dirname, "src"), path.resolve(__dirname, "src/styles/common.scss")],
              },
            },
          },
        ],
      },
    ],
  },
};
