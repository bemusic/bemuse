---
id: developer-guide
title: Developer Guide
---

This page describes how to setup the project on your computer for local
development. This guide should work on all major operating systems (Windows,
Linux, or macOS).

## Develop in GitPod

The easiest way to code on this project is to use GitPod, which lets you develop
Bemuse in a cloud-based environment where all the dependencies are already
installed from your web browser.

You can launch a workspace by going to the below link:

&rarr; <https://gitpod.io/#https://github.com/bemusic/bemuse>

## Develop in GitHub Codespaces

You can also develop Bemuse in GitHub Codespaces, which is a cloud-based
development environment that is integrated with GitHub.

You can launch a workspace by going to the below link:

&rarr; <https://github.com/codespaces/new?hide_repo_select=true&repo=27105154&machine=standardLinux32gb>

It will take about 4 minutes to launch the workspace. Once it is ready, you can
start the development server by running the following command:

```sh-session
$ rush dev
```

## Manual Setup

### Windows, macOS and Linux

- [Git](http://git-scm.com/)
- [Node.js](http://nodejs.org/) (v16.18.0+)
- Text Editor with [EditorConfig](http://editorconfig.org/) &
  [Prettier](https://prettier.io/) support. (We recommend
  [Visual Studio Code](https://code.visualstudio.com/))

#### Prerequisite Check

Run these commands inside the **Terminal** (**PowerShell/Command Prompt** for
Windows).

**Git**: You should see the version number:

```sh-session
$ git --version
git version 2.17.0
```

**Node.js**: You should see the version number:

```sh-session
$ node -v
v16.18.0
```

### Install Rush

We use [Rush](https://rushjs.io/) to manage the dependencies of this project, so we first need to install it.

```sh-session
$ npm install -g @microsoft/rush
```

### Setting Up the Project

First, you should create a folder for Bemuse development:

```sh-session
$ mkdir Bemuse
$ cd Bemuse
```

Then, clone the Bemuse repository:

```bash
$ git clone https://github.com/bemusic/bemuse.git
```

After these repository has been cloned, `cd` into the Bemuse repository:

```sh-session
$ cd bemuse
```

Install the project's dependencies using Rush:

```sh-session
$ rush update
```

Before running the development server, you will have to compile the subprojects that Bemuse depends on:

```sh-session
$ rush build --to-except bemuse
```

## Running Bemuse

After everything is installed and all subprojects have been compiled, you can
start the development server:

```sh-session
$ rush dev
```

The game should be accessible at `http://localhost:8080/`.

To run unit tests, go to `http://localhost:8080/?mode=test`.

## Building Bemuse

To build the source code into a static web application, run:

```sh-session
$ node build-scripts build
```

The built files will reside in the `dist` directory.

## Working on the project website

```sh-session
$ cd website
$ npm start
```
