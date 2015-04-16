Feature: Downloading Song for Offline Play
"""
Normally, a song can be played **on-demand**.
The downloaded assets go into browser's temporary cache.

A song can also be **downloaded for offline play**.
All charts will be downloaded, along with all assets, without initiating the game.
The downloaded assets will go into a persistent file (or blob) storage (such as IndexedDB)
and can be played without requiring an Internet connection.

When browsing the song list,
the selected song should have a Download button.
"""

Background:
  Given I am in music selection screen
  And I selected a song

Scenario: Downloading Song
"""
Upon clicking the "Download" button,
a popup window should display:

    | Do you want to download "song name?"
    | Total download size: N MB.

After the user has confirmed to download the song,
the game should start downloading them.

A progress bar is displayed in the song information pane.
Status text that says "Downloading" is also displayed in the song list.
It should also display percentage.

On the case of error, both status texts should turn red
and indicate the error status.
"""

Scenario: Downloaded Songs
"""
When a song is already downloaded,
the download button should be disabled and display the text "Downloaded."

This song should be playable without Internet connection.
"""


Scenario: Offline Mode
"""
When the browser is offline,
songs that are not downloaded are grayed out and cannot be played.
"""


Scenario: Updating Song
"""
When the song is found to be outdated,
the download button should be enabled again.
Upon clicking, the old song should be instantly playable
(just take the old version)
while the new assets downloads.

Design Considerations
~~~~~~~~~~~~~~~~~~~~~

- Ideally, the download process for saving song for offline play and just downloading for on-demand playing should be the same.

  - Prioritization: Download all charts first. Keysound packages next. Finally, download BGA and other stuff.

- Asynchronous task management system should facilitate:

  - **Cancellation.** Player may wish to abort downloading the song.
  - **Multiple parents.** A task may belong to multiple parent tasks. For example, a single download task may be used for multiple parent tasks (e.g. download for saving and download for on-demand playing).
  - **Progress reporting.** A task should be able to report its own progress. If a task is composed of several sub-tasks, a task should be able to compute its own progress based on its sub-tasks. A sub-task can have different weight.
  - Rough design of tasks management system:

    - When a task is created, it is created in "Idle" state.

- To allow updates, each song must have a "hash" that can be checked against to detect new updates.
- Storage strategy:

  - An IndexedDB-based key-value storage, which could store arbitrary objects and ArrayBuffer.
  - Song identifier:

    Songs downloaded from server
      ``[server]#[directory name]``
    Custom songs
      ``custom#[random_hash]``

  - Keys:

    Song Metadata
      ``song:[song identifier]``
    Individual File Data
      ``asset:[song identifier]:[file name]``

- Download Strategy

  #. Download all the charts and Bemuse packages (audio only as supported by browser).
  #. Start an IndexedDB transaction.

     #. Store all the assets into IndexedDB individual file data.
     #. Store the song metadata, including the assets metadata for future comparison.
"""
