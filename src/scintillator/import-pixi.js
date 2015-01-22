
export default new Promise(function(resolve) {
  require.ensure('pixi.js', function(require) {
    resolve(require('pixi.js'))
  }, 'PIXI')
})
