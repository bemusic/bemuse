
<h1 align="center">bms-js</h1>

<h3 align="center">BMS Parser for JavaScript</h3>

<p align="center">
  <a href="https://waffle.io/bemusic/bemuse?source=bemusic%2Fbms-js"><img src="http://img.shields.io/badge/wow%20much-waffle-green.svg?style=flat" alt="Waffles"></a>
  <a href="https://travis-ci.org/bemusic/bms-js"><img src="https://img.shields.io/travis/bemusic/bms-js.svg?style=flat" alt="Travis CI"></a>
  <a href="https://codeclimate.com/github/bemusic/bms-js"><img src="https://img.shields.io/codeclimate/github/bemusic/bms-js.svg?style=flat" alt="Code Climate"></a>
  <a href="https://coveralls.io/r/bemusic/bms-js"><img src="https://img.shields.io/coveralls/bemusic/bms-js.svg?style=flat" alt="Coveralls"></a>
  <a href="https://david-dm.org/bemusic/bms-js" title="Dependency status"><img src="https://david-dm.org/bemusic/bms-js.svg" alt="david-dm Dependency Status"></a>
  <a href="https://david-dm.org/bemusic/bms-js#info=devDependencies" title="devDependency status"><img src="https://david-dm.org/bemusic/bms-js/dev-status.svg" alt="david-dm Development Depedency Status"></a>
</p>

---

A [Be-Music Source](http://en.wikipedia.org/wiki/Be-Music_Source) file-format parser.
It is made primarily for usage in [BEMUSE](https://github.com/bemusic/bemuse).


BMS Parsing Stages
------------------

BMS will be parsed in three stages:

1. Use `bms.Reader` to turn a Buffer with BMS file content into a String.
    - Performs [character set detection](http://hitkey.nekokan.dyndns.info/cmds.htm#CHARSET). Since BMS file encoding varies.
        - This part is done by bemusepack to convert BMS file into UTF-8.
2. Use `bms.Compiler` to compile the String into a `BMSChart`.
    - Syntax-level processing is done here, such as:
        - \#RANDOM
        - \#SETRANDOM
        - \#SWITCH
    - Results in three primary data structures:
        - `headers` contains all BMS headers
        - `objects` contains all BMS objects on the timeline.
        - `timeSignature` contains the time signature information.
            - also allows converting from measure+fraction to beat
3. `BMSChart` contains all information needed to further process the song. These modules can then be used to extract information from `BMSChart`.
    - `SongInfo` allows looking up title, subtitle, artist, maker, and genre.
        - Implicit/multiplex subtitles taken into account here.
    - `Timing` allows conversion from beat to seconds.
        - BPM, BPM changes, STOP objects, and STP commands taken into account here.
    - `Positioning` allows conversion from beat to in-game position.
        - [SPEED and SCROLL commands (BEMUSE's BMS extensions)](http://bemusic.viewdocs.io/bemuse/BMS_EXTENSION.md) taken into account here.
    - `Notes` parses the notechart, resulting in in-game notes.
        - Channel mapping is taken into consideration here.
        - Normal notes and long notes taken into account here.
        - Also emits list of notes to autoplay.

Other Utility Classes
---------------------

- `Speedcore` allows calculation of position and velocity over a linear graph.
