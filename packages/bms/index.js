
// Public: The `bms` package is a library for working with rhythm game data.
//
// Although this library’s name suggests that it is for BMS file format,
// almost every part can be used standalone.
//
// This package contains:
//
// - __Modules that reads and parses BMS files:__
//
//   - {Reader} reads the BMS file from a {Buffer}, detects the character set
//     and decodes the buffer using that character set into a {String}.
//   - {Compiler} reads the BMS source from a {String}, and converts into
//     {BMSChart}, an internal representation of a BMS notechart.
//
// - __Classes for representing a BMS notechart.__
//   These module stores the data as close to the BMS file format as possible.
//
//   Almost no musical interpretation is made.
//   For example, a BPM change is simply represented using a
//   BMSObject with `channel` = `03` or `08`.
//
//   - {BMSChart} is composed of {BMSHeaders}, {BMSObjects}, and {TimeSignatures}.
//   - {BMSHeaders} represents the header sentences in a BMS file.
//   - {BMSObjects} represents the objects in a BMS file.
//   - {BMSObject} represents a single object.
//
// - __Classes that represent different aspects of a notechart.__
//   Instance of these classes may be created from a {BMSChart},
//   but they can be used in a standalone manner as well.
//
//   This makes this library very flexible,
//   and able to accomodate different formats of notechart.
//   For example, see the [bmson](https://github.com/bemusic/bmson) package.
//
//   It’s also possible to use these classes in context other than music gaming,
//   for example, you can use these classes to help building a music player
//   that requires precise synchronization between beats.
//
//   - {TimeSignatures} represents a collection of time signatures
//     in a musical score, and lets you convert the measure number and fraction
//     into beat number.
//   - {Timing} represents the timing information in a musical score,
//     and provides methods to convert between musical time (beats) and
//     metric time (seconds).
//   - {SongInfo} represents the basic song information,
//     such as title, artist, and genre.
//   - {Notes} represents the sound objects inside your notechart.
//   - {Keysounds} represents a mapping between keysound ID and filename.
//   - {Positioning} represents a mapping between beat and in-game position.
//     Some rhythm game lets chart author control the amount of scrolling
//     per beat. In StepMania 5, this is called the scroll segments.
//   - {Spacing} represents a mapping between beat and note spacing.
//     Some rhythm game lets chart author change the note spacing (HI-SPEED)
//     dynamically. In StepMania 5, this is called the speed segments.
//
// - __Low-level utility classes:__
//
//   - {Speedcore} represents a linear animation.
//
/* module */

exports.Reader          = require('./reader')
exports.Compiler        = require('./compiler')

exports.BMSChart        = require('./bms/chart')
exports.BMSHeaders      = require('./bms/headers')
exports.BMSObjects      = require('./bms/objects')

exports.Speedcore       = require('./speedcore')
exports.TimeSignatures  = require('./time-signatures')
exports.Notes           = require('./notes')
exports.Timing          = require('./timing')
exports.SongInfo        = require('./song-info')
exports.Keysounds       = require('./keysounds')
exports.Positioning     = require('./positioning')
exports.Spacing         = require('./spacing')
