
Game Options and Configuration
==============================

This page lists various options for configuring game objects.

.. contents::
   :local:

Options for Loading Game
------------------------

bms
  A ``Resource`` object for the BMS file to play.
assets
  A ``Resources`` object that contains the BMS resources needed by the BMS file:
  keysounds, images, and movies, for example.
metadata
  An ``Object`` containing `song metadata`_.
options
  An ``Object`` containing `game options`_.


Song Metadata
-------------

title
  A ``String`` representing the song title.
artist
  A ``String`` representing the song's artist.
genre
  A ``String`` representing the song's genre.
subtitles
  A ``Array`` of ``String`` representing the song's subtitles.
subartists
  A ``Array`` of ``String`` representing the song's sub-artists.
  This may include BGA maker and note charter.
volwav
  The playback volume of the BMS.
  This metadata overrides the `BMS #VOLWAV`_ header.

.. _BMS #VOLWAV: http://hitkey.nekokan.dyndns.info/cmds.htm#VOLWAV



Game Options
------------

players
  An ``array`` of `player options`_.


Player Options
--------------

speed
  The speed effector.





