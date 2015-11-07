
import PIXI from 'pixi.js'
import MAIN from 'bemuse/utils/main-element'

export function main () {
  let renderer = PIXI.autoDetectRenderer(640, 480)
  let stage = new PIXI.Stage(0x8b8685)
  let loader = new PIXI.AssetLoader([
    '/skins/default/Fonts/BemuseDefault-Meticulous.fnt',
    '/skins/default/Fonts/BemuseDefault-Other.fnt',
  ])
  loader.onComplete = function () {
    let text = new PIXI.BitmapText('*1234567890', {
      font: 'BemuseDefault-Meticulous'
    })
    stage.addChild(text)
    let text2 = new PIXI.BitmapText('01', {
      font: 'BemuseDefault-Other'
    })
    text2.y = 100
    stage.addChild(text2)
    render()
    console.log('Ok')
  }
  loader.load()
  function render () {
    renderer.render(stage)
  }
  MAIN.appendChild(renderer.view)
  render()
}
