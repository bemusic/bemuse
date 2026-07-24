// Loads every `*.spec.{js,ts,tsx}` under `src/` so that the `describe`/`it`
// blocks they declare register with Mocha.
//
// This replaces the former webpack `require.context('..', true, ...)` with
// Vite's `import.meta.glob`. The modules are loaded lazily and awaited (rather
// than eagerly imported) so that they only evaluate *after* Mocha's `bdd`
// interface has been installed by `prepareTestEnvironment()` — otherwise the
// global `describe`/`it` would not yet be defined when a spec module runs.
export async function loadSpecs() {
  const modules = import.meta.glob('../**/*.spec.{js,ts,tsx}')
  for (const key of Object.keys(modules).sort()) {
    await modules[key]()
  }
}

export default loadSpecs
