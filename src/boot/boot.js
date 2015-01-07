
import './boot.scss'
import template from './boot.jade'
import version from 'val!./version.js'

var boot = document.createElement('div')
boot.id = 'boot'
boot.innerHTML = template()
boot.querySelector('.js-progress-bar').classList.add('is-indeterminate')
boot.querySelector('.js-version').appendChild(
  document.createTextNode(`v${version}`))

document.body.appendChild(boot)

export function disappear() {
  boot.style.display = 'none'
}

