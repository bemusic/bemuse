export function forModule(moduleName: string) {
  return {
    info: bindLogger(moduleName, 'info'),
    warn: bindLogger(moduleName, 'warn'),
    error: bindLogger(moduleName, 'error'),
  }
}

function bindLogger(moduleName: string, level: 'info' | 'warn' | 'error') {
  return (...args: any[]) => {
    console.log(
      `[${new Date().toJSON()}] [${moduleName}] [${level}] ${require('util').format(
        ...args
      )}`
    )
  }
}
