
import steps      from 'artstep'
import webdriver  from 'selenium-webdriver'
import { expect } from 'chai'
import path       from '../config/path'

require('chai').use(require('chai-as-promised'))

global.expect = expect

let { By, until, WebElement } = webdriver

let driver = new webdriver.Builder()
  .forBrowser('firefox')
  .build()

function $(css, parent) {
  return (parent || driver).findElement(By.css(css))
}

function $$(css, parent) {
  return (parent || driver).findElements(By.css(css))
}

let { before, given, when, then, afterAll } = module.exports = steps()

afterAll(function*() {
  yield driver.quit()
})

// Title ======================================================================

when('I enter game', function*() {
  yield driver.get('http://localhost:8080/?mode=app')
})

then('I see the Start Game button')

// Music Selection ============================================================

given('I am in music selection screen', function*() {
  yield driver.get('http://localhost:8080/?mode=app')
  yield driver.wait(until.elementLocated(By.css('.music-select-scene')))
})

then('I see a list of songs', function*() {
  expect(yield $('ul.music-list').isDisplayed()).to.eq(true)
})

when('I select $nth song', function*(n) {
  yield (yield $$('ul.music-list > li'))[parseInt(n, 10) - 1].click()
})

then('the $nth song is selected', function*(n) {
  let songs   = yield $$('ul.music-list > li')
  let song    = songs[parseInt(n, 10) - 1]
  let active  = yield $('ul.music-list > li.active')
  yield expect(WebElement.equals(song, active)).to.eventually.be.true
})
