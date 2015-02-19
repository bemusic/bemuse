module.exports = function(source) {
  return this.exec(source, this.resource)()
}
