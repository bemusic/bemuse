import './Boot.scss'
import template from './Boot.jade'
import version from 'bemuse/utils/version'

let boot = document.createElement('div')
boot.id = 'boot'
boot.className = 'Boot'
boot.innerHTML = template()

boot
  .querySelector('.js-version')
  .appendChild(document.createTextNode(`v${version}`))

document.body.appendChild(boot)

export function hide() {
  boot.style.display = 'none'
}

export function setStatus(text) {
  boot.querySelector('.js-status').textContent = text
}
