# December Barber Shop — project guide for AI agents

Premium barbershop in **Prague**. Website languages: **Czech (`cs`, default) and English (`en`)**.
Never put Vietnamese (or any other language) in user-facing text. Code comments may be Vietnamese or English.

## Monorepo

pnpm + Turborepo. Run commands from the repo root:

- `pnpm dev` — web at http://localhost:3000 (redirects to `/cs` or `/en` by Accept-Language)
- `pnpm lint` · `pnpm typecheck` · `pnpm build` — all must pass before you finish
- pnpm may not be installed globally: `npx -y pnpm@10.34.9 <cmd>` works.

| Path              | Purpose                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`        | Landing page — Next.js 16 App Router, Tailwind v4, GSAP (+ScrollTrigger, SplitText), Motion — native scrolling (no Lenis) |
| `apps/api`        | NestJS backend — **phase 2, not started** (see its README for the planned module layout)                                  |
| `apps/admin`      | Admin — phase 2                                                                                                           |
| `packages/types`  | Domain types shared web ↔ api (no display text)                                                                           |
| `packages/ui`     | Shared primitives (`cn`, `Container`, `Eyebrow`); web-only glass UI lives in `apps/web/src/components/ui/`                |
| `packages/config` | tsconfig presets + brand tokens `tailwind/brand.css`                                                                      |
| `sources/`        | Original logo & renders — read-only                                                                                       |

## apps/web conventions

- **Routing:** everything lives under `src/app/[locale]/`. `src/proxy.ts` redirects un-prefixed URLs.
- **i18n:** all visible text comes from `src/i18n/dictionaries/{en,cs}.ts`. `en.ts` defines the `Dictionary` type; `cs.ts` must match it. Client components read text with `useDictionary()`. Add keys to **both** files in the same change.
- **Data vs text:** `src/content/*` holds language-neutral data (prices in CZK, phone, images, ids). Lines marked `// TODO` are placeholders.
- **Sections:** one file per section in `src/components/sections/`, wrapped in `<Section id theme transition rail>` (`components/layout/section.tsx`). Set `theme` to the background (`light`/`dark`) — the header and section rail recolor from it. Section transitions (rounded "rise", shade of the previous section, active-section tracking) are applied centrally by `components/motion/section-transitions.tsx` — do not re-implement them per section.
- **Scrolling:** native browser scrolling only — no Lenis, no pinned/scroll-jacked sections (the owner found it too slow). Use `scrollToId()` / `lockScroll()` from `@/lib/scroll`.
- **Sections (8, owner's request — every section needs its own striking moment):** Hero (see-through gradient wordmark over video, glass booking card) → Styles (5 signature cuts in one section; one espresso background — owner rejected per-style tints; autoplay on a timer, no progress bar) → Lookbook (`lookbook.tsx`, 14 cuts in 2 marquee rows running opposite ways, pause on hover/focus) → Experience (4 ritual strips; no stats row) → Film (`film.tsx`: full-screen Veo 3 film, separate 16:9 desktop / 9:16 mobile files, message "Leave the city at the door" (no people: camera glides from a rainy Prague street into the light, calm shop; plays once and holds the last frame); prompts + export steps in `apps/web/docs/film-veo-prompts.md`; `filmVideo.ready` in `content/images.ts`) → Menu (single-column price list, glass tabs + glass preview card) → Space (`gallery.tsx`: fits one screen on desktop — rounded photo stage with glass caption/buttons, thumbnail dock + 3 material notes, lightbox) → Contact (booking + opening offer in glass cards, MapLibre map via `components/ui/brand-map.tsx` — OpenFreeMap tiles, no API key, D-logo pin, no scroll-jacking; its worker is copied to `public/vendor/` by `apps/web/scripts/copy-maplibre-worker.mjs` before dev/build). No custom cursor; photos in full colour.
- **UI style (owner's rules):** Apple-like luxury. Primary buttons are **solid** rounded-xl blocks (`ctaGold` = ivory on dark, `ctaDark` = ink on light, in `components/ui/cta.ts`); `ctaGlass` for secondary. Frosted glass (`glassDark`/`glassLight`, `Segmented` in `components/ui/segmented.tsx`) **only where it floats over a photo/video or the header** — never bordered glass cards on flat backgrounds, never box-inside-box (owner: looks "AI"). Headline text never sits over a model's face. WhatsApp CTA uses the real logo (`components/brand/whatsapp-icon.tsx`). Corners rounded-xl/2xl/3xl — never rounded-full pills. **Banned:** underlines, hairline rules/divider lines, gold accent bars, underline tab indicators, gold-gradient or gold-tinted glass buttons, outline-stroke headline text, arrows, glow shadows, sparkles, stats rows, upscaled/zoomed crops that blur photos.
- **Motion:** reuse primitives in `components/motion/` (`Reveal`, `SplitReveal`, `Parallax`, `ClipReveal`, `Magnetic`, `Marquee`). Import GSAP only from `@/lib/gsap`. Wrap animations in `useGSAP` and `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
- **Brand:** colors `ivory #F6F2EC`, `travertine #D9CBB8`, `leather #6B4A3A`, `espresso #2B211C`, `ink #17120F`, `gold #D9C27A`. Fonts: Spectral (display — owner rejected Cormorant, Playfair and Bodoni Moda as too soft/curly), Cinzel (hero "DECEMBER" wordmark only — translucent ivory, `mix-blend-screen`), Plus Jakarta Sans (body), all with `latin-ext` for Czech diacritics. The "D" logo is vector SVG in `components/brand/logo-d.tsx` (strands animate via `.logo-d__strand`).
- Images go through `next/image`; alt text comes from `dict.images`.

## Agents in `.claude/agents/` (and Antigravity skills in `.agents/skills/`)

- `section-builder` — builds/edits landing sections following the conventions above
- `design-director` — audits/refines luxury art direction, typography, contrast, and layout rhythm
- `ui-library-architect` — extracts and maintains shared primitives in `packages/ui` (`@december/ui`) and `packages/config`
- `motion-reviewer` — reviews animation quality, performance and reduced-motion handling
- `frontend-qa-a11y` — audits accessibility (WCAG AA), Core Web Vitals, SEO, and responsive edge cases
- `conversion-ux` — optimizes booking user journeys and service discovery without breaking brand tone
- `i18n-translator` — keeps Czech/English dictionaries complete and natural
- `nestjs-architect` — designs/implements `apps/api` in phase 2
- `admin-builder` — designs/builds `apps/admin` management portal in phase 2
