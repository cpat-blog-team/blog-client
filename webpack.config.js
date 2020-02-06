const webpack = require("webpack");
const path = require("path");

const config = {
  entry: "./src/index.tsx",
  output: { path: path.resolve(__dirname, "public"), filename: "bundle.js" },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: "awesome-typescript-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png"
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: "file-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"]
  }
};

module.exports = config;
