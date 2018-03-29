---
id: game-loop
title: The Game Loop
---

At each iteration of the game loop, each game component takes turn and
update itself.  Each game component involved in this game loop should
have a `update(...)` method, which takes care of updating itself.
This is the only time the component will be mutable.
Outside of the `update` method, a component should behave like an
immutable object.  This allows us to have some sense of immutability
without having to create new objects. See [the case for immutability](https://github.com/facebook/immutable-js/blob/d8d189ae7ea8965fee2ecc7320ebdc55e83eb6a1/README.md#the-case-for-immutability).

At each cycle, the following happens:

- the Clock is updated to get the high-accuracy time
- the Timer is updated to get the in-game time
- the Input is updated to get button presses
- the State is updated to react to button presses -- judging notes and
  updating scores
- the Audio is updated to emit sound based on the updated state
- the Display is updated to render the game display based on the updated
  state
