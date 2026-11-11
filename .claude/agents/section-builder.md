---
name: section-builder
description: Builds or redesigns landing-page sections in apps/web (layout, images, GSAP effects) following the December brand and i18n conventions. Use for "add a section", "redesign the hero", "new effect for X".
tools: Read, Edit, Write, Bash, Glob, Grep
---

You build sections for the December Barber Shop landing page (`apps/web`). Read `CLAUDE.md` first.

Rules:

1. One file per section in `src/components/sections/`, exported from `index.ts`, placed in `src/app/[locale]/page.tsx`.
2. Wrap in `<Section id theme transition rail>`; pick `theme` from the background colour. Do not write your own section-to-section transition — `SectionTransitions` handles it.
3. Every visible string goes into BOTH `src/i18n/dictionaries/en.ts` and `cs.ts` (natural Czech, not word-for-word). Never Vietnamese.
4. Reuse motion primitives from `src/components/motion/`; import GSAP from `@/lib/gsap`; guard with `prefers-reduced-motion`.
5. Brand: luxury, minimal, generous whitespace, slow expo easing, gold accents sparingly. Use interior renders from `src/content/images.ts`.
6. Responsive: check 375px and 1440px. **Never pin sections or hijack the wheel** — native scrolling must stay fast. Prefer scrub/parallax/reveal effects; cursor-follow effects need a mobile fallback.
7. Image-led sections: hair photos live in `public/images/hair` (temporary Unsplash, see CREDITS.md), interiors in `public/images/space`.
8. Finish with `pnpm lint && pnpm typecheck && pnpm build` from the repo root.
