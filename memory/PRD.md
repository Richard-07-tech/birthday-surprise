# PRD — "For You, With Love" (Private Birthday Surprise Web App)

## Original Problem Statement
Build a mobile-first, private birthday surprise web app for the user's girlfriend ([HER NAME]), birthday on [DATE]. Cinematic, intimate experience — not a generic template. Opened on her phone first. Romantic soft-pink & gold light palette, elegant serif headings + clean sans body, smooth GPU-friendly animations, light/dark support. Single-page flow: Secret Gate → Hero (floating particles + live counters) → Our Story timeline (5-6 moments) → Memory Flip Cards (centerpiece, vertical 3D flip with photo + handwritten note) → The Letter (line-by-line fade reveal, fireworks/lantern finale, sign-off). No coupons, no login, no ads, no branding, no music (user declined). Interactive delights: parallax, tilt-on-touch cards, hidden heart easter egg, haptics, one original touch (Make-a-Wish lantern). Mobile: 360px+, no horizontal scroll, 44px tap targets, safe areas, dvh, lazy images, reduced-motion honored. All personal content in ONE config file with obvious placeholders.

## Architecture
- Pure frontend experience (no backend routes, no DB writes needed). FastAPI backend untouched; only `/api/` health exists.
- React (CRA + craco) + Tailwind + framer-motion + lenis (smooth scroll) + lucide-react icons.
- Single content source: `frontend/src/config/surpriseConfig.js` (names, secret word + 3 escalating hints, dates, timeline, cards, letter lines, easter egg, finale).
- `frontend/src/App.js` — gate state machine (sessionStorage so refreshes in one session stay unlocked), Gate + SparkleBurst + HeartLock inline.
- Components: `Experience` (lenis init), `Petals` (fixed canvas, DPR-capped, visibility-aware), `Hero` (masked line-by-line reveal, live days/h/m/s counter, birthday countdown, scroll parallax glows), `Timeline` (gold gradient axis, scroll reveals, polaroid tilts), `MemoryCards` (rotateX vertical flip, spring tilt-on-touch, lazy photos, light-ray + sparkle "heavenly" back reveal, note side-by-side on wide / stacked strip on narrow, native button = keyboard), `Letter` (scroll-linked per-line opacity/y/blur reveal via RevealLine, sign-off), `Fireworks` (canvas barrage + floating lanterns, starts once in view), `WishLantern` (tap → lantern floats away + wish message, resets), `EasterEggHeart` (fixed pulsing heart → modal), `ThemeToggle` (class-based dark mode, localStorage).
- Theming: CSS vars in `index.css` for light (blush #FFF9FB, petal #F472B6, rose-deep #DB2777, gold #C0912E) and dark (#130B10 with glowing gold/pink), mapped into Tailwind tokens; glass-morphism surfaces; grain overlay; `prefers-reduced-motion` kill-switch.
- Fonts: Cormorant Garamond (serif), Plus Jakarta Sans (sans), Caveat (handwritten notes).
- Favicon: custom heart SVG mark (`public/favicon.svg`). Title: "For You, With Love".
- All interactive elements carry data-testids (gate input/submit/hint, hero headline/counters, timeline items, memory cards, make-a-wish, easter egg, theme toggle).

## User Personas
- **Her (the recipient)**: opens a link on her phone; unlocks with a secret word; experiences the story solo, emotionally.
- **Him (the creator)**: wants zero-code editing of all content in one file; will swap placeholder photos/text later.

## Core Requirements (static)
1. Secret gate: password + escalating cute hints, magical unlock burst, haptics.
2. Hero: masked headline reveal, floating petals, days-together live counter, birthday countdown.
3. Timeline: 5-6 moments, scroll fade/slide, optional photos.
4. Flip cards: 2-col mobile, vertical rotateX flip, photo + handwritten note back, touch/mouse/keyboard, lazy images, tilt-on-touch.
5. Letter: line-by-line fade (no typewriter), fireworks + lantern finale, sign-off.
6. Easter egg heart, dark mode, reduced motion, 360px+, no horizontal scroll.

## Implemented (2026-10-31)
- All of the above, verified end-to-end on preview host: gate wrong→hint→correct→burst→hero; counters live (1,720 days / 227 sleeps); timeline reveals; card flip + heavenly back reveal on mobile; letter reveal + finale fireworks/lantern + make-a-wish; theme toggle; no horizontal overflow at 390px; desktop 1440px verified.

## Placeholder values to replace (all in surpriseConfig.js)
- herName "Her Name", yourName "Your Name", startDate 2022-02-14, birthday 1999-06-15
- secretWord "forever" + 3 hints
- 6 timeline moments + 6 card titles/notes (stock photos as placeholders)

## Backlog / Priorities
- P0: Replace all placeholder personal content (user edits config or dictates).
- P1: Real photo uploads (object storage) instead of stock placeholder URLs.
- P1: Dark-mode fine-tuning pass (lantern-lit night variant).
- P2: Wish keepsake (persist wishes as glowing lanterns), shareable QR card for gifting.

## Next Tasks
1. Fill real names/dates/letter into config.
2. Swap placeholder photos with real ones.
3. Optional: deploy for the shareable link.
