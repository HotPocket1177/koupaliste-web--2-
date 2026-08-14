// ─────────────────────────────────────────────────────────────
//  OBSAH WEBU — vše na jednom místě.
//  Uprav hodnoty níže; není třeba sahat do vzhledu ani kódu stránek.
// ─────────────────────────────────────────────────────────────

export const site = {
  nazev: 'Kiosek koupaliště',
  podtitul: 'Teplice nad Metují',
  odRoku: 1931,
  slogan: 'Občerstvení u vody, jak má být.',

  kontakt: {
    telefon: '+420 777 595 457',
    telefonHref: 'tel:+420777595457',
    email: 'koupaliste@volkovic.cz',
    adresaRadky: ['Rooseveltova', '549 57 Teplice nad Metují', 'okres Náchod'],
    mapaUrl: 'https://mapy.com/s/pehacogata',
  },

  site: {
    facebook: 'https://www.facebook.com/koupalistetnm',
    instagram: 'https://www.instagram.com/',
    firmy: 'https://www.firmy.cz/detail/14047340-kiosek-koupaliste-pavel-volk-teplice-nad-metuji.html',
  },

  // ─────────────────────────────────────────────────────────────
  //  PRÁVNÍ INFORMACE — obsah okénka otevíraného tlačítkem v hlavičce.
  // ─────────────────────────────────────────────────────────────
  pravni: {
    provozovatel: {
      jmeno: 'Pavel Volk',
      ico: '60911204',
      sidlo: 'Spojenecká 61, 541 01 Trutnov – Střední Předměstí',
      poznamka: 'Podnikatel je zapsán v živnostenském rejstříku. Příslušný živnostenský úřad: Městský úřad Trutnov.',
    },
    provozovna: {
      nazev: 'Kiosek koupaliště',
      adresaRadky: ['Koupaliště Teplice nad Metují', '549 57 Teplice nad Metují'],
      idProvozovny: '1016230711',
      poznamka: 'Provozovna je vedena pro hostinskou činnost a prodej kvasného lihu, konzumního lihu a lihovin. Zahájení provozování je ve výpisu uvedeno 27. 6. 2026.',
      vypisUrl: '/dokumenty/vypis-zivnostensky-rejstrik.pdf',
    },
    mimosoudniUvod: 'V případě, že mezi provozovatelem a spotřebitelem vznikne spotřebitelský spor z kupní smlouvy nebo ze smlouvy o poskytování služeb, který se nepodaří vyřešit vzájemnou dohodou, může spotřebitel podat návrh na mimosoudní řešení spotřebitelského sporu u příslušného subjektu:',
    coi: {
      nazev: 'Česká obchodní inspekce',
      oddeleni: 'Ústřední inspektorát – oddělení ADR',
      adresaRadky: ['Gorazdova 1969/24', '120 00 Praha 2'],
      email: 'adr@coi.gov.cz',
      url: 'https://coi.gov.cz/informace-o-adr/',
    },
    ochranaSoukromi: 'Tyto webové stránky neshromažďují osobní údaje návštěvníků a nepoužívají analytické ani marketingové cookies.',
  },

  otevirka: {
    poznamka: 'Provoz je sezónní a závisí na počasí. Aktuální info sledujte na Facebooku.',
    dny: [
      { den: 'Pondělí', od: '11:00', do: '18:00' },
      { den: 'Úterý',   od: '11:00', do: '18:00' },
      { den: 'Středa',  od: '11:00', do: '18:00' },
      { den: 'Čtvrtek', od: '11:00', do: '18:00' },
      { den: 'Pátek',   od: '11:00', do: '18:00' },
      { den: 'Sobota',  od: '11:00', do: '18:00' },
      { den: 'Neděle',  od: '11:00', do: '18:00' },
    ],
    // Konkrétní dny, kdy je výjimečně zavřeno (bez ohledu na běžnou otevírací dobu).
    vyjimky: ['2026-08-17', '2026-08-18', '2026-08-19'],
  },

  nabidka: [
    {
      nadpis: 'Výběrová káva Volkafe',
      popis: 'Čerstvě pražená zrna od naší pražírny. Espresso, filtr i ledová na horké dny.',
      znacka: 'Volkafe',
      znackaUrl: 'https://volkafe.cz/',
    },
    {
      nadpis: 'Čepované pivo Opat',
      popis: 'Broumovský ležák z pivovaru Opat. Vychlazený, do plastu, k vodě ideál.',
      znacka: 'Pivovar Opat',
    },
    {
      nadpis: 'Nanuky',
      popis: 'Osvěžení do ruky na horké dny. Ideální k vodě.',
      znacka: null,
    },
    {
      nadpis: 'Limonády a míchané nápoje',
      popis: 'Točené limonády Nektar Natura a míchané nápoje. Třeba Aperol, Hugo, gin & tonic a další.',
      znacka: null,
    },
    {
      nadpis: 'Jídlo a dezerty',
      popis: 'Jídlo z vlastní výroby – například sekaná s čedarem v máslové housce nebo hranolky s čedarem a slaninou. A na sladkou tečku? Dezerty z vlastní výroby, které se průběžně obměňují.',
      znacka: null,
    },
  ],

  vybaveni: [
    'Platba kartou',
    'Bezbariérové',
    'Dětský koutek',
    'Cyklisté vítáni',
    'Parkoviště',
    'Wi-Fi',
    'Zahrádka',
    'Family friendly',
  ],

  // ─────────────────────────────────────────────────────────────
  //  AKCE — sekce se na webu zobrazí jen když je tu aspoň jedna akce,
  //  která ještě neproběhla. Proběhlé akce se automaticky skryjí.
  //
  //  datum:  'RRRR-MM-DD' (povinné, podle něj se řadí a skrývají staré)
  //  cas:    volitelně, např. '18:00' nebo '14:00–22:00'
  //  fbUrl:  volitelně, odkaz na událost na Facebooku (ručně zkopíruj z FB)
  //
  //  Chceš-li sekci dočasně vypnout, smaž obsah pole: akce: []
  // ─────────────────────────────────────────────────────────────
  akcePravidelne: {
    text: 'Sobotní ranní cvičení s Martinou Chrástkovou — každou sobotu 8:00–9:00 (120 Kč), do konce srpna. Protáhneme tělo. Skočíme do vody. Dáme kafe.',
    banner: '/akce/sobotni-rano-martina.png',
  },

  akce: [
    {
      nazev: 'Putovní kino: Bardotky',
      datum: '2026-08-12',
      cas: '21:00',
      popis: 'Vstupné 150 Kč, občerstvení zajištěno. Začátek promítání po setmění. Deky a dobrou náladu s sebou.',
      fbUrl: null,
      banner: '/akce/putovni-kino-bardotky.jpg',
    },
    {
      nazev: 'Portal Pockets',
      datum: '2026-08-12',
      cas: '16:00–17:00',
      popis: 'Na konci letního dne studentská rocková kapela na koupališti.',
      fbUrl: null,
      banner: '/akce/portal-pockets.jpg',
    },
    {
      nazev: 'Na konci letního dne — 1. večer',
      datum: '2026-07-14',
      cas: '17:00',
      popis: 'Vyprávění paní Miroslavy Moravcové: Jak pramen Antoníček přivedl lidi ke koupání.',
      fbUrl: null,
    },
    {
      nazev: 'Putovní kino: Někdo to rád v Plzni',
      datum: '2026-07-15',
      cas: '21:30',
      popis: 'Promítání po setmění. Vstupné 100 Kč, občerstvení zajištěno v kiosku. Deky a dobrou náladu s sebou.',
      fbUrl: null,
    },
    {
      nazev: 'CHICO — žhavé rytmy flamenca',
      datum: '2026-07-17',
      cas: '17:00',
      popis: 'Na konci letního dne flamenco trio na terase kiosku. Vstupné dobrovolné.',
      fbUrl: null,
    },
    {
      nazev: 'Café Baret',
      datum: '2026-07-23',
      cas: '17:00',
      popis: 'Na konci letního dne živá hudba na terase Teplického koupaliště.',
      fbUrl: null,
    },
    {
      nazev: 'Na konci letního dne — 2. večer',
      datum: '2026-07-28',
      cas: '17:30',
      popis: 'Vyprávění M. Moravcové: Osobnosti Teplic nad Metují do roku 1945.',
      fbUrl: null,
    },
    {
      nazev: 'Amatérský turnaj v KUBBU',
      datum: '2026-08-02',
      cas: 'od 13:00',
      popis: 'Není potřeba umět hrát, stačí se netvářit moc důležitě. Přijďte si zahrát nebo jen fandit.',
      fbUrl: null,
    },
    {
      nazev: 'Putovní kino: POBERTA',
      datum: '2026-08-05',
      cas: '21:00',
      popis: 'Promítání po setmění. Vstupné 100 Kč, občerstvení zajištěno v kiosku. Deky a dobrou náladu s sebou.',
      fbUrl: null,
    },
    {
      nazev: 'The Craic — v irském stylu',
      datum: '2026-08-06',
      cas: '16:00',
      popis: 'Na konci letního dne tentokrát irsky. Živá hudba na Teplickém koupališti.',
      fbUrl: null,
    },
    {
      nazev: 'Ty skály znáš',
      datum: '2026-08-11',
      cas: '17:30',
      popis: 'Vyprávění Miroslavy Moravcové o skalách, které máme za humny a přesto je neznáme.',
      fbUrl: null,
      banner: '/akce/ty-skaly-znas.jpg',
    },
    {
      nazev: 'Krvesay',
      datum: '2026-08-20',
      cas: 'od 17:00',
      popis: 'Na konci letního dne country, folk a big beat. Vstupné dobrovolné. V případě deště se akce nekoná.',
      fbUrl: null,
      banner: '/akce/krvesay.jpg',
    },
    {
      nazev: 'Skalní hrady a jejich příběhy',
      datum: '2026-08-25',
      cas: '17:30',
      popis: 'Proč vznikly právě tady, kdo je obýval a kdo na nich možná straší dodnes. Vypráví Miroslava Moravcová.',
      fbUrl: null,
      banner: '/akce/skalni-hrady.png',
    },
  ],
};
