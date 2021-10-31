# bemuse/promise

Can you imagine a time where when you want to use promises, you have to install a third party library to polyfill it? That was the time when we started developing Bemuse.

We chose to use [Bluebird](http://bluebirdjs.com/) to polyfill the Promise API,
because at that time Bluebird was the [fastest performing](http://bluebirdjs.com/docs/benchmarks.html) polyfill and also the most popular one.

Bluebird not only provides the Promise API, but also a number of useful utility methods, such as `.map`, `.tap`, `.get`, `.done`, `.timeout`, etc. Depending on these non-standard methods was one of the biggest regrets 5 years later.

Fast forward to the present, virtually every JavaScript engine has already implemented Promise API. However, the native Promise objects don’t have the Bluebird’s methods that Bemuse uses so extensively. Previously, we would solve this issue by replacing the native Promise with Bluebird’s:

```js
global.Promise = require('bluebird');
```

This worked for us for a while. It was the time where JavaScript runtimes still doesn’t support async functions yet, so code using async function would have to be transpiled, and the transpiled async function would return an instance of a Bluebird promise.

But now, virtually every JavaScript engine has implemented async/await. We started facing problems when we decided to no longer transpile async/await code. Why? Because even though we replaced the global Promise class with Bluebird, native async functions will always return a native Promise when called. Our code stopped working due to errors like this:

```
	TypeError: Promise.resolve(...).tap is not a function
```

The `bemuse/promise` library, instead of replacing the native Promise class with Bluebird, monkey-patches the native Promise to add the Bluebird methods to it. It is limited to the methods and APIs we use in Bemuse.