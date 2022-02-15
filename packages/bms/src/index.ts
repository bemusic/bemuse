/**
 * The `bms` package is a library for working with rhythm game data.
 *
 * Although this library’s name suggests that it is for BMS file format,
 * almost every part can be used independently.
 *
 * @remarks
 * This package contains:
 *
 * Modules that reads and parses BMS files:
 * {@link Reader} reads the BMS file from a `Buffer`, detects the character set
 * and decodes the buffer using that character set into a string,
 * {@link Compiler} reads the BMS source from a string, and converts into
 * {@link BMSChart}, an internal representation of a BMS notechart.
 *
 * Classes for representing a BMS notechart:
 * {@link BMSChart} is composed of {@link BMSHeaders} and {@link BMSObjects}.
 * It the data as close to the BMS file format as possible.
 * Almost no musical interpretation is made (except for {@link TimeSignatures}).
 * For example, a BPM change is simply represented using a {@link BMSObject} with `channel` = `03` or `08`.
 *
 * Classes that represent different musical aspects of a notechart:
 * {@link TimeSignatures}, {@link Timing}, {@link SongInfo}, {@link Notes},
 * {@link Keysounds}, {@link Positioning} and {@link Spacing}.
 * Instance of these classes are usually created from a {@link BMSChart},
 * but they can be used in a standalone manner as well.
 *
 * Low-level utility classes: {@link Speedcore}.
 * These classes are used for lower-level operations such as keyframing
 * and linear interpolation.
 *
 * This makes this library very flexible, and able to accommodate different formats of notechart.
 * For example, the {@link https://github.com/bemusic/bmson | bmson} package provides
 * support for the BMSON format.
 *
 * It’s also possible to use these classes in context other than music gaming,
 * for example, you can use these classes to help building a music player
 * that requires precise synchronization between beats.
 *
 * @packageDocumentation
 */

import * as Reader from './reader'
import * as Compiler from './compiler'

export { Reader, Compiler }
export * from './reader/types'

export * from './bms/chart'
export * from './bms/headers'
export * from './bms/objects'

export * from './speedcore'
export * from './time-signatures'
export * from './notes'
export * from './timing'
export * from './song-info'
export * from './keysounds'
export * from './positioning'
export * from './spacing'
