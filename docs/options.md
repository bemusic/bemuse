---
id: options
title: Game Options and Configuration
sidebar_label: Options
---

This page lists various options for configuring game objects.

## Options for Loading Game

<dl>
  <dt>bms</dt>
  <dd>A <code>Resource</code> object for the BMS file to play.</dd>

  <dt>assets</dt>
  <dd>A <code>Resources</code> object that contains the BMS resources needed by the
    BMS file: keysounds, images, and movies, for example.</dd>

  <dt>metadata</dt>
  <dd>An <code>Object</code> containing <a href="#song-metadata">song metadata</a>.</dd>

  <dt>options</dt>
  <dd>An <code>Object</code> containing <a href="#game-options">game options</a>.</dd>
</dl>

## Song Metadata

<dl>
  <dt>title</dt>
  <dd>A <code>String</code> representing the song title.</dd>

  <dt>artist</dt>
  <dd>A <code>String</code> representing the song's artist.</dd>

  <dt>genre</dt>
  <dd>A <code>String</code> representing the song's genre.</dd>

  <dt>subtitles</dt>
  <dd>A <code>Array</code> of <code>String</code> representing the song's subtitles.</dd>

  <dt>subartists</dt>
  <dd>A <code>Array</code> of <code>String</code> representing the song's sub-artists. This may
    include BGA maker and note charter.</dd>

  <dt>volwav</dt>
  <dd>The playback volume of the BMS. This metadata overrides the
    <a href="http://hitkey.nekokan.dyndns.info/cmds.htm#VOLWAV">BMS #VOLWAV</a> header.</dd>
</dl>

## Game Options

<dl>
  <dt>players</dt>
  <dd>An <code>Array</code> of <a href="#player-options">player options</a>.</dd>
</dl>

## Player Options

<dl>
  <dt>speed</dt>
  <dd>The speed effector.</dd>
</dl>
