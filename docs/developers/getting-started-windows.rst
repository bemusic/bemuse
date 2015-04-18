Getting Started (Windows)
=========================

This setup guide is based on Windows 8.1.
This guide assumes some command-line knowledge.

Installing Prerequisites
------------------------

GitHub for Windows
~~~~~~~~~~~~~~~~~~

GitHub for Windows makes it easy to get started using Git and GitHub on Windows.
Download GitHub for Windows from https://windows.github.com/.
Install it and sign in using your GitHub account.

Chocolatey
~~~~~~~~~~

Chocolatey lets you install applications from the Command Prompt.
To install Chocolatey, visit https://chocolatey.org/.

Node.js
~~~~~~~

Node.js is a JavaScript runtime outside the browser.
We use it to perform build tasks (such as compiling the source codes, running tests, static analysis, and performing deployment tasks).
Open Command Prompt as Administrator and install Node.js using::

   choco install nodejs.install

Install Git for Windows
~~~~~~~~~~~~~~~~~~~~~~~

GitHub for Windows comes with PowerShell-based Git Shell, only available on Windows.

However, Bemuse is developed on multiple platforms, so we prefer to use a shell that can be used on all platforms.
One of it is the "bash" shell.
The easiest way to install a bash shell is to install Git for Windows::

   choco install git.install

Install Google Chrome
~~~~~~~~~~~~~~~~~~~~~

Google Chrome is used for automated testing, so make sure you have it installed::

   choco install google-chrome-x64

Restart Your Computer
~~~~~~~~~~~~~~~~~~~~~

These tools modify your system ``PATH`` variable.
They need to be reloaded.
One of the easiest and most reliable way to do it is to restart your computer.


Setting Up the Project
----------------------

Create an empty folder for the Bemuse project,
then clone the following repositories into that folder using GitHub for Windows:

:github:`bemusic/bemuse`
  The game repository.
:github:`bemusic/music`
  The music repository. This repository is huge, so it will take a while.

After cloning them,
right click the ``bemuse`` project folder and select "Git Bash here."

Install ``npm``
~~~~~~~~~~~~~~~

Even though npm is already installed with Node.js,
`the installer is buggy <http://stackoverflow.com/questions/25093276/node-js-windows-error-enoent-stat-c-users-rt-appdata-roaming-npm>`_,
causing npm not to run.
To fix, use ``npm`` to install itself::

   npm install npm -g

Install Project Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The Bemuse project depends on hundreds of other free software projects.
To install them, use the ``npm`` command line tool to install::

   npm install

Start the Development Server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To start the development server, type in::

   npm start
