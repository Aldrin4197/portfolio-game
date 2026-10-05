# Vue game portfolio

The active implementation is Vue 3 + Vite + KAPLAY. React and its dependencies have been removed. The canvas uses a fixed 1920 × 1080 drawing resolution, scaled as a complete 16:9 game stage with letterboxing where necessary. The browser document never scrolls, and the engine has no scroll/wheel movement listener.

Arrow keys move the character directly through engine state. Space, up arrow, and W trigger a grounded jump; gravity and platform collision bring the character back to a surface. Repeated keydown events cannot trigger mid-air jumps. Releasing one arrow while holding the other resumes the remaining direction, and blur clears input.

All portfolio information appears in Vue dialogs inside the stage: About, Skills/Services, Projects, Experience, Achievements, and Contact. Project details retain their existing source content and links. The in-game map enables direct navigation. Dialogs pause movement, trap focus through the native dialog element, allow their own content to scroll, and restore position and focus when closed.

The code keeps rendering and physics outside Vue’s reactive render cycle. Only nearby-area changes update the HUD. A single engine instance survives viewport resizes. Reduced-motion preferences remove decorative parallax and stride animation while retaining player-controlled movement.

Run `npm run export:preview` to refresh the standalone HTML preview.

## Verified behavior

Production build (including Vue/TypeScript checks) and ESLint pass. Browser checks verify a 1920 × 1080 canvas bitmap at desktop and smaller viewport sizes; a 16:9 stage without document overflow; no player movement from wheel input; arrow-key movement; jumping and landing on a raised platform; frozen movement while panels are open; all six destinations; project details; direct project URLs; held touch/pointer controls; and compact portrait/landscape layouts. Automated axe checks report no violations on the world view or the project panel. The exported HTML was also opened directly as a local file and exercised independently of Vite.
