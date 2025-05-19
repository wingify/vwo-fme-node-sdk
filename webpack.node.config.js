const webpack = require('webpack');
const path = require('path');
const semver = require('semver');
const nodeExternals = require('webpack-node-externals');
const packageFile = require('./package.json');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const PRODUCTION = 'production';

const libraryName = packageFile.name;
const libVersion = packageFile.version;
let deps = '';

Object.keys(packageFile.dependencies).map((key, index) => {
  deps += `\n ${index + 1}. ${key} - ${packageFile.dependencies[key]}`;
});

let libraryHeaderComment;

function addPlugins(argv) {
  const version = semver.inc(libVersion, argv.type) || libVersion;

  libraryHeaderComment = `${libraryName} - v${version}
URL - https://github.com/wingify/vwo-node-sdk

Copyright 2024-2025 Wingify Software Pvt. Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Dependencies used - ${deps}`;

  const plugins = [
    new webpack.BannerPlugin({
      banner: libraryHeaderComment,
      entryOnly: true,
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT
    })
  ];

  if (argv.env.analyze && argv.mode !== argv.PRODUCTION) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;
}

module.exports = function(_env, argv) {
  return {
    entry: {
      [libraryName]: './dist/server-unpacked/index.js'
    },
    mode: argv.mode === PRODUCTION ? 'production' : 'development',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist/server'),
      filename: () => {
        if (argv.mode === PRODUCTION) {
          return '[name].min.js';
        }

        return '[name].js';
      },
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules|lib/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js'],
    },
    target: 'node',
    externals: [nodeExternals()],
    plugins: addPlugins(argv)
  };
};
