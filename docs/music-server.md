---
id: music-server
title: How to Host a Music Server
sidebar_label: Music Server
---

<div class="admonition warning">
<p class="admonition-title">Warning</p>
<p>This section is under construction.</p>
</div>

Bemuse comes with a default music server to help new players get started. This
default music server contains a selection of songs that I think are really nice.
You can also run your own music server and play it in Bemuse. This page
describes how you can do it.

This guide is valid for Windows or macOS, and assumes some knowledge about using
the command line and web hosting.

## Prerequisites

### macOS

- [Homebrew](http://brew.sh/)
- [Node.js](https://nodejs.org/)
- [SoX](http://sox.sourceforge.net/): `brew install sox --with-libvorbis`

#### Prerequisite Check

Run these commands inside the Terminal.

**Node.js**: You should see the version number:

```sh-session
$ node -v
v10.11.0
```

**SoX**: You should see the SoX version:

```sh-session
$ sox --version
sox:      SoX v14.4.2
```

<div class="admonition note">
<p class="admonition-title">Note</p>
<p>On some devices, the SoX version number may not be displayed.</p>
</div>

### Windows

- [Node.js](https://nodejs.org/)
- [SoX](http://sox.sourceforge.net/): Download from
  http://sourceforge.net/projects/sox/files/sox/

**For hosting on your local machine**:

- [xampp](https://www.apachefriends.org)

#### Installation

Create a directory to store the program files. For example:
`C:\Bemuse\vendor\bin`. Extract files into that folder. Your tree should look
like this:

    C:
    └── Bemuse
        └── vendor
            └── bin
                ├── libflac-8.dll
                ├── libgcc_s_sjlj-1.dll
                ├── libgomp-1.dll
                ├── libid3tag-0.dll
                ├── libogg-0.dll
                ├── libpng16-16.dll
                ├── libsox-3.dll
                ├── libsoxconvolver64.dll
                ├── libsoxr64.dll
                ├── libssp-0.dll
                ├── libvorbis-0.dll
                ├── libvorbisenc-2.dll
                ├── libvorbisfile-3.dll
                ├── libwavpack-1.dll
                ├── libwinpthread-1.dll
                ├── refalac.exe
                ├── sox.exe
                ├── wget.exe
                ├── wget.ini
                └── zlib1.dll

#### Prerequisite Check

Open **PowerShell** (or Command Prompt) and add the PATH variable:

```powershell
PS> $env:Path += ";C:\Bemuse\vendor\bin"
```

**Node.js**: You should see the version number:

```powershell
PS> node -v
# v9.8.0
```

**SoX**: You should see the version number:

```powershell
PS> sox --version
# C:\Bemuse\vendor\bin\sox.exe:      SoX v14.4.2
```

### Debian Linux (Debian, Ubuntu etc.)

- [Node.js](https://nodejs.org/):
  [Here](https://github.com/nodesource/distributions/blob/master/README.md) is
  the installation guide from nodejs.
- [SoX](http://sox.sourceforge.net/): `sudo apt install sox`

If you got error when convert sound, install `libsox-dev` package too.

#### Prerequisite Check

Run these commands inside the Terminal.

**Node.js**: You should see the version number:

```sh-session
$ node -v
v11.1.0
```

**SoX**: You should see the SoX version:

```sh-session
$ sox --version
sox:      SoX v14.4.2
```

## A Music Server

A music server is simply a web server that hosts the files in a specific
structure, which allows Bemuse to find the list of songs and the song data. A
Bemuse music server has the following structure:

    (root of the server)
    ├── index.cache
    ├── index.json
    └── [song_title]/
        ├── bms1.bme
        ├── bms2.bml
        └── assets/
            ├── metadata.json
            └── (something).bemuse

### `index.json`

This file holds the list of all available songs and charts in this server. It
also includes some metadata information.

When entering the game, Bemuse will download this file to create the song list
that you see in the music selection screen.

### Song directory

Besides the `index.json` file is a song directory. This directory contains the
BMS files and the assets folder, a **Bemuse assets package**.

This file is generated using the Bemuse tools, which we will cover in the next
section.

### Bemuse assets package

Usually, a BMS package will come with hundreds (or even thousands) of sound
files (the keysounds). It is not suitable for serving over the web. Sometimes,
they are `.wav` files and usually, they are `.ogg` files. Wave files are too
large, and not all browsers can play OGG files.

A Bemuse asset package contains the keysounds in OGG format. These sound files
are grouped together into multiple parts. Each part is approximately 1.4 MB
large.

The Bemuse assets package is also generated using the Bemuse tools, which we
will cover in the next section.

## Install Bemuse Tools

Bemuse Tools is a command line application to help you generate files for Bemuse
music server. Install it using the **npm** command, which comes with Node.js:

```powershell
PS> npm install -g bemuse-tools
```

or if you use yarn:

```bash
$ yarn global add bemuse-tools
```

### Installation Check

Run the following command:

```powershell
PS> bemuse-tools
```

It should display the version:

    This is bemuse-tools v1.1.0-beta.1

      bemuse-tools: Tools for Bemuse

      index [-r] — Index BMS files in current directory
      pack <path> — Packs sounds and BGAs into assets folder
      server <path> — Serves a Bemuse server (no indexing or conversion)

If you installed bemuse-tools from yarn and get `command not found` error, you
have to export path.

```bash
$ export PATH=~/.yarn/bin:${PATH}
```

and run once again for installation check.

## Creating Your Server Folder

Extract your BMS files into a folder. One song per folder. For example:

    C:
    └── Bemuse
        └── myserver
            ├── song1
            │   ├── song1_N.bms
            │   ├── song1_H.bms
            │   ├── song1_A.bms
            │   ├── bass.wav
            │   └── kick.wav
            └── song2
                ├── song2_N.bms
                ├── song2_H.bms
                ├── song2_A.bms
                ├── go.wav
                ├── back.wav
                ├── to.wav
                ├── your.wav
                └── rave.wav

## Creating Bemuse Packages

Normally, a BMS package comes in `.rar` or `.zip` format. Inside that package,
there are few BMS files and hundreds of sound files.

It's not practical to extract `.rar` or `.zip` files in the browser. It's also
not practical to download hundreds of small files (very slow).

In Bemuse, keysounds are packed into `.bemuse` format. They are split into many
parts. Each part is about 1.4mb.

Inside Terminal or Powershell, `cd` to the server folder:

```powershell
PS> cd C:\Bemuse\myserver
```

Then invoke `bemuse-tools pack` with the folder you want to pack:

```powershell
PS> bemuse-tools pack 'Lapis - SHIKI'
# -> Loading audios
# -> Loading movies
# -> Loading and converting images
#
# -> Converting audio to ogg [better audio performance]
# .....................................................................................................
# ..................................................
# -> Writing...
# Written ogg.1.e0a51d24.bemuse
# Written ogg.2.d582293b.bemuse
# Written ogg.3.28d51957.bemuse
# ...
# Written metadata.json
```

<div class="admonition note">
<p class="admonition-title">Note</p>
<p>
    If you pack bms files from <b>linux</b>, <code>-> Converting audio to m4a [for iOS and Safari]</code> will get errors because of codec. Converted pack will not play sounds on Apple platform devices.
</p>
</div>

### Note

Now if you look at your song folder, you should see a new folder called
**assets**:

    Lapis - SHIKI
    ├── assets
    │   ├── bga.1.e0a51d24.bemuse
    │   ├── bga.2.d582293b.bemuse
    │   ├── bga.3.28d51957.bemuse
    │   │   ...
    │   ├── metadata.json
    │   ├── ogg.1.d9bfef56.bemuse
    │   ├── ogg.2.2105f7cc.bemuse
    │   └── ogg.3.766f65d4.bemuse
    │       ...
    ├── ba11.ogg
    ├── ba12.ogg
    ├── ba13.ogg
    │   ...
    ├── lapis5key.bms
    ├── lapis7keya.bme
    ├── lapis7keyl.bme
    │   ...
    ├── syn9.ogg
    └── synpad.ogg

## Creating Index File

Now, the client needs to know what songs are available in the server. You need
to create an index file. You can do it by running this command in the server
folder:

```powershell
PS> bemuse-tools index
#
# Absurd Gaff - siromaru       160bpm [schranz] siromaru / BMSSP-Absurd Gaff 3 6 8 10 10 21 [no-meta]
# ametsuchi - stereoberry      122bpm [discopunk / shoegazer] stereoberry / BMSSP-ametsuchi 1 3 5 5 8 [no-meta]
# atonement you you - unknown  197bpm [NO GENRE] Unknown Artist / BMSSP-atonement you you 4 6 [no-meta]
# AVALON - Team.SASAKURATION   200bpm [Ω] Team:SASAKURATION-AVALON 0 5 6 10 10 12 12 [no-meta]
# ...
```

After running, you will see these `index.json` and `index.cache` appear in your
folder:

    myserver
    ├── AVALON - Team.SASAKURATION
    ├── Absurd Gaff - siromaru
    ├── Declinin' - ____(sta)
    ├── HE is an Energizer - Mr.ABC
    ├── I'll_forget_you_you'll_never_forget_me - mommy
    ├── Lapis - SHIKI
    │   ...
    ├── index.cache
    └── index.json

## Hosting

### On a Web Server

Upload `index.json`, all `*.bemuse` and `*.bms/bme/bml` files to a web server.
Make sure the directory layout is the same.
[Enable cross-origin resource sharing](http://enable-cors.org/) on your web
server to allow Bemuse client to connect.

To connect to the music server, go to `http://bemuse.ninja/?server=<your URL>`.

Example:
http://bemuse.ninja/?server=http://flicknote.bemuse.ninja/bemuse/mumei12

### On a Local Machine (Windows, XAMPP)

Navigate to your Apache Config folder of XAMPP (e.g. `C:\xampp\apache\conf`) and
open `httpd.conf`

<div class="admonition note">
<p class="admonition-title">Note</p>
<p>Make sure you create a Backup of the file so that you can restore to the default settings if any issues occur.</p>
</div>

Find the variable name `DocumentRoot` and edit it's value from
`"C:\xampp\htdocs"` to your server folder. (e.g. `C:\Bemuse\myserver`)

```
#
# DocumentRoot: The directory out of which you will serve your
# documents. By default, all requests are taken from this directory, but
# symbolic links and aliases may be used to point to other locations.
#
DocumentRoot "C:\Bemuse\myserver"
```

Also change the value found in the `Directory` tag to the server folder

```
<Directory "C:\Bemuse\myserver">
```

Place this line inside the `Directory` tag

```
Header set Access-Control-Allow-Origin "*"
```

So it should look like below

```
DocumentRoot "C:\Bemuse\myserver"
<Directory "C:\Bemuse\myserver">
    ....
    Header set Access-Control-Allow-Origin "*"
</Directory>
```

Once the file is saved, open your XAMPP Control Pannel and run "Apache".

Then connect to the music server with
(http://bemuse.ninja/?server=https://localhost/).

### On a Local Machine (macOS, [nginx](https://nginx.org/en/))

First, open a Terminal and `cd` into the folder that contains the Bemuse server
(there should be an `index.json` file in that folder).

Then, install nginx:

```bash
$ brew install nginx
```

<div class="admonition note">
<p class="admonition-title">Note</p>
<p>
    Homebrew will install nginx on /usr/local.
</p>
</div>

Check your current location:

```bash
$ pwd
# e.g Output: /Users/cenox/Dev/bemuse-test
```

Note the output location; this will be used when we configure nginx.

Next, `cd` to nginx folder:

```bash
$ cd /usr/local/nginx/etc
```

Use `touch` command to create a config file to serve the Bemuse server.

```bash
$ touch servers/bemuse
```

Open Bemuse setting file with a text editor. Our example will use `nano`:

```bash
$ nano servers/bemuse
```

Insert below text:

```nginx
server {
    listen 80;
    location / {
        add_header 'Access-Control-Allow-Origin' '*';
        root /Users/cenox/Dev/bemuse-test;
        #    ^ Replace with the location from previous step
    }
}
```

Save the file by pressing `Ctrl+X`, `Y`, `Enter`.

Reload nginx:

```bash
$ nginx -s reload
```

Now, the music server will be available at http://localhost. You can play by
going to <http://bemuse.ninja/?server=http://localhost>.

##### Additional Note.

When you install nginx in Linux using a package manager, it runs when the OS
boots up, but macOS isn't. You can use `brew services` to register the nginx
service and make nginx automatically start when you log in.

```bash
$ brew services start nginx
```

#### Debian Linux using [nginx](https://nginx.org/en/)

First, open a Terminal and `cd` into the folder that contains the Bemuse music
server (you should see `index.json` in this folder).

Then, install nginx:

```bash
$ sudo apt install nginx
```

Check your current location:

```bash
$ pwd
# e.g Output: /home/cenox/bemuse-test
```

Note the output location. This will be used when we configure nginx.

Go to nginx folder:

```bash
$ cd /etc/nginx
```

Use `touch` command to create a config file to serve the Bemuse music server.

```bash
$ sudo touch sites-available/bemuse
```

Open the setting file with your text editor. This example uses `nano`:

```bash
$ sudo nano sites-available/bemuse
```

Insert below text:

```nginx
server {
    listen 80;
    server_name localhost;
    location / {
        add_header 'Access-Control-Allow-Origin' '*';
        root /home/cenox/bemuse-test; # Write location from pwd command.
    }
}
```

Save the file by pressing `Ctrl+X`, `Y`, `Enter`.

Then, create a symlink to enable the configured site:

```bash
$ sudo ln -s /etc/nginx/sites-available/bemuse sites-enabled/bemuse
```

Restart nginx:

```bash
$ sudo systemctl restart nginx
```

Now, the music server will be available at http://localhost. You can play by
going to <http://bemuse.ninja/?server=http://localhost>.
