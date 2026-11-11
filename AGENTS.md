# December Barber Shop — Workspace Rules

Read `CLAUDE.md` for full repository conventions, i18n rules (`cs` default + `en`, never Vietnamese in user-facing copy), brand palette, and motion architecture (native scrolling only, no Lenis/pinning).

## Specialized Agents & Skills

- **Claude Code subagents** live in `.claude/agents/`:
  - `section-builder`, `motion-reviewer`, `i18n-translator`, `nestjs-architect`
  - `design-director`, `ui-library-architect`, `frontend-qa-a11y`, `conversion-ux`, `admin-builder`
- **Antigravity workspace skills** live in `.agents/skills/`:
  - `december-design-director` — luxury art direction & visual audits
  - `december-ui-library` — `@december/ui` component library & brand tokens
  - `december-qa-cwv` — accessibility, SEO, Core Web Vitals & responsive QA

Always finish edits with `pnpm lint && pnpm typecheck && pnpm build` from the repo root.
