---
id: scoring-and-judgment
title: Scoring and Judgment
---

The scoring system and judgment system in Bemuse focuses on both accuracy and combo.

## Judgment

When hitting the note, the accuracy of your button press will be judged according to this table:

| Judgment   | Normal | Level5 | Level4 | Level3 | Beginner |
| ---------- | -----: | -----: | -----: | -----: | -------: |
| Meticulous |   20ms |   21ms |   22ms |   23ms |     24ms |
| Precise    |   50ms |   60ms |   70ms |   80ms |    100ms |
| Good       |  100ms |  120ms |  140ms |  160ms |    180ms |
| Offbeat    |  200ms |  200ms |  200ms |  200ms |    200ms |

The different timegates are designed to make the game easier for beginners, with a gradual increase in difficulty the harder the song gets. They are divided as follows:

| Timegate | Song Level |
| -------- | ---------: |
| Beginner |        1-2 |
| Level3   |          3 |
| Level4   |          4 |
| Level5   |          5 |
| Normal   |         6+ |

Based on the above judgement, an accuracy score is given based on the above judgement out of a highest possible score of 555555.

| Judgment   | Accuracy Score |
| ---------- | -------------: |
| Meticulous |           100% |
| Precise    |            80% |
| Good       |            50% |
| Offbeat    |             0% |

## Grading

After playing the game, the grade is calculated according to this table:

| Grade | Minimum Score |
| ----- | ------------: |
| F     |             0 |
| D     |        300000 |
| C     |        350000 |
| B     |        400000 |
| A     |        450000 |
| S     |        500000 |

## References

* The original [pull request](https://github.com/bemusic/bemuse/pull/446) implementing the scoring system.
* [Essay by @dtinth](https://qiita.com/dtinth/items/5b9f6b876a0a777eec50) regarding the new timegates & scoring.
