"use client";

import { useRef } from "react";
import { Section } from "@/components/layout/section";
import { LogoD } from "@/components/brand/logo-d";
import { Magnetic, Reveal, SplitReveal } from "@/components/motion";
import { site, telHref } from "@/content/site";
import { useDictionary } from "@/i18n/dictionary-provider";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Đặt lịch + Liên hệ trong một section:
 * - Chữ D vàng lớn tự vẽ theo cuộn, tiêu đề lớn, 3 nút (gọi / WhatsApp / chỉ đường).
 * - Bên dưới: địa chỉ, giờ mở cửa, liên hệ + bản đồ.
 * Giai đoạn 1 chưa có backend → chưa có form đặt lịch online.
 */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { dict } = useDictionary();

  const actions = [
    { label: dict.booking.call, sub: site.phone, href: telHref },
    { label: dict.booking.whatsapp, sub: dict.booking.whatsappSub, href: site.whatsapp },
    { label: dict.booking.directions, sub: dict.booking.directionsSub, href: site.mapLink },
  ];

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const strands = gsap.utils.toArray<SVGPathElement>(".ct-d .logo-d__strand", ref.current);
        strands.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap
          .timeline({
            scrollTrigger: { trigger: ref.current, start: "top 75%", end: "top top", scrub: 1 },
          })
          .to(strands, { strokeDashoffset: 0, stagger: 0.04, ease: "none" })
          .fromTo(".ct-d", { scale: 0.85, rotate: -6 }, { scale: 1, rotate: 0, ease: "none" }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <Section
      ref={ref}
      id="contact"
      theme="dark"
      className="bg-espresso text-ivory overflow-hidden pt-32 pb-28 md:pt-44 md:pb-36"
    >
      <LogoD
        tone="gold"
        strandsOnly
        strandWidth={1.6}
        aria-hidden
        className="ct-d pointer-events-none absolute top-0 left-1/2 h-[70vh] w-auto -translate-x-1/2 opacity-40"
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        {/* Kêu gọi đặt lịch */}
        <div className="text-center">
          <p className="text-gold text-[11px] tracking-[0.42em] uppercase">
            {dict.booking.eyebrow}
          </p>
          <SplitReveal
            as="h2"
            type="words"
            className="font-display mx-auto mt-8 max-w-5xl text-[clamp(3rem,7.5vw,7.5rem)] leading-[0.95] font-medium"
          >
            {dict.booking.title}
          </SplitReveal>
          <p className="text-ivory/60 mx-auto mt-8 max-w-md">{dict.booking.lead}</p>

          <div className="mt-14 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            {actions.map((a, i) => (
              <Magnetic key={a.label} strength={0.25}>
                <a
                  href={a.href}
                  target={a.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={
                    i === 0
                      ? "bg-gold text-ink hover:bg-ivory flex min-w-60 flex-col items-center rounded-full px-10 py-5 transition-colors duration-500"
                      : "border-ivory/25 hover:border-gold hover:text-gold flex min-w-60 flex-col items-center rounded-full border px-10 py-5 transition-colors duration-500"
                  }
                >
                  <span className="text-[12px] font-semibold tracking-[0.24em] uppercase">
                    {a.label}
                  </span>
                  <span className="mt-1 text-xs opacity-60">{a.sub}</span>
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Địa chỉ, giờ mở cửa, bản đồ */}
        <div className="border-ivory/10 mt-28 grid gap-12 border-t pt-16 lg:mt-36 lg:grid-cols-12">
          <Reveal stagger={0.1} className="space-y-10 lg:col-span-5">
            <h3 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-none font-medium">
              {dict.location.title}
            </h3>
            <address className="not-italic">
              <p className="text-gold text-[11px] tracking-[0.28em] uppercase">
                {dict.location.address}
              </p>
              <p className="font-display mt-3 text-2xl">{site.address}</p>
            </address>
            <div>
              <p className="text-gold text-[11px] tracking-[0.28em] uppercase">
                {dict.location.hours}
              </p>
              <dl className="divide-ivory/10 border-ivory/10 mt-3 divide-y border-y">
                {site.hours.map((h) => (
                  <div key={h.key} className="flex justify-between py-3">
                    <dt className="text-ivory/80">{dict.hours[h.key]}</dt>
                    <dd className="font-display text-xl tabular-nums">
                      {h.open} — {h.close}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="text-ivory/80 flex flex-wrap gap-x-10 gap-y-4">
              <a
                href={telHref}
                className="border-ivory/30 hover:border-gold hover:text-gold border-b pb-1 transition-colors"
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="border-ivory/30 hover:border-gold hover:text-gold border-b pb-1 transition-colors"
              >
                {site.email}
              </a>
            </div>
          </Reveal>

          <Reveal className="relative min-h-[380px] overflow-hidden rounded-[2rem] lg:col-span-7">
            <iframe
              title={dict.location.mapTitle}
              src={site.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.9)_sepia(0.35)_contrast(0.9)]"
            />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
