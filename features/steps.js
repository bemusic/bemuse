
import steps      from 'artstep'
import webdriver  from 'selenium-webdriver'
import { expect } from 'chai'

let { By, until } = webdriver

let driver = new webdriver.Builder()
  .forBrowser('firefox')
  .build()

function $(css, parent) {
  return (parent || driver).findElement(By.css(css))
}

function $$(css, parent) {
  return (parent || driver).findElements(By.css(css))
}

let { before, when, then, afterAll } = module.exports = steps()

before(function() {
})

when('I enter game', function*() {
  yield driver.get('http://localhost:8080/?mode=app')
})

then('I see the Start Game button')

when('I enter music selection screen', function*() {
  yield driver.get('http://localhost:8080/?mode=app')
})

then('I see a list of songs', function*() {
  expect(yield $('ul.music-list').isDisplayed()).to.eq(true)
})

when('I select (\\d+).. song', function*(n) {
  yield (yield $$('ul.music-list > li'))[n - 1].click()
})

then('the (\\d+).. song is selected', function*(n) {
  let a = yield $('.title', (yield $$('ul.music-list > li'))[n - 1]).getText()
  let b = yield $('.selected-song .song-info--title').getText()
  expect(a).to.equal(b)
})

afterAll(function*() {
  yield driver.quit()
})
