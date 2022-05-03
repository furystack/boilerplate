/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const frontendPackage = require('./package.json')
const rootPackage = require('../package.json')

module.exports = {
  entry: './src/index.tsx',
  output: {
    publicPath: '/',
    path: path.resolve(`${__dirname}/bundle`),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true,
      APP_VERSION: rootPackage.version,
      FRONTEND_APP_VERSION: frontendPackage.version,
      REPOSITORY: rootPackage.repository,
      BUILD_DATE: new Date().toISOString(),
      SERVICE_URL: 'http://localhost:9090/api',
    }),
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.PNG$/, /\.svg$/, /\.eot$/, /\.woff$/, /\.woff2$/, /\.ttf$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
}
