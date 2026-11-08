# Deployment

JourneyGuard needs Chromium, so the Docker image is the easiest way to run it. One instance comfortably checks dozens of journeys on a small VPS (1 vCPU, 1–2 GB RAM); journeys run one at a time to keep memory flat.

## Docker Compose (recommended)

```bash
mkdir journeyguard && cd journeyguard

# 1. Guided setup: writes journeyguard.yml and .env (dashboard password + alert secrets)
docker run --rm -it --user "$(id -u):$(id -g)" -v "$PWD:/config" ghcr.io/nxdpro/journeyguard \
  init --config /config/journeyguard.yml

# 2. Start
curl -O https://raw.githubusercontent.com/nxdpro/journeyguard/main/docker-compose.yml
docker compose up -d
docker compose logs -f
```

The dashboard is on port 8080; sign in with any username and the password from `.env`. Check that alerts arrive with `docker compose run --rm journeyguard test-alerts`. Every `${VARIABLE}` that `journeyguard.yml` references must be in `.env` (the guided setup takes care of the ones it creates). JourneyGuard refuses to serve the dashboard on a public address without a password of at least 10 characters. Results live in the `journeyguard-data` volume.

If the dashboard is reachable from the internet, put it behind a reverse proxy with HTTPS (Caddy, Nginx, Traefik) and set `dashboard.publicUrl` so alerts link to it. Example Caddyfile:

```
monitor.example.com {
  reverse_proxy localhost:8080
}
```

With a reverse proxy in front, change the port line in `docker-compose.yml` to `"127.0.0.1:8080:8080"` so the dashboard is reachable only through the proxy.

Custom headers you set for a site (for example a firewall allow-list token) are sent only to that site. If the site redirects to another domain, the browser follows without them.

Monitor the monitor: point Uptime Kuma or any uptime checker at `/healthz` (no password needed). It answers `200 {"ok":true}` while checks are running, and `503 {"ok":false}` when JourneyGuard itself cannot check (for example the browser no longer starts). JourneyGuard also sends one "cannot run checks" alert in that case, and another when checks resume.

Upgrade with `docker compose pull && docker compose up -d`: the Compose file follows the 0.1 line, which receives bug fixes. To move to a new version (0.2), read its release notes, then change the `image:` line in `docker-compose.yml`.

## One-off checks and reports

`check` looks at any site once, without a configuration file, alerts or saved history. It detects the platform, runs the journeys that fit, fills in the contact form without sending it, and exits with 1 if a journey is broken (2 if nothing could be checked):

```bash
docker run --rm ghcr.io/nxdpro/journeyguard check https://shop.example.com

# With an HTML report in the current folder, in Greek
docker run --rm --user "$(id -u):$(id -g)" -e HOME=/tmp -e JOURNEYGUARD_DATA_DIR=/tmp/jg -v "$PWD:/out" \
  ghcr.io/nxdpro/journeyguard check https://shop.example.com --lang el --report /out/report.html
```

`--json` prints the detection and every result as JSON; `--send-test-message` really submits the contact form once. This is the quickest way to run a free health check for a prospect or a new client, with their permission.

## Node.js with systemd

Requires Node.js 22+ and root access for the browser's system libraries.

```bash
sudo useradd --system --create-home --home-dir /opt/journeyguard --shell /usr/sbin/nologin journeyguard
# The latest release (the newest tag), not the work in progress on main
sudo -u journeyguard -H sh -c 'git clone https://github.com/nxdpro/journeyguard /opt/journeyguard/app && cd /opt/journeyguard/app && git checkout -q "$(git describe --tags --abbrev=0)" && npm ci && npm run build'

# Chromium where the service user can read it, plus its system libraries. Run it from the app
# folder so the Chromium build matches the bundled Playwright version.
sudo sh -c 'cd /opt/journeyguard/app && PLAYWRIGHT_BROWSERS_PATH=/opt/journeyguard/browsers npx playwright install --with-deps chromium'
sudo chown -R journeyguard: /opt/journeyguard/browsers

# Guided setup: writes journeyguard.yml and a private .env (dashboard password + alert secrets)
sudo -u journeyguard -H sh -c 'cd /opt/journeyguard && node app/dist/src/bin.js init https://your-site.com --config /opt/journeyguard/journeyguard.yml'
```

`/etc/systemd/system/journeyguard.service`:

```ini
[Unit]
Description=JourneyGuard
After=network-online.target
Wants=network-online.target

[Service]
User=journeyguard
WorkingDirectory=/opt/journeyguard
Environment=PLAYWRIGHT_BROWSERS_PATH=/opt/journeyguard/browsers
EnvironmentFile=/opt/journeyguard/.env
ExecStart=/usr/bin/node /opt/journeyguard/app/dist/src/bin.js start --config /opt/journeyguard/journeyguard.yml
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now journeyguard
journalctl -u journeyguard -f
```

The dashboard listens on 127.0.0.1:8080 by default; expose it through a reverse proxy (see above) or set `dashboard.host: 0.0.0.0` together with a strong password.

To upgrade to the latest release (read the [changelog](../CHANGELOG.md) first): `sudo -u journeyguard -H sh -c 'cd /opt/journeyguard/app && git fetch -q --tags origin && git checkout -q "$(git describe --tags --abbrev=0 origin/main)" && npm ci && npm run build'`, run the `playwright install` line again (a new Playwright version needs its matching Chromium), then `sudo systemctl restart journeyguard`.

## Cron instead of a long-running process

Cron starts with an almost empty environment, so point at the browsers yourself (JourneyGuard reads the `.env` next to the config by itself). Use `run --due`: it runs only the journeys whose `interval` has passed, so a contact form set to 24h is still sent once a day although cron calls every 15 minutes. In the service user's crontab (`sudo crontab -u journeyguard -e`):

```cron
*/15 * * * * cd /opt/journeyguard && PLAYWRIGHT_BROWSERS_PATH=/opt/journeyguard/browsers node app/dist/src/bin.js run --due --config journeyguard.yml >> run.log 2>&1
```

Alerts still fire on state changes because state is stored in `dataDir`. To browse the results, serve the dashboard separately (it only reads the data folder): `node app/dist/src/bin.js serve --config journeyguard.yml`.

Two things only the long-running `start` can do: the "JourneyGuard cannot run checks" alert (with cron, watch for exit code 2 instead, for example with your cron's mail), and a meaningful `/healthz` (under `serve` it always answers 200, because `serve` cannot see whether cron is still running).

## CI: smoke-test every deploy

Run the same journeys after each deploy and fail the pipeline when one breaks. `--no-alerts` ignores the alert settings (and their secrets); the HTML report with screenshots is attached to the run. Every `run` checks every journey, so in a CI configuration set `submit: false` on `contact-form` journeys, or each deploy sends a real message.

```yaml
# .github/workflows/smoke.yml
name: Post-deploy smoke test
on:
  deployment_status:
jobs:
  journeys:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - name: Run journeys
        run: |
          docker run --rm -v "$PWD:/work" -w /work -e HOME=/tmp -e JOURNEYGUARD_DATA_DIR=/tmp/jg \
            --user "$(id -u):$(id -g)" ghcr.io/nxdpro/journeyguard \
            run --config journeyguard.yml --no-alerts --report report.html
      - uses: actions/upload-artifact@v7
        if: always()
        with: { name: journeyguard-report, path: report.html }
```

## Changing the configuration

Edit `journeyguard.yml` (and `.env` for new secrets), check it, then restart:

```bash
docker compose run --rm journeyguard validate
docker compose up -d --force-recreate     # systemd: sudo systemctl restart journeyguard
```

`docker compose restart` alone does not reload `.env`.

## Troubleshooting

- **Logs:** `docker compose logs -f`, or `journalctl -u journeyguard -f` with systemd.
- **"the environment variable X is not set":** add `X` to `.env` next to `journeyguard.yml`, then restart.
- **"Chromium is not installed" or missing libraries** (Node.js only): run the `playwright install --with-deps` line again from the app folder.
- **A journey shows *not tested* behind a firewall:** see [Allow-listing JourneyGuard](firewalls.md) for Cloudflare, Wordfence, Sucuri and Imunify360.
- **A false alarm:** run the site's journeys once with details, `journeyguard run --site "My Shop" --no-alerts` (with Docker Compose: `docker compose run --rm journeyguard run --site "My Shop" --no-alerts`; if the site has a contact-form journey, this also sends its test message), then [report it](https://github.com/nxdpro/journeyguard/issues/new/choose). `check` is not the same test: it runs only the presets it detects, without your options, custom journeys or headers. False alarms are the bugs we fix first.

## Backups

Back up three things: `journeyguard.yml`, `.env` (it holds secrets, so keep the copy private) and `dataDir` (one folder per run with JSON, PNG and HTML files, plus `state.json`, the alert state). Losing `dataDir` only loses history. With Docker Compose the data is in a named volume:

```bash
docker run --rm -v journeyguard_journeyguard-data:/data:ro -v "$PWD:/backup" busybox tar czf /backup/journeyguard-data.tgz -C /data .
```

(`docker volume ls` shows the exact volume name.)

## Uninstall

- Docker Compose: `docker compose down -v` in the folder, then delete the folder (`-v` also deletes the stored history).
- systemd: `sudo systemctl disable --now journeyguard`, delete `/etc/systemd/system/journeyguard.service`, then `sudo userdel -r journeyguard` (removes `/opt/journeyguard`).
