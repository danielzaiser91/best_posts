const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const circular = new CircularDependencyPlugin({
  // exclude detection of files based on a RegExp
  exclude: /node_modules/,
  // add errors to webpack instead of warnings
  failOnError: true,
  // allow import cycles that include an asyncronous import,
  // e.g. via import(/* webpackMode: "weak" */ './file.js')
  allowAsyncCycles: false,
  // set the current working directory for displaying module paths
  cwd: process.cwd(),
});

// --- check bundle sizes ---
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// plugins: [new BundleAnalyzerPlugin()]

console.log('webpack-dev config applied!');

module.exports = {
  plugins: [
    circular
  ],
  devServer: {
    watchOptions: {
      aggregateTimeout: 1500
    },
  },
};
