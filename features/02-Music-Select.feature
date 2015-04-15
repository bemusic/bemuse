Feature: Music Select Screen
"""
The Music Selection is where the player will see the vast variety of
music available in Bemuse.
"""

Scenario: Selecting Song
  When I enter music selection screen
  Then I see a list of songs
  When I select 1st song
  Then the 1st song is selected
  When I select 2nd song
  Then the 2nd song is selected

Scenario: Tutorial Song
  When I enter music selection screen
  And I click the first item in song list
  Then the selected song should say "Tutorial"
