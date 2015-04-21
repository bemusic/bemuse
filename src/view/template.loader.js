module.exports = function(source) {
  this.cacheable()
  return this.exec(source, this.resource)()
}
