Getting Started (Windows)
=========================

This setup guide is based on Windows 10, but should also work on Windows 7 or above.
This guide assumes some command-line knowledge.

Installing Prerequisites
------------------------

GitHub for Windows
~~~~~~~~~~~~~~~~~~

GitHub for Windows makes it easy to get started using Git and GitHub on Windows.
Download GitHub for Windows from https://windows.github.com/.
Install it and sign in using your GitHub account.

Node.js
~~~~~~~

Node.js is a JavaScript runtime outside the browser.
We use it to perform build tasks (such as compiling the source codes, running tests, static analysis, and performing deployment tasks).
Download the Node.js installer from https://nodejs.org

Git for Windows
~~~~~~~~~~~~~~~

While GitHub for Windows provides a nice GUI to work with git, since Bemuse is developed on multiple platforms, we recommend that we work with git using the ``git`` command-line, so we willl use Git for Windows.
Download the Git for Windows installer from http://gitforwindows.org/.

When installing, make sure to check the "Use Git from the Windows Command Prompt" option, to add the ``git`` command to your PATH. This allows you to access the ``git``. CLI from your ``cmd`` or PowerShell.

This should also install the "Git Bash", a ``bash`` environment for Windows which we will use in this guide.

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

After cloning them, open the root project folder with your preferred command-line.

For ``cmd`` or PowerShell, ``cd`` into the Bemuse repository::

   cd bemuse

For ``bash``, right click the ``bemuse`` project folder and select "Git Bash here."

Install ``yarn``
~~~~~~~~~~~~~~~~

Note that we use ``yarn`` to install our Node.js dependencies, not ``npm``.

   npm install -g yarn

Install Project Dependencies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The Bemuse project depends on hundreds of other free software projects.
Install these dependencies by running the following command::

   yarn

Start the Development Server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To start the development server, type in::

   yarn start

The game should be accessible at ``http://localhost:8080/``.

Run Unit Tests
~~~~~~~~~~~~~~

To run unit tests, go to ``http://localhost:8080/?mode=test``.
