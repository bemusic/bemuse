---
id: scoring-and-judgment
title: Scoring and Judgment
---

The scoring system and judgment system in Bemuse focuses on both accuracy and combo.

## Judgment

When hitting the note, the accuracy of your button press will be judged according to this table:

| Judgment   | Normal | Level5 | Level4 | Level3 | Beginner | Score |
| ---------- | -----: | -----: | -----: | -----: | -------: | -----:|
| Meticulous |   20ms |   21ms |   22ms |   23ms |     24ms |  100% |
| Precise    |   50ms |   60ms |   70ms |   80ms |    100ms |   80% |
| Good       |  100ms |  120ms |  140ms |  160ms |    180ms |   50% |
| Offbeat    |  200ms |  200ms |  200ms |  200ms |    200ms |    0% |

The different timegates are designed to make the game easier for beginners, with a gradual increase in difficulty the harder the song gets. They are divided as follows:

| Timegate | Song Level |
| -------- | ---------: |
| Beginner |        1-2 |
| Level3   |          3 |
| Level4   |          4 |
| Level5   |          5 |
| Normal   |         6+ |

The final score is split into 2 parts:

- 500000 for accuracy
- 55555 for combo bonus

Each combo has an associated score.

| Combo number | Combo score |
| -----------: | ----------: |
|            0 |           0 |
|         1–22 |           1 |
|        23-50 |           2 |
|        51-91 |           3 |
|       92–160 |           4 |
|        161~∞ |           5 |

Combo bonus is the sum of combo score for each hit, divided by maximum possible value, times 55555.

**Example:** There are 100 notes. 60 notes have been hit, I missed a note, and hit 39 other notes.

- Obtained combo score = 108 for first 60 notes + 56 for 39 other notes = `164`
- Maximum possible combo score = `237`
- Combo bonus = `164 / 237 * 55555 = 38443`

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

- The original [pull request](https://github.com/bemusic/bemuse/pull/446) implementing the scoring system.
- [Essay by @dtinth](https://qiita.com/dtinth/items/5b9f6b876a0a777eec50) regarding the new timegates & scoring.
