Feature: Music Select Screen
"""
The Music Selection is where the player will see the vast variety of
music available in Bemuse.

This screen will let player:

- start tutorial.
- select song and level to play.
- see song information:

  - song URL and link to long version (maybe also embed SoundCloud);
  - artist website;
  - where to download the BMS package and sabuns.

- see their past score.
- see online ranking.
- set options.
- save songs for offline play.
"""

Background:
  Given I am in music selection screen

Scenario: Selecting Song
  Then I see a list of songs
  When I select 1st song
  Then the 1st song is selected
  When I select 2nd song
  Then the 2nd song is selected

Scenario: Searching Song
  When I type "Toki" into search box
  Then 1 song is shown on the list
  Then the selected song is "Toki"

Scenario: Play Hint
  Given I selected a song
  When I hover on the active level
  Then the play icon is visible
