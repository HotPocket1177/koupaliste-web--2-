// Admin pro "Kiosek koupaliště" — spravuje výjimečná zavření (src/data/vyjimky.json
// v hlavním repu) přes GitHub Contents API. Žádná databáze, žádný server — jen
// tenhle Cloudflare Worker, který drží GitHub token jako tajemství a commituje
// jménem "koupaliste-admin".

const REPO_OWNER = 'HotPocket1177';
const REPO_NAME = 'koupaliste-web--2-';
const FILE_PATH = 'koupaliste-web/src/data/vyjimky.json';
const ROZVRH_FILE_PATH = 'koupaliste-web/src/data/rozvrh.json';
const BRANCH = 'master';
const GITHUB_API = 'https://api.github.com';
const DEN_NAZVY = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function decodeBase64(b64) {
  const binary = atob(b64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

async function githubFetch(path, env, options = {}) {
  return fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'koupaliste-admin-worker',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
}

async function readJsonFile(env, path) {
  const res = await githubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`, env);
  if (!res.ok) throw new Error(`GitHub čtení selhalo (${res.status})`);
  const data = await res.json();
  return { value: JSON.parse(decodeBase64(data.content)), sha: data.sha };
}

async function writeJsonFile(env, path, value, sha, message) {
  const content = encodeBase64(`${JSON.stringify(value, null, 2)}\n`);
  const res = await githubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, env, {
    method: 'PUT',
    body: JSON.stringify({ message, content, sha, branch: BRANCH }),
  });
  if (!res.ok) throw new Error(`GitHub zápis selhal (${res.status}): ${await res.text()}`);
}

async function readExceptions(env) {
  const { value, sha } = await readJsonFile(env, FILE_PATH);
  return { dates: value, sha };
}

async function writeExceptions(env, dates, sha) {
  const sorted = [...new Set(dates)].sort();
  await writeJsonFile(env, FILE_PATH, sorted, sha, 'Admin: aktualizace výjimečných zavření');
  return sorted;
}

async function readRozvrh(env) {
  const { value, sha } = await readJsonFile(env, ROZVRH_FILE_PATH);
  return { days: value, sha };
}

async function writeRozvrh(env, days, sha) {
  await writeJsonFile(env, ROZVRH_FILE_PATH, days, sha, 'Admin: aktualizace týdenního rozvrhu');
  return days;
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

function isValidRozvrh(days) {
  return (
    Array.isArray(days) &&
    days.length === 7 &&
    days.every(
      (d, i) =>
        d &&
        d.den === DEN_NAZVY[i] &&
        TIME_RE.test(d.od) &&
        TIME_RE.test(d.do) &&
        typeof d.zavreno === 'boolean',
    )
  );
}

// ── Rate limiting hesla ──
// 5 chybných pokusů z jedné IP -> 15 minut blokace. Stav se drží v KV
// (RATE_LIMIT binding), protože Worker běží na více edge lokacích a
// paměť v procesu by se mezi nimi nesdílela.
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;

function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

async function isLockedOut(env, ip) {
  const raw = await env.RATE_LIMIT.get(`rl:${ip}`);
  if (!raw) return false;
  const data = JSON.parse(raw);
  return data.count >= MAX_ATTEMPTS;
}

async function recordFailedAttempt(env, ip) {
  const key = `rl:${ip}`;
  const raw = await env.RATE_LIMIT.get(key);
  const data = raw ? JSON.parse(raw) : { count: 0 };
  data.count += 1;
  await env.RATE_LIMIT.put(key, JSON.stringify(data), { expirationTtl: LOCKOUT_SECONDS });
}

async function clearAttempts(env, ip) {
  await env.RATE_LIMIT.delete(`rl:${ip}`);
}

const LOCKOUT_MESSAGE = 'Příliš mnoho chybných pokusů. Zkus to znovu za 15 minut.';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ip = clientIp(request);

    if (request.method === 'GET' && url.pathname === '/') {
      return new Response(ADMIN_HTML, { headers: { 'content-type': 'text/html; charset=utf-8' } });
    }

    if (request.method === 'POST' && url.pathname === '/api/verify') {
      if (await isLockedOut(env, ip)) {
        return json({ ok: false, error: LOCKOUT_MESSAGE }, 429);
      }
      const body = await request.json().catch(() => ({}));
      const ok = body.password === env.ADMIN_PASSWORD;
      if (ok) await clearAttempts(env, ip);
      else await recordFailedAttempt(env, ip);
      return json({ ok });
    }

    if (request.method === 'GET' && url.pathname === '/api/exceptions') {
      try {
        const { dates } = await readExceptions(env);
        return json({ dates });
      } catch (e) {
        return json({ error: String(e.message ?? e) }, 500);
      }
    }

    if (request.method === 'POST' && url.pathname === '/api/exceptions') {
      if (await isLockedOut(env, ip)) {
        return json({ error: LOCKOUT_MESSAGE }, 429);
      }
      const body = await request.json().catch(() => ({}));
      if (body.password !== env.ADMIN_PASSWORD) {
        await recordFailedAttempt(env, ip);
        return json({ error: 'Špatné heslo.' }, 401);
      }
      await clearAttempts(env, ip);
      if (!Array.isArray(body.dates) || !body.dates.every((d) => ISO_RE.test(d))) {
        return json({ error: 'Neplatný formát dat.' }, 400);
      }
      try {
        const { sha } = await readExceptions(env);
        const saved = await writeExceptions(env, body.dates, sha);
        return json({ ok: true, dates: saved });
      } catch (e) {
        return json({ error: String(e.message ?? e) }, 500);
      }
    }

    if (request.method === 'GET' && url.pathname === '/api/rozvrh') {
      try {
        const { days } = await readRozvrh(env);
        return json({ days });
      } catch (e) {
        return json({ error: String(e.message ?? e) }, 500);
      }
    }

    if (request.method === 'POST' && url.pathname === '/api/rozvrh') {
      if (await isLockedOut(env, ip)) {
        return json({ error: LOCKOUT_MESSAGE }, 429);
      }
      const body = await request.json().catch(() => ({}));
      if (body.password !== env.ADMIN_PASSWORD) {
        await recordFailedAttempt(env, ip);
        return json({ error: 'Špatné heslo.' }, 401);
      }
      await clearAttempts(env, ip);
      if (!isValidRozvrh(body.days)) {
        return json({ error: 'Neplatný formát rozvrhu.' }, 400);
      }
      try {
        const { sha } = await readRozvrh(env);
        const saved = await writeRozvrh(env, body.days, sha);
        return json({ ok: true, days: saved });
      } catch (e) {
        return json({ error: String(e.message ?? e) }, 500);
      }
    }

    return new Response('Not found', { status: 404 });
  },
};

const ADMIN_HTML = String.raw`<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin — Kiosek koupaliště</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
:root {
  --navy: #1b2f52; --navy-deep: #12213b; --red: #d42f2f; --red-dark: #b02525;
  --green: #1a7a3c; --green-bg: #e4f3e8; --water: #7fb5d8; --water-pale: #d6e8f2;
  --paper: #fbf7ee; --card: #ffffff; --ink: #1b2f52; --ink-soft: #5a6376; --line: #e4dcc8;
  --font-display: 'Oswald', 'Arial Narrow', sans-serif;
  --font-body: 'Work Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --radius: 8px; --shadow: 0 2px 10px rgba(27,47,82,0.08);
}
* { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-body); background: var(--paper); color: var(--ink); min-height: 100vh; }
.wrap { max-width: 440px; margin: 0 auto; padding: 2rem 1.2rem 4rem; }
.eyebrow { font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.68rem; font-weight: 600; color: var(--red); margin: 0 0 0.4rem; text-align: center; }
h1 { font-family: var(--font-display); text-transform: uppercase; font-size: 1.3rem; text-align: center; margin: 0 0 2rem; }

#gate { display: flex; flex-direction: column; gap: 0.9rem; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 1.6rem; box-shadow: var(--shadow); }
#gate input[type="password"] {
  font-family: var(--font-mono); font-size: 1rem; padding: 0.7rem 0.8rem; border: 1px solid var(--line);
  border-radius: var(--radius); background: var(--paper); color: var(--ink);
}
#gate-error { color: var(--red-dark); font-size: 0.85rem; min-height: 1.1em; text-align: center; }

.btn {
  font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.04em; font-size: 0.82rem;
  font-weight: 600; border: none; border-radius: var(--radius); padding: 0.75rem 1.1rem; cursor: pointer;
  transition: transform 0.12s ease, filter 0.12s ease; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
}
.btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-primary { background: var(--navy); color: #fff; }
.btn-close { background: var(--red); color: #fff; }
.btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }

#app { display: none; flex-direction: column; gap: 1.3rem; }
#app.is-visible { display: flex; }
#gate.is-hidden { display: none; }

.status-readout {
  display: flex; align-items: center; gap: 0.7rem; padding: 1rem 1.1rem; border-radius: var(--radius);
  background: var(--green-bg); border: 1px solid rgba(26,122,60,0.18);
}
.status-readout.is-closed { background: rgba(212,47,47,0.09); border-color: rgba(212,47,47,0.22); }
.status-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 4px rgba(26,122,60,0.16); flex-shrink: 0; }
.is-closed .status-dot { background: var(--red); box-shadow: 0 0 0 4px rgba(212,47,47,0.16); }
.status-text { font-family: var(--font-display); font-weight: 600; font-size: 0.98rem; }
.status-sub { font-size: 0.78rem; color: var(--ink-soft); margin-top: 0.1rem; }

.card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 1.3rem; box-shadow: var(--shadow); }
.section-label { font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.66rem; font-weight: 600; color: var(--ink-soft); margin: 0 0 0.7rem; display: flex; align-items: center; justify-content: space-between; }
.month-nav { display: flex; align-items: center; gap: 0.5rem; }
.month-nav button { background: none; border: 1px solid var(--line); border-radius: 5px; width: 24px; height: 24px; cursor: pointer; color: var(--ink); }
.month-label { font-family: var(--font-mono); font-size: 0.7rem; }

.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.3rem; }
.cal-dow { font-family: var(--font-display); font-size: 0.6rem; text-transform: uppercase; color: var(--ink-soft); text-align: center; padding-bottom: 0.2rem; }
.cal-day {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 6px;
  font-family: var(--font-mono); font-size: 0.8rem; border: 1px solid transparent; color: var(--ink);
  cursor: pointer; background: none; transition: background 0.12s ease;
}
.cal-day:hover { background: var(--water-pale); }
.cal-day.is-muted { color: var(--ink-soft); opacity: 0.35; pointer-events: none; }
.cal-day.is-today { border-color: var(--navy); font-weight: 700; }
.cal-day.is-closed { background: var(--red); color: #fff; font-weight: 600; }
.cal-day.is-closed:hover { background: var(--red-dark); }
.cal-day.is-pending-add { background: #f0a53a; color: #fff; font-weight: 600; }
.cal-day.is-pending-remove { background: none; color: var(--red); border: 1px dashed var(--red); text-decoration: line-through; }

.exception-list { display: flex; flex-direction: column; gap: 0.5rem; }
.exception-row { display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; border: 1px solid var(--line); border-radius: 6px; font-size: 0.85rem; }
.exception-row.is-pending { border-style: dashed; border-color: #f0a53a; }
.exception-row .x-date { font-family: var(--font-mono); font-weight: 500; }
.exception-row .x-remove { background: none; border: none; cursor: pointer; color: var(--ink-soft); width: 22px; height: 22px; border-radius: 50%; }
.exception-row .x-remove:hover { background: rgba(212,47,47,0.12); color: var(--red); }
.empty-note { font-size: 0.85rem; color: var(--ink-soft); text-align: center; padding: 0.6rem 0; }

.time-input {
  font-family: var(--font-mono); font-size: 0.9rem; padding: 0.5rem 0.4rem; border: 1px solid var(--line);
  border-radius: 6px; background: var(--paper); color: var(--ink); flex: 1; min-width: 0; text-align: center;
}
.time-input:disabled { opacity: 0.35; background: transparent; }

.quick-fill {
  display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; background: var(--water-pale);
  padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.78rem; color: var(--navy); margin-bottom: 0.8rem;
}
.quick-fill .time-input { background: #fff; flex: 0 1 5.5rem; }
.quick-fill .btn-ghost { font-size: 0.68rem; padding: 0.35rem 0.6rem; margin-left: auto; }

.day-table { display: flex; flex-direction: column; gap: 0.5rem; }
.day-row {
  display: flex; flex-direction: column; gap: 0.5rem;
  padding: 0.6rem 0.7rem; border-radius: 6px; border: 1px solid var(--line);
}
.day-row.is-off { background: rgba(212,47,47,0.05); }
.day-row-head { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; }
.day-name { font-family: var(--font-display); font-size: 0.88rem; font-weight: 600; }
.time-range { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: var(--ink-soft); }
.day-toggle { display: flex; align-items: center; gap: 0.35rem; font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink-soft); cursor: pointer; white-space: nowrap; }
.day-toggle input { accent-color: var(--red); width: 16px; height: 16px; flex-shrink: 0; }

.btn-row { display: flex; gap: 0.6rem; }
.btn-row .btn { flex: 1; }
#toast {
  position: fixed; left: 50%; bottom: 1.4rem; transform: translateX(-50%) translateY(120%);
  background: var(--navy-deep); color: var(--water-pale); font-size: 0.85rem; padding: 0.7rem 1.1rem;
  border-radius: 8px; box-shadow: var(--shadow); transition: transform 0.2s ease; max-width: 90vw; text-align: center;
}
#toast.is-visible { transform: translateX(-50%) translateY(0); }
#toast.is-error { background: var(--red-dark); }
</style>
</head>
<body>
<div class="wrap">
  <p class="eyebrow">Kiosek koupaliště</p>
  <h1>Správa otevírací doby</h1>

  <div id="gate">
    <input type="password" id="password" placeholder="Heslo" autocomplete="current-password">
    <button class="btn btn-primary" id="login-btn">Přihlásit se</button>
    <p id="gate-error"></p>
  </div>

  <div id="app">
    <div class="status-readout" id="status-readout">
      <span class="status-dot"></span>
      <div>
        <div class="status-text" id="status-text">Načítám…</div>
        <div class="status-sub" id="status-sub"></div>
      </div>
    </div>

    <div class="card">
      <p class="section-label">Otevírací doba</p>
      <div class="quick-fill" id="quick-fill">
        <span>Vyplnit stejně pro všechny dny:</span>
        <input class="time-input" type="time" id="fill-od" value="11:00">
        <span>–</span>
        <input class="time-input" type="time" id="fill-do" value="18:00">
        <button class="btn btn-ghost" id="fill-all-btn" type="button">Použít</button>
      </div>
      <div class="day-table" id="day-table"></div>
      <div class="btn-row" style="margin-top: 1rem;">
        <button class="btn btn-close" id="rozvrh-save-btn" disabled>Uložit rozvrh</button>
        <button class="btn btn-ghost" id="rozvrh-discard-btn" disabled>Zahodit</button>
      </div>
    </div>

    <div class="card">
      <div class="section-label">
        <span id="month-label-text"></span>
        <div class="month-nav">
          <button id="prev-month" aria-label="Předchozí měsíc">‹</button>
          <button id="next-month" aria-label="Následující měsíc">›</button>
        </div>
      </div>
      <div class="cal-grid" id="cal-grid"></div>
    </div>

    <div class="card">
      <p class="section-label">Zavřené dny</p>
      <div class="exception-list" id="exception-list"></div>
    </div>

    <div class="btn-row">
      <button class="btn btn-close" id="save-btn" disabled>Uložit změny</button>
      <button class="btn btn-ghost" id="discard-btn" disabled>Zahodit</button>
    </div>
  </div>
</div>
<div id="toast"></div>

<script>
const DOW = ['Po','Út','St','Čt','Pá','So','Ne'];
const MONTHS = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];

let password = sessionStorage.getItem('koupaliste-admin-pw') || '';
let saved = new Set();
let pending = new Set();
let savedRozvrh = [];
let pendingRozvrh = [];
let viewMonth = new Date();
viewMonth.setDate(1);
viewMonth.setHours(0,0,0,0);

const $ = (sel) => document.querySelector(sel);

function toIso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return y + '-' + m + '-' + day;
}

function showToast(msg, isError) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('is-error', !!isError);
  t.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('is-visible'), 3200);
}

function isDirty() {
  if (saved.size !== pending.size) return true;
  for (const d of saved) if (!pending.has(d)) return true;
  return false;
}

function updateButtons() {
  const dirty = isDirty();
  $('#save-btn').disabled = !dirty;
  $('#discard-btn').disabled = !dirty;
}

function isRozvrhDirty() {
  return JSON.stringify(savedRozvrh) !== JSON.stringify(pendingRozvrh);
}

function updateRozvrhButtons() {
  const dirty = isRozvrhDirty();
  $('#rozvrh-save-btn').disabled = !dirty;
  $('#rozvrh-discard-btn').disabled = !dirty;
}

function renderRozvrh() {
  const table = $('#day-table');
  table.innerHTML = '';
  pendingRozvrh.forEach((d, i) => {
    const row = document.createElement('div');
    row.className = 'day-row' + (d.zavreno ? ' is-off' : '');

    const head = document.createElement('div');
    head.className = 'day-row-head';

    const name = document.createElement('span');
    name.className = 'day-name';
    name.textContent = DOW[i];

    const toggle = document.createElement('label');
    toggle.className = 'day-toggle';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !d.zavreno;
    checkbox.addEventListener('change', () => {
      pendingRozvrh[i] = { ...pendingRozvrh[i], zavreno: !checkbox.checked };
      renderRozvrh();
      updateRozvrhButtons();
    });
    toggle.append(checkbox, document.createTextNode('Otevřeno'));

    head.append(name, toggle);

    const range = document.createElement('div');
    range.className = 'time-range';
    const odInput = document.createElement('input');
    odInput.type = 'time';
    odInput.className = 'time-input';
    odInput.value = d.od;
    odInput.disabled = d.zavreno;
    odInput.addEventListener('input', () => {
      pendingRozvrh[i] = { ...pendingRozvrh[i], od: odInput.value };
      updateRozvrhButtons();
    });
    const sep = document.createElement('span');
    sep.textContent = '–';
    const doInput = document.createElement('input');
    doInput.type = 'time';
    doInput.className = 'time-input';
    doInput.value = d.do;
    doInput.disabled = d.zavreno;
    doInput.addEventListener('input', () => {
      pendingRozvrh[i] = { ...pendingRozvrh[i], do: doInput.value };
      updateRozvrhButtons();
    });
    range.append(odInput, sep, doInput);

    row.append(head, range);
    table.appendChild(row);
  });
}

async function loadRozvrh() {
  const res = await fetch('/api/rozvrh');
  const data = await res.json();
  if (data.error) { showToast(data.error, true); return; }
  savedRozvrh = data.days;
  pendingRozvrh = data.days.map((d) => ({ ...d }));
  renderRozvrh();
  updateRozvrhButtons();
}

function renderStatus() {
  const now = new Date();
  const todayIso = toIso(now);
  const readout = $('#status-readout');
  const closedToday = pending.has(todayIso);
  readout.classList.toggle('is-closed', closedToday);
  if (closedToday) {
    $('#status-text').textContent = 'Dnes: zavřeno (výjimka)';
  } else {
    $('#status-text').textContent = 'Dnes: podle běžného rozvrhu';
  }
  const future = [...pending].filter((d) => d >= todayIso).sort();
  $('#status-sub').textContent = future.length
    ? 'Nejbližší naplánovaná výjimka: ' + future[0]
    : 'Žádná nadcházející výjimka';
}

function renderCalendar() {
  $('#month-label-text').textContent = MONTHS[viewMonth.getMonth()] + ' ' + viewMonth.getFullYear();
  const grid = $('#cal-grid');
  grid.innerHTML = '';
  DOW.forEach((d) => {
    const el = document.createElement('span');
    el.className = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const first = new Date(viewMonth);
  const firstDow = (first.getDay() + 6) % 7; // Po=0
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth()+1, 0).getDate();
  const todayIso = toIso(new Date());

  const cursor = new Date(first);
  cursor.setDate(cursor.getDate() - firstDow);

  for (let i = 0; i < 42; i++) {
    const d = new Date(cursor);
    d.setDate(cursor.getDate() + i);
    const iso = toIso(d);
    const inMonth = d.getMonth() === viewMonth.getMonth();
    const btn = document.createElement('button');
    btn.className = 'cal-day';
    btn.textContent = d.getDate();
    btn.dataset.date = iso;
    if (!inMonth) btn.classList.add('is-muted');
    if (iso === todayIso) btn.classList.add('is-today');
    const wasSaved = saved.has(iso);
    const isPending = pending.has(iso);
    if (wasSaved && isPending) btn.classList.add('is-closed');
    else if (!wasSaved && isPending) btn.classList.add('is-pending-add');
    else if (wasSaved && !isPending) btn.classList.add('is-pending-remove');
    btn.addEventListener('click', () => {
      if (pending.has(iso)) pending.delete(iso); else pending.add(iso);
      renderAll();
    });
    grid.appendChild(btn);
  }
}

function renderList() {
  const list = $('#exception-list');
  list.innerHTML = '';
  const all = new Set([...saved, ...pending]);
  const sorted = [...all].sort();
  if (!sorted.length) {
    const p = document.createElement('p');
    p.className = 'empty-note';
    p.textContent = 'Žádné naplánované výjimky.';
    list.appendChild(p);
    return;
  }
  sorted.forEach((iso) => {
    const isPendingState = pending.has(iso) !== saved.has(iso);
    const row = document.createElement('div');
    row.className = 'exception-row' + (isPendingState ? ' is-pending' : '');
    const span = document.createElement('span');
    span.className = 'x-date';
    span.textContent = pending.has(iso) ? iso : iso + ' (bude odebráno)';
    const btn = document.createElement('button');
    btn.className = 'x-remove';
    btn.setAttribute('aria-label', 'Přepnout ' + iso);
    btn.innerHTML = pending.has(iso)
      ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 6l12 12M18 6L6 18"/></svg>'
      : '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>';
    btn.addEventListener('click', () => {
      if (pending.has(iso)) pending.delete(iso); else pending.add(iso);
      renderAll();
    });
    row.appendChild(span);
    row.appendChild(btn);
    list.appendChild(row);
  });
}

function renderAll() {
  renderStatus();
  renderCalendar();
  renderList();
  updateButtons();
}

async function loadExceptions() {
  const res = await fetch('/api/exceptions');
  const data = await res.json();
  if (data.error) { showToast(data.error, true); return; }
  saved = new Set(data.dates);
  pending = new Set(data.dates);
  renderAll();
}

$('#login-btn').addEventListener('click', async () => {
  const pw = $('#password').value;
  const res = await fetch('/api/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: pw }),
  });
  const data = await res.json();
  if (!data.ok) {
    $('#gate-error').textContent = data.error || 'Špatné heslo, zkus to znovu.';
    return;
  }
  password = pw;
  sessionStorage.setItem('koupaliste-admin-pw', pw);
  $('#gate').classList.add('is-hidden');
  $('#app').classList.add('is-visible');
  loadExceptions();
  loadRozvrh();
});

$('#password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('#login-btn').click();
});

$('#prev-month').addEventListener('click', () => {
  viewMonth.setMonth(viewMonth.getMonth() - 1);
  renderCalendar();
});
$('#next-month').addEventListener('click', () => {
  viewMonth.setMonth(viewMonth.getMonth() + 1);
  renderCalendar();
});

$('#discard-btn').addEventListener('click', () => {
  pending = new Set(saved);
  renderAll();
});

$('#save-btn').addEventListener('click', async () => {
  $('#save-btn').disabled = true;
  $('#save-btn').textContent = 'Ukládám…';
  try {
    const res = await fetch('/api/exceptions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password, dates: [...pending] }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    saved = new Set(data.dates);
    pending = new Set(data.dates);
    renderAll();
    showToast('Uloženo. Na webu se projeví do ~1–2 minut.');
  } catch (e) {
    showToast(String(e.message ?? e), true);
  } finally {
    $('#save-btn').textContent = 'Uložit změny';
    updateButtons();
  }
});

$('#fill-all-btn').addEventListener('click', () => {
  const od = $('#fill-od').value;
  const doo = $('#fill-do').value;
  if (!od || !doo) return;
  pendingRozvrh = pendingRozvrh.map((d) => ({ ...d, od, do: doo }));
  renderRozvrh();
  updateRozvrhButtons();
});

$('#rozvrh-discard-btn').addEventListener('click', () => {
  pendingRozvrh = savedRozvrh.map((d) => ({ ...d }));
  renderRozvrh();
  updateRozvrhButtons();
});

$('#rozvrh-save-btn').addEventListener('click', async () => {
  $('#rozvrh-save-btn').disabled = true;
  $('#rozvrh-save-btn').textContent = 'Ukládám…';
  try {
    const res = await fetch('/api/rozvrh', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password, days: pendingRozvrh }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    savedRozvrh = data.days;
    pendingRozvrh = data.days.map((d) => ({ ...d }));
    renderRozvrh();
    showToast('Rozvrh uložen. Na webu se projeví do ~1–2 minut.');
  } catch (e) {
    showToast(String(e.message ?? e), true);
  } finally {
    $('#rozvrh-save-btn').textContent = 'Uložit rozvrh';
    updateRozvrhButtons();
  }
});

// Pokud je heslo v sessionStorage z dřívějška, přeskoč rovnou dovnitř.
if (password) {
  fetch('/api/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  }).then((r) => r.json()).then((data) => {
    if (data.ok) {
      $('#gate').classList.add('is-hidden');
      $('#app').classList.add('is-visible');
      loadExceptions();
      loadRozvrh();
    } else {
      sessionStorage.removeItem('koupaliste-admin-pw');
    }
  });
}
</script>
</body>
</html>`;
