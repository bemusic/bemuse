
import through2    from 'through2'

export class Progress {

  constructor() {
    this._pending = 0
    this._in      = 0
    this._out     = 0
  }

  in() {
    this._pending += 1
    this._update()
    return through2.obj()
      .on('data', () => {
        this._in += 1
        this._update()
      })
      .on('end', () => {
        this._pending -= 1
        this._update()
      })
  }

  out() {
    return through2.obj()
      .on('data', () => {
        this._out += 1
        this._update()
      })
      .on('end', () => {
        process.stderr.write('\n')
      })
  }

  _update() {
    process.stderr.write('\rPacking ' + this._out + '/' + this._in)
  }

}
