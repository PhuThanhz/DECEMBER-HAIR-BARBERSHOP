---
name: december-qa-cwv
description: >-
  Comprehensive QA, accessibility (WCAG AA), Core Web Vitals, SEO, and responsive audit workflow for apps/web.
  Use before shipping changes or when checking website quality and performance.
---

# December Frontend QA & Core Web Vitals Audit

Run this checklist on `apps/web` before releases or after major section/motion edits.

## Checklist

1. **Font & Token Integrity:** Verify `--font-display` and `--font-sans` in `packages/config/tailwind/brand.css` match `next/font/google` CSS variables in `apps/web/src/app/[locale]/layout.tsx`.
2. **LCP & Intro Timing:**
   - Hero image has `priority` and responsive `sizes`.
   - `Preloader` does not hide `<h1>` (`SplitReveal`) indefinitely or hijack `#hash` deep links with unconditional `window.scrollTo(0, 0)`.
   - Inspect `.grain::after` and scroll-linked animations for mobile Safari paint cost.
3. **Accessibility & Keyboard UX:**
   - Every hover-revealed action pairs `group-hover:*` with `group-focus-within:*` and has a touch-friendly mobile layout.
   - `MenuOverlay` and `Gallery` lightbox implement `role="dialog"`, `aria-modal="true"`, `Escape` close, and `lockScroll()`.
   - Every GSAP animation (including `Experience` stat counters) respects `prefers-reduced-motion`.
4. **SEO & Build Cleanliness:**
   - Zero `metadataBase` warnings during `pnpm build` (check root `opengraph-image.tsx` vs `[locale]/layout.tsx`).
   - Verify `localBusinessJsonLd` (`BarberShop`), `sitemap.ts`, `robots.ts`, `canonical`, and `hreflang`.
5. **Content Readiness:** Audit `// TODO` markers in `apps/web/src/content/{site,services,testimonials,hair}.ts`.

## Verification

```bash
pnpm lint && pnpm typecheck && pnpm build
```
