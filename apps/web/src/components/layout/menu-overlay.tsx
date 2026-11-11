"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LogoD } from "@/components/brand/logo-d";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { spaceImages } from "@/content/images";
import { hairImages } from "@/content/hair";
import { navIds, site, telHref, type NavId } from "@/content/site";
import { useDictionary } from "@/i18n/dictionary-provider";
import { LanguageSwitch } from "./language-switch";

const ease = [0.76, 0, 0.24, 1] as const;

const previews: Record<NavId, { src: string }> = {
  styles: hairImages.texturedQuiff,
  menu: hairImages.scissorCut,
  space: spaceImages.floor,
  experience: spaceImages.washCorner,
  contact: spaceImages.reception,
};

/**
 * Menu toàn màn hình (mọi kích thước): rèm trượt xuống, link serif lớn có số thứ tự,
 * desktop hover link → ảnh vòm bên phải đổi theo.
 */
export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dict } = useDictionary();
  const [hovered, setHovered] = useState<NavId>("styles");
  const items = navIds;

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    // Chờ rèm đóng rồi mới cuộn
    setTimeout(() => scrollToId(id), 450);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={dict.common.menu}
          className="bg-espresso text-ivory fixed inset-0 z-[70] flex flex-col overflow-hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(100% 0 0% 0)" }}
          transition={{ duration: 1, ease }}
        >
          {/* Hoạ tiết chữ D mờ phía sau */}
          <LogoD
            tone="gold"
            strandsOnly
            strandWidth={1.2}
            aria-hidden
            className="pointer-events-none absolute top-1/2 -left-[20vh] h-[140vh] w-auto -translate-y-1/2 opacity-[0.12]"
          />

          <div className="relative flex h-20 items-center justify-between px-5 md:h-24 md:px-10">
            <span className="text-gold text-[10px] tracking-[0.32em] uppercase">
              {dict.common.est}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="group flex items-center gap-3 text-[11px] font-medium tracking-[0.26em] uppercase"
            >
              {dict.common.close}
              <span className="relative block size-7">
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[135deg]" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </button>
          </div>

          <div className="relative mx-auto grid w-full max-w-[1600px] flex-1 items-center gap-10 px-5 md:px-10 lg:grid-cols-[1.3fr_1fr]">
            <nav aria-label={dict.common.menu}>
              <ul>
                {items.map((id, i) => (
                  <li key={id} className="overflow-hidden">
                    <motion.a
                      href={`#${id}`}
                      onClick={go(id)}
                      onPointerEnter={() => setHovered(id)}
                      className="group font-display flex items-baseline gap-5 py-1 text-[clamp(2.6rem,6.5vw,6rem)] leading-[1.05] font-normal"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-110%" }}
                      transition={{ duration: 1, ease, delay: 0.3 + i * 0.05 }}
                    >
                      <span className="text-gold font-sans text-[11px] tracking-[0.2em]">
                        0{i + 1}
                      </span>
                      <span className="group-hover:text-gold transition-[transform,color] duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-4 group-hover:italic">
                        {dict.nav[id]}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="arch relative hidden aspect-[3/4] max-h-[62vh] justify-self-end overflow-hidden lg:block"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.45 }}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={hovered}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={previews[hovered].src}
                    alt=""
                    fill
                    sizes="30vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div
            className="border-ivory/10 text-ivory/60 relative mx-auto grid w-full max-w-[1600px] gap-6 border-t px-5 py-6 text-[11px] tracking-[0.22em] uppercase md:grid-cols-4 md:px-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.8 } }}
            exit={{ opacity: 0 }}
          >
            <span>{site.address}</span>
            <a href={telHref} className="text-ivory">
              {site.phone}
            </a>
            <span>{dict.hours.short}</span>
            <LanguageSwitch className="text-ivory md:justify-end" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
