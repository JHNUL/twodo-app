const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

const config = {
  entry: './src/index.ts',
  externalsPresets: { node: true },
  node: {
    __dirname: false,
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [webpackNodeExternals()],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};

module.exports = config;
