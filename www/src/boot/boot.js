
import "./boot.scss"
import * as template from "./boot.jade"

var boot = document.createElement('div')
boot.id = 'boot'
boot.innerHTML = template()
boot.querySelector('.js-progress-bar').classList.add('is-indeterminate')

document.body.appendChild(boot)

