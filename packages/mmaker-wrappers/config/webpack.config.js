const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  devtool: "cheap-module-eval-source-map",
  entry: { index: ["./src/index.ts"] },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../build"),
    libraryTarget: "umd",
    umdNamedDefine: true,
    globalObject: "this"
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".svg"]
  },
  externals: [
    nodeExternals({
      modulesDir: path.resolve(__dirname, "../../../node_modules"),
      importType: "umd",
      whitelist: [
        //
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                "@babel/preset-react",
                [
                  "@babel/preset-env",
                  {
                    modules: false
                  }
                ]
              ],
              plugins: [
                [
                  require.resolve("babel-plugin-named-asset-import"),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: "@svgr/webpack?-svgo,+ref![path]"
                      }
                    }
                  }
                ]
              ]
            }
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  }
};
