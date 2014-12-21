
var path = require('path')

module.exports = {
  context: path.join(__dirname, 'www'),
  entry: {
    boot: './src/boot'
  },
  output: {
    path: path.join(__dirname, 'www', 'build'),
    publicPath: '/build/',
    filename: '[name].js'
  },
  devServer: {
    contentBase: './www',
    publicPath: '/build/',
    stats: { colors: true },
  },
  module: {
    loaders: [
      { test: /\/www\/src\/.*\.js$/, loader: '6to5?modules=commonInterop&experimental=true'},
      { test: /\.scss$/, loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded' },
      { test: /\.css$/, loader: 'style!css!autoprefixer?browsers=last 2 version' },
      { test: /\.jade/, loader: 'jade' },
    ],
    postLoaders: [
      { test: /\/www\/src\/.*\.js$/, loader: 'istanbul-instrumenter' },
    ],
  },
  plugins: [
    function() {
      this.plugin('done', function(stats) {
        var hash = stats.hash
        var url = 'build/' + stats.toJson().assetsByChunkName.boot[0]
        require('fs').writeFileSync(path.join(__dirname, 'www', 'build', 'main.js'),
          'document.write("<script src=\\"' + url + '\\"><\\/script>")');
      })
    }
  ]
}
