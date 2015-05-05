
Scoring and Judgment
====================

The scoring system and judgment system in Bemuse focuses on both accuracy and combo.


Judgment
--------

When hitting the note, the accuracy of your button press will be judged
according to this table:

============== ===================== ================
     Name        Maximum Offset (ms)   Accuracy Score
============== ===================== ================
  METICULOUS!                     20             100%
    PRECISE!                      50              80%
     GOOD!                       100              50%
    OFFBEAT!                     200               0%
    MISSED!                       --               0%
============== ===================== ================

.. src::

   src/game/judgments.js @ judgment timegate @ 705acbb3
   src/game/judgments.js @ judgment weight @ 75a77b67



Scoring
-------

The player's score is calculated from this formula:

.. math::

   \text{score} &= 500000 \times \text{accuracy}
     + 55555 \times \text{combo bonus} \\[10pt]
   \text{accuracy} &= \frac{
     \sum\text{accuracy score}
   }{\sum\text{total combos}} \\[10pt]
   \text{combo bonus} &= \frac{
     \sum_{c \in \text{combos}}{\text{combo level}(c)}
   }{\sum_{i = 1}^{\text{total combos}}{\text{combo level}(i)}} \\[10pt]
   \text{combo level}(c) &= \begin{cases}
     0 & c = 0 \\
     1 & 1 \leq c \leq 22 \\
     2 & 23 \leq c \leq 50 \\
     3 & 51 \leq c \leq 91 \\
     4 & 92 \leq c \leq 160 \\
     6 & 161 \leq c
   \end{cases}

Here's how the combo level formula comes from.
Let's assume, for simplicity, a player with 99% hit rate,
regardless of difficulty.
The probability that the player will attain :math:`c` combos
is :math:`0.99^c`.

Now we have 6 combo levels.
The probability that the player will
attain that level gradually decreases.
Therefore, the minimum combo is
:math:`\left\lceil\log_{0.99} p\right\rceil`.

============ ================= ===========
 Combo Level  Max. Probability  Min. Combo
============ ================= ===========
           1              100%           1
           2               80%          23
           3               60%          51
           4               40%          92
           5               20%         161
============ ================= ===========

.. src::

   src/game/state/player-stats.js @ score @ 8e0de318
   src/game/state/player-stats.js @ combo @ 382c4ed7

Grading
-------

After playing the game, the grade is calculated according to this table:

=========== ===============
   Grade      Minimum Score
=========== ===============
    F                     0
    D                300000
    C                350000
    B                400000
    A                450000
    S                500000
=========== ===============

.. src::

   src/app/game-launcher.js @ grade @ 06126a24

