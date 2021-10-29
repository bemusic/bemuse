import Bluebird from 'bluebird'

// Disabled for purely historical reasons.
/* eslint no-extend-native: off */

function wrapBluebirdInstanceMethod<K extends keyof Bluebird<any>>(
  methodName: K
) {
  return function (this: PromiseLike<any>, ...args: any[]): any {
    const wrapped = Bluebird.resolve(this) as any
    return Promise.resolve(wrapped[methodName](...args))
  }
}

function wrapBluebirdStaticMethod<K extends keyof typeof Bluebird>(
  methodName: K
) {
  return function (this: typeof Bluebird, ...args: any[]): any {
    return Promise.resolve((Bluebird[methodName] as any).apply(Bluebird, args))
  }
}

declare global {
  interface Promise<T> {
    error: Bluebird<T>['error']
    bind: Bluebird<T>['bind']
    props: Bluebird<T>['props']
    map: Bluebird<T>['map']
    reduce: Bluebird<T>['reduce']
    filter: Bluebird<T>['filter']
    tap: Bluebird<T>['tap']
    get: Bluebird<T>['get']
    done: Bluebird<T>['done']
  }
  interface PromiseConstructor {
    try: typeof Bluebird.try
    promisify: typeof Bluebird.promisify
    delay: typeof Bluebird.delay
    map: typeof Bluebird.map
  }
}

Promise.prototype.error = wrapBluebirdInstanceMethod('error')
Promise.prototype.bind = wrapBluebirdInstanceMethod('bind')
Promise.prototype.props = wrapBluebirdInstanceMethod('props')
Promise.prototype.map = wrapBluebirdInstanceMethod('map')
Promise.prototype.reduce = wrapBluebirdInstanceMethod('reduce')
Promise.prototype.filter = wrapBluebirdInstanceMethod('filter')
Promise.prototype.tap = wrapBluebirdInstanceMethod('tap')
Promise.prototype.get = wrapBluebirdInstanceMethod('get')
Promise.prototype.done = wrapBluebirdInstanceMethod('done')

Promise.try = wrapBluebirdStaticMethod('try')
Promise.promisify = wrapBluebirdStaticMethod('promisify')
Promise.delay = wrapBluebirdStaticMethod('delay')
Promise.map = wrapBluebirdStaticMethod('map')
