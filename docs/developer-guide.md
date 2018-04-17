---
id: developer-guide
title: Developer Guide
---

This page describes how to setup the project on your computer for local
development.

## Prerequisites

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) 8
* [Yarn](https://yarnpkg.com/)
* Text Editor with [EditorConfig](http://editorconfig.org/) support.

## Setting Up the Project

First, you should create a folder for Bemuse development:

```bash
mkdir Bemuse
cd Bemuse
```

Then, clone the Bemuse repository:

```bash
git clone git@github.com:bemusic/bemuse.git
```

After these repository has been cloned, `cd` into the Bemuse repository:

```bash
cd bemuse
```

Install the project's dependencies:

```bash
yarn
```

When it finishes installing, start the development server:

```bash
yarn start
```

The game should be accessible at `http://localhost:8080/`.

To run unit tests, go to `http://localhost:8080/?mode=test`.

## Coverage Mode

We measure the code coverage to make sure that most part of our code is covered
by some test. This helps us be more confident in modifying our code.

To turn on the coverage mode, start the server with the `BEMUSE_COV` environment
variable set to `true`:

```bash
BEMUSE_COV=true npm start
```

Then run the unit tests. After the unit tests are run, the coverage report will
be generated. They can be viewed at `http://localhost:8080/coverage/`.

<div class="admonition note">
<p class="admonition-title">Note</p>
<p>For Windows users, use the following command:</p>
<pre><code class="hljs css bat"><span class="hljs-built_in">set</span> "BEMUSE_COV=true" &amp;&amp; npm <span class="hljs-built_in">start</span>
</code></pre>
<p>You can also use <code>cross-env</code> for a cross-platform solution for defining environment variables.</p>
</div>

## Building

To build the source code into a static web application, run:

```bash
yarn build
```

The built files will reside in the `build` directory.

## Running Tests from Command Line

You can run tests from the command line by running:

```bash
yarn test
```

This will effectively

1.  build Bemuse with coverage mode turned on,
2.  start a web server,
3.  start a web browser and navigate to the test page, effectively running the
    tests,
4.  collect the results and code coverage and write reports.
