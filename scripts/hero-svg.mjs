// Writes the animated README hero (a check passes, then checkout breaks and an alert goes out). Run: node scripts/hero-svg.mjs
//   docs/assets/hero-{light,dark}.svg, hero-el-{light,dark}.svg: wide layout (900×332) for desktop.
//   docs/assets/hero-mobile-{light,dark}.svg, hero-el-mobile-{light,dark}.svg: tall layout (420×574) for phones,
//   chosen in the README with <source media="(max-width: 600px)">.
import { writeFileSync } from 'node:fs';

const T = 13.8; // seconds per loop

const PALETTES = {
  light: {
    bg: '#f6f8fc', surface: '#ffffff', line: '#dde3ef', text: '#0f172a', muted: '#5b6b8a', faint: '#aab5ca',
    accent: '#1f5eff', ok: '#16a34a', okText: '#15803d', fail: '#dc2626', failText: '#b91c1c',
    accentTint: '#e8efff', okTint: '#e6f6ec', failTint: '#fdeced', onState: '#ffffff', logo: '#1f5eff',
    shadow: 'flood-color="#0f172a" flood-opacity="0.10"',
  },
  dark: {
    bg: '#0d1424', surface: '#141d33', line: '#26324f', text: '#e8eefc', muted: '#93a3c4', faint: '#4a5878',
    accent: '#4c8dff', ok: '#34d399', okText: '#34d399', fail: '#f87171', failText: '#fca5a5',
    accentTint: '#172a52', okTint: '#0f2f2b', failTint: '#3a1c26', onState: '#0d1424', logo: '#1f5eff',
    shadow: 'flood-color="#000000" flood-opacity="0.45"',
  },
};

// Diagnosis wording: src/diagnose.ts, rule wp-critical (title and the first sentence of the detail). Status words: src/i18n.ts.
const TEXT = {
  en: {
    lang: 'en',
    steps: ['Homepage', 'Product', 'Add to cart', 'Checkout', 'Payment'],
    running: 'Running…', passed: 'All journeys passed', failed: '1 journey failed',
    http: 'HTTP 500', notTested: 'Not tested',
    alertTitle: 'Checkout failed · Aegean Coffee Co.', alertShort: 'Checkout failed', now: 'just now',
    diagTitle: 'PHP/WordPress fatal error',
    diagDetail: 'Usually caused by a plugin or theme update, or a PHP version change.',
    diagLines: ['Usually caused by a plugin or theme update,', 'or a PHP version change.'],
    label: 'JourneyGuard checks the Aegean Coffee Co. shop like a customer: homepage, product, add to cart, checkout, payment. '
      + 'The first run passes. On the second run checkout fails, payment is not reached, and an alert explains the likely cause '
      + '(PHP/WordPress fatal error) and goes out to Telegram, Email and Slack.',
  },
  el: {
    lang: 'el',
    steps: ['Αρχική', 'Προϊόν', 'Καλάθι', 'Ταμείο', 'Πληρωμή'],
    running: 'Σε εξέλιξη…', passed: 'Όλες οι διαδρομές πέρασαν', failed: '1 διαδρομή απέτυχε',
    http: 'HTTP 500', notTested: 'Δεν ελέγχθηκε',
    alertTitle: 'Το ταμείο απέτυχε · Aegean Coffee Co.', alertShort: 'Το ταμείο απέτυχε', now: 'μόλις τώρα',
    diagTitle: 'Κρίσιμο σφάλμα PHP/WordPress',
    diagDetail: 'Συνήθως οφείλεται σε ενημέρωση plugin ή θέματος, ή σε αλλαγή έκδοσης PHP.',
    diagLines: ['Συνήθως οφείλεται σε ενημέρωση plugin', 'ή θέματος, ή σε αλλαγή έκδοσης PHP.'],
    label: 'Το JourneyGuard ελέγχει το eShop Aegean Coffee Co. σαν πελάτης: αρχική, προϊόν, καλάθι, ταμείο, πληρωμή. '
      + 'Ο πρώτος έλεγχος περνά. Στον δεύτερο το ταμείο αποτυγχάνει, η πληρωμή δεν ελέγχεται, και μια ειδοποίηση εξηγεί την πιθανή αιτία '
      + '(κρίσιμο σφάλμα PHP/WordPress) και στέλνεται σε Telegram, Email και Slack.',
  },
};

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const SHIELD = 'M16 2 4 6.5v8.7c0 7.4 5.1 13.6 12 15.3 6.9-1.7 12-7.9 12-15.3V6.5L16 2Z'; // docs/assets/logo.svg
const PULSE = 'M9.5 19.5h4l2-6 2 9 2-5h3';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Rough text width for a sans-serif face (slightly generous), used only to size pills and chips.
const textWidth = (s, size, bold) => [...s].reduce((w, ch) => w + (/[iljtfr.,·'|!:;\s]/.test(ch) ? 0.3
  : /[mwMW]/.test(ch) ? 0.86 : /[A-ZΑ-Ω0-9]/.test(ch) ? 0.66 : ch === '…' ? 1 : 0.56), 0) * size * (bold ? 1.06 : 1);

// Layouts (the base, non-animated styles show the final frame: used when motion is reduced).
// pos: step centres along the axis; the pulse moves along x (wide) or y (tall).
const LAYOUTS = {
  wide: { W: 900, H: 332, axis: 'X', pos: [110, 280, 450, 620, 790], R: 19, GAP: 4, DROP: 70, CARD: { x: 90, y: 182, w: 720, h: 136 } },
  tall: { W: 420, H: 574, axis: 'Y', pos: [128, 180, 232, 284, 336], R: 18, GAP: 2, DROP: 100, CARD: { x: 16, y: 372, w: 388, h: 186 }, SX: 40 },
};

// Timeline (seconds)
const A1 = [0.6, 1.1, 1.6, 2.1, 2.6]; // run 1: pulse reaches each step
const PASS_PILL = 2.9; // "All journeys passed"
const RESET1 = 5.7; // run 1 result clears (the passed state holds for about 2.5 s)
const A2 = [6.3, 6.8, 7.3, 7.8]; // run 2: pulse reaches Homepage … Checkout
const DWELL = 0.2;
const FAIL = 8.15; // Checkout turns red
const NOT_REACHED = 8.4; // Payment marked not tested
const SHIFT = 8.75; // step row moves up
const CARD_IN = 8.9;
const CHIPS = 9.65;
const OUT = 13.1; // everything fades back to the starting frame

function build(theme, t, layout) {
  const P = PALETTES[theme];
  const { W, H, axis, pos: X, R, GAP, DROP, CARD } = LAYOUTS[layout];
  const tall = layout === 'tall';
  const L = X[4] - X[0];
  let css = '';
  let n = 0;
  const pct = (s) => `${+((Math.min(Math.max(s, 0), T) / T) * 100).toFixed(3)}%`;
  // frames: [[seconds, 'declarations', timingFunction?], ...]; the first and last values are held to 0% and 100%.
  const anim = (sel, frames) => {
    const f = [...frames].sort((a, b) => a[0] - b[0]);
    if (f[0][0] > 0) f.unshift([0, f[0][1]]);
    if (f[f.length - 1][0] < T) f.push([T, f[f.length - 1][1]]);
    const name = `k${n++}`;
    css += `@keyframes ${name}{${f.map(([s, d, tf]) => `${pct(s)}{${d}${tf ? `;animation-timing-function:${tf}` : ''}}`).join('')}}`;
    css += `${sel}{animation:${name} ${T}s infinite}`;
  };
  // Opacity on during each [from, to] range, with short fades. A range may start at 0 or run past T.
  const visible = (sel, ranges, fade = 0.2) => anim(sel, ranges.flatMap(([a, b]) => [
    ...(a <= 0 ? [[0, 'opacity:1']] : [[a, 'opacity:0'], [a + fade, 'opacity:1']]),
    ...(b >= T ? [[T, 'opacity:1']] : [[b, 'opacity:1'], [b + fade, 'opacity:0']]),
  ]));
  const pop = (a) => [[a, 'opacity:0;transform:scale(.55)'], [a + 0.12, 'opacity:1;transform:scale(1.1)', 'ease-out'], [a + 0.26, 'opacity:1;transform:scale(1)']];
  const off = (b, f = 0.25) => [[b, 'opacity:1;transform:scale(1)'], [b + f, 'opacity:0;transform:scale(1)']];
  const EASE = 'cubic-bezier(.2,.8,.2,1)';

  // Pulse (moving dot), its ring at each visited step, and the green progress line behind it.
  const pulse = [];
  const ring = [];
  const prog = [];
  const tr = `translate${axis}`;
  const run = (arr, dwellLast) => arr.forEach((a, i) => {
    const x = X[i] - X[0];
    const d = i === arr.length - 1 ? dwellLast : DWELL;
    if (i === 0) {
      pulse.push([a - 0.16, `opacity:0;transform:${tr}(${x}px)`]);
      prog.push([a - 0.16, `stroke-dashoffset:${L};opacity:1`]);
    }
    pulse.push([a, `opacity:1;transform:${tr}(${x}px)`], [a + d, `opacity:1;transform:${tr}(${x}px)`]);
    prog.push([a, `stroke-dashoffset:${L - x};opacity:1`], [a + d, `stroke-dashoffset:${L - x};opacity:1`]);
    ring.push([a - 0.02, `opacity:0;transform:${tr}(${x}px) scale(.7)`], [a + 0.1, `opacity:1;transform:${tr}(${x}px) scale(1)`, 'ease-out'],
      [a + d, `opacity:1;transform:${tr}(${x}px) scale(1)`], [a + d + 0.1, `opacity:0;transform:${tr}(${x}px) scale(1.15)`]);
    if (i === arr.length - 1) pulse.push([a + d + 0.15, `opacity:0;transform:${tr}(${x}px)`]);
  });
  run(A1, 0.25);
  run(A2, FAIL - A2[3]);
  prog.push([RESET1, `stroke-dashoffset:0;opacity:1`], [RESET1 + 0.25, `stroke-dashoffset:0;opacity:0`], [RESET1 + 0.3, `stroke-dashoffset:${L};opacity:0`],
    [RESET1 + 0.35, `stroke-dashoffset:${L};opacity:1`]);
  const xFail = X[3] - X[0];
  prog.push([OUT, `stroke-dashoffset:${L - xFail};opacity:1`], [OUT + 0.25, `stroke-dashoffset:${L - xFail};opacity:0`],
    [OUT + 0.3, `stroke-dashoffset:${L};opacity:0`], [OUT + 0.35, `stroke-dashoffset:${L};opacity:1`]);
  anim('#pulse', pulse);
  anim('#ring', ring);
  anim('#prog', prog);

  // Step states.
  for (let i = 0; i < 5; i++) {
    const f = [...pop(A1[i] + 0.1), ...off(RESET1)];
    if (i < 3) f.push(...pop(A2[i] + 0.1), ...off(OUT));
    anim(`#ok${i}`, f);
  }
  anim('#bad', [...pop(FAIL), ...off(OUT)]);
  anim('#shake', [[FAIL, 'transform:translateX(0)'], [FAIL + 0.07, 'transform:translateX(-4px)'], [FAIL + 0.15, 'transform:translateX(4px)'],
    [FAIL + 0.23, 'transform:translateX(-3px)'], [FAIL + 0.31, 'transform:translateX(2px)'], [FAIL + 0.39, 'transform:translateX(0)']]);
  anim('#ripple', [[FAIL - 0.01, 'opacity:0;transform:scale(1)'], [FAIL, 'opacity:.55;transform:scale(1)', 'ease-out'], [FAIL + 0.7, 'opacity:0;transform:scale(1.8)'],
    [FAIL + 0.71, 'opacity:0;transform:scale(1)']]);
  visible('#skip', [[NOT_REACHED, OUT]]);
  visible('#seg', [[0, NOT_REACHED], [OUT, T + 1]]);
  visible('#dash', [[NOT_REACHED, OUT]]);
  visible('#cap3', [[FAIL + 0.15, OUT]]);
  visible('#cap4', [[NOT_REACHED + 0.1, OUT]]);
  anim('#lab4', [[NOT_REACHED, `fill:${P.text}`], [NOT_REACHED + 0.2, `fill:${P.muted}`], [OUT, `fill:${P.muted}`], [OUT + 0.2, `fill:${P.text}`]]);

  // Status pill: each one fades out completely before the next fades in (the labels share one spot).
  visible('#pRun', [[0, PASS_PILL - 0.2], [RESET1 + 0.1, FAIL], [OUT + 0.3, T + 1]]);
  visible('#pOk', [[PASS_PILL, RESET1 - 0.1]]);
  visible('#pFail', [[FAIL + 0.2, OUT]]);
  css += '@keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}#pRun circle{animation:blink 1.2s infinite}';

  // Step row moves up, alert card slides in, channel chips appear.
  anim('#row', [[SHIFT, `transform:translateY(${DROP}px)`, 'cubic-bezier(.4,0,.2,1)'], [SHIFT + 0.55, 'transform:translateY(0)'],
    [OUT + 0.1, 'transform:translateY(0)', 'cubic-bezier(.4,0,.2,1)'], [OUT + 0.65, `transform:translateY(${DROP}px)`]]);
  anim('#card', [[CARD_IN, 'opacity:0;transform:translateY(22px)', EASE], [CARD_IN + 0.6, 'opacity:1;transform:translateY(0)'],
    [OUT, 'opacity:1;transform:translateY(0)'], [OUT + 0.3, 'opacity:0;transform:translateY(8px)'], [OUT + 0.31, 'opacity:0;transform:translateY(22px)']]);
  [0, 1, 2].forEach((i) => anim(`#chip${i}`, [[CHIPS + i * 0.15, 'opacity:0;transform:translateY(6px)', EASE], [CHIPS + i * 0.15 + 0.3, 'opacity:1;transform:translateY(0)'],
    [OUT + 0.3, 'opacity:1;transform:translateY(0)'], [OUT + 0.31, 'opacity:0;transform:translateY(6px)']]));

  // ---- Drawing ----
  const check = (color = P.onState) => `<path d="M-6 .5l4 4 8.5-9" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  const cross = `<path d="M-5.5-5.5 5.5 5.5M5.5-5.5-5.5 5.5" fill="none" stroke="${P.onState}" stroke-width="2.6" stroke-linecap="round"/>`;
  const logo = (x, y, size) => `<g transform="translate(${x} ${y}) scale(${size / 32})"><path d="${SHIELD}" fill="${P.logo}"/><path d="${PULSE}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;

  // Pill: [dot][text]. Wide: right-aligned in the header. Tall: left-aligned above the steps.
  const pill = (id, label, fg, tint, dot, hidden) => {
    const w = Math.round(textWidth(label, 14, true) + 46);
    const x = tall ? 20 : W - 24 - w;
    const y = tall ? X[0] - 68 : 13;
    return `<g id="${id}"${hidden ? ' opacity="0"' : ''}><rect x="${x}" y="${y}" width="${w}" height="30" rx="15" fill="${tint}"/>`
      + `<circle cx="${x + 16}" cy="${y + 15}" r="4" fill="${dot}"/><text x="${x + 28}" y="${y + 20}" class="b" font-size="14" fill="${fg}">${esc(label)}</text></g>`;
  };
  const pills = pill('pRun', t.running, P.accent, P.accentTint, P.accent, true)
    + pill('pOk', t.passed, P.okText, P.okTint, P.ok, true)
    + pill('pFail', t.failed, P.failText, P.failTint, P.fail);

  // Step centres: (cx, cy) in the coordinates of the step group.
  const SX = LAYOUTS[layout].SX;
  const at = (i) => (tall ? [SX, X[i]] : [X[i], 0]);
  const line = (a, b) => (tall ? `M${SX} ${a}V${b}` : `M${a} 0H${b}`);

  let steps = '';
  X.forEach((_, i) => {
    const [cx, cy] = at(i);
    const label = tall
      ? `<text id="lab${i}" x="${cx + R + 16}" y="${cy + 6}" class="b" font-size="16" fill="${i === 4 ? P.muted : P.text}">${esc(t.steps[i])}</text>`
      : `<text id="lab${i}" x="${cx}" y="42" class="b" font-size="17" text-anchor="middle" fill="${i === 4 ? P.muted : P.text}">${esc(t.steps[i])}</text>`;
    let node = `<circle r="${R}" fill="${P.surface}" stroke="${P.line}" stroke-width="1.5"/><text y="5" class="b" font-size="14" text-anchor="middle" fill="${P.muted}">${i + 1}</text>`;
    node += `<g id="ok${i}" class="c"${i < 3 ? '' : ' opacity="0"'}><circle r="${R + 0.5}" fill="${P.ok}"/>${check()}</g>`;
    if (i === 3) {
      node = `<circle id="ripple" class="c" r="${R}" fill="none" stroke="${P.fail}" stroke-width="2" opacity="0"/><g id="shake">${node}`
        + `<g id="bad" class="c"><circle r="${R + 0.5}" fill="${P.fail}"/>${cross}</g></g>`;
    }
    if (i === 4) {
      node += `<g id="skip"><circle r="${R + 1}" fill="${P.bg}" stroke="${P.faint}" stroke-width="1.6" stroke-dasharray="4 4"/>`
        + `<text y="5" class="b" font-size="14" text-anchor="middle" fill="${P.faint}">5</text></g>`;
    }
    steps += `<g transform="translate(${cx} ${cy})">${node}</g>${label}`;
  });
  const cap = (id, i, text, fill) => {
    const [cx, cy] = at(i);
    return tall
      ? `<text id="${id}" x="${W - 20}" y="${cy + 5}" font-size="14" text-anchor="end" fill="${fill}">${esc(text)}</text>`
      : `<text id="${id}" x="${cx}" y="62" font-size="14" text-anchor="middle" fill="${fill}">${esc(text)}</text>`;
  };
  const caps = cap('cap3', 3, t.http, P.failText) + cap('cap4', 4, t.notTested, P.muted);
  const gaps = X.map((_, i) => { const [cx, cy] = at(i); return `<circle cx="${cx}" cy="${cy}" r="${R + GAP}" fill="${P.bg}"/>`; }).join('');
  const [px, py] = at(0);

  const track = `<path d="${line(X[0], X[3])}" stroke="${P.line}" stroke-width="2"/>`
    + `<path id="seg" d="${line(X[3], X[4])}" stroke="${P.line}" stroke-width="2" opacity="0"/>`
    + `<path id="dash" d="${line(X[3] + R + GAP + 2, X[4] - R - GAP - 2)}" stroke="${P.faint}" stroke-width="2" stroke-dasharray="3 6" stroke-linecap="round"/>`
    + `<path id="prog" d="${line(X[0], X[4])}" stroke="${P.ok}" stroke-width="2.5" stroke-dasharray="${L} ${L}" stroke-dashoffset="${L - xFail}"/>`
    + gaps
    + `<g id="ring" class="c" opacity="0"><circle cx="${px}" cy="${py}" r="${R + 6}" fill="${P.accent}" fill-opacity=".12" stroke="${P.accent}" stroke-opacity=".55" stroke-width="1.5"/></g>`
    + `<g id="pulse" opacity="0"><circle cx="${px}" cy="${py}" r="11" fill="${P.accent}" fill-opacity=".2"/><circle cx="${px}" cy="${py}" r="5" fill="${P.accent}"/></g>`
    + steps + caps;
  // Wide: the step row sits under the header and the pill stays in the header. Tall: the pill moves with the steps.
  const row = tall ? `<g id="row">${pills}${track}</g>` : `<g transform="translate(0 102)"><g id="row">${track}</g></g>`;

  // Channel chips (Telegram, Email, Slack) starting at x, top at y.
  const chips = (x, y) => ['Telegram', 'Email', 'Slack'].map((name, i) => {
    const w = Math.round(textWidth(name, 13, false) * 1.05 + 40);
    const g = `<g id="chip${i}"><rect x="${x}" y="${y}" width="${w}" height="24" rx="12" fill="${P.bg}" stroke="${P.line}"/>`
      + `<g transform="translate(${x + 15} ${y + 12}) scale(.62)">${check(P.ok)}</g>`
      + `<text x="${x + 26}" y="${y + 16.5}" font-size="13" fill="${P.text}" class="m">${name}</text></g>`;
    x += w + 8;
    return g;
  }).join('');

  // Alert card (chat-style notification).
  const c = CARD;
  const frame = `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="14" fill="${P.surface}" stroke="${P.line}" filter="url(#sh)"/>`
    + `<rect x="${c.x}" y="${c.y}" width="5" height="${c.h}" fill="${P.fail}" clip-path="url(#cc)"/>`;
  let body;
  if (tall) {
    const tx = c.x + 18;
    body = logo(tx, c.y + 16, 28)
      + `<text x="${tx + 40}" y="${c.y + 30}" class="b" font-size="16" fill="${P.text}">${esc(t.alertShort)}</text>`
      + `<text x="${tx + 40}" y="${c.y + 49}" font-size="13" fill="${P.muted}">Aegean Coffee Co. · ${esc(t.now)}</text>`
      + `<text x="${tx}" y="${c.y + 84}" class="b" font-size="17" fill="${P.failText}">${esc(t.diagTitle)}</text>`
      + t.diagLines.map((l, i) => `<text x="${tx}" y="${c.y + 108 + i * 20}" font-size="15" fill="${P.muted}">${esc(l)}</text>`).join('')
      + chips(tx, c.y + 146);
  } else {
    const tx = c.x + 72;
    body = logo(c.x + 24, c.y + 17, 32)
      + `<text x="${tx}" y="${c.y + 31}" class="b" font-size="16" fill="${P.text}">${esc(t.alertTitle)}</text>`
      + `<text x="${c.x + c.w - 22}" y="${c.y + 31}" font-size="13" text-anchor="end" fill="${P.muted}">${esc(t.now)}</text>`
      + `<text x="${tx}" y="${c.y + 57}" class="b" font-size="17" fill="${P.failText}">${esc(t.diagTitle)}</text>`
      + `<text x="${tx}" y="${c.y + 81}" font-size="15" fill="${P.muted}">${esc(t.diagDetail)}</text>`
      + chips(tx, c.y + 97);
  }
  const card = `<g id="card">${frame}${body}</g>`;

  // Header: logo, product name, shop (and, when wide, the status pill).
  const header = tall
    ? `${logo(20, 11, 30)}<text x="58" y="33" font-size="18" class="h" fill="${P.text}">JourneyGuard</text>`
      + `<text x="${W - 20}" y="32" font-size="14" class="m" text-anchor="end" fill="${P.muted}">Aegean Coffee Co.</text>`
    : `${logo(24, 13, 30)}<text x="64" y="34" font-size="18"><tspan class="h" fill="${P.text}">JourneyGuard</tspan><tspan dx="10" fill="${P.faint}">/</tspan><tspan dx="10" class="m" fill="${P.muted}">Aegean Coffee Co.</tspan></text>`
      + pills;
  const HB = tall ? 52 : 56; // header height

  const style = `text{font-family:${SANS}}.b{font-weight:600}.h{font-weight:700}.m{font-weight:500}.c{transform-box:fill-box;transform-origin:center}${css}`
    + '@media (prefers-reduced-motion:reduce){*{animation:none!important}}';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t.label)}" lang="${t.lang}">
<title>${esc(t.label)}</title>
<style>${style}</style>
<defs><filter id="sh" x="-10%" y="-30%" width="120%" height="170%"><feDropShadow dx="0" dy="8" stdDeviation="12" ${P.shadow}/></filter>
<clipPath id="cc"><rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="14"/></clipPath>
<clipPath id="fr"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="17"/></clipPath></defs>
<g clip-path="url(#fr)"><rect width="${W}" height="${H}" fill="${P.bg}"/><rect width="${W}" height="${HB}" fill="${P.surface}"/><path d="M0 ${HB + 0.5}H${W}" stroke="${P.line}"/></g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="17.5" fill="none" stroke="${P.line}"/>
${header}
${row}
${card}
</svg>
`;
}

for (const [lang, suffix] of [['en', ''], ['el', '-el']]) {
  for (const layout of ['wide', 'tall']) {
    for (const theme of ['light', 'dark']) {
      const file = `docs/assets/hero${suffix}${layout === 'tall' ? '-mobile' : ''}-${theme}.svg`;
      const svg = build(theme, TEXT[lang], layout);
      writeFileSync(new URL(`../${file}`, import.meta.url), svg);
      console.log(`${file} written (${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB)`);
    }
  }
}
