"use client";

import Image from "next/image";
import { useRef } from "react";
import { Eyebrow } from "@december/ui";
import { Marquee, Parallax, Reveal, SplitReveal } from "@/components/motion";
import { testimonials } from "@/content/testimonials";
import { stats } from "@/content/experience";
import { spaceImages } from "@/content/images";
import { gsap, useGSAP } from "@/lib/gsap";
import { useDictionary } from "@/i18n/dictionary-provider";
import { Section } from "@/components/layout/section";

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const { dict } = useDictionary();

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // Đếm số khi vào viewport
        gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
          const end = Number(el.dataset.value);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 2.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          });
        });

        // Khung ảnh lớn mở rộng dần khi cuộn
        gsap.fromTo(
          ".exp-frame",
          { clipPath: "inset(12% 18% 12% 18% round 400px 400px 0 0)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px 0px 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: ".exp-frame",
              start: "top 85%",
              end: "center 50%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Section
      ref={ref}
      id="experience"
      theme="light"
      className="bg-travertine text-ink pt-32 md:pt-44"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <Eyebrow className="text-leather">{dict.experience.eyebrow}</Eyebrow>
        <SplitReveal
          as="h2"
          className="font-display mt-8 max-w-4xl text-[clamp(3rem,6vw,6rem)] leading-[0.95] font-normal"
        >
          {dict.experience.title}
        </SplitReveal>

        <Reveal
          stagger={0.1}
          className="bg-ink/15 mt-20 grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
        >
          {dict.experience.items.map((e, i) => (
            <article
              key={e.title}
              className="group bg-travertine hover:bg-bone p-8 transition-colors duration-700 md:p-10"
            >
              <span className="font-display text-leather text-sm italic">0{i + 1}</span>
              <h3 className="font-display mt-14 text-3xl font-normal">{e.title}</h3>
              <p className="text-ink/60 mt-4 text-sm leading-relaxed">{e.text}</p>
              <span className="bg-leather mt-8 block h-px w-8 transition-all duration-700 ease-[var(--ease-luxe)] group-hover:w-full" />
            </article>
          ))}
        </Reveal>

        <p className="text-leather mt-24 flex items-center gap-4 text-[11px] font-medium tracking-[0.32em] uppercase">
          <span className="bg-leather/50 h-px w-10" />
          {dict.testimonials.eyebrow}
        </p>
      </div>

      {/* Đánh giá khách hàng — dải chạy ngang, dừng khi hover */}
      <Marquee className="mt-10" duration={70}>
        {testimonials.map((t, i) => (
          <figure
            key={t.id}
            className="bg-ivory/70 mx-3 flex w-[80vw] max-w-[480px] shrink-0 flex-col justify-between rounded-[1.5rem] p-8 md:mx-4 md:p-10"
          >
            <p className="text-leather" aria-label={`${t.rating}/5`}>
              {"★".repeat(t.rating)}
            </p>
            <blockquote className="font-display mt-5 text-xl leading-snug md:text-2xl">
              “{dict.testimonials.items[i]?.quote}”
            </blockquote>
            <figcaption className="text-ink/50 mt-7 text-[11px] tracking-[0.26em] uppercase">
              {t.author} <span className="text-leather">· {dict.testimonials.items[i]?.role}</span>
            </figcaption>
          </figure>
        ))}
      </Marquee>

      <div className="exp-frame relative mt-28 h-[70vh] md:h-[90vh]">
        <Parallax className="absolute inset-0" speed={18}>
          <Image
            src={spaceImages.overview.src}
            alt={dict.images.overview}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div className="from-ink/70 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
        <div className="text-ivory absolute inset-x-0 bottom-0 mx-auto grid max-w-[1440px] grid-cols-2 gap-8 px-6 pb-12 md:grid-cols-4 md:px-10 lg:px-16">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="font-display text-5xl font-normal md:text-7xl">
                <span className="stat-num" data-value={s.value}>
                  {s.value}
                </span>
                <span className="text-gold">{s.suffix}</span>
              </p>
              <p className="text-ivory/70 mt-2 text-[11px] tracking-[0.28em] uppercase">
                {dict.experience.stats[i]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
