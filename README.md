# December Barber Shop

Monorepo (pnpm + Turborepo) cho website December Barber Shop.

| Thư mục           | Mô tả                                                                     | Trạng thái     |
| ----------------- | ------------------------------------------------------------------------- | -------------- |
| `apps/web`        | Landing page song ngữ **CS / EN** — Next.js 16, Tailwind v4, GSAP, Motion | ✅ Giai đoạn 1 |
| `apps/api`        | Backend NestJS (đặt lịch, thanh toán, CMS)                                | ⏳ Giai đoạn 2 |
| `apps/admin`      | Trang quản trị                                                            | ⏳ Giai đoạn 2 |
| `packages/ui`     | Component dùng chung (`Container`, `Eyebrow`, `cn`)                       |                |
| `packages/types`  | Domain types dùng chung web ↔ api                                         |                |
| `packages/config` | tsconfig, brand tokens Tailwind (`tailwind/brand.css`)                    |                |
| `sources/`        | Logo & ảnh gốc (không chỉnh sửa)                                          |                |

## Bắt đầu

```bash
corepack enable   # hoặc: npm i -g pnpm
pnpm install
pnpm dev          # http://localhost:3000
```

Lệnh khác: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm format`.

## apps/web

```
src/
├── app/[locale]/        # App Router theo ngôn ngữ (cs, en); proxy.ts tự chuyển hướng
├── i18n/                # config, dictionaries/{cs,en}.ts, DictionaryProvider
├── components/
│   ├── brand/           # LogoD (chữ D vector hoá, animate được), Wordmark
│   ├── layout/          # Header, MenuOverlay, LanguageSwitch, SectionRail, Section, Footer
│   ├── motion/          # Preloader, SmoothScroll, Reveal, SplitReveal, Parallax, ClipReveal, Magnetic, Cursor, Marquee
│   └── sections/        # 6 section: Hero, Styles (kiểu tóc, đổi màu), Menu (bảng giá), Gallery (không gian), Experience (+ đánh giá), Contact (đặt lịch + bản đồ)
├── content/             # ⚠️ Nội dung tiệm: site.ts (địa chỉ, SĐT, giờ…), services.ts, testimonials.ts
├── hooks/  lib/  styles/
```

**Ngôn ngữ:** tiếng Séc (`/cs`, mặc định) và tiếng Anh (`/en`). Văn bản: `apps/web/src/i18n/dictionaries/{cs,en}.ts`.

**Cập nhật thông tin thật:** sửa các dòng có `// TODO` trong `apps/web/src/content/`.

**AI agents:** xem `CLAUDE.md` và `.claude/agents/` (section-builder, motion-reviewer, i18n-translator, nestjs-architect).

## Brand

Màu: ivory `#F6F2EC` · travertine `#D9CBB8` · leather `#6B4A3A` · espresso `#2B211C` · gold `#D9C27A`.
Font: Playfair Display (tiêu đề) + Manrope (nội dung).
