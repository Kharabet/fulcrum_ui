const webpack = require('webpack')
const path = require('path')

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
          path.resolve(__dirname, '../common')
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
      new webpack.NormalModuleReplacementPlugin(/(.*)BUILD_APP_NETWORK(\.*)/, function (resource) {
        resource.request = resource.request.replace(/BUILD_APP_NETWORK/, process.env.REACT_APP_ETH_NETWORK)
      }),
    ]
  },
  babel: {
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'src': './src',
            'bzx-common': '../common',
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
