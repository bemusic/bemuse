
import './boot.scss'
import template from './boot.jade'
import version from 'val!./version.js'

let boot = document.createElement('div')
boot.id = 'boot'
boot.className = 'bemuse-boot'
boot.innerHTML = template()

let bar = boot.querySelector('.js-progress-bar')
bar.classList.add('is-indeterminate')

boot.querySelector('.js-version').appendChild(
  document.createTextNode(`v${version}`))

document.body.appendChild(boot)

export function hide() {
  boot.style.display = 'none'
}

export function setProgress(progress) {
  if (progress === null) {
    bar.classList.add('is-indeterminate')
    bar.style.width = ''
  } else {
    bar.classList.remove('is-indeterminate')
    bar.style.width = (progress * 100).toFixed(2) + '%'
  }
}

