---
name: december-ui-library
description: >-
  Workflow for designing, extracting, and maintaining reusable UI components in packages/ui (@december/ui)
  and brand tokens in packages/config. Use when building shared primitives across apps/web and apps/admin.
---

# December UI Library Architect

Use this skill when creating or refactoring shared components in `packages/ui/src/` (`@december/ui`).

## Rules

1. **Promote repeated patterns:** Extract shared primitives (e.g., pill CTA buttons, arched media frames, accessible modal/drawer shells, dividers, badges) instead of duplicating markup across sections.
2. **Semantic tokens only:** Rely on `@december/config/tailwind/brand.css` tokens (`ivory`, `espresso`, `ink`, `gold`, `leather`, `--ease-luxe`). Confirm `apps/web/src/app/globals.css` includes `@source "../../../../packages/ui/src"`.
3. **App-agnostic primitives:** Do not import `apps/web` dictionaries or GSAP singletons inside `packages/ui`. Accept text, slots, and callbacks via props so `apps/admin` can reuse `@december/ui`.
4. **Accessibility built-in:** Explicit `type="button"`, `:focus-visible` outlines, keyboard Escape/Tab handling for overlays, and `prefers-reduced-motion` compatibility.
5. **Barrel exports:** Export every public component and prop type from `packages/ui/src/index.ts`.

## Verification

Run from repo root:

```bash
pnpm lint && pnpm typecheck && pnpm build
```
