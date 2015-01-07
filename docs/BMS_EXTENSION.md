
BE☆MU☆SE's BMS EXTENSIONS
=========================


Base36 Channels
---------------

Most BMS players support Base10 (00-99) and Base16 (00-FF) channels.
I don't want to deal with number clashes in the future,
so I took the liberty to extend the support for channel numbers into Base36 (00-ZZ).

This allows more meaningful channel names, such as `#xxxSC` for scrolling factor and `#xxxSP` for spacing factor.


Speed and Scroll Segments
-------------------------

Speed and scroll segments are introduced in StepMania 5
to dynamically change notes spacing and notes scrolling speed.


### `#SCROLLxx yyy.zzz` and `#xxxSC`


### `#SPEEDxx yyy.zzz` and `#xxxSP`


Extension Lines
---------------

### `#EXT #xxxyy:....`

Since old BMS editors drops unknown command line, we can prefix them with `#EXT` to have it not parsed by them.

