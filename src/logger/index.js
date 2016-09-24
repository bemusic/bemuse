
export function forModule (moduleName) {
  return {
    info: bindLogger(moduleName, 'info'),
    warn: bindLogger(moduleName, 'warn'),
    error: bindLogger(moduleName, 'error'),
  }
}

function bindLogger (moduleName, level) {
  return (...args) => {
    console.log(`[${new Date().toJSON()}] [${moduleName}] [${level}] ${require('util').format(...args)}`)
  }
}
