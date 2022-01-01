---
id: previewer
title: Bemuse’s BMS/bmson Previewer
sidebar_label: Previewer [NEW]
---

Bemuse comes with a rudimentary previewer app to preview BMS/bmson notecharts.

## Current feature list:

- Preview SP and DP charts.
- Can play, pause and seek.
- Shows combo counter.
- Reload chart files from disk.

You can access the previewer by going to this URL:

<div style="text-align: center; font-size: 2em">

**<https://bemuse.ninja/?mode=previewer>**

</div>

<div class="admonition warning">
<p class="admonition-title">Note</p>

As the developer has limited resources, no support is provided for this app, although you can [report issues](https://github.com/bemusic/bemuse/issues) on the issue tracker. If you are a developer, you can [find the source code on GitHub](https://github.com/bemusic/bemuse/tree/master/bemuse/src/previewer). If you managed to fix some issues, pull requests are welcome.

</div>


## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| <kbd>Space</kbd> | Play/Pause |
| <kbd>ArrowUp</kbd> | Jump to Next Measure |
| <kbd>ArrowDown</kbd> | Jump to Previous Measure |
| <kbd>ArrowLeft</kbd> | Jump Backward by 5 Seconds |
| <kbd>ArrowRight</kbd> | Jump Forward by 5 Seconds |
| <kbd>,</kbd> | Jump Backward by 0.1 Seconds |
| <kbd>.</kbd> | Jump Forward by 0.1 Seconds |
| <kbd>Home</kbd> | Jump to Beginning of Song |
| <kbd>G</kbd> | Jump to Measure... |
| <kbd>1</kbd> | Hi-Speed Up |
| <kbd>2</kbd> | Hi-Speed Down |
| <kbd>R</kbd> | Reload Chart File |