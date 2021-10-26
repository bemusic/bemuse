---
id: bemusepack
title: The .bemuse File Format
sidebar_label: .bemuse File Format
---

The `.bemuse` file format is created for efficient distribution of sound assets
(`.ogg`) files over the web browser. Before we created the `.bemuse` file
format, we considered the following more conventional approaches:

- Distribute `.ogg` files individually: This would lead to hundreds of small
  files per song. This can make loading slow, due to the many HTTP requests.

- Distribute all sounds packaged in a `.zip` archive: This would lead to files
  that are about 20 megabytes large. In case of a download failure, the whole 20
  megabyte file would have to be downloaded again.

The `.bemuse` file format aims to strike a balance between these two extremes.
We bundle many `.ogg` files into chunks of around 1.4 MB. There are two types of
file:

- `metadata.json` (index file)
- `*.bemuse` (sound data chunk file)

## `metadata.json` (index file)

```ts
{
  files: Array<{
    name: string
    ref: [index: number, start: number, end: number]
  }>
  refs: Array<{
    path: string
    hash: string
    size: number
  }>
}
```

The metadata file is JSON-based.

- The `files` array contains a list of all available sound files.
  - `name` The sound file name, e.g. `snare.ogg`.
  - `ref` An array of three numbers that define the sound data:
    - The index of the chunk at which the sound data resides.
    - The index of the first byte in the chunk payload where the sound data
      starts.
    - The index of the last byte in the chunk payload where the sound data ends.
- The `refs` array contains info about where each chunk is located.
  - `path` Relative URL where the chunk file can be downloaded.
  - `hash` MD5 hash of the chunk file content.
  - `size` Size of the file in bytes.

## `*.bemuse` (sound data chunk file)

This file is a binary format.

- First 10 bytes: Signature string: `BEMUSEPACK`.
- Next 4 bytes: All zeroes (legacy reasons).
- Chunk payload follows. This can contain arbitrary data.

## Example

```json
{
  "files": [
    { "name": "beat.ogg", "ref": [0, 0, 1596631] },
    { "name": "bgm.ogg", "ref": [1, 0, 1574274] },
    { "name": "synth.ogg", "ref": [2, 0, 1350505] },
    { "name": "cymbal.ogg", "ref": [2, 1350505, 1415370] },
    { "name": "snare.ogg", "ref": [2, 1415370, 1430427] }
  ],
  "refs": [
    {
      "path": "oggs.0.f7f0e987.bemuse",
      "hash": "f7f0e987c5b9070b29d66b74c4b77609",
      "size": 1596645
    },
    {
      "path": "oggs.1.03981ebc.bemuse",
      "hash": "03981ebc7f52705fb44063de5a79930b",
      "size": 1574288
    },
    {
      "path": "oggs.2.8ed2dece.bemuse",
      "hash": "8ed2dece0eef7cd65195d7ef6a72708d",
      "size": 1430441
    }
  ]
}
```

For example, if you want to access the contents of `snare.ogg`, the following
steps can be followed:

1. Look for the entry whose name is `snare.ogg`.
2. Look at the ref. In this case, `[2, 1415370, 1430427]`.
3. Look at `refs[file.ref[0]].path`. In this case, `oggs.2.8ed2dece.bemuse`.
4. Download that file and take the `.slice(file.ref[1] + 14, file.ref[2] + 14)`.
