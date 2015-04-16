Feature: Title Screen
"""
When you enter the game, you'll first see the title screen.
In that screen, the Logo and the "Start Game" button will be displayed prominently.
When you press the "Start Game" button, you'll be taken to the "Music Selection" screen.

.. image:: /images/spec/01-title.*

Other links include:

- About -- Links to About screen.
- GitHub -- Links to GitHub project.
- Community -- Links to the community site. Maybe a subreddit, or a forum, or something.
"""

Scenario: Entering Game
  When I enter game
  Then I see the Start Game button

