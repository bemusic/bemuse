# Bemuse-like Rhythm Game (Prototype) — web-mvp-extend

This branch contains an extended web MVP for a Bemuse-like rhythm game.

What’s included
- Shared engine (TypeScript) with improved timing, note state tracking and judgement callbacks.
- Scoring module with judgement windows and points.
- Updated Canvas-based gameplay component with judgement overlays and local audio loading.
- Simple Chart Editor stub (UI + basic note placement & export).
- Example beatmap JSON.

Run locally (after files added):
1. npm install
2. npm run dev
3. Open http://localhost:5173

Notes and next steps
- Audio: Browsers block autoplay; start playback via a user gesture (Start button).
- The placeholder audio file is referenced as public/placeholder.mp3 — replace with a real audio file or load a local one via the file input in the UI.
- This prototype focuses on timing and core gameplay flow; more polish (skins, effects, editor refinements, importers) comes next.
