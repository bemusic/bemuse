
Project Architecture
====================

This section describes the architecture of the project.


Directory Structure
-------------------

:tree:`bin`
  Useful scripts for routine work.
  Examples include setting up Git commit hooks and releasing a new version.
:tree:`config`
  Configuration code for webpack and other things.
:tree:`docs`
  This documentation.
:tree:`features`
  The functional specifications and end-to-end tests.
:tree:`public`
  Files that will be deployed verbatim to the server,
  **except for** ``index.html``, where the boot script will be inlined.
  These include skin files.
:tree:`spec`
  Contains the unit tests.
  Its directory structure resembles the ``src`` directory.
:tree:`src`
  Contains the production code.
  Code is split into *modules* for different parts of the application.
:tree:`tasks`
  Gulp tasks to run test server, build, test the application.


Important Modules
-----------------

These modules live in the ``src`` directory.
There may be an arbitrary number of modules.
Therefore, this section only lists the significant modules.

:module:`boot`
  This module is the entry point to Bemuse.
  It reads the ``?mode=`` parameter
  and determines the name of the main module to load.
  It then displays a loading indicator and loads the main module asynchronously.
  After the main module is downloaded, finally, it is executed.
  Main modules include ``app``, the game, and ``test``, the unit tests.
  Upon building, the boot script will be inlined into ``index.html``.

  **Rationale:**
  No one likes blank white page.
  We want the user to see the application starting up as soon as possible,
  even though it is simply a loading indicator.
  To make this *blazingly fast*,
  we keep the compiled size of the ``boot`` very small,
  and inline that compiled code directly into the HTML file.
  So, no round-trip HTML requests!
  If they can load the HTML, they *will* see the loading bar.

:module:`app`
  This is the main module of the game's application flow.
  Executing this module will present the game's main menu.

:module:`test`
  This is the main module for unit tests.
  Executing this module will setup the environment for testing,
  load the unit tests in ``spec`` directory,
  and then execute them.
  After the test is run, the results and coverage data (if available)
  will be sent back to the server for further processing.

:module:`game`
  This module contains the actual game part.
  For example, the logic for judging notes, calculating score,
  and rendering the scene.


Related Projects
----------------

Apart from the ``bemuse`` project,
we also maintain other closely-related projects in a separate repository.

:github:`bemusic/bms-js`
  This project is a BMS parser written in JavaScript.
  It is written in plain ES5 for maximum portability.

:github:`bemusic/bmspec`
  This project is an executable specification of the BMS file format.
  It is used to make sure that bms-js can properly parse BMS file format,
  especially the edge cases.

:github:`bemusic/pack`
  This repository contains the code needed to convert a BMS package
  into a Bemuse package.
  Traditional BMS packages are optimized for offline playing.
  They are distributed as a large ``.zip`` file with ``.wav``, ``.mpg``, and
  ``.bms`` files. This is not suitable for web consumption.
  See :github:`bemusic/pack` for more information.
