---
id: architecture
title: Project Architecture
sidebar_label: Architecture
---

This section describes the architecture of the project.

## Structure

The Bemuse project is a **monorepo**. This means every package that shapes the project lives inside the same repository, which allows for easier development process.

<dl>
  <dt>bin</dt>  
  <dd>Useful scripts for routine work. Examples include setting up Git
  commit hooks and releasing a new version.</dd>

  <dt>config</dt>  
  <dd>Configuration code for webpack and other things.</dd>

  <dt>docs</dt>  
  <dd>This documentation.</dd>

  <dt>packages</dt>  
  <dd>Contains projects closely-related to the core Bemuse project. These are published into separate npm packages.</dd>

  <dt>public</dt>  
  <dd>Files that will be deployed verbatim to the server, **except for**
  `index.html`, where the boot script will be inlined. These include
  skin files.</dd>

  <dt>src</dt>  
  <dd>Contains the production code. Code is split into *modules* for
  different parts of the application.</dd>

  <dt>tasks</dt>  
  <dd>Gulp tasks to run test server, build, test the application.</dd>

  <dt>website</dt>  
  <dd>The code that powers this documentation. We use <a href="https://docusaurus.io/">Docusaurus</a> to build our documentation as a static website.</dd>
</dl>

## Important Modules

These modules live in the `src` directory. There may be an arbitrary
number of modules. Therefore, this section only lists the significant
modules.

<dl>
  <dt>boot</dt>  
  <dd>This module is the entry point to Bemuse. It reads the <code>?mode=</code>
  parameter and determines the name of the main module to load. It
  then displays a loading indicator and loads the main module
  asynchronously. After the main module is downloaded, finally, it is
  executed. Main modules include <code>app</code>, the game, and <code>test</code>, the unit
  tests. Upon building, the boot script will be inlined into
  <code>index.html</code>.

**Rationale:** No one likes blank white page. We want the user to
see the application starting up as soon as possible, even though it
is simply a loading indicator. To make this _blazingly fast_, we
keep the compiled size of the `boot` very small, and inline that
compiled code directly into the HTML file. So, no round-trip HTML
requests\! If they can load the HTML, they _will_ see the loading
bar.</dd>

  <dt>app</dt>  
  <dd>This is the main module of the game's application flow. Executing
  this module will present the game's main menu.</dd>

  <dt>test</dt>  
  <dd>This is the main module for unit tests. Executing this module will
  setup the environment for testing, load the unit tests in `spec`
  directory, and then execute them. After the test is run, the results
  and coverage data (if available) will be sent back to the server for
  further processing.</dd>

  <dt>game</dt>  
  <dd>This module contains the actual game part. For example, the logic
  for judging notes, calculating score, and rendering the scene.</dd>
</dl>

## Packages

We also maintain other closely-related packages. These used to live in their own repository, but we've merged them into the main Bemuse repo for easier development.

<dl>
  <dt><a href="https://github.com/bemusic/bemuse/tree/master/packages/bms">bms-js</a></dt>  
  <dd>This package is a BMS parser written in JavaScript.</dd>

  <dt><a href="https://github.com/bemusic/bemuse/tree/master/packages/bmson">bmson</a></dt>  
  <dd>This package contains various functions useful for working with bmson files.</dd>

  <dt><a href="https://github.com/bemusic/bemuse/tree/master/packages/bemuse-tools">bemuse-tools</a></dt>  
  <dd>This package contains the command-line tools to convert a BMS package into a Bemuse package. Traditional BMS packages are optimized for offline playing. They are distributed as a large <code>.zip</code> file with <code>.wav</code>, <code>.mpg</code>, and <code>.bms</code> files.</dd>
</dl>
