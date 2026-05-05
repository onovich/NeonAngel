# Neon Angel Handoff

## Project Summary

Neon Angel is a web-first minimalist bullet hell rebuilt from the original single-file prototype under `origin/` into a Vite + React project. The runtime shell is React, but the actual gameplay loop, entity updates, collisions, progression, and rendering live in the canvas engine at `src/logic/engine/gameEngine.js`.

## Current Architecture

- `src/data/`
  Centralized configuration, palette, progression values, weapon definitions, and UI copy.
- `src/logic/engine/`
  The gameplay core. This file currently owns player/enemy classes, combat resolution, XP leveling, reward selection, hit effects, and input handling.
- `src/logic/hooks/`
  React bridge that creates and disposes the engine, then exposes imperative controls back to the UI shell.
- `src/view/`
  HUD, start/game-over menus, and screen composition.

## What Changed Most Recently

- Progression now uses an experience bar instead of direct elite-kill leveling.
- Level-up rewards are now two-choice upgrade cards instead of automatic weapon rotation.
- Mobile movement was changed to touch-delta following.
- Mobile start/restart buttons and reward cards received explicit touch handlers.
- Combat readability was improved through color separation and clearer full-HP bullets.

## Important Runtime Behaviors

- Desktop controls: `WASD` / arrow keys to move, `Space` for ultimate, `Enter` for start/restart, `1` / `2` or `Q` / `E` plus `Enter` for reward selection.
- Mobile controls: start/restart/reward cards rely on explicit `onTouchStart`; gameplay movement uses touch delta accumulation rather than joystick-from-origin behavior.
- XP thresholds come from `GAME_CONFIG.progression`. Ordinary enemies, elites, and bosses grant different XP amounts.
- Weapon upgrades and unlocks are defined in `WEAPON_DEFS`, and reward cards are assembled in `buildRewardOption()`.

## Files To Read First

- `src/logic/engine/gameEngine.js`
  Read this first for any gameplay, progression, input, or combat work.
- `src/data/gameConfig.js`
  Read this second for current numbers, colors, progression thresholds, and weapon definitions.
- `src/view/components/Hud.jsx`
  Read this when touching reward overlays, HUD bars, or mobile overlay interaction.
- `origin/design.md`
  Read this for the original design intent and high-level combat fantasy.

## Known Risks

- The engine file is now the main integration surface for many systems. It is workable, but future changes carry merge and regression risk because input, combat, progression, and effects are still concentrated there.
- Real-device mobile validation is not complete. Several touch issues were fixed by reasoning from code plus browser checks, but not fully closed on hardware.
- The README is structurally correct but not fully synchronized with later gameplay evolution.

## Recommended Next Steps

1. Run a real-phone pass that covers start menu, movement, reward selection, ultimate, and restart.
2. Split reward/progression logic out of `gameEngine.js` if more progression features are planned.
3. Refresh README to mention XP leveling, reward choice cards, and current mobile support status.
4. Define target balancing metrics such as expected survival time and expected level count per strong run.

## Operational Notes

- Build command: `npm run build`
- Dev command: `npm run dev`
- Preview command: `npm run preview`
- Latest pre-handoff baseline before this documentation pass: commit `5340762`

## Git / Deployment Notes

- Remote: `git@github.com:onovich/NeonAngel.git`
- Pages deployment uses `.github/workflows/deploy.yml`.
- Vite base is configured for `/NeonAngel/`, but the live site may be served under the custom-domain path `blog.onovich.com/NeonAngel/`.