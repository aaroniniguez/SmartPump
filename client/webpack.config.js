const path = require("path");
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');
dotenv = require('dotenv').config({path: __dirname + '/../.env'});

module.exports = {
  entry: [
      "@babel/polyfill", "./src/index.js"
  ],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: { extensions: [".ts", ".tsx", "*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
  host:'0.0.0.0',
    open: true,
    openPage: "login",
    contentBase: path.join(__dirname, "src/public/"),
    port: process.env.CLIENT_PORT,
    publicPath: "http://"+process.env.HOST+"/dist/",
    historyApiFallback: true,
    // hotOnly: true,
    // hotOnly: true
  },
  plugins: [
	new webpack.HotModuleReplacementPlugin(),
	new Dotenv({path: "../.env"})
	]
};
