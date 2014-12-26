bemusepack — Packs BMS files into .bemuse archive
=================================================

BMS files need to be converted into `.bemuse` file format before playing on BE☆MU☆SE.
It is a simple file format to hold BMS files and keysound files together.
A custom format is created to be easily consumed by web applications, both on desktop and mobile devices.


File Format Specification
-------------------------

* 10 bytes magic string "BEMUSEPACK"
* 4 bytes - metadata size N (UInt32LE)
* N bytes - metadata in JSON format
  * song metadata
    * title
    * artist
    * genre
    * BPM
    * readme
  * list of all files
    * File name
    * File size
    * File offset (relative to payload start)
  * dependencies
    * list of objects
      * url: relative path to extra `.bemuse` file to load. [^1]
      * size: to be able to display progress
      * type: list of resource types such as "bms", "sound", "bga"
        * for efficiently loading needed resources
        * for example, dependencies without "bga" type will not be loaded when "bga" feature is turned off (or not implemented :trollface:)
* The payload
  * just a stream of bytes created from multiple files concatenated so that it can be sliced easily.

[^1]: There isn't a simple way to perform partial download of large files. One approach is to split the `.bemuse` file into several parts. Therefore, if the download fails, we don't have to re-download the whole thing.



