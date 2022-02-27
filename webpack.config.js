const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = (_, argv) => ({
  entry: {
    stack: path.resolve(__dirname, "./src/scripts/stack.ts"),
    imagetool: path.resolve(__dirname, "./src/scripts/imagetool.ts"),
    particle: path.resolve(__dirname, "./src/scripts/particle.ts"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  target: "web",
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BASE_URL: JSON.stringify(argv.mode === 'production' ? '/pixijs-tests' : ''),
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      title: "Pixi Tests - Stack",
      filename: "stack.html",
      chunks: ["stack"],
      template: "src/template.html",
    }),

    new HtmlWebpackPlugin({
      inject: true,
      title: "Pixi Tests - Image Tool",
      filename: "imagetool.html",
      chunks: ["imagetool"],
      template: "src/template.html",
    }),

    new HtmlWebpackPlugin({
      inject: true,
      title: "Pixi Tests - Particle",
      filename: "particle.html",
      chunks: ["particle"],
      template: "src/template.html",
    }),

    new HtmlWebpackPlugin({
      inject: false,
      title: "Pixi Tests",
      chunks: [],
      template: "src/index.html",
    }),

    new CopyWebpackPlugin({
      patterns: [{ from: "src/assets", to: "assets" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
  },
});
