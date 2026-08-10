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
      nadpis: 'Zmrzlina',
      popis: 'Točená i kopečková. Klasika, po které se každé léto zapráší.',
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
  akce: [
    {
      nazev: 'Letní zahájení sezóny',
      datum: '2026-06-01',
      cas: 'od 11:00',
      popis: 'Otevíráme koupaliště! První limonáda pro děti zdarma a čerstvá káva Volkafe za zaváděcí cenu.',
      fbUrl: null,
    },
    {
      nazev: 'Večer u vody s živou hudbou',
      datum: '2026-07-18',
      cas: '18:00–22:00',
      popis: 'Akustický set místní kapely, čepované pivo Opat a grilování na zahrádce. Vstup zdarma.',
      fbUrl: null,
    },
    {
      nazev: 'Dětské odpoledne',
      datum: '2026-08-15',
      cas: '14:00–18:00',
      popis: 'Soutěže, zmrzlina a hry pro nejmenší. Přijďte si užít odpoledne k vodě.',
      fbUrl: null,
    },
  ],
};
