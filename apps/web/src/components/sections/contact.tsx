"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LogoD } from "@/components/brand/logo-d";
import { BrandMap, type MapMode } from "@/components/ui/brand-map";
import { Section } from "@/components/layout/section";
import { Reveal, SplitReveal } from "@/components/motion";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { ctaDark, ctaGlass, ctaGold } from "@/components/ui/cta";
import { Segmented } from "@/components/ui/segmented";
import { isOpened, site, telHref } from "@/content/site";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useBookingSelection } from "@/lib/booking-selection";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
/** Toạ độ tiệm [kinh độ, vĩ độ] — Václavské náměstí 1. */
const MAP_CENTER: [number, number] = [14.423985, 50.083844];

interface PragueStatus {
  time: string;
  isWeekend: boolean;
  isOpen: boolean;
}

function getPragueStatus(): PragueStatus {
  const now = new Date();
  const time = new Intl.DateTimeFormat("cs-CZ", {
    timeZone: "Europe/Prague",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Prague",
    weekday: "short",
  }).format(now);
  const [hStr = "0", mStr = "0"] = time.split(":");
  const mins = Number(hStr) * 60 + Number(mStr);
  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const schedule = isWeekend ? site.hours[1]! : site.hours[0]!;
  const [oh = 9, om = 0] = schedule.open.split(":").map(Number);
  const [ch = 21, cm = 0] = schedule.close.split(":").map(Number);
  const isOpen = mins >= oh * 60 + om && mins < ch * 60 + cm;
  return { time, isWeekend, isOpen };
}

/**
 * Chương cuối — Đặt chỗ & ghé thăm (gộp Opening + Booking + Contact cũ).
 * Trái (#booking): lựa chọn đang chọn, 2 kênh đặt lịch.
 * Phải: địa chỉ, giờ mở cửa, liên hệ và bản đồ MapLibre (ghim logo D, chế độ 3D / vệ tinh, một nút chỉ đường).
 */
export function Contact() {
  const { dict } = useDictionary();
  const { selection, selectBooking } = useBookingSelection();
  const [status, setStatus] = useState<PragueStatus | null>(null);
  const b = dict.booking;
  const [mapMode, setMapMode] = useState<MapMode>("3d");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(getPragueStatus());
    const id = setInterval(() => setStatus(getPragueStatus()), 30_000);
    return () => clearInterval(id);
  }, []);

  const service = selection ? `${selection.title} (${selection.meta})` : b.defaultService;
  const whatsappUrl = `${site.whatsapp}?text=${encodeURIComponent(`${b.whatsappPrefill} ${service}`)}`;

  const channels = [
    {
      title: b.whatsapp,
      sub: b.whatsappSub,
      cta: b.whatsappCta,
      href: whatsappUrl,
      external: true,
    },
    { title: b.call, sub: b.callSub, cta: b.callCta, href: telHref, external: false },
  ];

  const statusText = !status
    ? null
    : !isOpened
      ? dict.location.openingSoon
      : status.isOpen
        ? dict.location.openNow
        : dict.location.closedNow;

  return (
    <Section
      id="contact"
      theme="dark"
      fit={false}
      className="bg-ink text-ivory overflow-hidden py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-16">
        {/* Tiêu đề */}
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <SplitReveal
            as="h2"
            type="words"
            className="font-display text-[clamp(2.4rem,4.8vw,5rem)] leading-[0.95] font-normal text-balance md:col-span-7"
          >
            {b.title}
          </SplitReveal>
          <Reveal className="md:col-span-5 md:pb-2">
            <p className="text-ivory/70 text-sm leading-relaxed text-pretty md:text-base">
              {b.lead}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-16 lg:grid-cols-12 lg:gap-16">
          {/* Trái — đặt lịch */}
          <div id="booking" className="scroll-mt-28 lg:col-span-6">
            <AnimatePresence initial={false}>
              {selection && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
                  className="mb-8"
                  aria-live="polite"
                >
                  <p className="font-display text-gold text-base italic">{b.selectedLabel}</p>
                  <p className="font-display mt-1 text-2xl">{selection.title}</p>
                  <div className="mt-1 flex items-center gap-4">
                    <span className="text-ivory/60 text-xs">{selection.meta}</span>
                    <button
                      type="button"
                      onClick={() => selectBooking(null)}
                      className="text-ivory/60 hover:text-gold text-xs transition-colors"
                    >
                      {dict.common.clear}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Reveal stagger={0.1} as="ul" className="flex flex-col gap-3">
              {channels.map((c, i) => {
                const isWa = i === 0;
                return (
                  <li
                    key={c.title}
                    className={cn(
                      "relative overflow-hidden rounded-3xl",
                      // WhatsApp: tấm nền espresso với logo WhatsApp lớn chìm phía sau
                      isWa ? "bg-espresso px-6 sm:px-8" : "px-6 sm:px-8",
                    )}
                  >
                    {isWa && (
                      <WhatsAppIcon className="pointer-events-none absolute -right-8 -bottom-10 size-48 text-[#25D366] opacity-[0.09] sm:size-56" />
                    )}
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group relative flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between lg:py-8"
                    >
                      <span>
                        <span className="font-display group-hover:text-gold block text-[clamp(1.6rem,2.4vw,2.2rem)] leading-tight transition-colors duration-300">
                          {c.title}
                        </span>
                        <span className="text-ivory/60 mt-1.5 block text-sm">{c.sub}</span>
                      </span>
                      {isWa ? (
                        <span
                          className={cn(
                            ctaGold,
                            "shrink-0 bg-[#25D366] text-[#0B1F14] group-hover:bg-[#2EE071] hover:bg-[#2EE071]",
                          )}
                        >
                          <WhatsAppIcon className="size-5" />
                          {c.cta}
                        </span>
                      ) : (
                        <span className={cn(ctaGlass, "group-hover:bg-ivory/[0.18] shrink-0")}>
                          {c.cta}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </Reveal>
          </div>

          {/* Phải — ghé thăm */}
          <div className="flex flex-col lg:col-span-6">
            <p className="text-ivory/70 flex min-h-[1.25rem] flex-wrap items-center gap-x-2 text-[11px] tracking-[0.22em] uppercase">
              {statusText && (
                <>
                  <span>{statusText}</span>
                  <span className="text-ivory/45 tabular-nums">
                    · {dict.location.pragueTime} {status?.time}
                  </span>
                </>
              )}
            </p>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div className="py-2">
                <p className="text-gold text-[10px] tracking-[0.3em] uppercase">
                  {dict.location.address}
                </p>
                <p className="font-display mt-2 text-xl leading-snug">{site.address}</p>
                <div className="mt-3 flex flex-col gap-1.5 text-sm">
                  <a
                    href={telHref}
                    className="hover:text-gold w-fit tabular-nums transition-colors"
                  >
                    {site.phone}
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="hover:text-gold w-fit transition-colors"
                  >
                    {site.email}
                  </a>
                </div>
              </div>

              <div className="py-2">
                <p className="text-gold text-[10px] tracking-[0.3em] uppercase">
                  {dict.location.hours}
                </p>
                <dl className="mt-2">
                  {site.hours.map((h) => {
                    const isToday =
                      status !== null &&
                      ((h.key === "weekend" && status.isWeekend) ||
                        (h.key === "weekdays" && !status.isWeekend));
                    return (
                      <div key={h.key} className="py-1">
                        <dt
                          className={cn(
                            "flex items-center gap-3 text-sm",
                            isToday ? "text-ivory" : "text-ivory/60",
                          )}
                        >
                          {dict.hours[h.key]}
                          {isToday && (
                            <span className="text-gold text-[9px] tracking-[0.26em] uppercase">
                              {dict.common.today}
                            </span>
                          )}
                        </dt>
                        <dd
                          className={cn(
                            "font-display text-xl tabular-nums",
                            isToday ? "text-gold" : "text-ivory/75",
                          )}
                        >
                          {h.open} — {h.close}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Bản đồ toàn chiều ngang (hàng riêng, không để trống cột trái) — MapLibre + OpenFreeMap (màu tự nhiên), ghim logo D, nhãn trên nền tối để luôn đọc rõ */}
        <div className="bg-espresso relative mt-12 h-[460px] w-full overflow-hidden rounded-3xl sm:h-[540px] lg:mt-16 lg:h-[clamp(560px,72vh,760px)]">
          <BrandMap
            center={MAP_CENTER}
            zoom={16.2}
            mode={mapMode}
            label={dict.location.mapTitle}
            pin={
              <div className="pointer-events-none flex flex-col items-center">
                <div className="bg-ink rounded-xl p-2 shadow-[0_6px_20px_rgba(23,18,15,0.35)]">
                  <LogoD tone="gold" className="h-7 w-auto" strandWidth={3} />
                </div>
                <div className="bg-ink h-4 w-0.5" />
                <div className="bg-ink size-2 rounded-full" />
              </div>
            }
            fallback={
              <a
                href={site.mapLink}
                target="_blank"
                rel="noreferrer"
                className="text-ivory/80 hover:text-gold flex size-full items-center justify-center text-sm transition-colors"
              >
                {dict.common.openMaps}
              </a>
            }
          />
          {/* Chế độ xem: 3D (nhà nổi khối, nghiêng) · vệ tinh — kính nổi trên bản đồ */}
          <Segmented
            label={dict.location.mapView}
            layoutId="map-mode"
            value={mapMode}
            onChange={setMapMode}
            options={[
              { key: "3d", label: dict.location.mapModes["3d"] },
              { key: "satellite", label: dict.location.mapModes.satellite },
            ]}
            className="bg-ink/70 absolute top-4 left-4 z-10 md:top-6 md:left-6"
          />
          {/* Nhãn địa danh trên tấm kính tối (nổi trên bản đồ) */}
          <div className="bg-ink/75 pointer-events-none absolute top-4 right-4 rounded-2xl px-5 py-4 text-right backdrop-blur-xl md:top-6 md:right-6">
            <p className="font-display text-ivory text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none">
              {dict.location.district}
            </p>
            <p className="text-ivory/65 mt-2 hidden text-[10px] tracking-[0.2em] tabular-nums sm:block">
              50°05′02″ N · 14°25′26″ E
            </p>
          </div>
          <a
            href={site.mapLink}
            target="_blank"
            rel="noreferrer"
            className={cn(
              ctaDark,
              "absolute bottom-5 left-5 z-10 shadow-[0_6px_20px_rgba(23,18,15,0.3)] md:bottom-6 md:left-6",
            )}
          >
            {b.directionsCta}
          </a>
        </div>
      </div>
    </Section>
  );
}
