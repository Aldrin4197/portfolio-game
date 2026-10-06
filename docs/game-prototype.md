# Vue game portfolio

The active implementation is Vue 3 + Vite + KAPLAY. React and its dependencies have been removed. The stage fills 100% of the browser width and 100dvh. KAPLAY resizes its drawing buffer to the host, including 1920 × 1080, and the camera preserves sprite proportions while exposing more scenery on wide screens. The browser document never scrolls, and the engine has no scroll/wheel movement listener.

Arrow keys move the character directly through engine state. Space, up arrow, and W trigger a grounded jump; gravity and platform collision bring the character back to a surface. Repeated keydown events cannot trigger mid-air jumps. Releasing one arrow while holding the other resumes the remaining direction, and blur clears input.

All portfolio information appears in Vue dialogs inside the stage: About, Skills/Services, Projects, Experience, Achievements, and Contact. Project details retain their existing source content and links. The in-game map enables direct navigation. Dialogs pause movement, trap focus through the native dialog element, allow their own content to scroll, and restore position and focus when closed.

The code keeps rendering and physics outside Vue’s reactive render cycle. Only nearby-area changes update the HUD. A single engine instance survives viewport resizes. Reduced-motion preferences remove decorative parallax and stride animation while retaining player-controlled movement.

Run `npm run export:preview` to refresh the portable preview folder. Assets remain separate files.

## PNG UI integration

The active portfolio UI uses the original PNG compositions. Its native dialog is fully transparent and borderless, so there is no secondary window around the artwork. PNG-framed controls provide section navigation, closing, search, filters, and paging. The canvas world and movement physics remain independent of the overlay.

The poster, inventory, journal, noticeboard, and correspondence desk preserve their authored proportions on desktop. On narrow or short viewports, PNG borders frame content that flows normally instead of shrinking text to fit a small stage. Project details preserve their existing content and external links.

The UI imports neither the procedural atlas renderer nor the old CSS pixel renderer. Tech badges load the supplied PNG atlas; tools without authored frames use text monograms. No runtime canvas export or base64 encoding is used for these assets.

## Mobile controls

`TouchControls.vue` owns one joystick pointer ID and captures that pointer during a drag. Jump accepts a second finger independently. Movement is normalized to -1…1 with an 18% horizontal dead zone and clamped by the world controller. Pointer cancellation, capture loss, blur, rotation, and overlay state reset the joystick.

Touch capability and portrait orientation come from media queries, without user-agent detection. The rotation prompt is a native dialog above any existing portfolio panel. Dismissing it does not resume gameplay when another panel is open. The canvas fills the viewport and uniformly scales world coordinates; touch controls are teleported to the viewport and padded away from safe-area insets.

## Viewport and audio lifecycle

The world uses a 420-unit reference height and a minimum 480-unit horizontal field of view for portrait. Ground remains at 332/420 of the screen height, with extra sky/soil filling portrait space. Resizing does not recreate the engine or reset player position. Safe-area padding applies to controls, while the scene paints edge to edge.

`audio.ts` lazily creates a Web Audio graph after sound is enabled and a user gesture is received. Its original eight-bar theme runs on the audio clock with a short scheduling window; stalled timers skip missed notes instead of producing a burst. Master volume and independent music/effects settings persist in localStorage, with defaults when storage is unavailable. Oscillators disconnect after completion. Mute, blur, visibility changes, rotation prompts, and teardown stop pending voices and the scheduler. Reading a dialog ducks music; gameplay effects follow successful jumps and actual airborne-to-grounded transitions.
