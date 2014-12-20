<h1 align="center">BEAT☆MUSIC☆SEQUENCE</h1>

<p align="center">(also known as BE☆MU☆SE, BEMUSE, and B☆M☆S)</p>

<h3 align="center"><em>web-based music game of the future</em></h3>

<p align="center">
  <a href="https://waffle.io/bemuse-game/bemuse"><img src="http://img.shields.io/badge/wow%20much-waffle-green.svg?style=flat" alt="Waffles"></a>
</p>

---

__This project uses [README-Driven Development][RDD]__, and we are in the planning stage. Therefore, what you read below, as of the time of writing, doesn't exist yet. Also check out the [__Project Plan__][Plan]. The actual development starts in 2015. This file will also evolve over time as development progresses.

Should you have any question about the project plan, now is a good time to raise an issue.

[RDD]: http://tom.preston-werner.com/2010/08/23/readme-driven-development.html
[Plan]: (https://workflowy.com/s/ZM4dIDZWRR)

---

Free and open-source web-based BMS simulator, built with the future's web technology.
Play on your computer or on your iPad.

## Features

* Online play
	* comes with some [default selection of songs](https://github.com/bemusic/music).
	* people can host song collections on their own servers too.
* Offline play
	* downloaded simfiles can be played later offline.
	* can also play simfiles on your computer.
* BMS simfile support:
	* 7-keys + Scratch
	* 7-keys
	* 14-keys
	* However, they must be converted into ".bemuse" files first.
* Game modes:
	* Single player mode
	* Two player mode — two players play on the same machine.
* Online start time synchronization — play together with friends.
* Fully supports keysounds.
* Supports `#LNTYPE 1` and `#LNOBJ`.
* Play on PC (using keyboard or gamepad) or on iPad.


## Development


### Project Structure

To make the game load as fast as possible, the app is split into multiple parts:

- __boot__: A special module to display loading bar and loads the application.
  Dependencies should be minimized.
- __app__: The game itself.
- __test__: The test code.

The directory structure:

- __www__: These files will be hosted online
  - __build__: The built bundles (not included in Git).
  - __src__: The source code for the game and the boot loader.
    - __boot__: The source code for the boot loader.
    - __app__: The source code for the game.
    - __test__: The test code for the game.


### Prerequisites

- Node.js
- Git


### Setup

1. Clone the Git repository.
2. ```bash
   npm install
   ```
   to install dependencies.


### Development Server

```bash
npm start
```


### Building

```bash
npm run build
```


### Deploying

TODO


### Bemuse File

BMS files need to be converted into `.bemuse` file format. It is a simple file format to hold BMS files and keysound files together. A custom format is created to be easily consumed by web applications, both on desktop and mobile devices.

* All sound samples are converted into `.mp3`
  * Since it is the only format supported by major browsers!


#### File format draft

* 10 bytes magic string "BEMUSEPACK"
* 4 bytes - metadata size N
* N bytes - metadata in JSON format
	* song metadata
	  * title
	  * artist
	  * genre
	  * BPM
	  * readme
	* list of all files
		* File name
		* File size
		* File offset (relative to payload start)
	* dependencies
	  * list of relative path to extra `.bemuse` file to load. (*1)
* The payload
	* just a stream of bytes created from multiple files concatenated so that it can be sliced easily.


(*1): There isn't a simple way to perform partial download of large files. One approach is to split the `.bemuse` file into several parts. Therefore, if the download fails, we don't have to re-download the whole thing.
