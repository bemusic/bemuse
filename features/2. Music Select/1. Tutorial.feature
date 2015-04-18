Feature: Tutorial
"""
The first item in the music selection list should say "Tutorial."
Clicking on that item should display a big, slowly blinking button
that says "Start Tutorial."

Upon clicking the button, the tutorial song should start.

For simplicity and uniformity, the speed is fixed (cannot be adjusted).
The keyboard mapping is reset to default during the course of this tutorial.
"""

Background:
  Given I am in music selection screen

Scenario: Tutorial as Default Song
  Then I should see text "Start Tutorial"
