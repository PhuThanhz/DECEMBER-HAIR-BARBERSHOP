# apps/api — NestJS (giai đoạn 2, chưa triển khai)

Backend cho đặt lịch online, quản trị và thanh toán. Khi bắt đầu:

```bash
cd apps && npx @nestjs/cli new api --package-manager pnpm --skip-git
```

Đặt tên package là `@december/api` và dùng chung type từ `@december/types`.

## Cấu trúc dự kiến

```
apps/api/
├── src/
│   ├── main.ts                     # bootstrap, helmet, CORS, versioning (/v1), Swagger
│   ├── app.module.ts
│   ├── config/                     # @nestjs/config + schema validate (zod/joi): app, db, jwt, mail, payment
│   ├── common/
│   │   ├── decorators/             # @CurrentUser, @Roles, @Public
│   │   ├── filters/                # HttpExceptionFilter (chuẩn hoá lỗi)
│   │   ├── guards/                 # JwtAuthGuard, RolesGuard, ThrottlerGuard
│   │   ├── interceptors/           # Logging, Transform response, Timeout
│   │   ├── pipes/                  # ValidationPipe cấu hình chung
│   │   └── dto/                    # PaginationDto, IdParamDto
│   ├── database/                   # Prisma service/module, migrations, seed
│   ├── modules/
│   │   ├── auth/                   # đăng nhập admin/staff, JWT + refresh token
│   │   ├── users/                  # tài khoản nội bộ (owner, manager, barber)
│   │   ├── barbers/                # hồ sơ thợ, chuyên môn, ảnh
│   │   ├── services/               # danh mục & giá dịch vụ
│   │   ├── schedules/              # ca làm, ngày nghỉ, slot trống
│   │   ├── bookings/               # tạo / đổi / huỷ lịch, chống trùng slot
│   │   ├── customers/              # khách hàng, lịch sử, điểm thân thiết
│   │   ├── payments/               # VNPay / MoMo, webhook, đặt cọc
│   │   ├── notifications/          # email, SMS, Zalo ZNS (queue BullMQ)
│   │   ├── media/                  # upload ảnh (S3 / Cloudinary)
│   │   └── cms/                    # nội dung landing page, gallery, testimonials
│   └── health/                     # /health (Terminus)
└── test/                           # e2e (Jest + Supertest)
```

Mỗi module theo mẫu: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/` (hoặc `*.repository.ts`), `*.spec.ts`.
