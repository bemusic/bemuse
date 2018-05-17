bemusepack — Packs BMS files into .bemuse archive
=================================================

BMS files need to be converted into `.bemuse` file format before playing on BE☆MU☆SE.
It is a simple file format to hold BMS files and keysound files together.
A custom format is created to be easily consumed by web applications, both on desktop and mobile devices.


File Format Specification
-------------------------

A `.bemuse` file contains

- an arbitrary metadata
- an opaque payload

Usually, the metadata describes what's inside the payload.


### File Format

- 10 bytes magic string `BEMUSEPACK`
- 4 bytes Uint32LE — metadata size N (may be 0 if no metadata)
- N bytes — metadata
- the rest of the file — payload


### Metadata

An entry file should have a metadata of more than 0 bytes.
It should be a valid JSON.
It describe all files both internal and external.
External packages should have metadata of 0 bytes.

```js
{
  version: 2,
  song: { title, artist, genre, ... },
  refs: [
    { size, hash }, // the first ref (0) describes its own payload
    { path, size, hash }, // ref 1's payload metadata
    ...
  ],
  files: [
    {
      name, type, size, hash,
      refs: [
        [ ref, start, end ], // start, end relative to payload
        ...
      ]
    }
  ]
}
```

