import type { Dictionary } from "./en";

/** Čeština — výchozí jazyk webu. Názvy služeb ponecháváme anglicky (běžné v českých barbershopech). */
export const cs: Dictionary = {
  meta: {
    title: "December Barber Shop — Umění gentlemana",
    description:
      "Prémiový barber lounge v Praze: travertin, klasická kožená křesla a barbeři, kterým na vás záleží. Rezervujte si své křeslo ještě dnes.",
  },
  common: {
    book: "Rezervovat",
    menu: "Menu",
    close: "Zavřít",
    skip: "Přeskočit na obsah",
    language: "Jazyk",
    scroll: "Scrollujte",
    view: "Zobrazit",
    est: "Založeno 2026 · Praha",
    tagline: "Umění gentlemana",
  },
  nav: {
    styles: "Střihy",
    menu: "Ceník",
    space: "Prostor",
    experience: "Zážitek",
    testimonials: "Recenze",
    booking: "Rezervace",
    contact: "Kontakt",
  },
  hours: {
    weekdays: "Pondělí — Pátek",
    weekend: "Sobota — Neděle",
    short: "Po–Pá 9:00–21:00 · So–Ne 8:30–21:30",
  },
  preloader: { sub: "Barber Shop" },
  hero: {
    eyebrow: "Barber Shop · Praha · Založeno 2026",
    lead: "Umění gentlemana. Travertin, teplé světlo a barbeři, kterým na vás záleží — místo, kde se každý střih stává rituálem.",
    cta: "Rezervovat",
  },
  styles: {
    eyebrow: "Signature střihy",
    title: "Vlasy na míru vám",
    lead: "Od ostrého skin fade po jemný přirozený styl — každý střih ladíme podle tvaru obličeje, typu vlasů i vašeho životního stylu.",
    cta: "Chci tento střih",
    items: {
      texturedQuiff: { name: "Textured Quiff", tags: "Objem · Skin fade" },
      pompadourFade: { name: "Pompadour Fade", tags: "Klasika · Lesk" },
      frenchCrop: { name: "French Crop", tags: "Krátká ofina · Taper" },
      beardFade: { name: "Beard & Fade", tags: "Plnovous · Přechod" },
      slickBack: { name: "Slick Back", tags: "Undercut · Pomáda" },
      buzzCut: { name: "Buzz Cut", tags: "Čistý · Nenáročný" },
      sidePart: { name: "Gentleman's Part", tags: "Ostrá pěšinka · Nadčasový" },
      modernTaper: { name: "Modern Taper", tags: "Přirozený · Mid fade" },
      naturalFlow: { name: "Natural Flow", tags: "Délka · Textura" },
    },
  },
  features: {
    label: "Signature",
    of: "z",
    hold: "Fixace",
    maintenance: "Údržba",
    faces: "Sluší",
    duration: "V křesle",
    cta: "Chci tento střih",
    items: {
      texturedQuiff: {
        kicker: "Objem s charakterem",
        description:
          "Zvednutá matná textura nahoře a ostrý skin fade po stranách. Ležérní přes den, elegantní večer — stylováno jílem pro přirozený vzhled.",
        hold: "Střední · Matná",
        maintenance: "Každé 3–4 týdny",
        faces: "Oválný, kulatý, hranatý",
        duration: "45 min",
      },
      modernTaper: {
        kicker: "Přirozený, nikdy obyčejný",
        description:
          "Jemná textura nahoře plynule přechází do mid fade. Hezky dorůstá a hodí se od pondělní porady po víkendový útěk.",
        hold: "Lehká · Přirozená",
        maintenance: "Každé 4 týdny",
        faces: "Oválný, protáhlý, srdcovitý",
        duration: "45 min",
      },
      beardFade: {
        kicker: "Vousy a vlasy v jedné linii",
        description:
          "Plnovous vytvarovaný tak, aby plynule navazoval na přechod — ostré linie na tvářích a zakončení horkým ručníkem.",
        hold: "Přirozená",
        maintenance: "Každé 2–3 týdny",
        faces: "Kulatý, oválný, srdcovitý",
        duration: "75 min",
      },
      slickBack: {
        kicker: "Uhlazená sebejistota",
        description:
          "Delší vlasy nahoře sčesané dozadu nad výrazným undercutem. Lesk pomády na jednání i pozdní večeře.",
        hold: "Pevná · Mokrý efekt",
        maintenance: "Každé 4 týdny",
        faces: "Oválný, hranatý",
        duration: "45 min",
      },
      naturalFlow: {
        kicker: "Délka se záměrem",
        description:
          "Delší vlasy tvarované pouze nůžkami — odlehčení, pohyb a žádné tvrdé linie. Pro muže, kteří si vlasy nechávají růst schválně.",
        hold: "Lehká · Mořská sůl",
        maintenance: "Každých 6–8 týdnů",
        faces: "Oválný, hranatý, protáhlý",
        duration: "60 min",
      },
    },
  },
  menu: {
    eyebrow: "Ceník",
    title: "Služby a ceny",
    lead: "Každá návštěva zahrnuje konzultaci, horký ručník a uvítací drink.",
    signature: "Doporučujeme",
    minutes: "min",
    onRequest: "Na dotaz",
    categories: { all: "Vše", cut: "Střihy", beard: "Vousy a holení", care: "Péče a rituály" },
    items: {
      "signature-cut": {
        name: "Signature Cut",
        description: "Konzultace, precizní střih, mytí a finální styling.",
      },
      "skin-fade": {
        name: "Skin Fade",
        description: "Plynulý přechod od kůže do délky, ostré kontury.",
      },
      "buzz-cut": { name: "Buzz Cut", description: "Střih strojkem s čistým obrysem břitvou." },
      "junior-cut": { name: "Junior Cut", description: "Pro mladé gentlemany do 12 let." },
      "beard-sculpt": {
        name: "Beard Sculpting",
        description: "Zastřižení, tvarování a vyživující olej na vousy.",
      },
      "hot-towel-shave": {
        name: "Hot Towel Shave",
        description: "Holení břitvou s horkými ručníky a péčí po holení.",
      },
      "cut-and-beard": {
        name: "Cut & Beard",
        description: "Signature Cut spolu s kompletní úpravou vousů.",
      },
      "head-spa": {
        name: "Relax Head Spa",
        description: "Pečující mytí s masáží hlavy, šíje a ramen.",
      },
      colour: {
        name: "Colour & Tone",
        description: "Krytí šedin, melír nebo tónování — individuální konzultace.",
      },
      "december-ritual": {
        name: "The December Ritual",
        description: "Střih, holení s horkým ručníkem, head spa a drink — kompletní zážitek.",
      },
    },
  },
  experience: {
    eyebrow: "Zážitek",
    title: "Zpomalte. Nechte se hýčkat.",
    items: [
      {
        title: "Osobní konzultace",
        text: "Každý střih začíná rozhovorem — o tvaru obličeje, typu vlasů i vašem životním rytmu.",
      },
      {
        title: "Horký ručník a oleje",
        text: "Klasický rituál holení s horkými ručníky, ručně šlehanou pěnou a péčí po holení.",
      },
      {
        title: "Zelený kout",
        text: "Hluboce sklopná mycí křesla u živé stěny, teplá voda a masáž hlavy, šíje a ramen.",
      },
      {
        title: "Lounge",
        text: "Sametové sezení, uvítací drink a prostor dost tichý na to, abyste si opravdu odpočinuli.",
      },
    ],
    stats: [
      "Barberských křesel",
      "Relaxační mycí křesla",
      "Sterilizované nástroje",
      "Průměrné hodnocení",
    ],
  },
  space: {
    eyebrow: "Prostor",
    title: "Lounge, ne jen holičství.",
    hint: "Travertin, kůže a zeleň. Klepnutím obrázek zvětšíte.",
  },
  testimonials: {
    eyebrow: "Řekli o nás",
    ticker: "Cut · Shave · Ritual",
    items: [
      {
        role: "Stálý klient",
        quote:
          "Prostor jako hotelový lounge. Barber se mnou vše probral a střih je naprosto přesný.",
      },
      {
        role: "Architekt",
        quote: "Travertin, teplé světlo, kožená křesla — každý detail tu má smysl.",
      },
      {
        role: "Podnikatel",
        quote: "Holení s horkým ručníkem je nejklidnějších třicet minut mého týdne.",
      },
      {
        role: "Fotograf",
        quote: "Head spa je neuvěřitelné. Pokaždé odcházím upravený a odpočatý.",
      },
      {
        role: "Stálý klient",
        quote: "Rychlá rezervace, přesně na čas, žádné čekání. Stojí to za každou korunu.",
      },
    ],
  },
  booking: {
    eyebrow: "Rezervace",
    title: "Vaše křeslo už čeká.",
    lead: "Rezervujte si předem, abychom vše připravili přesně pro vás. Online rezervace již brzy.",
    call: "Zavolat",
    whatsapp: "WhatsApp",
    whatsappSub: "Odpovídáme během pár minut",
    directions: "Navigovat",
    directionsSub: "Google Maps",
  },
  location: {
    eyebrow: "Návštěva",
    title: "Kde nás najdete",
    address: "Adresa",
    hours: "Otevírací doba",
    mapTitle: "Mapa — December Barber Shop",
  },
  footer: {
    explore: "Prozkoumat",
    follow: "Sledujte nás",
    contact: "Kontakt",
    rights: "Všechna práva vyhrazena",
  },
  images: {
    reception: "Recepce December Barber Shop s policemi produktů a svítícím logem",
    floor: "Hnědá kožená barberská křesla pod odhaleným technickým stropem",
    chair: "Klasické hnědé kožené křeslo u recepce",
    washCorner: "Relaxační mycí kout s kulatou živou zelenou stěnou",
    washLounge: "Mycí křesla a čekací zóna se sametovým křeslem",
    lounge: "Čekací lounge s křeslem, konferenčním stolkem a květináči",
    stations: "Řada klenutých podsvícených zrcadel a barberských křesel",
    overview: "Celkový pohled: barberská křesla, zeleň a mycí zóna",
  },
  notFound: {
    text: "Stránka, kterou hledáte, neexistuje.",
    back: "Zpět na úvod",
  },
};
