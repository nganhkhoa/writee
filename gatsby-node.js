const path = require('path');
const fs = require('fs');

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [
        path.resolve(__dirname, "src"),
        "node_modules",
      ],
      extensions: ['.js', '.jsx'],
      alias: {
        "@": path.resolve(__dirname, "src/components"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@layouts": path.resolve(__dirname, "src/layouts"),
        'react': path.resolve(__dirname, "node_modules/react")
      }
    },
    module : {
      rules : [
        {
          test : /\.jsx$/,
          ...loaders.js()
        }
      ]
    }
  })
}
