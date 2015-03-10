
Getting Started
===============

This page describes how to setup the project on your computer
for local development.

.. contents::
   :local:


Prerequisites
-------------

- Git_
- Node.js_ v0.12
- Text Editor with EditorConfig_ support.

.. _Git: http://git-scm.com/
.. _Node.js: http://nodejs.org/
.. _EditorConfig: http://editorconfig.org/


Setting Up the Project
----------------------

.. note::
   
   For Windows users, there (will be) a dedicated quick-start guide.

TODO: Write this section




Starting the Development Server
-------------------------------

::

  npm start


- To run the application, go to ``http://localhost:8080/``.
- To run unit tests, go to ``http://localhost:8080/?mode=test``.


Coverage Mode
~~~~~~~~~~~~~

We run code coverage on our code to make sure that most part of our code
is covered by a unit test.
This helps us be more confident in modifying our code.

To turn on the coverage mode, start the server using the following command::

  COV=true npm start

Then run the unit tests.
After the unit tests are run, the coverage report will be generated.

You can view the coverage report at `http://localhost:8080/coverage/`.



Building
--------

To build the source code into a static web application, run::

  npm run build

The built files will reside in the ``build`` directory.


Running Tests from Command Line
-------------------------------

You can run tests from the command line by running::

  npm test

This will effectively

1. build Bemuse with coverage mode turned on,
2. start a web server,
3. start a web browser and navigate to the test page, effectively running the tests,
4. collect the results and code coverage and write reports.



