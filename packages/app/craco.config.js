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
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
require("inspector");

module.exports = {
  babel: {
    presets: [
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
        },
      ],
    ],
    plugins: [
      [
        "@locator/babel-jsx/dist",
        {
          env: "development",
        },
      ],
    ],
  },
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

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
        new NodePolyfillPlugin()
      );

      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        buffer: require.resolve("buffer"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        url: require.resolve("url"),
        util: require.resolve("util"),
        zlib: require.resolve("browserify-zlib"),
        "process/browser": require.resolve("process/browser"),
      };
      return webpackConfig;
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
