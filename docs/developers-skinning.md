---
id: developers-skinning
title: Skinning
---

To make it easy to adjust the gameplay screen's appearance, the *skin*
is not built into the game's source code.

## Location

The skin is located at the
<span data-role="tree">public/skins/default</span> folder. Inside, you
will see several files.

  - skin.xml  
    This is the skin file that will be loaded by Bemuse. **Do not edit
    this file,** since this file has been generated from the skin
    template.

  - skin\_template.jade  
    This is the skin template that is used to generate skin.xml. It is
    written in [Jade](http://jade-lang.com/) language.

  - skin\_data.yml  
    A YAML file describing global variables available to the skin
    template.

  - gulpfile.js  
    A Gulp script to compile the template into skin.xml.

  - \*/\*.png  
    Image assets.

## Skin Development

Make sure you have already set up the project and started the local
development server.

Install Gulp globally, so that you can invoke it directly from the
command line:

    npm install -g gulp

In another terminal window, <span data-role="command">cd</span> to the
skin's directory:

    cd public/skins/default

Then run Gulp:

    gulp

This will compile the skin into skin.xml. If you change
skin\_template.jade or skin\_data.yml, the skin is recompiled. Now, you
can refresh the browser to see the changes.

## Skin Elements

**TODO**: generate documentation
