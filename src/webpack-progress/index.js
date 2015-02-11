
module.exports = function ProgressPlugin() {
  return function ProgressPluginInstance() {
    this.plugin('compilation', function(compilation) {
      compilation.mainTemplate.plugin('require-ensure', function(result) {
        result = result.replace('head.appendChild(script);', function() {
          return 'window.WebpackLoadingContext ? ' +
            'window.WebpackLoadingContext.load(script, head) : ' +
            'head.appendChild(script);'
        })
        return result
      })
    })
  }
}
