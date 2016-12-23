/* eslint import/no-extraneous-dependencies: off */
import webpack from 'webpack';
import path from 'path';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const isProduction = process.env.NODE_ENV === 'production';

const devtool = isProduction ? 'eval' : 'inline-source-map';
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
    },
  }),
];
if (isProduction) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
  }));
}

export default {
  entry: {
    bundle: path.join(__dirname, 'src/main'),
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel'],
      },
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          mimetype: 'application/octet-stream',
        },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          mimetype: 'image/svg+xml',
        },
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  target: 'electron-renderer',
  devtool,
  plugins,
};
