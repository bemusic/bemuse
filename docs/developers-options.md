---
id: developers-options
title: Game Options and Configuration
sidebar_label: Options
---

This page lists various options for configuring game objects.

## Options for Loading Game

  - bms  
    A `Resource` object for the BMS file to play.

  - assets  
    A `Resources` object that contains the BMS resources needed by the
    BMS file: keysounds, images, and movies, for example.

  - metadata  
    An `Object` containing [song metadata](#song-metadata).

  - options  
    An `Object` containing [game options](#game-options).

## Song Metadata

  - title  
    A `String` representing the song title.

  - artist  
    A `String` representing the song's artist.

  - genre  
    A `String` representing the song's genre.

  - subtitles  
    A `Array` of `String` representing the song's subtitles.

  - subartists  
    A `Array` of `String` representing the song's sub-artists. This may
    include BGA maker and note charter.

  - volwav  
    The playback volume of the BMS. This metadata overrides the [BMS
    \#VOLWAV](http://hitkey.nekokan.dyndns.info/cmds.htm#VOLWAV) header.

## Game Options

  - players  
    An `array` of [player options](#player-options).

## Player Options

  - speed  
    The speed effector.
