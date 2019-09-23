const _ = require('lodash')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

const PROD = !process.env.WEBPACK_DEV
const BUILD_DIR = '/build/'
const BUILD_PATH = path.join(process.cwd(), BUILD_DIR)

const DEFAULT_FORCE_COMPILE_MODULES = [
  'startupjs/init',
  '@startupjs/init'
]
const DEFAULT_ALIAS = {
}

module.exports = function getConfig (env, {
  forceCompileModules = [],
  alias = {}
} = {}) {
  process.env.BABEL_ENV = 'server'

  if (typeof forceCompileModules === 'string') {
    forceCompileModules = JSON.parse(forceCompileModules)
  }
  if (typeof alias === 'string') {
    alias = JSON.parse(alias)
  }
  forceCompileModules = forceCompileModules.concat(DEFAULT_FORCE_COMPILE_MODULES)
  return _.pickBy({
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals({ whitelist: forceCompileModules })], // in order to ignore all modules in node_modules folder
    mode: PROD ? 'production' : 'development',
    devtool: 'source-map',
    entry: {
      server: ['@babel/polyfill', './server.js']
    },
    output: {
      path: BUILD_PATH,
      filename: PROD ? '[name].js' : '[name].dev.js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.server.js', '.server.jsx', '.js', '.jsx', '.json'],
      alias: {
        ...DEFAULT_ALIAS,
        ...alias
      }
    }
  }, Boolean)
}