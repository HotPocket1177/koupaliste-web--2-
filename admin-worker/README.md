# Admin — výjimečná zavření

Malý Cloudflare Worker, který slouží admin stránku (kalendář s výjimečnými
zavřeními) a na uložení commitne změnu do `koupaliste-web/src/data/vyjimky.json`
v hlavním repu přes GitHub API. Web se pak přebuildí stejnou GitHub Actions
akcí jako dnes (~1–2 minuty).

Žádná databáze, žádný vlastní server — jen tenhle Worker (Cloudflare má
štědrý free tier, na tohle použití nikdy nedosáhneš na placení).

## Jednorázové nastavení

1. **Cloudflare účet** — založ zdarma na https://dash.cloudflare.com/sign-up
   (stačí email, není potřeba mít u nich doménu).

2. **GitHub token** — na https://github.com/settings/tokens?type=beta vytvoř
   *fine-grained personal access token*:
   - Repository access → jen `HotPocket1177/koupaliste-web--2-`
   - Permissions → Contents → **Read and write**
   - Nastav si expiraci klidně na "No expiration" nebo si termín připomeň,
     ať to nespadne rok od teď bez varování.
   - Zkopíruj vygenerovaný token (zobrazí se jen jednou).

3. **Instalace nástrojů** (v tomhle adresáři `admin-worker/`):
   ```
   npm install
   npx wrangler login
   ```
   Otevře se prohlížeč, přihlas se svým Cloudflare účtem.

4. **Tajné hodnoty** (nikdy nejdou do gitu, jen do Cloudflare):
   ```
   npx wrangler secret put GITHUB_TOKEN
   ```
   vlož token z kroku 2.
   ```
   npx wrangler secret put ADMIN_PASSWORD
   ```
   vymysli heslo, které budou používat oba správci.

5. **Nasazení:**
   ```
   npx wrangler deploy
   ```
   Wrangler vypíše URL typu `https://koupaliste-admin.<tvůj-subdomain>.workers.dev`
   — to je adresa admin stránky. Dej ji oběma lidem, co budou otevíračku
   spravovat (klidně si ji uložit jako záložku na mobilu).

## Aktualizace později

Po jakékoli změně v `src/index.js` stačí znovu spustit `npx wrangler deploy`.
Sdílené heslo nebo GitHub token změníš opětovným `wrangler secret put`.

## Jak to funguje za běhu

1. Admin otevře stránku, zadá sdílené heslo (uloží se jen v `sessionStorage`
   prohlížeče, ne natrvalo).
2. Klikáním na dny v kalendáři si připraví změny (přidání/odebrání
   výjimečného zavření) — zatím lokálně, nic se neukládá.
3. Kliknutím na **Uložit změny** pošle Worker jeden request na GitHub API,
   který přečte aktuální `vyjimky.json`, nahradí ho novým seznamem a
   commitne. Ať admin škrtne přes kalendář deset dní, je to pořád jeden commit.
4. GitHub Actions (stejná automatizace jako dnes) build spustí a nasadí —
   do ~1–2 minut je změna vidět na `koupaliste.volkovic.cz`.

## Bezpečnostní poznámky

- Heslo je sdílené a posílá se při každém uložení — funguje to přes HTTPS,
  ale je to nejjednodušší možná varianta, ne bankovní zabezpečení. Pro dva
  lidi spravující otevíračku kiosku je to přiměřené.
- Worker sám nemá přístup k ničemu jinému v repu než k jednomu souboru
  (`vyjimky.json`) — je to jediné, co umí měnit.
