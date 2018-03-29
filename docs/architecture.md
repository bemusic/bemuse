---
id: architecture
title: Project Architecture
sidebar_label: Architecture
---

This section describes the architecture of the project.

## Directory Structure

  - <span data-role="tree">bin</span>  
    Useful scripts for routine work. Examples include setting up Git
    commit hooks and releasing a new version.

  - <span data-role="tree">config</span>  
    Configuration code for webpack and other things.

  - <span data-role="tree">docs</span>  
    This documentation.

  - <span data-role="tree">public</span>  
    Files that will be deployed verbatim to the server, **except for**
    `index.html`, where the boot script will be inlined. These include
    skin files.

  - <span data-role="tree">spec</span>  
    Contains the unit tests. Its directory structure resembles the `src`
    directory.

  - <span data-role="tree">src</span>  
    Contains the production code. Code is split into *modules* for
    different parts of the application.

  - <span data-role="tree">tasks</span>  
    Gulp tasks to run test server, build, test the application.

## Important Modules

These modules live in the `src` directory. There may be an arbitrary
number of modules. Therefore, this section only lists the significant
modules.

  - <span data-role="module">boot</span>  
    This module is the entry point to Bemuse. It reads the `?mode=`
    parameter and determines the name of the main module to load. It
    then displays a loading indicator and loads the main module
    asynchronously. After the main module is downloaded, finally, it is
    executed. Main modules include `app`, the game, and `test`, the unit
    tests. Upon building, the boot script will be inlined into
    `index.html`.
    
    **Rationale:** No one likes blank white page. We want the user to
    see the application starting up as soon as possible, even though it
    is simply a loading indicator. To make this *blazingly fast*, we
    keep the compiled size of the `boot` very small, and inline that
    compiled code directly into the HTML file. So, no round-trip HTML
    requests\! If they can load the HTML, they *will* see the loading
    bar.

  - <span data-role="module">app</span>  
    This is the main module of the game's application flow. Executing
    this module will present the game's main menu.

  - <span data-role="module">test</span>  
    This is the main module for unit tests. Executing this module will
    setup the environment for testing, load the unit tests in `spec`
    directory, and then execute them. After the test is run, the results
    and coverage data (if available) will be sent back to the server for
    further processing.

  - <span data-role="module">game</span>  
    This module contains the actual game part. For example, the logic
    for judging notes, calculating score, and rendering the scene.

## Related Projects

Apart from the `bemuse` project, we also maintain other closely-related
projects in a separate repository.

  - <span data-role="github">bemusic/bms-js</span>  
    This project is a BMS parser written in JavaScript. It is written in
    plain ES5 for maximum portability.

  - <span data-role="github">bemusic/bmspec</span>  
    This project is an executable specification of the BMS file format.
    It is used to make sure that bms-js can properly parse BMS file
    format, especially the edge cases.

  - <span data-role="github">bemusic/pack</span>  
    This repository contains the code needed to convert a BMS package
    into a Bemuse package. Traditional BMS packages are optimized for
    offline playing. They are distributed as a large `.zip` file with
    `.wav`, `.mpg`, and `.bms` files. This is not suitable for web
    consumption. See <span data-role="github">bemusic/pack</span> for
    more information.
