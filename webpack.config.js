/* eslint-disable global-require */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
//++++++++++++++++++++++++++++++++++++++++++++++++
//* entry
const src = 'src';
const entryFileName = 'index.js';
//* output
const dist = 'dist';
//* HTMLWebpackPlugin
const HTMLWebpackPluginProps = { title: 'Игра в пары' };
//* FaviconsWebpackPlugin
const favicon = path.resolve(__dirname, 'assets/img/favicon.png');
//* dev server
const PORT = 3000;
const browser = 'chrome';

module.exports = (env) => ({
  entry: path.resolve(__dirname, `${src}/${entryFileName}`),
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, dist),
    clean: true,
  },
  //* development
  devtool: 'eval-source-map',
  devServer: {
    port: PORT,
    open: {
      app: {
        name: browser,
      },
    },
    static: {
      directory: path.join(__dirname, dist),
      watch: true,
    },
  },
  //* plugins
  plugins: [
    new HTMLWebpackPlugin(HTMLWebpackPluginProps),
    new MiniCssExtractPlugin({
      filename: env.prod ? '[name].[contenthash].css' : '[name].css',
    }),
    new FaviconsWebpackPlugin(favicon),
  ],
  //* module
  module: {
    rules: [
      // babel
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader' },
      },
      // css
      {
        test: /\.css$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      // scss
      {
        test: /\.scss$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: { implementation: require('sass') },
          },
        ],
      },
      // images
      {
        test: /\.(webp|jpe?g|png|svg|gif)$/i,
        type: 'asset/resource',
      },
      // fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  //* optimization
  optimization: {
    minimizer: [
      // css
      new CssMinimizerPlugin(),
      // images
      new ImageMinimizerPlugin({
        minimizer: [
          {
            implementation: ImageMinimizerPlugin.squooshMinify,
            options: {
              encodeOptions: {
                mozjpeg: {
                  quality: 100,
                },
                webp: {
                  lossless: 1,
                },
                avif: {
                  cqLevel: 0,
                },
              },
            },
          },
        ],
      }),
    ],
    // chunks
    splitChunks: {
      chunks: 'all',
    },
  },
});
