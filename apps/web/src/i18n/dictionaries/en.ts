/**
 * English dictionary — the source of truth for the dictionary shape.
 * `cs.ts` must implement the same `Dictionary` type (TypeScript enforces it).
 */
export const en = {
  meta: {
    title: "December Barber Shop — The Art of the Gentleman",
    description:
      "A premium barber lounge in Prague: travertine stone, vintage leather chairs and barbers who care. Book your chair today.",
  },
  common: {
    book: "Book a chair",
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
    language: "Language",
    scroll: "Scroll",
    view: "View",
    est: "Est. 2026 · Prague",
    tagline: "The art of the gentleman",
  },
  nav: {
    styles: "Styles",
    menu: "Menu",
    space: "Space",
    experience: "Experience",
    testimonials: "Reviews",
    booking: "Booking",
    contact: "Contact",
  },
  hours: {
    weekdays: "Monday — Friday",
    weekend: "Saturday — Sunday",
    short: "Mon–Fri 9:00–21:00 · Sat–Sun 8:30–21:30",
  },
  preloader: { sub: "Barber Shop" },
  hero: {
    eyebrow: "Barber Shop · Prague · Est. 2026",
    lead: "The art of the gentleman. Travertine stone, warm light and barbers who care — where every cut becomes a ritual.",
    cta: "Book now",
  },
  styles: {
    eyebrow: "Signature styles",
    title: "Hair, crafted to you",
    lead: "From a sharp skin fade to a soft natural flow — every style is tailored to your face shape, hair type and the way you live.",
    cta: "Book this style",
    items: {
      texturedQuiff: { name: "Textured Quiff", tags: "Volume · Skin fade" },
      pompadourFade: { name: "Pompadour Fade", tags: "Classic · High shine" },
      frenchCrop: { name: "French Crop", tags: "Short fringe · Taper" },
      beardFade: { name: "Beard & Fade", tags: "Full beard · Blend" },
      slickBack: { name: "Slick Back", tags: "Undercut · Pomade" },
      buzzCut: { name: "Buzz Cut", tags: "Clean · Low maintenance" },
      sidePart: { name: "Gentleman's Part", tags: "Hard part · Timeless" },
      modernTaper: { name: "Modern Taper", tags: "Natural · Mid fade" },
      naturalFlow: { name: "Natural Flow", tags: "Length · Texture" },
    },
  },
  features: {
    label: "Signature",
    of: "of",
    hold: "Hold",
    maintenance: "Upkeep",
    faces: "Best for",
    duration: "In the chair",
    cta: "Book this style",
    items: {
      texturedQuiff: {
        kicker: "Volume with attitude",
        description:
          "Lifted, matte texture on top over a crisp skin fade. Effortless by day, sharp by night — styled with clay for a natural finish.",
        hold: "Medium · Matte",
        maintenance: "Every 3–4 weeks",
        faces: "Oval, round, square",
        duration: "45 min",
      },
      modernTaper: {
        kicker: "Natural, never ordinary",
        description:
          "Soft texture on top tapering cleanly to a mid fade. Grows out gracefully and works from Monday meetings to weekend escapes.",
        hold: "Light · Natural",
        maintenance: "Every 4 weeks",
        faces: "Oval, long, heart",
        duration: "45 min",
      },
      beardFade: {
        kicker: "Beard and hair, one line",
        description:
          "A full beard sculpted to flow seamlessly into the fade — razor-sharp cheek lines and hot-towel finish.",
        hold: "Natural",
        maintenance: "Every 2–3 weeks",
        faces: "Round, oval, heart",
        duration: "75 min",
      },
      slickBack: {
        kicker: "Polished confidence",
        description:
          "Length on top combed straight back over a disconnected undercut. Pomade shine for boardrooms and late dinners.",
        hold: "Firm · Wet look",
        maintenance: "Every 4 weeks",
        faces: "Oval, square",
        duration: "45 min",
      },
      naturalFlow: {
        kicker: "Length with intention",
        description:
          "Shoulder-grazing length shaped with scissors only — weight removed, movement added, no harsh lines. For men who grow it out on purpose.",
        hold: "Light · Sea-salt",
        maintenance: "Every 6–8 weeks",
        faces: "Oval, square, long",
        duration: "60 min",
      },
    },
  },
  menu: {
    eyebrow: "The menu",
    title: "Services & prices",
    lead: "Every visit includes a consultation, a hot towel and a welcome drink.",
    signature: "Signature",
    minutes: "min",
    onRequest: "On request",
    categories: { all: "All", cut: "Haircuts", beard: "Beard & Shave", care: "Care & Rituals" },
    items: {
      "signature-cut": {
        name: "Signature Cut",
        description: "Consultation, precision cut, wash and finishing style.",
      },
      "skin-fade": {
        name: "Skin Fade",
        description: "Seamless fade from skin to length, sharp line-up.",
      },
      "buzz-cut": {
        name: "Buzz Cut",
        description: "Clipper cut all over with a clean razor outline.",
      },
      "junior-cut": { name: "Junior Cut", description: "For young gentlemen up to 12 years." },
      "beard-sculpt": {
        name: "Beard Sculpting",
        description: "Trim, shape and nourishing beard oil.",
      },
      "hot-towel-shave": {
        name: "Hot Towel Shave",
        description: "Straight-razor shave with hot towels and after-shave care.",
      },
      "cut-and-beard": {
        name: "Cut & Beard",
        description: "Signature Cut together with full beard sculpting.",
      },
      "head-spa": {
        name: "Relax Head Spa",
        description: "Nourishing wash with a head, neck and shoulder massage.",
      },
      colour: {
        name: "Colour & Tone",
        description: "Grey blending, highlights or toning — tailored consultation.",
      },
      "december-ritual": {
        name: "The December Ritual",
        description: "Cut, hot towel shave, head spa and a drink — the full experience.",
      },
    },
  },
  experience: {
    eyebrow: "Experience",
    title: "Slow down. Be looked after.",
    items: [
      {
        title: "Personal consultation",
        text: "Every cut begins with a conversation — your face, your hair, the rhythm of your life.",
      },
      {
        title: "Hot towel & oils",
        text: "The classic shaving ritual with hot towels, hand-whipped lather and after-shave care.",
      },
      {
        title: "The green corner",
        text: "Deep-reclining wash chairs by the living wall, warm water and a head, neck and shoulder massage.",
      },
      {
        title: "Lounge",
        text: "Velvet seating, a welcome drink and a space quiet enough to truly rest.",
      },
    ],
    stats: ["Barber chairs", "Relax wash chairs", "Sterilised tools", "Average rating"],
  },
  space: {
    eyebrow: "The space",
    title: "A lounge, not just a barbershop.",
    hint: "Travertine, leather and greenery. Tap any image to enlarge.",
  },
  testimonials: {
    eyebrow: "Kind words",
    ticker: "Cut · Shave · Ritual",
    items: [
      {
        role: "Regular client",
        quote:
          "It feels like a hotel lounge. My barber talked everything through and the cut is spot on.",
      },
      {
        role: "Architect",
        quote: "Travertine, warm light, leather chairs — every detail here is intentional.",
      },
      {
        role: "Entrepreneur",
        quote: "The hot towel shave is the calmest thirty minutes of my week.",
      },
      {
        role: "Photographer",
        quote: "The head spa is incredible. I always leave sharper and fully rested.",
      },
      {
        role: "Regular client",
        quote: "Quick booking, right on time, no waiting. Worth every crown.",
      },
    ],
  },
  booking: {
    eyebrow: "Reservations",
    title: "Your chair is waiting.",
    lead: "Book ahead so we can prepare everything for you. Online booking is coming soon.",
    call: "Call to book",
    whatsapp: "WhatsApp",
    whatsappSub: "We reply within minutes",
    directions: "Directions",
    directionsSub: "Google Maps",
  },
  location: {
    eyebrow: "Visit",
    title: "Find us",
    address: "Address",
    hours: "Opening hours",
    mapTitle: "Map — December Barber Shop",
  },
  footer: {
    explore: "Explore",
    follow: "Follow",
    contact: "Contact",
    rights: "All rights reserved",
  },
  images: {
    reception: "December Barber Shop reception with product shelves and illuminated sign",
    floor: "Brown leather barber chairs under an exposed technical ceiling",
    chair: "Vintage brown leather barber chair by the reception",
    washCorner: "Relaxing wash corner with a round living green wall",
    washLounge: "Wash chairs and a waiting area with a velvet armchair",
    lounge: "Waiting lounge with armchair, coffee table and planters",
    stations: "Row of arched backlit mirrors and barber chairs",
    overview: "Overview of the shop: barber chairs, greenery and wash area",
  },
  notFound: {
    text: "The page you are looking for does not exist.",
    back: "Back to home",
  },
};

export type Dictionary = typeof en;
