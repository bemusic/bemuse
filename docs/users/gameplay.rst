
Gameplay
========


How do I adjust the speed?
--------------------------

To set the speed in-game, use the Up and Down buttons on your keyboard.
This adjusts the speed by 0.5x.
If you hold down Alt, the speed is adjusted by 0.1x instead.


There is a huge audio latency! Can it be fixed?
-----------------------------------------------

As a web-based game, it does not have low-level access to the audio driver.
There are many factors that affect the audio latency in this game
(and web-based audio applications in general):

- The browser's implementation of the Web Audio technology
- Your sound card driver and settings on your operating system

As for Bemuse, we already have a mechanism for compensating these audio delays,
but they are not integrated into the game's user interface yet.
This should change in later version.

1. Go to http://bemuse.ninja/?mode=sync.
2. Perform the experiment.
3. Take note of the result. For example, my result is 31 ms.
4. Convert the milliseconds into seconds by dividing by 1000. My results become 0.031 s.
5. Back to the game, append ``?latency=0.031`` to the URL. Change the number according to your result.
   So, my URL would look like: http://bemuse.ninja/?latency=0.031







