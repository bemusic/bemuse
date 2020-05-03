---
id: faq
title: FAQ
---

## How do I adjust the speed?

To set the speed in-game, use the Up and Down buttons on your keyboard. This
adjusts the speed by 0.5x. If you hold down Alt, the speed is adjusted by 0.1x
instead.

## There is a huge audio latency\! Can it be fixed?

As a web-based game, it does not have low-level access to the audio driver.
There are many factors that affect the audio latency in this game (and web-based
audio applications in general):

- The browser's implementation of the Web Audio technology
- Your sound card driver and settings on your operating system

Bemuse has a mechanism for delay compensation. Simply open the options screen
and enter your system’s audio+input latency. You can click on the “Calibrate”
button to find out your system’s audio+input latency.

From my experience, Safari has the lowest latency so far.

## The game runs poorly in my browser!

If you're getting low FPS while playing Bemuse, please make sure you have
hardware acceleration turned on to make the game run smoothly.

Here's how to turn it on in different browsers:

- **Chrome (and Microsoft Edge):** Settings > Show advanced settings > System >
  Use hardware acceleration when available
- **Firefox:** Options > Performance > Use recommended performance settings
- **Safari:** Hardware acceleration is enabled by default.
