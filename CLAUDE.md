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
| `packages/ui`     | Shared primitives (`cn`, `Container`, `Eyebrow`)                                                                          |
| `packages/config` | tsconfig presets + brand tokens `tailwind/brand.css`                                                                      |
| `sources/`        | Original logo & renders — read-only                                                                                       |

## apps/web conventions

- **Routing:** everything lives under `src/app/[locale]/`. `src/proxy.ts` redirects un-prefixed URLs.
- **i18n:** all visible text comes from `src/i18n/dictionaries/{en,cs}.ts`. `en.ts` defines the `Dictionary` type; `cs.ts` must match it. Client components read text with `useDictionary()`. Add keys to **both** files in the same change.
- **Data vs text:** `src/content/*` holds language-neutral data (prices in CZK, phone, images, ids). Lines marked `// TODO` are placeholders.
- **Sections:** one file per section in `src/components/sections/`, wrapped in `<Section id theme transition rail>` (`components/layout/section.tsx`). Set `theme` to the background (`light`/`dark`) — the header and section rail recolor from it. Section transitions (rounded "rise", shade of the previous section, active-section tracking) are applied centrally by `components/motion/section-transitions.tsx` — do not re-implement them per section.
- **Scrolling:** native browser scrolling only — no Lenis, no pinned/scroll-jacked sections (the owner found it too slow). Use `scrollToId()` / `lockScroll()` from `@/lib/scroll`.
- **Sections (keep ~6, owner's request):** Hero → Styles (5 signature cuts in one section; background colour changes per style, autoplay) → Menu (price list) → Space (interior gallery, `gallery.tsx`) → Experience (+ testimonials marquee) → Contact (booking CTA + address/hours/map). No custom cursor; photos in full colour.
- **Motion:** reuse primitives in `components/motion/` (`Reveal`, `SplitReveal`, `Parallax`, `ClipReveal`, `Magnetic`, `Marquee`). Import GSAP only from `@/lib/gsap`. Wrap animations in `useGSAP` and `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
- **Brand:** colors `ivory #F6F2EC`, `travertine #D9CBB8`, `leather #6B4A3A`, `espresso #2B211C`, `ink #17120F`, `gold #D9C27A`. Fonts: Playfair Display (display — owner found Cormorant too soft), Manrope (body), both with `latin-ext` for Czech diacritics. The "D" logo is vector SVG in `components/brand/logo-d.tsx` (strands animate via `.logo-d__strand`).
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
