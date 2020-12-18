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
    }
  },
  babel: {
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'bzx-common': '../bzx-common'
          }
        }
      ]
    ]
  }
}
