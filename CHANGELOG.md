# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.1] - 2026-11-08

Fewer false alarms, a Spanish translation and clearer firewall advice. Upgrading from 0.1.0 needs no changes to your configuration.

### Added
- **Spanish** for the guided setup, dashboard, reports, alerts and diagnosis (`language: es`, `--lang es`). Thanks to @masyarakatai ([#11](https://github.com/nxdpro/journeyguard/pull/11)).
- **[Allow-listing guide](docs/firewalls.md)** with steps for Cloudflare, Wordfence, Sucuri and Imunify360. Thanks to @masyarakatai ([#10](https://github.com/nxdpro/journeyguard/pull/10)).
- `run --due` for running from cron; a `.env` file next to the config is read automatically; `--lang` for `demo` and `init`.
- A journey that stays *not tested* for a day sends one alert, so a firewall or CAPTCHA cannot hide a real problem for long.

### Fixed
- Contact forms: newsletter boxes are skipped; Ninja Forms are submitted; time, date-time and other input types are filled; the browser's own validation messages and anti-robot answers count as *not tested*; Greek messages written in capitals are recognised; multi-line messages stay whole.
- WooCommerce: `expectPayments` counts only methods a customer can choose; shops selling subscriptions, bundles or bookings are checked; shops in a folder (`example.gr/eshop/`) are checked inside that folder.
- Cloudflare bot detection on ordinary pages is no longer reported as a firewall block; platforms are detected from technical traces only; a stray `%` in a link no longer stops detection; cookie banners inside shadow DOM and Greek "Άρνηση" buttons are closed.
- Safe mode recognises more final buttons ("Proceed to PayPal", "Παραγγελία τώρα", "Συνέχεια στην πληρωμή").
- `check` never mixes its results with a monitor's history, explains why a site could not be reached and writes reports safely; values taken from variables keep their YAML type; a warning appears when safe mode is off.
- Greek: formal register in the setup wizard, natural alert titles, correct plurals and more translated messages.

### Changed
- Firewall advice everywhere now says to allow-list the server's IP address or a secret header, never the public `X-JourneyGuard` header on its own.
- The Docker image runs on Node 24 and is smoke-tested before it is published; the Compose file follows the `0.1` line; releasing the same version twice is refused.
- Updated dependencies: nodemailer 10.3.1 and Playwright 1.65.0, which brings a newer Chromium.

## [0.1.0] - 2026-10-20

First public release.

### Added
- **Journeys in a real browser** (Playwright/Chromium) with per-stage results, retries and evidence: screenshot, page HTML, console errors, failed requests.
- **Presets** that need no selectors: `website` (error pages, broken scripts and styles, key pages, SSL expiry), `woocommerce` (in-stock product → cart → checkout → payment methods, classic and block checkout), `shopify` (beta) and `contact-form` (Contact Form 7, WPForms, Gravity Forms, Elementor, Fluent Forms, Ninja Forms, Divi and generic forms).
- **`expectPayments`** for WooCommerce: an alert when a named method (for example the card gateway) disappears while others such as cash on delivery remain. Detects Stripe, PayPal, Viva, JCC, Everypay, Cardlink, Nexi, Piraeus, Eurobank/Worldline, IRIS, Revolut, Klarna and more.
- **Custom journeys in YAML**: `goto`, `click`, `fill`, `select`, `check`, `press`, `expectVisible`, `expectHidden`, `expectText`, `expectNoText`, `expectUrl`, `waitFor`, `screenshot`, with fallback selectors.
- **Plain-language diagnosis in English and Greek**: WordPress and PHP fatal errors, lost carts, missing payment methods, failing mail, firewalls, banners in the way, expiring SSL and more. Greek reports and alerts translate the common technical messages too.
- **Alerts on change** via Telegram, Discord, Slack, email and webhooks, with screenshots, retried until delivered. The monitor also watches itself: one alert when it cannot run checks, one when it recovers, and `/healthz` answers 503 meanwhile.
- **Dashboard** with history, "run now", password protection and `/healthz`; **self-contained, white-label HTML reports**.
- **`journeyguard check <url>`**: checks any site once with no setup, never sends a message, results in Greek for `.gr`/`.cy` sites.
- **Guided setup** (`init`) in English or Greek: detects WooCommerce, Shopify and WordPress from the site's code, checks that the contact page really has a form, finds your Telegram chat by itself, sends a test alert and writes `journeyguard.yml` plus a private `.env` with a generated dashboard password.
- `validate`, `test-alerts`, `detect`, and `demo` with a built-in shop that can be broken in 14 different ways.
- **Docker image** (Debian slim with the headless Chromium shell, about 900 MB, amd64 and arm64), Compose file, CI and release workflows.

### Safety and false alarms
- **Safe mode on by default**: an in-page guard refuses order and payment clicks, Enter in checkout fields and scripted order submissions, including custom buttons, web components and shadow DOM, in English and Greek with or without accents. A network backstop blocks order and payment requests (WooCommerce, Shopify, OpenCart, PrestaShop, Magento, Stripe, PayPal) even if a click slips through. Never blocks choosing a payment method; fails closed.
- **Not tested, not broken**: firewall block pages, CAPTCHAs (including Divi's maths question), anti-spam and anti-robot answers ("Επιβεβαιώστε ότι δεν είστε ρομπότ"), free orders and products whose options load on demand are reported as *not tested* with a hint, never as outages, and never count as recoveries.
- **Cookie banners and pop-ups** are closed like a visitor would, always choosing "necessary only".
- Error text only counts on real error pages; PHP errors are found anywhere on the page; sites that merely mention WooCommerce are not mistaken for shops; the right contact form is picked and a sent contact form is never retried.
- Watchdog for frozen pages and frames and a deadline per step; the scheduler survives errors and storage failures; `run` and `check` exit with 1 when a journey fails and 2 when nothing could be checked.
- The dashboard refuses to run on a public address without a strong password; "run now" is protected against cross-site requests; strict Content Security Policy. Extra headers are only sent to the monitored site.

[Unreleased]: https://github.com/nxdpro/journeyguard/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/nxdpro/journeyguard/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/nxdpro/journeyguard/releases/tag/v0.1.0
