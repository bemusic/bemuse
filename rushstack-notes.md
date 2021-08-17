# Notes on migrating to Rushstack

- For packages, replace existing tooling with [Hesft](https://rushstack.io/pages/heft/overview/).
- For main Bemuse project, keep existing tooling.

## Migrating to Heft.

- `config/rig.json`:

  ```json
  {
    "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",

    "rigPackageName": "@rushstack/heft-web-rig",
    "rigProfile": "library"
  }
  ```

- `.gitignore`

  ```
  lib/
  lib-commonjs/
  ```

- Replace Mocha with Jest. For convenience, keep Chai.

  - Rename files to `*.test.ts`.