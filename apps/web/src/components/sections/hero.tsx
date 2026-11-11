"use client";

import Image from "next/image";
import { useRef } from "react";
import { Magnetic, SplitReveal, useIntro } from "@/components/motion";
import { spaceImages } from "@/content/images";
import { useDictionary } from "@/i18n/dictionary-provider";
import { Section } from "@/components/layout/section";
import { gsap, useGSAP } from "@/lib/gsap";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const { dict } = useDictionary();

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
        gsap.from(".hero-fade", {
          opacity: 0,
          y: 24,
          duration: 1.1,
          stagger: 0.1,
          delay: 0.3,
          ease: "expo.out",
        });
        gsap.from(".hero-rule", { scaleX: 0, duration: 1.3, delay: 0.2, ease: "expo.inOut" });

        // Khi cuộn: ảnh trôi xuống & tối dần, nội dung bay lên mờ đi
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        tl.to(".hero-parallax", { yPercent: 22, ease: "none" }, 0)
          .to(".hero-content", { yPercent: -35, opacity: 0, ease: "none" }, 0)
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
      className="bg-ink text-ivory h-svh min-h-[640px] overflow-hidden"
      aria-label={dict.meta.title}
    >
      <div className="hero-parallax absolute inset-x-0 -top-[25%] bottom-0">
        <div className="hero-media absolute inset-0 scale-[1.08]">
          <Image
            src={spaceImages.reception.src}
            alt={dict.images.reception}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="hero-shade bg-ink absolute inset-0 opacity-0" />
      <div className="from-ink/70 via-ink/25 to-ink/85 absolute inset-0 bg-gradient-to-b" />

      <div className="hero-content relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-28 md:px-10 md:pb-36 lg:px-16">
        <p className="hero-fade text-gold mb-6 flex items-center gap-4 text-[11px] font-medium tracking-[0.42em] uppercase">
          <span className="hero-rule bg-gold h-px w-14 origin-left" />
          {dict.hero.eyebrow}
        </p>

        <SplitReveal
          as="h1"
          type="chars"
          immediate
          play={done}
          delay={0.1}
          className="font-display text-[clamp(4.5rem,17vw,15rem)] leading-[0.82] font-normal tracking-[-0.02em]"
        >
          December
        </SplitReveal>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1fr_auto] md:items-end">
          <p className="hero-fade text-ivory/75 max-w-md text-base leading-relaxed text-balance md:text-lg">
            {dict.hero.lead}
          </p>
          <div className="hero-fade flex items-center gap-8">
            <Magnetic>
              <a
                href="#contact"

                className="group bg-gold text-ink relative inline-flex items-center gap-4 overflow-hidden rounded-full px-8 py-4 text-[12px] font-semibold tracking-[0.24em] uppercase"
              >
                <span className="relative z-10">{dict.hero.cta}</span>
                <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
                <span className="bg-ivory absolute inset-0 translate-y-full rounded-full transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-y-0" />
              </a>
            </Magnetic>
            <a
              href="#styles"
              className="text-ivory/70 hidden items-center gap-3 text-[11px] tracking-[0.3em] uppercase md:flex"
            >
              <span className="bg-ivory/20 relative block h-12 w-px overflow-hidden">
                <span
                  className="bg-gold absolute inset-0"
                  style={{ animation: "scroll-cue 2.4s var(--ease-silk) infinite" }}
                />
              </span>
              {dict.common.scroll}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
