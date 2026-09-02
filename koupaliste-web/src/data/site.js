// ─────────────────────────────────────────────────────────────
//  OBSAH WEBU — vše na jednom místě.
//  Uprav hodnoty níže; není třeba sahat do vzhledu ani kódu stránek.
// ─────────────────────────────────────────────────────────────

// Rozvrh, výjimečná zavření a akce se editují přes admin (admin-worker/),
// který zapisuje přímo do těchto souborů přes GitHub API. Ruční úprava funguje taky.
import dny from './rozvrh.json';
import vyjimky from './vyjimky.json';
import akce from './akce.json';
import akcePravidelne from './akce-pravidelne.json';

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
    // Týdenní rozvrh. Zdroj: src/data/rozvrh.json (viz admin-worker/ pro editaci přes web).
    dny,
    // Konkrétní dny, kdy je výjimečně zavřeno (bez ohledu na běžnou otevírací dobu).
    // Zdroj: src/data/vyjimky.json (viz admin-worker/ pro editaci přes web).
    vyjimky,
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
  //  která ještě neproběhla, nebo aspoň jedna stálá (opakující se) akce.
  //  Proběhlé akce s datem se automaticky skryjí do archivu.
  //  Zdroj: src/data/akce.json (s datem) a src/data/akce-pravidelne.json
  //  (opakující se) — viz admin-worker/ pro editaci přes web.
  // ─────────────────────────────────────────────────────────────
  akcePravidelne,
  akce,
};
