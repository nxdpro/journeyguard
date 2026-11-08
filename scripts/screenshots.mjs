// Regenerates the README images from the demo shop: `npm run build && node scripts/screenshots.mjs`
// (JG_LANG=el for the Greek ones, which get an -el suffix).
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { normalizeConfig } from '../dist/src/config.js';
import { resolveSites } from '../dist/src/resolve.js';
import { Engine } from '../dist/src/engine.js';
import { createServer, listen } from '../dist/src/server.js';
import { renderReport, buildViews } from '../dist/src/report.js';
import { startDemoShop } from '../dist/src/demo/shop.js';
import { buildMessage } from '../dist/src/alerts/message.js';

const out = path.resolve('docs/assets');
await mkdir(out, { recursive: true });
const lang = process.env.JG_LANG === 'el' ? 'el' : 'en';

// Optional: map a friendly hostname to 127.0.0.1 in /etc/hosts and set JG_DEMO_URL=http://aegean-coffee.example
const demoUrl = process.env.JG_DEMO_URL;
const shop = await startDemoShop(demoUrl ? Number(new URL(demoUrl).port || 80) : 0, 'none');
const siteUrl = demoUrl ?? shop.url;
const dataDir = await mkdtemp(path.join(os.tmpdir(), 'jg-shots-'));
const config = normalizeConfig({
  settings: { dataDir, timeout: '8s', retries: 0, language: lang },
  sites: [
    {
      name: 'Aegean Coffee Co.',
      url: siteUrl,
      journeys: [
        { preset: 'woocommerce' },
        { preset: 'contact-form', options: { path: '/contact/' } },
        { preset: 'website', options: { ssl: false, pages: ['/shop/'] } },
      ],
    },
  ],
});
const sites = resolveSites(config);
const engine = new Engine(config, sites, {}, { save: true, alert: false });
const [site] = sites;
const [woo, contact, web] = site.journeys;

// Build some history so the dashboard looks lived-in.
for (let i = 0; i < 6; i++) await engine.run([{ site, journey: woo }, { site, journey: contact }, { site, journey: web }]);
shop.setMode('checkout');
const [failedRun] = await engine.run([{ site, journey: woo }]);
shop.setMode('contact');
await engine.run([{ site, journey: contact }]);
shop.setMode('none');

const server = createServer({ config, sites });
const port = await listen(server, '127.0.0.1', 0);
const browser = await chromium.launch({ executablePath: process.env.JOURNEYGUARD_CHROMIUM_PATH || undefined });
const suffix = lang === 'el' ? '-el' : '';
const file = (name) => path.join(out, `${name}${suffix}.png`);

// Lazy images (the failure screenshot) must be loaded before a page is measured or captured.
const loadImages = (page) => page.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
// The bottom edge (CSS px from the top of the page) of the first element matching `sel`, plus `pad`.
const bottomOf = (page, sel, pad = 0) => page.evaluate(([s, p]) => Math.ceil(document.querySelector(s).getBoundingClientRect().bottom + scrollY + p), [sel, pad]);
const capture = async (page, height, to) => page.screenshot({ path: to, fullPage: true, clip: { x: 0, y: 0, width: page.viewportSize().width, height } });

// The README dashboard: the top of the dashboard, with the failing checkout and its diagnosis. Light and dark have the same size.
for (const scheme of ['light', 'dark']) {
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 700 }, deviceScaleFactor: 2, colorScheme: scheme });
  await desktop.goto(`http://127.0.0.1:${port}/`);
  await loadImages(desktop);
  await desktop.screenshot({ path: file(scheme === 'dark' ? 'dashboard-dark' : 'dashboard'), fullPage: false });
  await desktop.close();
}

// The e-mail alert an owner receives, on a phone: the whole message.
const shot = engine.store.artifactPath(failedRun.siteId, failedRun.journeyId, failedRun.id, 'failure.png');
const message = buildMessage(failedRun, 'failure', lang, { screenshotPath: shot, publicUrl: 'https://monitor.example.com' });
const alertFile = path.join(dataDir, 'alert.html');
await writeFile(alertFile, message.emailHtml.replace('cid:failure-screenshot', `file://${shot}`).replace('<body style="', '<body style="margin:16px;background:#fff;'));
const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await phone.goto(`file://${alertFile}`);
await loadImages(phone);
const alertHeight = await bottomOf(phone, 'body > :last-child', 16);
const alertPng = await capture(phone, alertHeight, file('alert'));
await phone.close();

// The dashboard on a phone, light and dark: one screen that runs down into the failure screenshot, so the bottom
// edge cuts through that image and never through text. The phone pair below uses the same height for both
// screens; the e-mail, if shorter, continues white below its last line.
const phoneScreens = {};
let screenH = alertHeight;
for (const scheme of ['light', 'dark']) {
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme });
  await mobile.goto(`http://127.0.0.1:${port}/`);
  await loadImages(mobile);
  const shotTop = await mobile.evaluate(() => Math.ceil(document.querySelector('.journey img.shot').getBoundingClientRect().top + scrollY));
  screenH = Math.max(screenH, shotTop + 72);
  phoneScreens[scheme] = mobile;
}
for (const scheme of ['light', 'dark']) {
  const mobile = phoneScreens[scheme];
  phoneScreens[scheme] = { png: await capture(mobile, screenH, file(scheme === 'dark' ? 'dashboard-mobile-dark' : 'dashboard-mobile')) };
  await mobile.close();
}

// Frames: the phone pair side by side in simple device frames (phones.png, phones-dark.png), and the client report
// with a thin border and rounded corners, so both keep a clean edge on GitHub's white and dark pages.
const FRAME = {
  light: { bezel: '#f6f8fc', line: '#dde3ef', shadow: '0 10px 28px rgba(15,23,42,.10)' },
  dark: { bezel: '#141d33', line: '#26324f', shadow: 'none' },
};
const dataUrl = (png) => `data:image/png;base64,${png.toString('base64')}`;
const framePage = async (html, width, to) => {
  const page = await browser.newPage({ viewport: { width, height: 400 }, deviceScaleFactor: 2 });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${html}</body></html>`);
  await loadImages(page);
  await page.locator('#frame').screenshot({ path: to, omitBackground: true });
  await page.close();
};
const SCREEN_H = screenH;
for (const scheme of ['light', 'dark']) {
  const f = FRAME[scheme];
  const device = (png, bg) => `<div style="padding:12px;border-radius:36px;background:${f.bezel};border:1px solid ${f.line};box-shadow:${f.shadow}">`
    + `<div style="width:390px;height:${SCREEN_H}px;border-radius:24px;overflow:hidden;background:${bg};box-shadow:0 0 0 1px ${f.line}">`
    + `<img src="${dataUrl(png)}" style="display:block;width:390px"></div></div>`;
  await framePage(`<div id="frame" style="display:inline-flex;gap:40px;align-items:flex-start;padding:16px 24px 36px">`
    + `${device(alertPng, '#ffffff')}${device(phoneScreens[scheme].png, '#ffffff')}</div>`, 1000, file(scheme === 'dark' ? 'phones-dark' : 'phones'));
}

// The self-contained client report. It stays light (it is sent to clients as is).
const html = await renderReport(await buildViews(sites, engine.store), config.settings, (run, f) => engine.store.artifactPath(run.siteId, run.journeyId, run.id, f));
const reportFile = path.join(dataDir, 'report.html');
await writeFile(reportFile, html);
const report = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 });
await report.goto(`file://${reportFile}`);
await loadImages(report);
const reportPng = await report.screenshot({ fullPage: false });
await report.close();
await framePage(`<div id="frame" style="display:inline-block;border:1px solid #dde3ef;border-radius:12px;overflow:hidden">`
  + `<img src="${dataUrl(reportPng)}" style="display:block;width:1100px"></div>`, 1102, file('report'));

await browser.close();
server.close();
await shop.close();
console.log(`Screenshots written to ${out}`);
