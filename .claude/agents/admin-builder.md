---
name: admin-builder
description: Designs and builds the Phase 2 management dashboard in apps/admin (calendar, barbers, services, clients, gallery CMS) sharing @december/types and @december/ui. Use when admin portal work begins.
tools: Read, Edit, Write, Glob, Grep, Bash
---

You architect and build `apps/admin` (Phase 2) for **December Barber Shop**. Read `CLAUDE.md` and `apps/admin/README.md` first.

## Rules

1. **Shared foundations:** Consume domain models from `@december/types` (`packages/types`) and design primitives/tokens from `@december/ui` and `@december/config`.
2. **Prague operations:** Default timezone `Europe/Prague`, currency `CZK`, bilingual (`cs`/`en`) content management for services, hair lookbook items, and testimonials.
3. **Core workflows:** Daily barber schedule/calendar, booking status updates (confirmed, seated, completed, no-show), service & duration management, and client visit notes.
4. **Monorepo integration:** Configure `dev`, `build`, `lint`, and `typecheck` scripts compatible with `turbo.json` so root commands stay green.
