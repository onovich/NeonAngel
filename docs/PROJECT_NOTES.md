# Project Notes

## Lessons Learned

- The game container listens to touch events globally and calls `preventDefault()`, so mobile-first buttons must provide explicit `onTouchStart` handlers. This affected the start button, restart button, and reward selection cards.
- Mobile movement feels much more natural when driven by touch delta per frame instead of distance from the initial touch point. The current implementation resets touch deltas after each frame and scales them by `touchMoveScale`.
- Full-HP player bullets cannot rely on plain white fill on a pale background. A colored core plus white outline and glow is more readable without making the whole scene darker.
- Weapon identity needs both numerical and visual separation. Distinct shot colors plus hit feedback such as `Bloom` fan particles and `Pulse` hit ripples made weapon differences much easier to read.
- Upgrades tied directly to elite kills made progression too spiky. The current system uses an experience bar and only pauses for a level-up reward when the XP threshold is crossed.
- Reward overlays must reset touch input when confirmed; otherwise the engine may think a touch is still active and mobile movement will stop responding.

## Current TODO

- Real-device mobile validation is still pending. The mobile path has been fixed multiple times, but it still needs end-to-end verification on an actual phone.
- Reward copy is still system-oriented. The current card text is functional, but not yet tuned into more flavorful player-facing upgrade descriptions.
- README has not been refreshed after the later gameplay changes. It still describes the project structure accurately, but does not yet mention XP leveling, two-choice upgrades, or recent mobile fixes.
- Combat and pacing have been tuned iteratively, but not yet benchmarked against a formal target like "average survival time" or "expected level-ups per run".

## Verified Facts

- Local scripts: `npm run dev`, `npm run build`, `npm run preview`.
- Node baseline from `package.json`: `>=18.12.0`.
- Latest known gameplay systems include XP-based leveling, two-choice weapon rewards, weapon-specific hit feedback, desktop keyboard movement, and mobile touch-delta movement.
- Deployment is handled by GitHub Actions for GitHub Pages.