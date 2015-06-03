BMS Support in Bemuse
=====================

Bemuse supports BMS, BME and BML, but some features are not supported.
They are noted here.

**BMS**

-  BGA is not supported yet.
-  Free-zone not supported.
-  Invisible objects `not yet <https://github.com/bemusic/bemuse/issues/186>`_ supported.

**BML**

-  Supports #LNTYPE 1 (RDM; loose BML) and #LNOBJ (RDM type 2; strict
   BML)
-  Long notes are judged both at the start and at the end (2 judgments
   per long note, similar to O2Jam).
-  Player must release the button at the end of long notes. Otherwise,
   the end of long note will be missed.

   -  **Exception:** Player doesn’t have to stop spinning the turntable
      at the end of SCRATCH notes. If the player keeps spinning, player
      will get METICULOUS (Perfect) judgment.

**PLAYER**

As Bemuse is currently a single-player game, only #PLAYER 1 is
supported.

**RANK**

-  Bemuse does not support #RANK.
-  Judgment timegate is described at `scoring and judgment`_ section.
-  Bemuse judge notes per unit time.

**TOTAL**

Bemuse does not support #TOTAL.

**DIFFICULTY**

-  BMS charts with #DIFFICULTY 1-4 are treated as the same (non-insane).
-  BMS charts with #DIFFICULTY 5 are treated as 発狂BMS (INSANE chart).
   In music selection screen, it is displayed in different color.

**TITLE and SUBTITLE**

-  Supports implicit subtitles.
-  Supports multiple subtitles.

**ARTIST and SUBARTIST**

-  Supports multiple subartists.

**Landmine**

Not supported (in the future, it will display as fake note).

**WAV**

-  Supports OGG, M4A, MP3, WAV samples.
-  Polyphony of #WAV is 1, consistent with major BMS implementations.
-  However, it does not apply to sounds played when player hits the
   button without note (freestyle sound).

   -  Sound of the nearby note will play with no polyphony limit.

-  If player gets OFFBEAT (bad) judgment, the sound will play in wrong
   pitch.

**RANDOM**

-  Only #RANDOM, #IF, #ENDIF in original specification are supported.
   However, they can be nested (nesting level can be ended with
   #ENDRANDOM).
