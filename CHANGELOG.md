# Changelog

[@coppertine]: https://github.com/Coppertine
[@cenox]: https://github.com/CenoX
[@dtinth]: https://github.com/dtinth
[@gluestick]: https://github.com/Gluestick
[@mugabe]: https://github.com/mugabe
[@resir014]: https://github.com/resir014
[@thakkaryash94]: https://github.com/thakkaryash94
[@hajimehoshi]: https://github.com/hajimehoshi
[@nekokan]: https://github.com/Nekokan
[@tayhobbs]: https://github.com/TayHobbs
[@mslourens]: https://github.com/mslourens
[@setheal]: https://github.com/setheal
[@511v41]: https://github.com/511V41
[@aboudicheng]: https://github.com/aboudicheng
[@pnkapadia64]: https://github.com/pnkapadia64
[@tsfreddie]: https://github.com/TsFreddie
[@vishal5251]: https://github.com/vishal5251
[@vtno]: https://github.com/vtno
[@aj-ya]: https://github.com/aj-ya
[@dimitrov-d]: https://github.com/dimitrov-d
[@s-pace]: https://github.com/s-pace

## v50 (2021-10-26)

### New stuff

- **4 songs have been added to the Music Server.**

- **For creators: The tool to prepare songs and manage a Bemuse Music Server has
  been rewritten from scratch to be easier to use.** In previous versions,
  to set up a Bemuse Music Server, you would have to install a lot of programs
  and use the command line tools. Now you can prepare songs and set up a
  Bemuse Music Server from your web browser.
  [Check out the documentation for more info.](https://bemuse.ninja/project/docs/song-workshop.html)
  [#721], by [@dtinth]

### Internals

- Migrated some workflows from CircleCI to GitHub Actions to speed up builds.
  [#718], by [@vtno]

[#718]: https://github.com/bemusic/bemuse/pull/718
[#721]: https://github.com/bemusic/bemuse/pull/721

## v49.2 (2021-10-24)

### Improvements

- **You can now play custom BMS songs on your mobile phone.** The custom BMS
  dialog now displays a button to let you pick a file on your device. When you
  select a BMS archive file (zip/rar/7z), Bemuse will decompress and load the
  song. It consumes some RAM, and may not work on lower-end devices. [#714], by
  [@aj-ya]

- The [Community FAQ page](https://faq.bemuse.ninja/) now contains
  [a list of Bemuse servers](https://faq.bemuse.ninja/). You can check that out
  if you are looking for more songs to play.

### Internals

- Various internal improvements. [#715], by [@dtinth]

[#714]: https://github.com/bemusic/bemuse/pull/714
[#715]: https://github.com/bemusic/bemuse/pull/715

## v49.1.2 (2021-10-20)

### Improvements

- **Download retries.** When a file failed to download, it will be retried up to
  3 times. [#712], by [@dtinth]

- **Improved support for loading sound files inside directories.** For example,
  the
  [BMS OF FOON entry “miss” by Yosk!](https://manbow.nothing.sh/event/event.cgi?action=More_def&num=79&event=128)
  now plays properly on Bemuse.

  Some internal work has also been done to prepare for the ability to separate
  music servers from music data server, and the codebase has been modernized a
  little bit. As a result, this version of Bemuse will require a more recent
  browser: Firefox 69+, Chrome 76+, and Safari 14+. This may affect around 1% of
  player base, and it is advised to update your browser. If you have an
  up-to-date browser and you run into issues, please report them either in
  Issues tracker or Discord. [#706], by [@dtinth]

### Internals

- Introduced `bemuse-types` package to publish type definitions in a music
  collection. [#705], by [@dtinth]

- Improved the code readability of custom songs folder feature. [#699], by
  [@dimitrov-d]

- Prepare the codebase for implementing the detection of removed custom song
  folder and upgraded Prettier to v2. [#700], by [@dtinth]

[#705]: https://github.com/bemusic/bemuse/pull/705
[#706]: https://github.com/bemusic/bemuse/pull/706
[#699]: https://github.com/bemusic/bemuse/pull/699
[#700]: https://github.com/bemusic/bemuse/pull/700
[#712]: https://github.com/bemusic/bemuse/pull/712

## v49 (2021-10-09)

### New stuff

- **If you forgot your password you can now reset it.** Click the login button
  without specifying the username or password, then Bemuse will ask for your
  email. A better UI may be implemented in later releases. [#694], by [@dtinth]
- **Feature preview: Custom songs folder.**

  Currently, to play custom songs, you must drag the song you want to play into
  Bemuse window. This can be a bit inconvenient if you have many songs to play.

  This new feature, currently in preview, lets you pick a folder that contains
  all your custom songs. The folder selection is saved locally, so next time you
  return to Bemuse your custom songs will be there.
  [Check out the announcement post to find out how to access this feature preview.](https://github.com/bemusic/bemuse/discussions/696)
  [#695], by [@dtinth]

[#694]: https://github.com/bemusic/bemuse/pull/694
[#695]: https://github.com/bemusic/bemuse/pull/695

## v48.5.1 (2021-10-08)

### Internals

- Upgraded the build infrastructure to TypeScript 4.4.3 [#687], by [@dtinth]
- Fixed compiler warnings in stylesheet files. [#689], by [@vishal5251]

### Improvements

- You can go back to Music Selection Screen when the game fails to load a song.
  (Previously, the game would softlock.) [#690], by [@dtinth]

[#687]: https://github.com/bemusic/bemuse/pull/687
[#689]: https://github.com/bemusic/bemuse/pull/689
[#690]: https://github.com/bemusic/bemuse/pull/690

## v48.5 (2021-07-20)

### Others

- **Added a [Community FAQ page](https://faq.bemuse.ninja/).** This page is
  maintained by the community on
  [Bemuse Discord server](https://discord.gg/aB6ucmx) and is aimed to answer
  common questions. If you don’t find your question answered, feel free to ask
  your questions in `#general`! [#683], by [@dtinth]

[#683]: https://github.com/bemusic/bemuse/pull/683

## v48.4 (2021-06-05)

### Internals

- Upgraded project dependencies so that it can be run on Node 16.3.0. This
  should make it easier for new developers to get started playing around with
  the codebase. [#679], by [@dtinth]

[#679]: https://github.com/bemusic/bemuse/pull/679

## v48.3 (2020-05-08)

### Internals

- Added a _passive_ web monetization using the upcoming open standard,
  [Web Monetization API](https://webmonetization.org/), to see if this can
  potentially help offset server costs. If you are a [Coil](https://coil.com/)
  member, your membership will help support the server costs. As for Bemuse,
  nothing will go behind a monetization-wall. The game will remain completely
  free without any ads. [#671], by [@dtinth]

[#671]: https://github.com/bemusic/bemuse/pull/671

## v48.2.1 (2020-05-03)

### Internals

- The game code has been moved to the `bemuse` subdirectory inside the
  [bemusic/bemuse](https://github.com/bemusic/bemuse) monorepo. This can help
  streamline future releases. [#668], by [@dtinth]

- Fix broken deployment script.

[#668]: https://github.com/bemusic/bemuse/pull/668

## v48.1 (2020-05-03)

### Internals

- **You can now develop Bemuse in your web browser,** courtesy of
  [GitPod](https://gitpod.io/), which provides an on-demand cloud-based
  environment where all the project dependencies are already installed, usable
  from your web browser. [#666], by [@dtinth]

[#666]: https://github.com/bemusic/bemuse/pull/666

## v48 (2020-05-03)

### New stuff

- **Added support to gamepad controllers that sets the axis value in a
  continuous fashion.** Some controllers call this INFINITAS mode. This also
  adds a new “turntable sensitivity” settings. In addition, if the buttons 8 or
  9 are mapped, they will no longer function as a “start” and “select” buttons
  (to avoid changing speed on a single button on some controllers). [#662], by
  [@TsFreddie]

### Improvements

- **Our documentation site is now searchable.** Courtesy of Algolia’s
  [DocSearch](https://docsearch.algolia.com/) program. [#663], by [@s-pace]

[#662]: https://github.com/bemusic/bemuse/pull/662
[#663]: https://github.com/bemusic/bemuse/pull/663

## v47.2 (2020-05-03)

### Internals

- Migrate part of the code from `co` to `async function`s. (#639, by
  [@TayHobbs]; #641, #642, #643, #645, #649, by [@mslourens]; #646, by
  [@setheal]; #652, by [@511V41]; #656, by [@aboudicheng]; #657, by
  [@pnkapadia64]). [#655], by [@dtinth]

[#655]: https://github.com/bemusic/bemuse/pull/655

## v47.1 (2019-10-04)

### Improvements

- Laid groundwork for gradually migrating part of the codebase to MobX (see
  #573). [#572], by [@dtinth]

[#572]: https://github.com/bemusic/bemuse/pull/572

## v47 (2019-09-29)

### New stuff

- Add support for `?archive` query flag
  ([requested](https://twitter.com/Nekokan_Server/status/1173186650865713153) by
  [@Nekokan]) [#568], by [@dtinth]

### Internals

- Updated some dependencies in response to
  [GitHub security alerts for vulnerable dependencies](https://help.github.com/en/articles/about-security-alerts-for-vulnerable-dependencies).
  [#567], by [@dtinth]

### Improvements

- Fixed a CHANGELOG formatting issue where changelog text is broken into
  multiple lines when viewed in Bemuse. [#569], by [@dtinth]
- Minor CHANGELOG update: Removed trailing .0.0 in version number. [#570], by
  [@dtinth]

[#567]: https://github.com/bemusic/bemuse/pull/567
[#568]: https://github.com/bemusic/bemuse/pull/568
[#569]: https://github.com/bemusic/bemuse/pull/569
[#570]: https://github.com/bemusic/bemuse/pull/570

## v46 (2019-09-12)

### New stuff

- **You can now drop a link to a BMS archive (.zip, .rar) from another web page
  into the “Custom BMS” panel.** When you do it, Bemuse will attempt to download
  and extract the file. Note that for this to work, the web server that serves
  the file must set up [cross-origin resource sharing](https://enable-cors.org/)
  to allow Bemuse to download it. Both Dropbox and IPFS gateways has this set up
  already.

  Dropbox URL normalization code is based on [@Nekokan]’s
  [Dropbox Replacer](http://nekokan.dyndns.info/tool/DropboxReplacer/), thanks!
  [#554], by [@dtinth]

### Improvements

- Fixed an issue where a player, when playing using a touch screen in 3D mode,
  cannot touch below canvas to activate the note. [#472], by [@dtinth]
- Fixed an issue where the OGG sound decoder crashes when decoding some OGG
  files in iOS. [#553], by [@dtinth]

[#472]: https://github.com/bemusic/bemuse/pull/472
[#553]: https://github.com/bemusic/bemuse/pull/553
[#554]: https://github.com/bemusic/bemuse/pull/554

## v45.1 (2019-09-02)

### Internals

- Upgraded TypeScript to latest version, 3.6.2, and converted some more code
  that deals with game initialization logic to TypeScript. [#549], by [@dtinth]

[#549]: https://github.com/bemusic/bemuse/pull/549

## v45 (2019-08-31)

### New stuff

- **Bemuse can now load custom songs directly from .zip, .rar and .7z files.**
  You can now drop an archive file into Bemuse. This is possible thanks to
  [libarchive.js](https://github.com/nika-begiashvili/libarchivejs) which is a
  port of [libarchive](https://github.com/libarchive/libarchive) to WebAssembly.
  [#547], by [@dtinth]

### Others

- When playing in 3D mode (e.g. using a touch screen), performing a fast
  glissando between 2 notes with one column of gap in-between will no longer
  emit the sound of the gap. For example, given a note pattern 1-3-5-7, you can
  swipe your finger from 1~7, and the game will suppress the sounds of column
  2-4-6. This improves the playing experience in mobile devices. [#546], by
  [@dtinth]

[#546]: https://github.com/bemusic/bemuse/pull/546
[#547]: https://github.com/bemusic/bemuse/pull/547

## v44.5 (2019-08-30)

### Internals

- Several core objects have been converted to TypeScript to make the game code
  easier to maintain. This includes `Judgments`, `Game`, `Player`, `GameInput`,
  `GameState`, `PlayerState` and `PlayerStats` in the game, and `Callbacks`,
  `Observable` and `Progress` in the utilities. [#544], by [@dtinth]

[#544]: https://github.com/bemusic/bemuse/pull/544

## v44.4 (2019-08-29)

### New stuff

- The TUTORIAL now displays a tooltip that teaches new players how to exit the
  game. [#542], by [@dtinth]

### Internals

- Added release dates to CHANGELOG sections. [#541], by [@dtinth]

[#541]: https://github.com/bemusic/bemuse/pull/541
[#542]: https://github.com/bemusic/bemuse/pull/542

## v44.3 (2019-08-29)

### Internals

- Updated webpack configuration in the main app to allow compiling TypeScript
  code. Now we can start writing game code using TypeScript! [#538], by
  [@dtinth]
- Updated the automated release script to remove pre-release version suffix from
  CHANGELOG entries, further streamlining the release process. [#539], by
  [@dtinth]

[#538]: https://github.com/bemusic/bemuse/pull/538
[#539]: https://github.com/bemusic/bemuse/pull/539

## v44.2.4 (2019-08-29)

### Internals

- Upgraded to Lerna 3 and switched to Fixed version mode. This means Bemuse’s
  sub-projects (`bms`, `bmson`, `bemuse-tools`, etc…) will have the same version
  as the Bemuse game. This makes versioning easier. [#536], by [@dtinth]

[#536]: https://github.com/bemusic/bemuse/pull/536

## v44.1 (2019-08-29)

### New stuff

- **OGG support** is added to iOS and Safari, using [@hajimehoshi]’s
  [stbvorbis.js](https://github.com/hajimehoshi/stbvorbis.js) library to decode
  OGG files in-browser. This means that Bemuse no longer relies on proprietary
  audio file format (m4a) to function in Safari and iOS, and thus:

  - Generating a Bemuse package is faster because m4a files no longer to be
    generated.

  - Less disk space requirement as only ogg files are needed.

  - A Bemuse package can now be generated on Linux, due to proprietary tools to
    use Apple’s m4a encoder is no longer needed.

  With this change, creating content for Bemuse will become easier and more
  accessible! [#534], by [@dtinth]

### Internals

- Upgraded React and React DOM to version 16.9.0. [#533], by [@dtinth]

[#533]: https://github.com/bemusic/bemuse/pull/533
[#534]: https://github.com/bemusic/bemuse/pull/534

## v44 (2019-08-27)

This release contains no new features, just a lot of codebase modernizations.

### Internals

- Babel is replaced by TypeScript compiler. Now TypeScript is used to transpile
  both TypeScript and JavaScript files. [#512], by [@dtinth]

- The whole source tree is automatically formatted using Prettier. [#513], by
  [@dtinth]

- Lots of old code and unused dependencies have been removed. [#516], by
  [@dtinth]

- Minor warning fixes. [#517], by [@dtinth]

- Added an end-to-end testing, using Puppeteer. [#503], by [@dtinth]

- Upgraded the project to Node 10. [#518], by [@dtinth]

- Fix a problem where `.jsx` files do not pass through `lint-staged`. [#519], by
  [@resir014]

- Converted `bms`, `bmson`, `bemuse-notechart`, and `bemuse-indexer` packages to
  TypeScript. [#520], [#521], [#522], by [@dtinth]

- Updated service worker code to use `serviceworker-webpack-plugin` instead of
  custom service worker hack. [#525], by [@resir014]

- Removed webpack-progress hack. [#525], by [@resir014]

[#512]: https://github.com/bemusic/bemuse/pull/512
[#513]: https://github.com/bemusic/bemuse/pull/513
[#516]: https://github.com/bemusic/bemuse/pull/516
[#517]: https://github.com/bemusic/bemuse/pull/517
[#503]: https://github.com/bemusic/bemuse/pull/503
[#518]: https://github.com/bemusic/bemuse/pull/518
[#519]: https://github.com/bemusic/bemuse/pull/519
[#520]: https://github.com/bemusic/bemuse/pull/520
[#521]: https://github.com/bemusic/bemuse/pull/521
[#522]: https://github.com/bemusic/bemuse/pull/522
[#525]: https://github.com/bemusic/bemuse/pull/525
[#524]: https://github.com/bemusic/bemuse/pull/524

## v43 (2018-11-11)

This release contains multiple contributions from the community! Many thanks to
everyone who helped contributing to this release.

### Fixes and improvements

- **Faster IPFS support** using Cloudflare’s
  [Distributed Web Gateway](https://www.cloudflare.com/distributed-web-gateway/).
  [#508], by [@dtinth]

- **Fullscreen now works in more browsers.** [#505], by [@Gluestick]

- **When calibrating, music preview is now muted.** [#507], by [@Gluestick]

- **Documentation has been improved.**

  - Contribution guidelines have been updated, along with miscellaneous fixes.
    [#496], by [@resir014]

  - Our [Music Server](https://bemuse.ninja/project/docs/music-server.html) docs
    has been updated to note that due to our usage of proprietary codec (AAC)
    for iOS compatibility, Music Servers has to be created from either Windows
    and Mac machines ([#510], by [@resir014]). Also, some instructions has been
    made more easy to follow, and a guide to configure an nginx web server (in
    addition to XAMPP) have been added ([#511], by [@cenox]).

### Internals

Our codebase has been modernized and quality improved, thanks to the hard work
from our contributors.

- Upgraded many dependencies. [#498], by [@resir014]

- Migraded to Babel 7. [#501], by [@thakkaryash94]

- Fixed a propTypes warning in OptionsInputKey. [#506], by [@Gluestick]

[#496]: https://github.com/bemusic/bemuse/pull/496
[#498]: https://github.com/bemusic/bemuse/pull/498
[#501]: https://github.com/bemusic/bemuse/pull/501
[#505]: https://github.com/bemusic/bemuse/pull/505
[#506]: https://github.com/bemusic/bemuse/pull/506
[#507]: https://github.com/bemusic/bemuse/pull/507
[#508]: https://github.com/bemusic/bemuse/pull/508
[#510]: https://github.com/bemusic/bemuse/pull/510
[#511]: https://github.com/bemusic/bemuse/pull/511

## v42 (2018-08-08)

This update took a really long time as I (dtinth) was busy with other things in
life. Also, this release contains many internal changes to the code
infrastructure, which is, you know, the less exciting parts of the work.

### New stuff

- **Full-screen button** is displayed at the top-right corner inside the game.
  Automatic full-screen has been removed. [#495], by [@dtinth]

- **3 new songs added.** More songs will be added soon, stay tuned.

### Improvements

- **Improved documentation.** Our docs have been split into 3 sections ([#489],
  by [@resir014]):

  - **Users** for people who play this game. This section covers the user guide,
    the game mechanics, and some FAQs.

  - **Creators** for content creators (bms authors) and people who wants to
    maintain a music server.

  - **Developers** for developers who wants to dive into the game’s code.

- Added information on documentation for running a music server on a Windows
  local machine. [#490], by [@Coppertine]

- Forced encoding. Encoding can be forced by setting the file extension. For
  example, `HYPER.sjis.bms` will always be read as Shift-JIS.

### Internal changes

- **Gone monorepo.** 5 packages on `npm`: `bms`, `bmson`, `bemuse-notechart`,
  `bemuse-indexer` and `bemuse-tools` now lives in this repository.

- Updated Browserslist compatibility table according to blog post
  [“‘last 2 versions’ considered harmful”](https://jamie.build/last-2-versions)
  [#483], by [@resir014]

- Upgraded `auth0-js` due to security issue. [#485], by [@resir014]

- Improved developer guide for Windows users. [#487], by [@resir014]

### API changes

#### `bms@3.0.0`

- [Breaking change] Use `lib` folder to refer to individual module.
  `bms/speedcore` &rarr; `bms/lib/speedcore`
- [New feature] Added support parsing `.dtx` files. [bemusic/bms-js#28], by
  [@mugabe]
- [Internals] Modernized the source code and moved into `bemuse` repository.

#### `bms@3.1.0`

- [New feature] `BMS.Reader.read` and `BMS.Reader.readAsync` now takes an
  optional options object, allowing you to force file encoding.

#### `bmson@4.0.0`

- [Internals] Modernized the source code and moved into `bemuse` repository.

#### `bemuse-notechart@2.0.0`

- [Breaking change] Use `lib` folder to refer to individual module.
  `bemuse-notechart/loader` &rarr; `bemuse-notechart/lib/loader`
- [Internals] Modernized the source code and moved into `bemuse` repository.

#### `bemuse-notechart@2.1.0`

- [Improvement] File encoding can be forced through file name extension.

#### `bemuse-indexer@4.0.0`

- [Internals] Modernized the source code and moved into `bemuse` repository.

#### `bemuse-notechart@4.1.0`

- [Improvement] File encoding can be forced through file name extension.

#### `bemuse-tools@3.0.0`

- [Internals] Modernized the source code and moved into `bemuse` repository.

#### `bemuse-tools@3.1.0`

- [Bugfix] Removed peer dependencies error.
- [Improvement] File encoding can be forced through file name extension.

[bemusic/bms-js#28]: https://github.com/bemusic/bms-js/pull/28
[#495]: https://github.com/bemusic/bemuse/pull/495
[#483]: https://github.com/bemusic/bemuse/pull/483
[#485]: https://github.com/bemusic/bemuse/pull/485
[#487]: https://github.com/bemusic/bemuse/pull/487
[#489]: https://github.com/bemusic/bemuse/pull/489
[#490]: https://github.com/bemusic/bemuse/pull/490

## v41 — New docs site, Latency calibration fixes, Chrome 66 support, IPFS support (2018-05-07)

### New stuff

- **New documentation site.** The docs site for the Bemuse project can now be
  found at https://bemuse.ninja/project/. [#479], by [@resir014]

- **Experimental support for IPFS.** Please read more info about this feature in
  the issue linked afterwards. [#480], by [@dtinth]

### Fixes and improvements

- **Fixed a bug that happens in Chrome 66** where a song wouldn’t start due to
  the new autoplay policy taking effect.

  - By the way, newer versions of Chrome in Android has **significantly lower
    latency.** On Android, the latency used to be ~120ms, but now it’s only
    ~40ms.

- **Fixed a long-standing audio latency calibration bug** where it would cause
  the game to go out of sync from the display. [#474], by [@dtinth]

- **UI updated for mobile devices.** [#478], by [@dtinth]

### Internal changes

- **Upgraded webpack** to v4. [#471], by [@resir014]

[#479]: https://github.com/bemusic/bemuse/pull/479
[#480]: https://github.com/bemusic/bemuse/pull/480
[#474]: https://github.com/bemusic/bemuse/pull/474
[#478]: https://github.com/bemusic/bemuse/pull/478
[#471]: https://github.com/bemusic/bemuse/pull/471

## v40 — Big update: 3D mode, 7 more songs, and other stuff! (2018-02-13)

### New, new stuff!

- **3D mode is out!** This mode is recommended for playing on touch screens
  (e.g. an iPad Pro). This mode only works when Scratch settings is set to off.
  [Video demo](https://www.youtube.com/watch?v=2o7i3L4Tu1o)

- **Added 7 more songs.**

- **A friendly dialog box appears when you exit the tutorial** and encourages
  you to keep playing other songs, and build up your music gaming skills!

### Internal changes

- **Improved analytics tracking,** using [Amplitude](https://amplitude.com/).
  This will help me to gain better insights more easily, which can be useful in
  improving the game. No personal data is collected.

- **Infrastructure and tooling:** Upgraded to webpack 3, added prop-types to
  most components, and other project improvements. Thanks a lot to @resir014 for
  contributing these improvements!

## v38 — Big update! (2017-12-31)

Have a happy new year! This release makes the game easier for beginners.

### New stuffs

- Added **5 new songs** and more **easy charts**.

### Improved mechanics

- This game mechanics is now easier for beginners. For more information, see the
  report
  [“Easier timegates for beginners coming to Bemuse”](https://qiita.com/dtinth/items/5b9f6b876a0a777eec50).

### Internals

- Updated the project’s infrastructure (e.g. upgraded to latest version of
  React). Big thanks to help and feedback from
  [@resir014](https://github.com/resir014)!

## v37 (2017-03-11)

### Bugfixes

- **Scoreboard is back.** After a month of downtime or so. Thanks for your
  patience!

- **Speed no longer resets** when you hit the replay (F1) button.

- **Errors are now displayed** when there is a problem loading a custom BMS.
  (They used to be silently discarded, leading to the dialog keeps loading
  indefinitely).

### Internals

- **Upgraded the build infrastructure.** webpack 2 and stuffs.

## v36 (2016-12-24)

### A new feature arrived

- **Music previews.** Now you’ll hear a preview while selecting songs!

## v35 (2016-12-21)

### Internals

- **Moved the music server.** With 44 songs and counting, our music server now
  contains more than 1GB of data. Since
  [GitHub only allows 1GB](https://help.github.com/articles/what-is-my-disk-quota/),
  I need to find a new home in order to release more songs.

  Now, the music server is hosted on a
  [DigitalOcean](https://m.do.co/c/302d31171899) droplet, with performance
  enhanced by [CloudFlare](https://www.cloudflare.com/).

  The game itself is still hosted on
  [GitHub](https://github.com/bemusic/bemuse).

- **Added
  [Bemuse server tool](https://github.com/bemusic/bemuse/wiki/Bemuse-server-tool).**

## v34 (2016-12-06)

### New features

- **5-keys inactive column cover.** This is the first step to make Bemuse more
  approachable to beginners. When playing 5-key charts (marked with green
  color), we will cover the unused columns. We will be improving 5-keys support.

- **Expert gauge.** When expert gauge is enabled, you will see a gauge at the
  top of the screen. This brings a challenge — to finish the song with the gauge
  intact.

### Improvements

- **Improved offbeat sound.** When you trigger the note off-beat, the note would
  also sound off-pitch. [@joezeng](https://github.com/joezeng) contributed a
  change which makes it sound even more jarring! Enjoy!!!!!!

- **Improved offline support.** We’ve modernized the code for offline support a
  bit. This makes the first visit of the game faster.

## v33 (2016-09-24)

### More features!

- **Play area cover.** For some players, the play area may be too tall. There is
  now a new setting that lets you adjust the amount of the play area that will
  be hidden (covered) from the top (in percentage). If this number is negative,
  the play area will be pulled up.

- **Accuracy and precision in result screen.** We now display the accuracy (mean
  difference) and precision data (standard deviation) of the keypresses in the
  result screen.

## v32 (2016-09-21)

### Improvements to existing features

- **Improved game restarting.** Based on the statistics in the past 3 months,
  21.3% of game plays are restarts of the previous game. In this release, I make
  restarting easier in several ways:
  - **Inside game, press F1 to restart.** This will immediately restart the
    game.
  - **Inside the result screen, click the chart difficulty button** at the
    top-right corner. This will also immediately restart the game.
  - **Faster song loading when playing the same song.** In Bemuse, songs are
    stored in a compressed format and have to be decoded before playing. In this
    version, Bemuse will temporarily store the decoded data, so that it will
    load faster if you play the same song again.
- **Custom BMS popup will immediately appear when a folder is dragged over the
  music selection screen.** This should make playing custom BMS easier.

## v31.2 (2016-09-17)

### Improvements

- Improved support for bmson BGAs in Bemuse servers.

### Bugfixes

- Fixed a bug where BGAs would display at an incorrect position in different
  screen resolution.

## v31.2 (2016-09-07)

### New features

- **Support BGAs in bmson files.** In this version, there is a caveat when using
  BGAs in bmson file.
  - Due to current Bemuse architecture, every chart in the same song shares the
    same BGA. It case of multiple charts with different BGA, the BGA of the song
    will be selected arbitrarily.
  - Only 1 `bga_event` allowed, and it is expected to point to a WebM or MP4
    file. Otherwise, the BGA is considered invalid and will not be loaded.

## v31.1 (2016-06-30)

### New stuffs

- Added a home page (which you can see by scrolling down from the title screen).
  There are still a lot of rooms for improvements. Think of this as an alpha
  version. Suggestions are welcome. :)

### Internals

- Improved analytics tracking to send more useful information. All analytics
  data are anonymous and are used for the purpose of improving the game.

## v31 (2016-06-24)

### Announcement of new stuffs!

- **Out of beta!** I’ve shipped so many beta releases for a year now, and it
  needs to go out of beta someday… Since jumping major versions are pretty
  [trendy](https://medium.com/node-js-javascript/4-0-is-the-new-1-0-386597a3436d)
  [these](https://facebook.github.io/react/blog/2016/03/07/react-v15-rc1.html)
  [days](https://blog.sketchapp.com/versioning-licensing-and-sketch-4-0-8ad98783e9ba),
  I decided to release version 31.

- **BGAs!** On new songs, Bemuse will now display a 720p HD background
  animation. You need a decent computer and a good internet connection for this
  feature to work smoothly. You can turn it off in the options screen.

  Right now, it is only available in online songs. BGAs in custom songs are not
  supported yet. Future versions will add support for BGAs inside bmson files.
  BGAs are encoded in WebM format at resolution of 1280x720, at bitrate of 1500
  kbps.

- **Auto-velocity!** Bemuse now has the auto-velocity option which tries to
  maintain a consistent note scrolling speed across plays. This means the game
  will automatically adjust the speed modifier to match the note scrolling speed
  of the previous song you’ve played.

  For example, if you played a 100bpm song at 4.8x speed, then if you play a
  200bpm song, the game will adjust the speed to 2.4x. You can activate this
  feature in the options screen.

- **[BMS Search](http://bmssearch.net/) Integration!** You can now go to BMS
  Search page for the selected song from the “Information” tab.

- **New Title Screen!**

### Advanced and developer features…

- **Setting the default search text!** [BMS Search](http://bmssearch.net/), a
  BMS database and search engine, has a very convenient link to Bemuse. But you
  still have to search for the song you want to play. In this version, Bemuse
  supported the `?grep=` URL parameter, which will pre-fill the search text.

  For example, this URL will link directly to a song called “The Heroine
  Appears.” in [METTATUNES](http://keysounds.net/mettatunes/) event server:
  https://bemuse.ninja/?server=https://bmson.nekokan.dyndns.info/mettatunes/&grep=the+heroine+appears

- **Adding BGAs in music server:** Two new keys in `README.md` front-matter data
  is added: `video_url` which specifies the URL to a video file (WebM, 1280x720,
  1500kbps) and `video_offset` which specifies when to start playing the video
  (in seconds after the song begins).

### Internals

- **Modernized the codebase!** The Bemuse GUI is now based on latest version of
  React. The web application has been aggressively refactored to use Redux
  (which leads to cleaner code and easier testability).

## v1.0.0-beta.30 (2016-01-02)

### New feature

- **iPad Pro support.**

  **Note:** Bemuse is very RAM intensive. Before playing, please close other
  apps and other Safari tabs, and set your screen orientation to portrait.

  When I started developing Bemuse, I call it “a BMS player of the future.” When
  the beta version was released, the game is barely playable on an iPad Air.
  Many songs crash the game, and other songs made the very game laggy (running
  at about 30 fps, which is unacceptable for such rhythm games). This is because
  of the large amount of sound data, more than an iPad Air can handle (some song
  take more than 1GB of RAM to play). I just hope that a better tablet will be
  released in the future.

  But the future is here. iPad Pro comes with 4GB of RAM and an A9 processor,
  the game can now process up to 200 fps. This is Moore’s law in action.
  Although most application is allowed to access only 600MB of RAM, Safari does
  not have this restriction. There is almost no audio latency at all on an iPad
  Pro. This is the era for web-based applications!

  [![Video Demo](http://img.youtube.com/vi/NmFYpgK1etc/hqdefault.jpg)](https://www.youtube.com/watch?v=NmFYpgK1etc)

  (P.S. Bemuse also works on Microsoft Surface Pro (using Google Chrome), but it
  has very high audio latency.)

## v1.0.0-beta.29 (2015-12-05)

### Changes

- **Sound volume normalization** (online songs only).

  The [ReplayGain](https://en.wikipedia.org/wiki/ReplayGain) algorithm is used
  to normalize the volume of each song. From now on, every song will have
  roughly the same loudness. Some songs are very loud. As a result, the volume
  of songs is decreased, on average, by 15%. This only applies to online songs,
  as the ReplayGain value must be precomputed.

  _Bemuse music server authors:_ To normalize the sound volume, please specify
  the `replaygain:` key in the YAML front matter of your song’s README file
  ([example](https://github.com/bemusic/music/blame/6ce362e6905fb3ca390ab34320daf0559ea99ab6/%5B5argon%5Dmaidbattle/README.md#L7)),
  then run `bemuse-tools index` again.

- **Overall volume decrease.**

  Some platforms (e.g. Chrome on Mac OS X) can process audio
  [using 32-bit float format](https://developer.apple.com/library/mac/documentation/MusicAudio/Conceptual/CoreAudioOverview/WhatisCoreAudio/WhatisCoreAudio.html#//apple_ref/doc/uid/TP40003577-CH3-SW11)
  all the way from the browser to the operating system. This means it’s possible
  to have sounds playing above the full volume without clipping if the system
  volume is decreased. Other platforms clip the audio signals that exceed the
  full scale as data leaves the browser to the system. This means the audio will
  sound distorted, even when the system volume is decreased.

  To resolve this, the overall volume is deceased. For online songs that have
  `replaygain` tag added, Bemuse will adjust the volume of the song to give
  around 6 dB of headroom.

  For custom BMS, there is no precomputed song volume information. In this case,
  Bemuse reduces the song volume by -4.2 dB (based on
  [the result of BMS loudness study](http://qiita.com/dtinth/items/1200681c517a3fb26357)).
  This means in this version, custom BMS will play at 62% volume of the
  original. I think this is good, because this means less clipping and more
  dynamics. Please turn up your volume!

  Feedback is welcome! Please tweet to
  [@bemusegame](https://twitter.com/bemusegame).

## v1.0.0-beta.28 — Native gamepad/MIDI support, detailed accuracy report (2015-12-04)

### New features

- **_Experimental_ support for native gamepad and MIDI input.**

  A common problem with using keyboard and joystick-to-keyboard softwares is
  that the keypresses has to go through the operating system’s—then the
  browser’s—event queue. In some cases, this causes input to be delayed
  (especially on a Mac when mashing many buttons).

  Thanks to the new technologies in HTML5,
  [Web Gamepad API](http://www.w3.org/TR/gamepad/) and
  [Web MIDI API](http://www.w3.org/TR/webmidi/), you should now be able to play
  Bemuse with your game controller or MIDI controller without extra
  joystick-to-keyboard software. You’ll need to set up the key mapping before
  playing with your controller.

  This technology is still very new and experimental, and support varies between
  browser, OS, and controller. For instance, on my Mac, Google Chrome detects
  the DJ DAO controller but not the JKOC controller, whereas Firefox only
  detects the JKOC controller, but not DJ DAO. In short, it may not work.

- **Detailed accuracy report:** In the result screen, click on the accuracy
  number, and a panel showing the detailed play statistics is displayed,
  including a histogram of accuracies, number of EARLY/LATE hits, and other
  statistical information.

  ![Screenshot](https://cloud.githubusercontent.com/assets/193136/11596204/433fb532-9ae6-11e5-9636-d2bb7669fe4f.png)

  Other statistical information include:

  - The **mean** which represents the
    [trueness](https://en.wikipedia.org/wiki/Accuracy_and_precision#ISO_Definition_.28ISO_5725.29)
    of your note hits to the musical score.
  - The **S.D.** which represents the
    [precision](http://www.mathsisfun.com/accuracy-precision.html) of your note
    hits.
  - The **median** which can be compared to the mean to determine the
    [skewness](https://en.wikipedia.org/wiki/Skewness#Relationship_of_mean_and_median)
    (although
    [not technically correct](http://www.amstat.org/publications/jse/v13n2/vonhippel.html)).

- **What’s new?** Never miss out on new updates to Bemuse. When a new version is
  released, a “What’s new?” bubble appears in the title screen. Clicking on it
  will display the change log.

### Fixes

- Fixed a problem where modifier keys (Ctrl, Alt) are captured by the web
  browser, and thus interrupting the game.

### Internals

- The custom automated test harness has been replaced with
  [Karma](http://karma-runner.github.io/) test runner.

## v1.0.0-beta.26 — Personal records (2015-11-24)

### New feature

- This release displays your personal records in the music selection screen.

## v1.0.0-beta.27 — Eyecatch, background image (2015-11-24)

### News

**[forgetalia](http://cerebralmuddystream.nekokan.dyndns.info/bmson/forgetalia.html)**,
a pilot bmson package, is now
[available for playing online](http://bemuse.ninja/?server=http://bmson.nekokan.dyndns.info/forgetalia/)!

Follow [@forgetalia](https://twitter.com/forgetalia) for more updates.

### New features

- **Eyecatch and background images** are now supported for bmson files.
  - If the eyecatch and background image is not specified (or using BMS files),
    Bemuse will try to load `eyecatch_image.png` and `back_image.png`.
- **Sharing on Twitter** will now attach the server URL.

### Improvements

- Make the game display smoother in non-native resolution. Please play at
  1280x720 resolution for best experience.
- The music list will automatically scroll to the selected song after playing.
- Changed the wording in the tutorial to make it more encouraging…

  ![That’s it!](https://github.com/bemusic/bemuse/blob/feature/moar-stuff/public/skins/default/Tutorial/Page6.png?raw=true)

- The long scratch note will now automatically end at the moment the end of the
  scratch note reaches the judgment bar. This does not affect gameplay; only
  visual.

## v1.0.0-beta.25 — Rudimentary bmson 1.0 support (2015-11-10)

### New features

- **Rudimentary bmson 1.0 support.** This release makes Bemuse support the bmson
  1.0 structure. It supports only what is supported in bmson v0.21.

  The following are supported:

  - New, snake_cased key names, and other key name changes
  - `info.resolution`
  - `info.chart_name`
  - `info.subtitle`
  - `info.subartists`

  The following are NOT yet supported:

  - Mix notes
  - Background images
  - New sound slicing algorithm (unfortunately, requires non-trivial change
    across codebases)

### その他

- Refactored the old UI data flow system (imperative `<Binding />`) into a
  higher-order component. #211
- Made the music-select-store code easier to understand. #211

## v1.0.0-beta.24 (2015-11-08)

### Bugfixes

- **Fixed sound cutting problem when playing bmson files.** In previous version,
  sometimes there’s a clicking sound at the end of a sliced keysound. As of
  writing, Google Chrome is not very accurate when it comes to playing and
  stopping sounds. I guess that it rounds to the next buffer loop before
  stopping. The fix is to manually stop the sound by setting fading its volume
  down to 0 at a precise time.
- **Fixed graphics blending problem.** Related issue:
  [pixijs/pixi.js#2188](https://github.com/pixijs/pixi.js/issues/2188)

### その他

- **Updated code style** to use
  [eslint-config-bemuse](https://github.com/bemusic/eslint-config-bemuse), which
  is based on [feross/standard](https://github.com/feross/standard) code style,
  but is less strict.

## v1.0.0-beta.23 — view personal records (2015-11-03)

### New feature

- **Personal records.** If you are signed in, you should be able to see your
  personal record in the music selection screen.

### This section is for developers

- **Node 5.** The codebase has been migrated to work with Node.js version 5.
- **Hot Module Replacement.** Developing this game will be much easier with hot
  reloading. It is now possible to tweak the user interface code and have the
  new code injected.
  [See this awesome talk if you haven’t](https://www.youtube.com/watch?v=xsSnOQynTHs).
- **Refactored online system.** The code for online system has been heavily
  refactored. It is very far from perfect, and we lose data caching ability (in
  exchange with simpler code). Caching (and cache invalidation) is a hard
  problem and would need dedicated effort to implement it in the right way.

## v1.0.0-beta.22: Faster loading and internal stuffs (2015-09-08)

This release contains mainly chore work to the game’s codebase and other minor
stuff.

### Improvements

- **Faster loading.** Bemuse will now download 2 package files simultaneously.
  This should result in faster package downloads.

### Advanced stuffs

- Allow `server` query string to be used instead of the more verbose
  `BEMUSE_MUSIC_SERVER`.

### Internals

- The markdown parser has switched to use
  [markdown-it](https://github.com/markdown-it/markdown-it) library.
- The markdown will be parsed like GFM, which means line breaks will create a
  new line when displayed.
- Changed file names and CSS class names to be consistent with JSX class names
  across the codebase.
- The bmson related code has been moved to
  [bmson](https://github.com/bemusic/bmson) project, to be incorporated into
  [bemuse-indexer](https://github.com/bemusic/indexer), and subsequently,
  [bemuse-tools](https://github.com/bemusic/bemuse-tools), in order to give
  bmson support to these tools.
- Update isparta relying on a older version of webpack that uses an incompatible
  regenerator, causing build errors on the CI.

## v1.0.0-beta.21 (2015-09-08)

### A new feature

- The game will now display
  [whether you pressed the keys too early or too late](https://twitter.com/bemusegame/status/635873015356461056).

## v1.0.0-beta.20: Options Screen Improvements (2015-08-23)

### New features

- **Audio latency compensation** now available. Just go to options screen and
  click the “Calibrate” button.
- You can now set the speed directly inside the options screen.

## v1.0.0-beta.19: #bmson (2015-08-23)

### bmson supported

- **Experimental support for bmson notechart,** a new notechart format that will
  hopefully make authoring notecharts for rhythm games much, much easier. Please
  [read the full announcement here](http://qiita.com/dtinth/items/a2d644c608b3d1cf41ff).

## v1.0.0-beta.18: Two keys for the turntable! (2015-08-10)

### Improvements

- Some people have been requesting this, so I’m glad to announce that **it’s now
  possible to assign 2 keys to the turntable.**
- Performance improvements in the music selection and options screen.

## v1.0.0-beta.16: 5-keys BMS support (2015-08-04)

### New features

- **5-keys BMS support added.**

  This release of Bemuse allows playing of 5-keys BMS files. 5-keys BMS charts
  are highlighted in green.

  <img width="442" alt="screen shot 2015-08-04 at 23 44 19" src="https://cloud.githubusercontent.com/assets/193136/9066584/c4fda73a-3b02-11e5-901e-f70269631876.png">

  It is only basic support, and the game will still display as 7 keys. However,
  when 5 keys BMS is detected, we perform column adjustments based on scratch
  position, according to this table:

  | Scratch Position | 左の皿 |   B1   |   B2   | B3  | B4  | B5  |   B6   |   B7   | 右の皿 |
  | ---------------- | :----: | :----: | :----: | :-: | :-: | :-: | :----: | :----: | :----: |
  | **Left**         |   ◎    |   1    |   2    |  3  |  4  |  5  | &nbsp; | &nbsp; |   –    |
  | **Disabled**     |   –    | &nbsp; |   1    |  2  |  3  |  4  |   5    | &nbsp; |   –    |
  | **Right**        |   –    | &nbsp; | &nbsp; |  1  |  2  |  3  |   4    |   5    |   ◎    |

  As a result, these 5-keys charts on the default music server becomes playable:

  - CHICKEN for the WIN
    - 5 SUMMONED
    - 5 BUFFED
    - 5 ENRAGED
  - 僕たちの旅とエピロ ー グ。
    - normal
  - 가짜/인형/술사/이야기
    - 5Keys Normal
    - 5Keys Hyper

### Internals

- The JavaScript ecosystem is
  [evolving fast](http://www.allenpike.com/2015/javascript-framework-fatigue/),
  and we need to keep updating our dependencies to the latest version, in order
  to reap the most benefits from modern web technologies. Notable changes:
  - We migrated to [**Pixi.js v3**](http://www.goodboydigital.com/pixi-js-v3/),
    which should be “faster and better in almost every way!”
  - Babel, the JavaScript transpiler we use has been upgraded from `^4.3.0` to
    `^5.8.20`
  - And a lot of
    [other dependencies](https://github.com/bemusic/bemuse/pull/194/files#diff-b9cfc7f2cdf78a7f4b91a753d10865a2).

* The background image has been moved out of the game layer, and is now managed
  via the DOM.

## v1.0.0-beta.15 (2015-07-27)

### A little improvement

- You can now see your own ranking in the music selection screen.

## v1.0.0-beta.14.1 (2015-07-22)

### Fixed a bug

- Fixed a small bug where you cannot sign in / create a new account in the
  result screen, because keystrokes handled by the game subsystem instead of the
  user interface.

## v1.0.0-beta.14: Online Ranking System (2015-07-22)

### New features

- **Online Ranking System!** A preliminary<sup>1</sup> ranking system, powered
  by [Parse](https://parse.com/).

### Improvements

- The Custom BMS dialog will now pop up automatically when you drag something
  over the “Custom BMS” button in music selection screen.

<sup>1</sup> _By preliminary, I really mean it. While it should work fine, the
online scoreboard system may need to go through several refinements. If
necessary, the whole scoreboard may be cleared at any time before v1.0.0 final
is released. Nevertheless, I would really love for you to try them out and give
feedback._

## v1.0.0-beta.13 — Offline Support (2015-06-18)

This release brings offline support (and other small fixes). Now you can play
Bemuse while being completely offline.

### New stuff

- **Offline support added.** It is made possible through a new HTML5 technology,
  [Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/),
  which allows web application to manage all network resources
  ([and more](https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md#other-serviceworker-related-specifications)).

  - **HTTPS is Required** — Service workers
    [only work when using HTTPS](https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md#https-only-you-say),
    so you need to go to https://bemuse.ninja instead of
    http<b></b>://bemuse.ninja.
  - **Browser support** is very limited, as this technology is new. As of
    writing, only **Google Chrome** and **Opera** works. For an up-to-date
    status, check out the website
    _[Is ServiceWorker Ready?](https://jakearchibald.github.io/isserviceworkerready/)_

### その他

- Added preliminary documentation about
  [Bemuse's BMS support](http://bemuse.readthedocs.org/en/latest/users/bms-support.html)
  and
  [running your own music server](http://bemuse.readthedocs.org/en/latest/users/music-server.html).
- The sky background has been removed from the touch gameplay screen. It has
  been found to have caught frame rate drops in iOS.
- Added a disclaimer when playing a non-official music server.
- Fixed a bug where the game fails to load BMS files with special characters
  from the server. This is due to it not being properly URL-encoded, which makes
  files like `#another.bms` fail to load. ddb13eb

## v1.0.0-beta.11 — Custom BMS now supported (2015-05-18)

This release brings the custom BMS support, and other various bug fixes and
improvements.

### New big feature

- **Custom BMS Support**

  We are excited to announce that you can now play custom BMS songs in Bemuse,
  right in the browser.

  For those who don't know what BMS is, it is a playable song format for rhythm
  games. Every year, hundreds of songs are created in this format, and can be
  played in any
  [BMS player](http://hitkey.nekokan.dyndns.info/cmds.htm#BMS-APPS), and Bemuse
  is just one of them. You can read about the history of BMS from this excellent
  article,
  “[What is BMS?](https://github.com/lifthrasiir/angolmois/wiki/What-is-BMS%3F)”

  Currently, we only support Google Chrome. In the music selection screen, click
  on the **Play Custom BMS** button and drag a BMS folder into the drop area.

  ![Drag a BMS folder and drop it inside Bemuse!](https://cloud.githubusercontent.com/assets/193136/7685751/b07bd14a-fdba-11e4-9c23-447c4a15d80c.png)

  Then the song will be added to the top of the music list.

  ![screen shot 2015-05-18 at 23 51 09](https://cloud.githubusercontent.com/assets/193136/7685766/e1ff442c-fdba-11e4-9ec4-eb053177a5a2.png)

  Now you can play that song like any online songs! I think we now really have a
  cross-platform BMS player<sup>1</sup>.

### その他

- Fixed the problem where Bemuse refuses to read data from some music server.
  These servers report that the metadata is just a "plain text data" (as opposed
  to the expected "JSON data").
- New songs are now sorted in reverse-chronological order.
- Fixed bug where some keysounds failed to load when filename has wrong
  capitalization (for example, `#WAV Piano-001.ogg` is declared where the actual
  filename is `piano-001.ogg`).
- Subtle changes to how freestyle sounds (sounds played when pressing buttons
  without hitting a note) are played. See #186 for more discussion.

<sup>1</sup> _As it has been pointed out, this statement isn’t entirely
accurate. Bemuse is_ not the _first cross-platform BMS player. But to the best
of our knowledge, it is the first one that is readily playable without having to
compile from source on non-major platform and offers native support for BMS. We
apologize for any misconception._

## v1.0.0-beta.9.2 (2015-05-08)

### Improvements

- **Newly-added songs are now at the top of the song list.**
- **Twitter account** is linked from the title screen. Follow
  [@bemusegame](https://twitter.com/bemusegame) on Twitter.
- **YouTube videos** are added to the Information tab of songs that has a music
  video.

## v1.0.0-beta.8 (2015-05-07)

### Improvements

- **Songs are now sorted by difficulty** of the easiest chart.

  From the play statistics, we have seen that, after finishing the Tutorial,
  most people start playing the next song in the list. Unfortunately, it was a
  hard song.

  Starting from this version, the game will show the song with lowest difficulty
  level first. This should help you find an easy song to play. Enjoy!

## v1.0.0-beta.7 (2015-05-07)

### Two modes

- **The game is split into two modes.** Keyboard mode for beginners and O2Jam
  players, and BMS mode for existing LR2 and IIDX players.
  - The keyboard settings are now separate between these two modes.
  - In keyboard mode, the default key settings are [S][d][f][space][j][k][l].
    There are no scratch lanes.
  - In BMS mode, there is a scratch lane and the key settings are
    (Shift)[Z][s][X][d][C][f][V].

## v1.0.0-beta.6 (2015-05-07)

### Improvements

- Error popups may now be closed (by double-clicking them).

### Bugfixes

- Fixes an occasional bug where an error popup appears when the game fails to
  synchronize the time with the server.
- Fixes a strange bug where an error popup appears when you push the Esc button
  to quit the game.

## v1.0.0-beta.5.2 (2015-05-05)

### Internals

This release makes the game synchronizes the time with a time synchronization
server. More info on that will be published in later version.

## v1.0.0-beta.4 (2015-04-29)

### Improvements

- Added About page.
- Check for supported browser before entering game.
- Start the game when player releases the start button (instead of when
  pressing). This fixes the keypress delay issue on Mac OS X and helps player
  concentrate more on the start button.

## v1.0.0-beta.3 (2015-04-29)

So many things from previous releases that I didn't even bother counting them.
Just see the commit logs.

## v0.11.0 (2015-03-22)

A lot of new, big things!

### OMG! The game is now working!

- **Game** is now playable.
  - Only 1 player and 7k+1 mode.
  - Speed, keyboard mapping, and audio latency is still hardcoded.
  - BMS url configurable via `?bms` query parameter.

### Internals

- **Isparta** is used to perform code coverage instrumentation.
- **Documentation** is revamped to Sphinx style, and is published to
  http://bemuse.readthedocs.org/.

## v0.10.1 (2015-02-20)

### Game implementation progress

- **Game loader** is implemented to download everything needed for the game
  (song, game engine, skin) [#94]
- **Random notes** are generated to test the display. [#92], [#93]

### Infrastructure stuff

- **webpack** configuration have been tweaked
  - Use absolute path to filter module instead of regular expressions — more
    reliable environment [#91]
- **Babel** is used instead of the now-obsolete 6to5. [#95]
- **Istanbul** is configured to ignore Babel runtime code. [#96]

[#91]: https://github.com/bemusic/bemuse/pull/91
[#92]: https://github.com/bemusic/bemuse/pull/92
[#93]: https://github.com/bemusic/bemuse/pull/93
[#94]: https://github.com/bemusic/bemuse/pull/94
[#95]: https://github.com/bemusic/bemuse/pull/95
[#96]: https://github.com/bemusic/bemuse/pull/96

## v0.8.0 (2015-02-11)

### Internals

- **co** (dependency) has been updated to latest version. [#88]
- **Module loading progress** has been implemented. Since the game code may be
  quite large it is a good idea to to show a progress bar. [#89]

[#88]: https://github.com/bemusic/bemuse/pull/88
[#89]: https://github.com/bemusic/bemuse/pull/89

## v0.7.0 (2015-02-04)

### Game implementation progress

- **Support for || and && operators in Scintillator** added, so more complex
  expression may be used.
- **Auto-Synchro** project started [#87] — to study how to calibrate audio-video
  offset and audio+input latency. [#85]

### Internals

- **Bluebird** is now used instead of prfun for Promises implementation, since
  Bluebird seems to be more actively developed. [#86]

[#85]: https://github.com/bemusic/bemuse/pull/85
[#86]: https://github.com/bemusic/bemuse/pull/86
[#87]: https://github.com/bemusic/bemuse/pull/87

## v0.5.0 (2015-02-03)

### Game implementation progress

- **Animations** in skins are now possible, thanks to the
  [keytime](https://github.com/mattdesl/keytime) project. [#84]

[#84]: https://github.com/bemusic/bemuse/pull/84

## v0.4.0 (2015-02-02)

### Game implementation progress

- **Skins compilation** changed from a simple Makefile to a Gulp script. [#82]
- **Masking** feature added to `<group>` object in the skin. [#83]

[#82]: https://github.com/bemusic/bemuse/pull/82
[#83]: https://github.com/bemusic/bemuse/pull/83

### Infrastructure stuff

- **Coveralls.io** is integrated with this project. When there are pull
  requests, Coveralls will tell you how the pull-request affect the code
  coverage. [#81]

[#81]: https://github.com/bemusic/bemuse/pull/81

## v0.3.1 (2015-02-02)

### Internals

- **Asset hashing** have been enabled. This means each time a different
  JavaScript file name will be generated, based on the contents. [#80]
  - This prevents problem when some cached JavaScript files are the old version
    and doesn't work with the boot script AND/OR other JavaScript files.

[#80]: https://github.com/bemusic/bemuse/pull/80

## v0.3.0 (2015-02-01)

### Game implementation progress

- **Scintillator** is the biggest addition to this game. It is a game skinning
  engine based on XML and Pixi.js. [#77]

### Internals

- **6to5** has been updated.
- **Code coverage** improved.

[#77]: https://github.com/bemusic/bemuse/pull/77

## v0.2.1 (2015-02-01)

### Game implementation progress

- **Pixi.js** is added to the project just to make sure it works in our build
  infrastructure.
- **Bemuse** is the official name of this game. BEAT☆MUSIC☆SEQUENCE will be the
  subtitle.
- **Windows build support** added so my teammate (who uses Windows) can
  collaborate, as well as others who use Windows.

## v0.1.2 (2015-01-17)

A lot has happened.

### Game implementation progress

- **Cachier:** Large blobs can now be cached inside IndexedDB. This should make
  it easy to implement offline playback.
- **Sampling Master:** Sounds can be loaded and played using Web Audio API.
- **BMS:** Basic BMS parsing has been implemented.
- **Technical Demo:** A demo of BMS parsing and playing sound has been added to
  the "Coming Soon" page.

### Set up the infrastructure for success

- **Automated Code Reviews:** Whenever a pull request is opened, Travis will
  check your code against `jshint` and `jscs` and writes a comment on the pull
  request.
- **Automatic Deployments:** Once a new version is released, a deployment to
  GitHub pages is made.

## v0.0.0 (2014-12-26)

This is v0.0.0. Right now, this game cannot do anything (at all!), but I just
finished setting up the infrastructure. Took me five days!

### Project setup progress

- Decide on which build tool to use: Gulp + webpack + Jasmine.
- Set up linting rules and pre-commit hooks.
- Setup Travis CI and Code Climate with Code Coverage.
- Set up testing infrastructure.
- Write brief project plan and README.md (which will evolve over time).
