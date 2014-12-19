
module.exports = function() {

this.Given(/^a BMS file as follows$/, function (string, callback) {
  callback.pending()
})

this.Then(/^there should be (\d+) header sentences$/, function (arg1, callback) {
  callback.pending()
})

this.Then(/^there should be (\d+) channel sentence$/, function (arg1, callback) {
  callback.pending()
})

this.Then(/^the header "([^"]*)" should have value "([^"]*)"$/, function (arg1, arg2, callback) {
  callback.pending()
})

this.Then(/^there should be (\d+) objects$/, function (arg1, callback) {
  callback.pending()
})

this.Then(/^there should be (\d+) object at beat (\d+)$/, function (arg1, arg2, callback) {
  callback.pending()
})

}
