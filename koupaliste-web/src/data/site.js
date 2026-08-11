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
  },

  nabidka: [
    {
      nadpis: 'Výběrová káva Volkafe',
      popis: 'Čerstvě pražená zrna od naší pražírny. Espresso, filtr i ledová na horké dny.',
      znacka: 'Volkafe',
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
      popis: 'Domácí limonády, nealko koktejly a osvěžení pro dospělé i děti.',
      znacka: null,
    },
    {
      nadpis: 'Dezerty a drobné občerstvení',
      popis: 'Něco sladkého ke kávě i něco slaného k pivu. Malé chody na zahánění hladu.',
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
  akcePravidelne: 'Sobotní ranní cvičení s Martinou — každou sobotu 8:00–9:00 (120 Kč), do konce srpna. Protáhneme tělo, smočíme do vody, dáme kafe.',

  akce: [
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
      popis: 'Na konci letního dne: flamenco trio na terase kiosku. Vstupné dobrovolné.',
      fbUrl: null,
    },
    {
      nazev: 'Café Baret',
      datum: '2026-07-23',
      cas: '17:00',
      popis: 'Na konci letního dne: živá hudba na terase Teplického koupaliště.',
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
    },
  ],
};
