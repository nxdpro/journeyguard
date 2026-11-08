// Writes the animated terminal that replays `journeyguard demo` in the README:
//   docs/assets/demo.svg and demo-el.svg (860 px wide, 14 px text) for desktop,
//   docs/assets/demo-mobile.svg and demo-el-mobile.svg (444 px wide, 13 px text, lines wrapped at 50 columns) for phones,
//   chosen in the README with <source media="(max-width: 600px)">.
// Every line below is copied verbatim from the real output of `journeyguard demo` and `journeyguard demo --lang el` (v0.1.1).
// Some lines are left out to keep it short; long lines continue on the next row, as in a narrow terminal.
// Regenerate with `node scripts/terminal-svg.mjs` whenever the demo's wording changes.
import { writeFileSync } from 'node:fs';

// Dark in both GitHub themes; the frame stays visible on #0d1117.
const C = {
  bg: '#0d1424',
  bar: '#141d33',
  line: '#26324f',
  title: '#93a3c4',
  fg: '#e8eefc',
  dim: '#8494b6',
  green: '#34d399',
  red: '#f87171',
  cyan: '#38bdf8',
  prompt: '#4c8dff',
};

// A line: [secondsIntoTheLoop, segments]. A segment is [text, color, bold?] or a WRAP marker.
// A blank line takes half a row. WRAP(indent, join) is where the desktop terminal continues on the next row;
// the phone version joins the line back (with `join` between the parts) and wraps it at its own width.
const L = (at, ...segs) => ({ at, segs });
const BLANK = { blank: true };
const WRAP = (indent, join = ' ') => ({ wrap: indent, join });

function english() {
  const SHOP = 'http://127.0.0.1:38009';
  const SITE = 'Aegean Coffee Co. (demo)';
  return {
    command: 'journeyguard demo',
    delay: 0,
    aria: 'Terminal: journeyguard demo checks a healthy shop, then catches a broken checkout and explains it in plain language',
    lines: [
      L(1.95, ['JourneyGuard demo', C.fg, true], [' · demo shop running at ', C.fg], [SHOP, C.cyan]),
      BLANK,
      L(2.35, ['1) The shop is healthy:', C.fg, true]),
      BLANK,
      L(3.55, [SITE, C.fg, true], [' › Shop checkout (WooCommerce)  ', C.fg], ['PASSED', C.green, true], ['  562ms', C.dim]),
      L(3.6, ['  ✔', C.green], [' Website', C.fg]),
      L(3.65, ['  ✔', C.green], [' Products', C.fg]),
      L(3.7, ['  ✔', C.green], [' Add to cart', C.fg]),
      L(3.75, ['  ✔', C.green], [' Checkout', C.fg]),
      L(3.8, ['  ✔', C.green], [' Payment', C.fg]),
      L(3.85, ['  ○ Place order — not tested (Safe mode: JourneyGuard never submits real orders or payments)', C.dim]),
      BLANK,
      L(4.45, [SITE, C.fg, true], [' › Contact form  ', C.fg], ['PASSED', C.green, true], ['  389ms', C.dim]),
      BLANK,
      L(4.8, [SITE, C.fg, true], [' › Website health  ', C.fg], ['PASSED', C.green, true], ['  85ms', C.dim]),
      BLANK,
      L(5.4, ['2) Now we break it (--break checkout) — this is what an owner normally never notices:', C.fg, true]),
      BLANK,
      L(6.5, [SITE, C.fg, true], [' › Shop checkout (WooCommerce)  ', C.fg], ['FAILED', C.red, true], ['  473ms', C.dim]),
      L(6.55, ['  ✔', C.green], [' Website', C.fg]),
      L(6.6, ['  ✔', C.green], [' Products', C.fg]),
      L(6.65, ['  ✔', C.green], [' Add to cart', C.fg]),
      L(6.7, ['  ✖', C.red], [' Checkout ', C.fg], ['—', C.dim], [' ', C.fg], [`HTTP 500 on ${SHOP}/checkout/`, C.red]),
      L(6.75, ['  ○ Payment — not tested (Not reached: "Checkout" failed)', C.dim]),
      L(6.8, ['  →', C.red], [' ', C.fg], ['PHP/WordPress fatal error', C.fg, true]),
      L(6.85, ['    Usually caused by a plugin or theme update, or a PHP version change. ', C.dim], WRAP(4), ['Check the PHP error log and recently updated plugins.', C.dim]),
      L(6.9, ['  Homepage load: 14ms · Product: Espresso Blend 250g · Items in cart: 1', C.dim]),
      L(6.95, ['  ', C.fg], ['Screenshot:', C.dim], [' /tmp/journeyguard-demo-ImMHF3/runs/aegean-coffee-co-demo/woocommerce/', C.fg], WRAP(14, ''), ['2026-11-08T22-03-48-230Z-c4f3/failure.png', C.fg]),
      BLANK,
      L(7.95, ['Dashboard:', C.fg, true], [' ', C.fg], ['http://localhost:8080', C.cyan], ['   ', C.fg], ['(Ctrl+C to stop)', C.dim]),
    ],
  };
}

function greek() {
  const SHOP = 'http://127.0.0.1:39227';
  const SITE = 'Aegean Coffee Co. (demo)';
  const D = 0.9; // the longer command takes longer to type
  return {
    command: 'journeyguard demo --lang el',
    delay: D,
    aria: 'Τερματικό: το journeyguard demo ελέγχει ένα eShop που λειτουργεί κανονικά, μετά εντοπίζει το χαλασμένο ταμείο και εξηγεί την πιθανή αιτία με απλά λόγια',
    lines: [
      L(D + 1.95, ['JourneyGuard demo', C.fg, true], [' · το δοκιμαστικό eShop τρέχει στο ', C.fg], [SHOP, C.cyan]),
      BLANK,
      L(D + 2.35, ['1) Το eShop λειτουργεί κανονικά:', C.fg, true]),
      BLANK,
      L(D + 3.55, [SITE, C.fg, true], [' › Αγορά από το eShop (WooCommerce)  ', C.fg], ['ΕΠΙΤΥΧΙΑ', C.green, true], ['  508ms', C.dim]),
      L(D + 3.6, ['  ✔', C.green], [' Ιστοσελίδα', C.fg]),
      L(D + 3.65, ['  ✔', C.green], [' Προϊόντα', C.fg]),
      L(D + 3.7, ['  ✔', C.green], [' Καλάθι', C.fg]),
      L(D + 3.75, ['  ✔', C.green], [' Ταμείο', C.fg]),
      L(D + 3.8, ['  ✔', C.green], [' Πληρωμή', C.fg]),
      L(D + 3.85, ['  ○ Υποβολή παραγγελίας — δεν ελέγχθηκε (Ασφαλής λειτουργία: το JourneyGuard δεν υποβάλλει', C.dim], WRAP(4), ['ποτέ πραγματικές παραγγελίες ή πληρωμές)', C.dim]),
      BLANK,
      L(D + 4.45, [SITE, C.fg, true], [' › Φόρμα επικοινωνίας  ', C.fg], ['ΕΠΙΤΥΧΙΑ', C.green, true], ['  330ms', C.dim]),
      BLANK,
      L(D + 4.8, [SITE, C.fg, true], [' › Υγεία ιστοσελίδας  ', C.fg], ['ΕΠΙΤΥΧΙΑ', C.green, true], ['  80ms', C.dim]),
      BLANK,
      L(D + 5.4, ['2) Τώρα το «σπάμε» (--break checkout): αυτό συνήθως δεν το προσέχει κανείς:', C.fg, true]),
      BLANK,
      L(D + 6.5, [SITE, C.fg, true], [' › Αγορά από το eShop (WooCommerce)  ', C.fg], ['ΑΠΟΤΥΧΙΑ', C.red, true], ['  439ms', C.dim]),
      L(D + 6.55, ['  ✔', C.green], [' Ιστοσελίδα', C.fg]),
      L(D + 6.6, ['  ✔', C.green], [' Προϊόντα', C.fg]),
      L(D + 6.65, ['  ✔', C.green], [' Καλάθι', C.fg]),
      L(D + 6.7, ['  ✖', C.red], [' Ταμείο ', C.fg], ['—', C.dim], [' ', C.fg], [`HTTP 500 στη σελίδα ${SHOP}/checkout/`, C.red]),
      L(D + 6.75, ['  ○ Πληρωμή — δεν ελέγχθηκε (Δεν εκτελέστηκε, γιατί απέτυχε το βήμα «Ταμείο»)', C.dim]),
      L(D + 6.8, ['  →', C.red], [' ', C.fg], ['Κρίσιμο σφάλμα PHP/WordPress', C.fg, true]),
      L(D + 6.85, ['    Συνήθως οφείλεται σε ενημέρωση plugin ή θέματος, ή σε αλλαγή έκδοσης PHP.', C.dim], WRAP(4), ['Ελέγξτε το PHP error log και τα πρόσφατα ενημερωμένα plugins.', C.dim]),
      L(D + 6.9, ['  Φόρτωση αρχικής: 19ms · Προϊόν: Espresso Blend 250g · Τεμάχια στο καλάθι: 1', C.dim]),
      L(D + 6.95, ['  ', C.fg], ['Στιγμιότυπο:', C.dim], [' /tmp/journeyguard-demo-gezDz7/runs/aegean-coffee-co-demo/woocommerce/', C.fg], WRAP(15, ''), ['2026-11-08T21-53-13-364Z-2b65/failure.png', C.fg]),
      BLANK,
      L(D + 7.95, ['Πίνακας ελέγχου:', C.fg, true], [' ', C.fg], ['http://localhost:8080', C.cyan], ['   ', C.fg], ['(Ctrl+C για τερματισμό)', C.dim]),
    ],
  };
}

// Desktop keeps the WRAP markers as written. Phones: join each line back and wrap it at `cols` columns, breaking
// at spaces; only a word longer than a whole row (a long path) breaks after a "/". A continued row starts at
// column 4 under an indented line (after "  ✔ ", "  ○ " …) and at column 2 under a line that starts at the margin.
function rewrap(segs, cols) {
  const flat = [];
  for (const s of segs) {
    if (s.wrap !== undefined) {
      if (flat.length) flat[flat.length - 1] = [flat[flat.length - 1][0].replace(/ +$/, ''), ...flat[flat.length - 1].slice(1)];
      if (s.join) flat.push([s.join, C.fg]);
    } else flat.push(s);
  }
  const lead = flat[0][0].match(/^ */)[0].length;
  const indent = lead >= 4 ? lead : lead + 2;
  const room = cols - indent;
  const rows = [[]];
  let width = 0;
  const put = (piece, color, bold) => {
    if (width + piece.trimEnd().length > cols && width > indent) {
      rows.push([]);
      width = indent;
      piece = piece.replace(/^ +/, '');
    }
    if (piece) rows.at(-1).push([piece, color, bold]);
    width += piece.length;
  };
  for (const [text, color, bold] of flat) {
    for (const word of text.match(/[^ ]+ *| +/g) ?? []) {
      if (word.trimEnd().length <= room) put(word, color, bold);
      else for (const part of word.match(/[^/]*\/+|[^/]+$/g)) {
        let rest = part;
        while (rest.trimEnd().length > room) { put(rest.slice(0, room), color, bold); rest = rest.slice(room); }
        put(rest, color, bold);
      }
    }
  }
  return rows.flatMap((r, i) => (i ? [WRAP(indent), ...r] : r));
}

const VARIANTS = {
  desktop: { W: 860, PAD: 28, BAR: 38, LH: 21, GAP: 10, FONT: 14, BARFONT: 12.5, CW: 8.4, cols: 0 },
  mobile: { W: 444, PAD: 18, BAR: 34, LH: 19, GAP: 8, FONT: 13, BARFONT: 12, CW: 7.8, cols: 50 },
};

const TYPE_START = 0.45; // first keystroke
const TYPE_STEP = 0.075; // seconds per character
const T = 18; // seconds per loop; the finished screen stays up for about 9 s
const END = 97; // % of the loop at which the screen clears
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const SANS = "-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pct = (s) => +((s / T) * 100).toFixed(2);

function render(demo, variant) {
  const { W, PAD, BAR, LH, GAP, FONT, BARFONT, CW, cols } = VARIANTS[variant];
  const { command: COMMAND } = demo;
  const ENTER = 1.75 + demo.delay; // the cursor drops to the next row
  const lines = cols ? demo.lines.map((l) => (l.blank ? l : { ...l, segs: rewrap(l.segs, cols) })) : demo.lines;

  // Lay out the rows.
  let y = BAR + 30;
  const commandY = y;
  y += LH;
  const placed = [];
  for (const line of lines) {
    if (line.blank) {
      y += GAP;
      continue;
    }
    placed.push({ ...line, y });
    y += LH * (1 + line.segs.filter((s) => s.wrap !== undefined).length);
  }
  const cursorFinalY = y; // the row below the last line, where the cursor waits
  const H = cursorFinalY + 24;

  let css = '';
  let body = '';

  // The command, typed one character at a time: each prefix shows until the next one replaces it.
  // The prompt is drawn once below; here it only holds the space.
  for (let i = 1; i <= COMMAND.length; i++) {
    const from = pct(TYPE_START + (i - 1) * TYPE_STEP);
    const to = i < COMMAND.length ? pct(TYPE_START + i * TYPE_STEP) : END;
    const last = i === COMMAND.length;
    css += `@keyframes t${i}{0%{opacity:0}${from}%{opacity:1}${to}%,100%{opacity:0}}#t${i}{animation:t${i} ${T}s step-end infinite${last ? '' : ';opacity:0'}}`;
    body += `<text id="t${i}" x="${PAD}" y="${commandY}" xml:space="preserve"><tspan fill-opacity="0" font-weight="700">$ </tspan><tspan fill="${C.fg}" font-weight="700">${esc(COMMAND.slice(0, i))}</tspan></text>`;
  }
  // The prompt alone, before typing starts (and between loops).
  body += `<text x="${PAD}" y="${commandY}" xml:space="preserve"><tspan fill="${C.prompt}" font-weight="700">$ </tspan></text>`;

  placed.forEach(({ at, segs, y: ly }, i) => {
    const a = pct(at);
    css += `@keyframes k${i}{0%{opacity:0}${a}%{opacity:1}${END}%,100%{opacity:0}}#l${i}{animation:k${i} ${T}s step-end infinite}`;
    const spans = segs
      .map((s) =>
        s.wrap !== undefined
          ? `<tspan class="w" x="${PAD}" dy="${LH}">${' '.repeat(s.wrap)}</tspan>`
          : `<tspan fill="${s[1]}"${s[2] ? ' font-weight="700"' : ''}>${esc(s[0])}</tspan>`,
      )
      .join('');
    body += `<text id="l${i}" x="${PAD}" y="${ly}" xml:space="preserve">${spans}</text>`;
  });

  // The cursor: hidden while the command is typed, then always on the row below the newest output.
  const stops = [[pct(ENTER), commandY + LH]];
  for (const p of placed) {
    const rows = 1 + p.segs.filter((s) => s.wrap !== undefined).length;
    const next = p.y + rows * LH;
    const at = pct(p.at);
    if (stops.at(-1)[0] === at) stops.at(-1)[1] = next;
    else stops.push([at, next]);
  }
  stops.at(-1)[1] = cursorFinalY;
  const move = stops.map(([at, cy]) => `${at}%{transform:translateY(${cy - cursorFinalY}px)}`).join('');
  css += `@keyframes cm{0%{transform:translateY(${stops[0][1] - cursorFinalY}px)}${move}100%{transform:translateY(0)}}`;
  css += `@keyframes cg{0%{opacity:0}${pct(ENTER)}%{opacity:1}${END}%,100%{opacity:0}}`;
  css += `@keyframes cb{0%,55%{opacity:1}56%,100%{opacity:0}}`;
  css += `#cur{animation:cm ${T}s step-end infinite,cg ${T}s step-end infinite}#cur rect{animation:cb 1.1s step-end infinite}`;
  const cursor = `<g id="cur"><rect x="${PAD}" y="${cursorFinalY - FONT}" width="${CW}" height="${FONT + 4}" rx="1" fill="${C.fg}" fill-opacity=".72"/></g>`;

  // The JourneyGuard shield, inline (an SVG used as an image cannot load other files).
  const titleText = 'journeyguard demo';
  const shield = (x, yy, s) =>
    `<g transform="translate(${x} ${yy}) scale(${s / 32})"><path d="M16 2 4 6.5v8.7c0 7.4 5.1 13.6 12 15.3 6.9-1.7 12-7.9 12-15.3V6.5L16 2Z" fill="#1f5eff"/><path d="M9.5 19.5h4l2-6 2 9 2-5h3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(demo.aria)}">
<title>journeyguard demo</title>
<style>text{font-family:${MONO};font-size:${FONT}px}.bar{font-family:${SANS};font-size:${BARFONT}px;font-weight:600}${css}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="${C.bg}" stroke="${C.line}"/>
<path d="M12.5 .5h${W - 25}a12 12 0 0 1 12 12V${BAR}H.5V12.5a12 12 0 0 1 12-12Z" fill="${C.bar}" stroke="${C.line}"/>
<path d="M1 ${BAR}h${W - 2}" stroke="${C.line}"/>
<circle cx="24" cy="${BAR / 2}" r="6" fill="#ff5f57"/><circle cx="44" cy="${BAR / 2}" r="6" fill="#febc2e"/><circle cx="64" cy="${BAR / 2}" r="6" fill="#28c840"/>
${shield(W / 2 - 70, BAR / 2 - 8, 16)}<text class="bar" x="${W / 2 - 48}" y="${BAR / 2 + 4.5}" fill="${C.title}">${titleText}</text>
${body}
${cursor}
</svg>
`;
  return { svg, W, H, count: placed.length };
}

for (const [demo, name] of [[english(), 'demo'], [greek(), 'demo-el']]) {
  for (const variant of ['desktop', 'mobile']) {
    const file = `docs/assets/${name}${variant === 'mobile' ? '-mobile' : ''}.svg`;
    const { svg, W, H, count } = render(demo, variant);
    writeFileSync(new URL(`../${file}`, import.meta.url), svg);
    console.log(`${file} written (${svg.length} bytes, ${count} lines, ${W}×${H})`);
  }
}
