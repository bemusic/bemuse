
BMS Parser for JavaScript
=========================

A [Be-Music Source](http://en.wikipedia.org/wiki/Be-Music_Source) file-format parser.
It is made primarily for usage in [BEMUSE](https://github.com/bemusic/bemuse).


BMS Parsing Stages
------------------

BMS will be parsed in three stages:

1. Use `bms.Reader` to turn a Buffer with BMS file content into a String.
    - Performs [character set detection](http://hitkey.nekokan.dyndns.info/cmds.htm#CHARSET). Since BMS file encoding varies.
        - This part is done by bemusepack to convert BMS file into UTF-8.
2. Use `bms.Compiler` to compile the String into a BMS chart.
    - Syntax-level processing is done here, such as:
        - \#RANDOM
        - \#SETRANDOM
        - \#SWITCH
3. Use `bms.Processor` to process the compiled BMS chart into a song.
    - We determine the beat, position, and time of each event.
    - Time signature, BPM, STOP, SCROLL is taken into account here.
