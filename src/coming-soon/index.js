
import template from './template.jade'
import 'style!./style.scss'

var div = document.createElement('div')
div.className = 'coming-soon'
div.innerHTML = template()

document.body.appendChild(div)
