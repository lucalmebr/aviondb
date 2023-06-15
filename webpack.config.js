"use strict";

import path from "path";
import webpack from "webpack";
import { fileURLToPath } from "url";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
export default {
  entry: "./src/index.js",
  output: {
    library: {
      name: "AvionDB",
      type: "var"
    },
    filename: "./aviondb.min.js",
  },
  target: "web",
  devtool: "source-map",
  externals: {
    fs: "{}",
    mkdirp: "{}",
    "node:fs/promises": "{}", 
    "node:path": "{}" 
  },
  plugins: [
		new NodePolyfillPlugin(),
  ],
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["node_modules", path.resolve(__dirname, "./node_modules")],
    alias: {
      leveldown: "level-js",
    }
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
