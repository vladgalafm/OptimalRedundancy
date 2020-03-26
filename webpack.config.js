const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  mode: 'development', // mode can be 'development', 'production' or 'none'. 'production' mode enables compressing for output file
  entry: './src/js/index.js', // An entry point indicates which module webpack should use to begin building
  output: { // The output property tells webpack where to emit the bundles it creates and how to name these files
    filename: 'js/main.js', // output.filename tells webpack the name of our bundle
    path: path.resolve(__dirname, 'dist/'), // output.path tells webpack where we want our bundle to be emitted to
    publicPath: '../', // this helps to find correct path to images from style.css
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
      chunkFilename: "[id].css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  cascade: false
                })
              ],
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  watch: true,
};