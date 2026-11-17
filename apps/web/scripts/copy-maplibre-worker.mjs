// Chép web worker của MapLibre vào public/vendor để trình duyệt tải được.
// Turbopack không tự sao chép file worker đi kèm bundle, nên BrandMap gọi setWorkerUrl("/vendor/maplibre-gl-worker.mjs").
// Chạy tự động trước `dev` và `build` (xem package.json).
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve("maplibre-gl/package.json"));
const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "vendor");

mkdirSync(outDir, { recursive: true });
copyFileSync(
  join(pkgDir, "dist", "maplibre-gl-worker.mjs"),
  join(outDir, "maplibre-gl-worker.mjs"),
);
console.log("maplibre-gl worker → public/vendor/maplibre-gl-worker.mjs");
