"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Section } from "@/components/layout/section";
import { motion } from "motion/react";
import { ctaGold } from "@/components/ui/cta";
import { filmVideo, spaceImages } from "@/content/images";
import { useDictionary } from "@/i18n/dictionary-provider";
import { cn } from "@/lib/cn";
import { scrollToId } from "@/lib/scroll";

const MOBILE_QUERY = "(max-width: 767px)";

/** Theo dõi media query bằng useSyncExternalStore (không setState trong effect, không lệch hydrate). */
function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(MOBILE_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

/**
 * Film — một màn hình điện ảnh với thông điệp "Město nechte za dveřmi" (phố Praha mưa lạnh → tiệm ấm).
 * - Hai bản video Veo 3: 16:9 cho máy tính, 9:16 cho điện thoại (mỗi máy chỉ tải đúng một bản).
 * - Thông điệp căn giữa khổ lớn trên lớp tối ở tâm.
 * - Phát 1 lần khi vào màn hình (tắt tiếng, không nút điều khiển — theo yêu cầu owner); quay lại thì xem từ đầu.
 *   Giảm chuyển động → không tự phát.
 * - Chưa có video (filmVideo.ready = false) → ảnh tĩnh của tiệm.
 */
export function Film() {
  const { dict } = useDictionary();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const msg = dict.film;
  const src = isMobile ? filmVideo.mobile : filmVideo.desktop;
  const poster = isMobile ? filmVideo.posterMobile : filmVideo.posterDesktop;

  // Phát khi section vào màn hình; ra ngoài thì dừng & tua về đầu → lần sau quay lại xem từ đầu.
  // Giảm chuyển động → không tự phát (giữ ảnh poster).
  useEffect(() => {
    const v = videoRef.current;
    const s = sectionRef.current;
    if (!filmVideo.ready || !v || !s) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !reduce.matches) {
          void v.play().catch(() => {});
        } else {
          v.pause();
          if (!e?.isIntersecting && v.ended) v.currentTime = 0;
        }
      },
      { threshold: 0.35 },
    );
    io.observe(s);
    return () => io.disconnect();
  }, [src]);

  return (
    <Section
      ref={sectionRef}
      id="film"
      theme="dark"
      fit={false}
      label={msg.title}
      className="bg-ink text-ivory relative h-[100svh] max-h-[1100px] min-h-[600px] overflow-hidden"
    >
      {/* Lớp hình */}
      <div className="absolute inset-0">
        {filmVideo.ready ? (
          <video
            key={src}
            ref={videoRef}
            aria-hidden
            muted
            loop={filmVideo.loop}
            playsInline
            preload="metadata"
            poster={poster}
            // Điện thoại: bản 16:9 cắt dọc — giữ cửa tiệm (lệch phải) trong khung
            className="size-full object-cover object-[62%_50%] md:object-center"
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={spaceImages.stations.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[70%_50%]"
          />
        )}
      </div>

      {/* Lớp tối đều + tối sâu ở tâm để chữ giữa màn hình luôn nổi trên mọi khung hình */}
      <div aria-hidden className="bg-ink/35 pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(23,18,15,0.62),rgba(23,18,15,0.15)_70%,transparent)]"
      />

      {/* Thông điệp — căn giữa, khổ lớn */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col items-center justify-center px-6 text-center md:px-10">
        {/* Chữ trong suốt hoà vào video (blend "screen", không đổ bóng) — chỉ mờ dần hiện lên một lần,
            không tách từng chữ → không giật khi video đang chạy */}
        <motion.div
          className="flex flex-col items-center mix-blend-screen"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display text-gold/90 text-lg italic md:text-2xl">{msg.kicker}</p>
          <h2 className="font-display text-ivory/80 mt-5 max-w-[12ch] text-[clamp(3.2rem,8.4vw,9.5rem)] leading-[0.9] font-light tracking-[-0.015em] text-balance">
            {msg.title}
          </h2>
        </motion.div>
        <button
          type="button"
          onClick={() => scrollToId("booking")}
          className={cn(ctaGold, "mt-10 hidden sm:inline-flex")}
        >
          {dict.common.book}
        </button>
      </div>
    </Section>
  );
}
