// Public: Utilities for dealing with 2-character BMS event/keysound IDs.
//
// BMS charts reference keysounds and events using 2-character IDs.
// Traditionally these IDs are **base-36** (`0-9A-Z`) and are treated
// case-**insensitively** — `AA` and `aa` refer to the same object.
//
// Newer charts may opt in to **base-62** (`0-9a-zA-Z`) by declaring
// `#BASE 62` in the header. In base-62 mode, IDs are case-**sensitive**,
// so `Aa`, `AA`, and `aA` are three different objects.
/* module */

/**
 * Matches a header command that is indexed by a 2-character ID suffix,
 * such as `#WAVxx`, `#BMPxx`, `#BPMxx`, and `#STOPxx`.
 *
 * Group 1 is the command prefix (always case-insensitive) and group 2 is
 * the 2-character ID suffix (whose case matters only in base-62 mode).
 */
export const ID_INDEXED_COMMAND = /^(wav|bmp|bpm|stop)(\S\S)$/i

/**
 * Normalizes a 2-character keysound/event ID suffix according to the chart’s
 * numeric base.
 *
 * - In base-36 (and any other case-insensitive base, e.g. 16) the suffix is
 *   lowercased, preserving the historical case-insensitive behavior.
 * - In base-62 the original case is preserved, making IDs case-sensitive.
 *
 * @param suffix the raw ID suffix (usually 2 characters)
 * @param base the chart’s numeric base (36 by default, 62 for case-sensitive)
 */
export function normalizeIdSuffix(suffix: string, base: number): string {
  return base === 62 ? suffix : suffix.toLowerCase()
}
