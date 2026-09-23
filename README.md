# KenkoBuddy landing page

A standalone React/Vite/TypeScript landing page with Tailwind, Framer Motion, React Three Fiber and Drei. The approved hero composition is retained. All interactive product content is a local demonstration.

## Run
- npm ci
- npm run dev -- --port 5173 --strictPort
- npm run lint
- npm run typecheck
- npm run test
- npm run build
- npm run preview -- --port 4173 --strictPort

## Integrate
Mount App in the existing React application and include src/styles.css. Copy public/models and public/images. Vite uses a relative base; asset() resolves asset paths. Navigation uses page anchors. Configure deployment, login, signup, app, privacy, terms and support URLs through .env.example and src/lib/config.ts. Unconfigured destinations open honest local integration dialogs. Replace them before public launch. Remove the preview noindex only when publication is intended.

Analytics has no provider or network calls by default. configureAnalytics() can connect an approved provider; events contain interaction identifiers, not check-in values. All check-in, coach, recipe, exercise and preference interactions run in memory. Reloading clears them. Tab-local demo controls reset when their component unmounts. Sample progress and estimated recipe nutrition are labeled.

## Main files created or changed
- src/App.tsx, src/main.tsx, src/styles.css: preserved hero, completed page and integration.
- src/components/KenkoStage.tsx, KenkoCanvas.tsx: lazy GLB scene, animation, capability checks, fallback and visibility handling.
- src/components/ScrollStory.tsx: five natural-scroll chapters, sticky desktop scene and stacked mobile scenes.
- src/components/ProductPortal.tsx: five keyboard-accessible product tabs and local demos.
- src/components/FinalSections.tsx: editable preferences, ingredient matching, movement comparison, trust, final CTA and footer.
- src/components/Dialog.tsx, Icon.tsx: shared accessible UI.
- src/lib/config.ts, content.ts, content.test.ts: centralized configuration, demo logic and tests.
- package.json, package-lock.json, vite.config.ts, eslint.config.js, .env.example: dependencies, split production bundle and checks.
- scripts/blender/create_wellness_assets.py: reproducible five-asset pipeline.
- scripts/blender/create_kenko_mascot.py: retained reproducible mascot pipeline.
- design/*.blend, design/asset-manifest.json, public/models/*.glb, public/images/*: editable Blender sources, web assets and fallbacks.
- screenshots/: browser evidence and verification.json.
Original hero snapshots are retained under work/.

## Blender pipeline
Run from this project:
    blender -b --python scripts/blender/create_kenko_mascot.py
    blender -b --python scripts/blender/create_wellness_assets.py
The scripts export independent GLBs, editable .blend studios and transparent PNG renders. WebP versions are used by the page; work/convert-assets.py converts fallback renders using Pillow. Blender is never required at runtime. GLBs use procedural geometry and materials with zero texture dependencies.

| GLB | Bytes | Triangles |
| --- | ---: | ---: |
| kenko-mascot | 394196 | 21812 |
| hydration | 98800 | 5760 |
| nutrition | 159408 | 8688 |
| movement | 52864 | 2976 |
| recovery | 80692 | 4236 |
| intelligence | 73852 | 4060 |

Additional story models total 465616 bytes. All six GLBs total 859812 bytes.

## Rendering
The hero, story scenes and final composition use real GLBs on capable devices. Kenko floats, breathes, blinks, follows pointer movement subtly, pulses its heart and moves its flippers. Five symbols highlight independent shell panels. Scroll scenes separate the shell, assemble ingredients and compose the five wellness assets around Kenko.

The headline and CTAs render before the dynamic 3D chunk. Below-fold models load on demand. Off-screen/hidden-page rendering pauses. DPR is capped at 1.25 on mobile and 1.5 on desktop. Soft grounding shadows use inexpensive CSS rather than costly real-time shadow maps.

Static images remain visible during loading and replace WebGL for reduced motion, low-capability/data-saving devices, slow rendering, timeout or context failure. Add ?fallback=1 to test. The small portal mascot is intentionally an image. Mobile uses stacked chapters, reduced model sizing and no long pinned scene.

## Verification
Lint, TypeScript, five unit tests and production build passed. Chrome browser checks covered desktop 1440x900, tablet 1024x768 and mobile emulation 390x844; no horizontal overflow, console errors or external API calls. Tested live GLBs, all five scenes, shell controls, tabs and keyboard navigation, check-in propagation, coach prompts, recipe details, workout controls, progress chart, preference editing, ingredient matching, navigation and CTA dialogs. Reduced-motion and forced fallback render without canvases. Actual WebGL context loss restores the static image. See screenshots/verification.json.

Physical mobile devices and Safari were not tested. Authentication, real AI, persistent data, production policies and a support service require integration with the existing application.
