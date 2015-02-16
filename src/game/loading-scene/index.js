
import $ from 'jquery'

export class LoadingScene {
  constructor() {
    this.element = $('<div><h1>Loading</h1></div>')[0]
  }
  attached() {
    console.log('DOM attached!')
  }
}

export default LoadingScene
