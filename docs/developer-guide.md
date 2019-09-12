---
id: developer-guide
title: Developer Guide
---

This page describes how to setup the project on your computer for local development. This guide should work on all major operating systems (Windows, Linux, or macOS).

## Prerequisites

### Windows, macOS and Linux

- [Git](http://git-scm.com/)
- [Node.js](http://nodejs.org/) (8.0.0+)
- [Yarn](https://yarnpkg.com/)
- Text Editor with [EditorConfig](http://editorconfig.org/) & [Prettier](https://prettier.io/) support. (We recommend [Visual Studio Code](https://code.visualstudio.com/))

#### Prerequisite Check

Run these commands inside the **Terminal** (**PowerShell/Command Prompt** for Windows).

**Git**: You should see the version number:

```sh-session
$ git --version
git version 2.17.0
```

**Node.js**: You should see the version number:

```sh-session
$ node -v
v10.11.0
```

**Yarn**: You should see the version number:

```sh-session
$ yarn -v
1.6.0
```

## Setting Up the Project

First, you should create a folder for Bemuse development:

```sh-session
$ mkdir Bemuse
$ cd Bemuse
```

Then, clone the Bemuse repository:

```bash
$ git clone git@github.com:bemusic/bemuse.git
```

After these repository has been cloned, `cd` into the Bemuse repository:

```sh-session
$ cd bemuse
```

Install the project's dependencies. Note that we use Yarn, not npm:

```sh-session
$ yarn
```

Before running the development server, you will have to compile all subprojects:

```sh-session
$ yarn lerna run prepare
```

After everything is installed and all subprojects have been compiled, you can start the development server:

```sh-session
$ yarn start
```

The game should be accessible at `http://localhost:8080/`.

To run unit tests, go to `http://localhost:8080/?mode=test`.

## Coverage Mode

We measure the code coverage to make sure that most part of our code is covered by some tests. This helps us be more confident in modifying our code.

To turn on the coverage mode, start the server with the `BEMUSE_COV` environment variable set to `true`:

```sh-session
$ BEMUSE_COV=true npm start
```

Then run the unit tests. After the unit tests are run, the coverage report will be generated. They can be viewed at `http://localhost:8080/coverage/`.

### Notes

For Windows users, setting an environment variable on the command line can be difficult. However, you can use `cross-env` for a cross-platform solution for defining environment variables.

```powershell
PS> npm install -g cross-env
PS> cross-env BEMUSE_COV=true npm start
```

## Building

To build the source code into a static web application, run:

```sh-session
$ yarn build
```

The built files will reside in the `build` directory.

## Running Tests from Command Line

You can run tests from the command line by running:

```sh-session
$ yarn test
```

This will effectively

1.  build Bemuse with coverage mode turned on,
2.  start a web server,
3.  start a web browser and navigate to the test page, effectively running the tests,
4.  collect the results and code coverage and write reports.
