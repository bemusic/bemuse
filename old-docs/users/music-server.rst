
Running Your Own Music Server
=============================

.. warning::

    This section is under construction.

Bemuse comes with a default music server to help new players get started.
This default music server contains a selection of songs that I think are really nice.
You can also run your own music server and play it in Bemuse.
This page describes how you can do it.
This page assumes some knowledge about using the command line and web hosting.


A Music Server
--------------

A music server is simply a web server that hosts the files in a specific structure,
which allows Bemuse to find the list of songs and the song data.
A Bemuse music server has the following structure:

- (root of the server)

  - index.json
  - song1/

    - bms1.bme
    - bms2.bml
    - assets/

      - metadata.json
      - (something).bemuse


index.json
~~~~~~~~~~

This file holds the list of all available songs and charts in this server.
It also includes some metadata information.

When entering the game, Bemuse will download this file to create the song list
that you see in the music selection screen.


Song directory
~~~~~~~~~~~~~~

Besides the ``index.json`` file is a song directory.
This directory contains the BMS files and the assets folder, a **Bemuse assets package**.

This file is generated using the Bemuse tools, which we will cover in the next section.


Bemuse assets package
~~~~~~~~~~~~~~~~~~~~~

Usually, a BMS package will come with hundreds (or even thousands) of sound files (the keysounds). It is not suitable for serving over the web.
Sometimes, they are ``.wav`` files and usually, they are ``.ogg`` files.
Wave files are too large, and not all browsers can play OGG files.

A Bemuse asset package contains the keysounds in OGG and M4A format,
because most browsers can play these file formats.
These sound files are grouped together into multiple parts.
Each part is approximately 1.4 MB large.

The Bemuse assets package is also generated using the Bemuse tools,
which we will cover in the next section.


Prerequisites
-------------

Bemuse tools work on Windows and Mac OS X. Before that, you need to install:

Node.js
~~~~~~~

Bemuse tools is written in JavaScript for the Node.js platform and distributed through npm.
First, you need to install `Node.js <https://nodejs.org/>`_, which also includes npm.

SoX
~~~

SoX is a tool to process and convert audio files.
Bemuse tools uses it to convert the keysounds into a web-friendly format.

Windows users should list SoX in their System PATH by going to Control Panel>System and Security>System>Advanced System Setitngs>Environment Variables or by setting the PATH variable in CMD. Please see TechNet documentation for more info: https://technet.microsoft.com/en-us/library/bb490963.aspx?f=255&MSPPError=-2147217396

QuickTime and qaac (Windows only)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Mac OS X already comes with QuickTime and a command-line M4A encoder.
Windows, on the other hand, does not.
Therefore, Windows users needs to install `qaac <https://sites.google.com/site/qaacpage/>`_.
It is a command to convert audio files into MP4 audio (AAC) for browsers that doesn't support OGG.
Currently, Bemuse Tools looks for the 32-bit executable for qaac; don't just install the 64-bit executable.

Windows users should list qaac in their System PATH by going to Control Panel>System and Security>System>Advanced System Setitngs>Environment Variables or by setting the PATH variable in CMD. Please see TechNet documentation for more info: https://technet.microsoft.com/en-us/library/bb490963.aspx?f=255&MSPPError=-2147217396


Installing Bemuse Tools
-----------------------

Bemuse tools is distributed via npm. To install Bemuse tools, use the following command::

  npm install -g bemuse-tools

If you get a permission error on Windows, try running the above command in an Administrator command prompt.

If you get a permission error on Mac OS X, try::

  sudo npm install -g bemuse-tools


Using Bemuse Tools
------------------

First, you will want to create a folder to hold your music server.

**TODO**: More detailed instructions


Generating Bemuse assets package
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Use this command::

  bemuse-tools pack songdir

Generating index file
~~~~~~~~~~~~~~~~~~~~~

Use this command::

  bemuse-tools index



Hosting
-------

On Dropbox
~~~~~~~~~~

TODO


On a Web Server
~~~~~~~~~~~~~~~

Upload the files to the web server. Also set up CORS on the server to allow Bemuse to access.

Direct players to your server with the following url:
http://bemuse.ninja/?server=[SERVER URL]
**TODO**: More detailed instructions
