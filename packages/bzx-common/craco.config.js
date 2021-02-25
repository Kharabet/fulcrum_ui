const webpack = require('webpack')
const path = require('path')
const dotenv = require('dotenv')
const gitCommitId = require('git-commit-id')
const fs = require('fs')

// Getting the config from dotenv if present (Normally only for local development)
if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const envVars = {
  GIT_COMMIT: gitCommitId({ cwd: path.resolve(__dirname, '../../') }).slice(0, 7),
  REACT_APP_ETH_NETWORK: process.env.REACT_APP_ETH_NETWORK
}

const networks = ['mainnet', 'kovan', 'ropsten', 'rinkeby', 'bsc']

// Check that we are passing a valid network for the build
if (!networks.includes(envVars.REACT_APP_ETH_NETWORK)) {
  throw new Error(`Invalid network specified during build. "${envVars.REACT_APP_ETH_NETWORK}"`)
}

console.log('Config', JSON.stringify(envVars, null, 2))

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      )
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1)
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf)
      if (oneOfRule) {
        const tsxRule = oneOfRule.oneOf.find(
          (rule) => rule.test && rule.test.toString().includes('tsx')
        )

        const newIncludePaths = [
          // relative path to my yarn workspace library
          path.resolve(__dirname, '../bzx-common')
        ]
        if (tsxRule) {
          if (Array.isArray(tsxRule.include)) {
            tsxRule.include = [...tsxRule.include, ...newIncludePaths]
          } else {
            tsxRule.include = [tsxRule.include, ...newIncludePaths]
          }
        }
      }
      return webpackConfig
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/(.*)BUILD_APP_NETWORK(\.*)/, function(resource) {
        resource.request = resource.request.replace(
          /BUILD_APP_NETWORK/,
          process.env.REACT_APP_ETH_NETWORK
        )
      }),
      new webpack.DefinePlugin({
        'process.env.GIT_COMMIT': JSON.stringify(envVars.GIT_COMMIT),
        'process.env.APP_VERSION': JSON.stringify(envVars.GIT_COMMIT)
      })
    ]
  },
  babel: {
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            src: './src',
            'bzx-common': '../bzx-common',
            'app-images': './src/assets/images',
            'app-lib': './src/lib',
            'app-services': './src/services',
            'shared-components': './src/shared-components',
            'ui-framework': './src/ui-framework'
          }
        }
      ]
    ]
  }
}
