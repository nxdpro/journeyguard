# Safety and responsible use

JourneyGuard drives a real browser through real shops. It is designed so that doing that is safe.

## No real orders, no real payments

- **Safe mode is on by default.** Before every click JourneyGuard inspects the target. Buttons that look like the final step of a purchase are refused: `#place_order`, WooCommerce block checkout buttons, Shopify's pay button, OpenCart's confirm button, and labels such as *Place order*, *Confirm order*, *Complete order*, *Pay now*, *Pay €24.90*, *Ολοκλήρωση παραγγελίας*, *Καταχώρηση παραγγελίας*, *Πληρωμή τώρα*, matched regardless of case and accents (so CSS uppercasing does not fool it). A refused click fails the journey with a clear message instead of placing an order.
- **A guard inside the page** backs this up at the moment an action happens: it blocks clicks on order buttons (including on an icon or text inside them, custom buttons and web components), pressing Enter in a checkout field, and page scripts that submit the order form. Selecting a payment method (a radio or its label) is never blocked.
- **A network backstop** blocks requests that would place an order or capture a payment (WooCommerce, Shopify, OpenCart, PrestaShop, Magento, Stripe, PayPal), even after an innocent-looking click. The journey then fails with *Safe mode blocked an order request*.
- Safe mode **fails closed**: only an explicit `safeMode: false` turns it off, and `run`, `start` and the dashboard then show a warning.
- The shop presets **stop once the payment step has loaded**. They verify that customers could pay (payment methods offered, payment providers detected, place-order button present) without paying.
- To test a full purchase, use a staging store or a store whose payment gateway is in **test mode**, write a custom journey, and set `safeMode: false` for that configuration only.

## Side effects you should know about

- **Carts:** shop journeys add one item to a cart in a fresh browser session that is discarded afterwards. WooCommerce keeps abandoned sessions for up to 48 hours; if you use abandoned-cart emails, make sure they require an email address (JourneyGuard never enters one at checkout).
- **Contact forms send real messages.** The `contact-form` preset runs every 24 hours by default and is never retried within a run. `journeyguard run` checks every journey each time you call it, so in cron use `run --due`, and in CI set `submit: false`. Use a monitoring address in the `email` option and a mail rule to file the messages away. `journeyguard check` never sends unless you add `--send-test-message`.
- **Cookie banners and pop-ups** are closed like a visitor would, always choosing "necessary only". Consent tools may log one refusal per check.
- **Analytics:** the user agent of every request contains `JourneyGuard/<version>`, and requests to your site also carry the header `X-JourneyGuard: 1`. In Google Tag Manager, add a trigger exception for visits whose user agent contains `JourneyGuard`; in server-side analytics or CDN logs you can filter on either. Cookie banners are answered with "necessary only", so tracking that respects consent does not run.
- **Stock:** adding to cart does not reduce stock in WooCommerce or Shopify.

## Firewalls and bot protection

JourneyGuard identifies itself honestly and does **not** try to evade bot protection or solve CAPTCHAs. If Cloudflare, Sucuri, Wordfence, Imunify360 or rate limiting show a block page, the journey is reported as *not tested* (no alert) with a hint. A plain "403 Forbidden" from a firewall JourneyGuard does not recognise counts as a failure, because real visitors may be refused too. Forms with a visible CAPTCHA are reported as *not tested*; use `submit: false`, or a CAPTCHA test key on a staging copy, if you need them covered.

### Letting the monitor through a firewall

Allow-list something only you can send:

1. **The IP address of the server JourneyGuard runs on** (simplest), or
2. **A secret header for that site**, then allow-list requests that carry it:

   ```yaml
   sites:
     - name: My Shop
       url: https://shop.example.com
       headers:
         X-Monitor-Token: ${SHOP_MONITOR_TOKEN}   # a long random value kept in .env
   ```

   In Cloudflare, for example: Security → WAF → Custom rules → *Skip* when the request header `X-Monitor-Token` equals your value.

Never allow-list the public `X-JourneyGuard: 1` header or the `JourneyGuard` user agent on their own: they are documented here, so anyone can send them. Extra headers, including such secrets, are only sent to the monitored site, never to third-party scripts or payment providers; if the site redirects to another domain, the browser follows without them.

Step-by-step instructions for Cloudflare, Wordfence, Sucuri and Imunify360: [Allow-listing JourneyGuard](firewalls.md).

## Only monitor what you are allowed to

Run JourneyGuard against sites you own, operate, or have written permission to test. Automated purchases and form submissions against third-party sites may breach their terms of service and the law.

## Your data

Everything stays on your server: results and screenshots live in `dataDir`, and JourneyGuard sends nothing anywhere except the alerts you configure. Screenshots can contain whatever the page showed, so protect the dashboard with a password and keep `dataDir` private. Use dedicated low-privilege test accounts for journeys that log in, and pass their credentials through environment variables.

## Reporting security issues

See [SECURITY.md](../SECURITY.md).
