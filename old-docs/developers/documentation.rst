
Documentation
=============

To keep the codebase and documentation in sync,
we keep the documentation in 2 places:

1. Inside the ``docs`` folder.
2. Inside the code.


Documentation System
--------------------

We use Sphinx_ to generate the project's documentation.
Documentation building and hosting is provided by `Read the Docs`_.

.. _Sphinx: http://sphinx-doc.org/
.. _Read the Docs: https://readthedocs.org/


Generating Documentations Locally
---------------------------------

Install Sphinx using::

    pip install sphinx

Inside the ``docs`` folder, type in::

    make html

This will generate the HTML documentations in ``_build/html``.


Writing Documentation Pages
---------------------------

To create a new documentation page, create an ``.rst`` file in the appropriate
place, and then reference the ``.rst`` file inside ``README.rst``'s toctree.


Writing Documentation In Code
-----------------------------

This project is written in ES6,
and we don't have an adequate documentation tool yet.
Some tools don't work with ES6 syntax, or some tools requires us to be too
verbose and repetitive (making documentation a boring and error-prone process).

Therefore, this project invents its own code documentation tool
which integrates nicely with Sphinx.

.. codedoc:: docs/codedoc



Automatically-Generated Module Documentation
--------------------------------------------

To facilitate documenting the game internals,
documentation for each ES6 module is generated.

.. codedoc:: docs/moduledoc


How It Works
------------

I think from the outside,
this system looks pretty cool,
but from the inside,
this is a dirty hack.

.. codedoc:: docs/generate




