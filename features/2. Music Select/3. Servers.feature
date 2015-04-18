Feature: Music Servers
"""
**Music servers** are places where songs are published.
Bemuse comes with a default music server.
A music server contains an ``index.json`` file which contains information
about available songs.

Hosting a music server only requires static web hosting.
This allows a music server to be hosted on GitHub Pages and Dropbox.
"""

Scenario: Changing a Music Server
"""
In the Music Select page, a toolbar button should say "Change Server."
This brings up a popup window.
Inside it, a list of available music servers are displayed.
Clicking on a list item changes the music server.
"""

Scenario: Adding New Music Server
"""
Inside the popup,
clicking an "Add" button would prompt the player for the music server URL.
After adding, the music server will be validated and cached.
"""

Scenario: Removing an Added Music Server
"""
Inside the popup, clicking an edit button will reveal "x" delete mark
on each list item.
Clicking on the "x" delete button would show a popover to confirm deletion.
After that, the music server is deleted.
"""

Scenario: Specifying Server and Song via URL
"""
To allow Bemuse to be used as a tool to preview BMS packages,
the game would accept some query parameters.
It will NOT be cached.
"""
