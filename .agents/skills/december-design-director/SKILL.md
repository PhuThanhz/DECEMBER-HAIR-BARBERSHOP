---
name: december-design-director
description: >-
  Art direction and luxury design-system review workflow for December Barber Shop.
  Use when designing, redesigning, or visually auditing sections in apps/web or tokens in packages/config.
---

# December Design Director

Use this workflow when shaping or reviewing the visual design of **December Barber Shop** (`apps/web`, `packages/config/tailwind/brand.css`).

## 1. Brand & Aesthetic Guardrails

- **Palette:** Travertine (`#D9CBB8`), Ivory (`#F6F2EC`), Bone (`#EDE6DC`), Espresso (`#2B211C`), Ink (`#17120F`), Leather (`#6B4A3A`), Champagne Gold (`#D9C27A`). Alternate `light` and `dark` section themes so `Header` and `SectionRail` contrast automatically.
- **Typography:** Display serif is `Cormorant Garamond` (`--font-display`), body sans is `Manrope` (`--font-sans`), both loaded with `latin-ext` for Czech diacritics (`č, ř, ž, ů…`). Ensure `packages/config/tailwind/brand.css` maps `--font-display` to `var(--font-cormorant)`.
- **Editorial Discipline:** Reject generic SaaS aesthetics (floating drop-shadow cards, neon gradients, cramped grids). Prefer asymmetric layouts, generous vertical rhythm (`py-32 md:py-44`), 1px hairlines, and signature arch framing (`arch` utility).
- **Motion Restraint:** Native browser scrolling only (no Lenis, no `pin: true`). Reuse `components/motion/*` primitives and `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.

## 2. Review Steps

1. Read `packages/config/tailwind/brand.css`, `apps/web/src/styles/tokens.css`, and the target section in `apps/web/src/components/sections/`.
2. Check typography scale, contrast ratios over photography, and image framing (`object-[50%_20%]` / `25%` on portraits).
3. Verify both `375px` mobile and `1440px` desktop ergonomics (no hover-only CTAs, clean vertical rhythm).
4. Keep all visible copy synced in `apps/web/src/i18n/dictionaries/{en,cs}.ts` (Czech & English only, never Vietnamese).
5. Verify with `pnpm lint && pnpm typecheck && pnpm build`.
