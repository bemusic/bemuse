---
id: scoring-and-judgment
title: Scoring and Judgment
---

The scoring system and judgment system in Bemuse focuses on both
accuracy and combo.

## Judgment

When hitting the note, the accuracy of your button press will be judged
according to this table:

|      Name      | Maximum Offset (ms) | Accuracy Score |
|:--------------:| -------------------:| --------------:|
|   METICULOUS!  |                  20 |           100% |
|     PRECISE!   |                  50 |            80% |
|      GOOD!     |                 100 |            50% |
|     OFFBEAT!   |                 200 |             0% |
|     MISSED!    |                  -- |             0% |

<div class="srcref admonition">
<p class="first admonition-title">Source code reference</p>
<ul class="last simple">
<li>Defined at <a class="reference external" href="https://github.com/bemusic/bemuse/blob/bf96099/src/game/judgments.js#L7-14">src/game/judgments.js:7-14</a> (judgment timegate)</li>
<li>Defined at <a class="reference external" href="https://github.com/bemusic/bemuse/blob/bf96099/src/game/judgments.js#L51-58">src/game/judgments.js:51-58</a> (judgment weight)</li>
</ul>
</div>

## Scoring

The player's score is calculated from this formula:


<div class="math">
  \[\begin{split}\text{score} &amp;= 500000 \times \text{accuracy}
    + 55555 \times \text{combo bonus} \\[10pt]
  \text{accuracy} &amp;= \frac{
    \sum\text{accuracy score}
  }{\sum\text{total combos}} \\[10pt]
  \text{combo bonus} &amp;= \frac{
    \sum_{c \in \text{combos}}{\text{combo level}(c)}
  }{\sum_{i = 1}^{\text{total combos}}{\text{combo level}(i)}} \\[10pt]
  \text{combo level}(c) &amp;= \begin{cases}
    0 &amp; c = 0 \\
    1 &amp; 1 \leq c \leq 22 \\
    2 &amp; 23 \leq c \leq 50 \\
    3 &amp; 51 \leq c \leq 91 \\
    4 &amp; 92 \leq c \leq 160 \\
    6 &amp; 161 \leq c
  \end{cases}\end{split}\]
</div>


Here's how the combo level formula comes from. Let's assume, for
simplicity, a player with 99% hit rate, regardless of difficulty. The
probability that the player will attain \\(c\\) combos is \\(0.99^c\\).

Now we have 6 combo levels. The probability that the player will attain
that level gradually decreases. Therefore, the minimum combo is
\\(\left\lceil\log_{0.99} p\right\rceil\\).

| Combo Level | Max. Probability |  Min. Combo |
| -----------:| ----------------:| -----------:|
|           1 |             100% |           1 |
|           2 |              80% |          23 |
|           3 |              60% |          51 |
|           4 |              40% |          92 |
|           5 |              20% |         161 |

<div class="srcref outdated admonition">
<p class="first admonition-title">Source code reference</p>
<ul class="last simple">
<li class="outdated">Defined at <a class="reference external" href="https://github.com/bemusic/bemuse/blob/bf96099/src/game/state/player-stats.js#L27-29">src/game/state/player-stats.js:27-29</a> (score) [outdated: 17be8477]</li>
<li>Defined at <a class="reference external" href="https://github.com/bemusic/bemuse/blob/bf96099/src/game/state/player-stats.js#L99-106">src/game/state/player-stats.js:99-106</a> (combo)</li>
</ul>
</div>

# Grading

After playing the game, the grade is calculated according to this table:

| Grade | Minimum Score |
| ----- | -------------:|
|   F   |             0 |
|   D   |        300000 |
|   C   |        350000 |
|   B   |        400000 |
|   A   |        450000 |
|   S   |        500000 |

<div class="srcref admonition">
<p class="first admonition-title">Source code reference</p>
<ul class="last simple">
<li>Defined at <a class="reference external" href="https://github.com/bemusic/bemuse/blob/bf96099/src/rules/grade.js#L2-12">src/rules/grade.js:2-12</a> (grade)</li>
</ul>
</div>
