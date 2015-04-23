
let now

if (window.performance && typeof window.performance.now === 'function') {
  now = () => window.performance.now()
} else {
  now = () => Date.now()
}

export { now }
export default now

