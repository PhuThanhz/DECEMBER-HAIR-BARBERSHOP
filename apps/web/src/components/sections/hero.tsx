"use client";

import { useEffect, useRef } from "react";
import { Magnetic, useIntro } from "@/components/motion";
import { heroVideo } from "@/content/images";
import { site } from "@/content/site";
import { useDictionary } from "@/i18n/dictionary-provider";
import { Section } from "@/components/layout/section";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToId } from "@/lib/scroll";
import { ctaGold, glassDark } from "@/components/ui/cta";
import { cn } from "@/lib/cn";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const { dict } = useDictionary();
  // Hai bản video chồng nhau, chuyển mờ chéo ở cuối mỗi vòng → vòng lặp liền mạch, không giật
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  // Chỉ phát khi đang trong màn hình & không bật giảm chuyển động
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    const s = ref.current;
    if (!a || !b || !s) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const vids = [a, b] as const;
    const FADE = 0.9; // giây chuyển mờ chéo
    let active = 0;
    let fading = false;
    let isVisible = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    a.style.opacity = "1";
    b.style.opacity = "0";

    const checkPlay = () => {
      const cur = vids[active]!;
      if (!isVisible || mq.matches) vids.forEach((v) => v.pause());
      else void cur.play().catch(() => {});
    };

    const onTime = () => {
      const cur = vids[active]!;
      if (fading || !cur.duration || cur.currentTime < cur.duration - FADE) return;
      fading = true;
      const next = vids[1 - active]!;
      next.currentTime = 0;
      void next.play().catch(() => {});
      for (const v of vids) v.style.transition = `opacity ${FADE}s linear`;
      next.style.opacity = "1";
      cur.style.opacity = "0";
      timer = setTimeout(
        () => {
          cur.pause();
          active = 1 - active;
          fading = false;
        },
        FADE * 1000 + 60,
      );
    };

    vids.forEach((v) => v.addEventListener("timeupdate", onTime));
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        checkPlay();
      },
      { threshold: 0.1 },
    );
    io.observe(s);
    mq.addEventListener("change", checkPlay);
    return () => {
      clearTimeout(timer);
      io.disconnect();
      mq.removeEventListener("change", checkPlay);
      vids.forEach((v) => v.removeEventListener("timeupdate", onTime));
    };
  }, []);

  useGSAP(
    () => {
      if (!done) return;
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // Ảnh zoom chậm từ xa vào khi màn mở ra
        gsap.fromTo(
          ".hero-media",
          { scale: 1.28 },
          { scale: 1.08, duration: 2.4, ease: "expo.out" },
        );
        // Wordmark: từng chữ trồi lên khỏi mặt nạ, đường kẻ vàng tự vẽ, BARBER hiện sau
        gsap.from(".hero-char", {
          yPercent: 110,
          duration: 1.5,
          stagger: 0.05,
          delay: 0.1,
          ease: "expo.out",
        });
        gsap.from([".hero-est", ".hero-barber"], {
          opacity: 0,
          y: 14,
          duration: 1.1,
          stagger: 0.12,
          delay: 0.85,
          ease: "expo.out",
        });
        gsap.from(".hero-fade", {
          opacity: 0,
          y: 24,
          duration: 1.1,
          stagger: 0.1,
          delay: 0.3,
          ease: "expo.out",
        });

        // Khi cuộn: ảnh trôi xuống & tối dần, tiêu đề giãn nhẹ và mờ đi
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        tl.to(".hero-parallax", { yPercent: 22, ease: "none" }, 0)
          .to(".hero-wordmark", { scale: 1.05, opacity: 0.35, ease: "none" }, 0)
          .to(".hero-content", { yPercent: -32, opacity: 0, ease: "none" }, 0)
          .to(".hero-shade", { opacity: 0.85, ease: "none" }, 0);
      });
    },
    { scope: ref, dependencies: [done] },
  );

  return (
    <Section
      ref={ref}
      id="top"
      theme="dark"
      transition="none"
      rail={false}
      fit={false}
      className="bg-ink text-ivory h-dvh min-h-[680px] overflow-hidden"
      aria-label={dict.meta.title}
    >
      <div className="hero-parallax absolute inset-x-0 -top-[25%] bottom-0 transform-gpu will-change-transform">
        <div className="hero-media absolute inset-0 scale-[1.08]">
          <video
            ref={videoARef}
            aria-hidden
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={heroVideo.poster}
            className="absolute inset-0 size-full object-cover"
          >
            <source src={heroVideo.src} type="video/mp4" />
          </video>
          {/* Bản thứ hai — chỉ hiện khi chuyển mờ chéo ở cuối vòng */}
          <video
            ref={videoBRef}
            aria-hidden
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 size-full object-cover opacity-0"
          >
            <source src={heroVideo.src} type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="hero-shade bg-ink absolute inset-0 opacity-0" />
      {/* Lớp phủ điện ảnh tối vừa phải: làm nổi bật video và chữ vàng */}
      <div className="from-ink/75 via-ink/45 to-ink/95 pointer-events-none absolute inset-0 bg-gradient-to-b" />

      {/* Tên thương hiệu: chữ ngà trong suốt hoà vào video (blend "screen", không viền, không bóng);
          dòng dưới: năm thành lập · BARBER — như một con dấu thương hiệu. */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-5 pb-[18svh]">
        <h1
          aria-label={site.name}
          className="hero-wordmark font-display flex flex-col uppercase select-none"
        >
          <span
            aria-hidden
            className="flex font-[family-name:var(--font-wordmark-face)] text-[clamp(3rem,13.4vw,14.5rem)] leading-[0.9] font-normal tracking-[0.04em] mix-blend-screen"
          >
            {[..."DECEMBER"].map((c, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.03em]">
                <span className="hero-char text-ivory/60 inline-block">{c}</span>
              </span>
            ))}
          </span>
          <span
            aria-hidden
            className="mt-[clamp(0.75rem,1.4vw,1.5rem)] flex items-center gap-[clamp(0.75rem,1.8vw,2rem)]"
          >
            <span className="hero-est text-ivory/70 font-sans text-[clamp(0.55rem,0.75vw,0.75rem)] tracking-[0.32em] whitespace-nowrap">
              {dict.common.est}
            </span>
            <span aria-hidden className="flex-1" />
            <span className="hero-barber text-gold -mr-[0.42em] text-[clamp(1.15rem,3.4vw,3.7rem)] leading-none font-normal tracking-[0.42em]">
              Barber
            </span>
          </span>
        </h1>
      </div>

      <div className="hero-content relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-12 md:px-10 md:pb-16 lg:px-16">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <p className="hero-fade text-ivory/80 max-w-lg text-base leading-relaxed text-balance md:text-lg">
            {dict.hero.lead}
          </p>
          {/* Thẻ kính: đặt lịch + địa chỉ & giờ — video vẫn thấy mờ phía sau */}
          <div
            className={cn(
              glassDark,
              "hero-fade flex w-full flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl p-3 pr-6 sm:w-fit",
            )}
          >
            <Magnetic>
              <a
                href="#booking"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("booking");
                }}
                className={ctaGold}
              >
                <span>{dict.hero.cta}</span>
              </a>
            </Magnetic>
            <p className="text-ivory/75 text-[13px] leading-relaxed tabular-nums">
              {site.address}
              <span className="block">{dict.hours.short}</span>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
