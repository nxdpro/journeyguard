# Alerts

JourneyGuard sends an alert when a journey **breaks** (passing → failing) and when it **recovers** (failing → passing, including how long it was down). Repeated failures do not re-alert, and warnings (slow pages, intermittent failures) only appear on the dashboard. With `retries: 1` (the default) a single network blip never wakes anyone up (contact forms are never retried, so a check never sends two messages).

- If no channel accepted an alert (for example Telegram was briefly down), it is sent again on the next run, so an outage is never silently missed.
- A run that could not verify the broken step (a CAPTCHA or firewall challenge appeared) is not reported as a recovery.
- If a firewall or bot-protection challenge appears, see [Allow-listing JourneyGuard](firewalls.md) for Cloudflare, Wordfence, Sucuri and Imunify360 guidance.
- When the monitor itself fails (the browser crashed, the server ran out of memory) no outage alert is sent; the dashboard shows a *Monitor* warning. After 3 checks in a row cannot run, you get a single "JourneyGuard cannot run checks" alert, and a "checking again" alert once it works. This needs the long-running `journeyguard start` (Docker, systemd); with cron, watch the exit code instead (2 = could not check).
- A journey that stays *not tested* (a firewall, CAPTCHA or banner stops every check) never alerts on each run, but after a day (or three intervals, whichever is longer) you get one "could not be tested for a while" alert with the reason, so nothing goes unwatched without you knowing.
- Every alert goes to every channel listed; alerts per site are planned for v0.2. An optional `name:` labels a channel in logs and in `test-alerts`.
- `journeyguard run --no-alerts` ignores the `alerts` section completely, so CI runs do not need the alert secrets.

Test every configured channel with:

```bash
journeyguard test-alerts
```

## Telegram

The guided setup does this for you: run `journeyguard init`, choose Telegram, paste the bot token and send any message to the bot; it finds the chat, sends a test message and saves both values in `.env`.

By hand:

1. Talk to [@BotFather](https://t.me/BotFather), create a bot, copy the token.
2. Send any message to your bot (or add it to a group), then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `chat.id`.

```yaml
- type: telegram
  botToken: ${TELEGRAM_BOT_TOKEN}
  chatId: ${TELEGRAM_CHAT_ID}
```

The failure screenshot is sent as a photo after the message.

## Discord

Channel settings → Integrations → Webhooks → New webhook → copy URL.

```yaml
- type: discord
  webhookUrl: ${DISCORD_WEBHOOK_URL}
```

The failure screenshot is attached to the message.

## Slack

Create an [incoming webhook](https://api.slack.com/messaging/webhooks).

```yaml
- type: slack
  webhookUrl: ${SLACK_WEBHOOK_URL}
```

## Email

Any SMTP server. The screenshot is embedded in the email.

```yaml
- type: email
  smtp: ${SMTP_URL}            # smtp://user:pass@smtp.example.com:587  or  smtps://...:465
  from: "JourneyGuard <monitor@example.com>"
  to: [owner@example.com, developer@example.com]
```

## Webhook

POSTs JSON to any URL, for n8n, Make, Zapier, PagerDuty bridges or your own systems:

```json
{
  "event": "failure",
  "title": "❌ My Shop: Shop checkout (WooCommerce) journey failed",
  "site": { "id": "my-shop", "name": "My Shop", "url": "https://shop.example.com" },
  "journey": { "id": "woocommerce", "name": "Shop checkout (WooCommerce)" },
  "status": "failed",
  "failedStage": "Checkout",
  "stages": [{ "name": "Website", "status": "passed" }, { "name": "Checkout", "status": "failed", "error": "HTTP 500 on …" }],
  "hints": [{ "id": "wp-critical", "severity": "critical", "title": "PHP/WordPress fatal error", "detail": "…" }],
  "link": "https://monitor.example.com/#my-shop%2Fwoocommerce"
}
```

```yaml
- type: webhook
  url: https://hooks.example.com/journeyguard
```

`event` is `failure`, `recovery`, `test`, `untested` (a journey has been *not tested* for a day, or three intervals if that is longer), `monitor` (JourneyGuard itself cannot run checks) or `monitor-recovered`. Webhooks are not signed: put a secret in the URL (`url: https://hooks.example.com/journeyguard?token=${WEBHOOK_TOKEN}`) and check it on the receiving side.

Set `language: el` for Greek or `language: es` for Spanish alerts, and `dashboard.publicUrl` to include a link to the dashboard.
