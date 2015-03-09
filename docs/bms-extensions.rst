
Bemuse's BMS Extensions
=======================


Base36 Channels
---------------

Most BMS players support Base10 (00-99) and Base16 (00-FF) channels.
I don't want to deal with number clashes in the future,
so I took the liberty to extend the support for channel numbers into Base36 (00-ZZ).

This allows more meaningful channel names,
such as ``#xxxSC`` for scrolling factor and ``#xxxSP`` for spacing factor.


Speed and Scroll Segments
-------------------------

::

  #SCROLL01 1
  #SCROLL02 0.5
  #SPEED01 1
  #SPEED02 0.5
  #001SC:01020102
  #001SP:01020102

History
~~~~~~~

Speed and scroll segments are introduced in StepMania 5
to dynamically change notes spacing and notes scrolling speed.
This allows scrolling effects to be created without relying on BPM changes
or STOPs.


Extension Lines
---------------

::

  #EXT #xxxyy:....


