const DURATION_RE = /^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)?$/i;
const UNIT_MS: Record<string, number> = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

/** Parses "500ms", "30s", "15m", "24h", "1d" or a bare number of milliseconds. */
export function parseDuration(value: string | number, field = 'duration'): number {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid ${field}: ${value}`);
    return value;
  }
  const match = DURATION_RE.exec(value.trim());
  if (!match) throw new Error(`Invalid ${field}: "${value}" (use e.g. 30s, 15m, 24h)`);
  const unit = (match[2] ?? 'ms').toLowerCase();
  return Math.round(Number(match[1]) * (UNIT_MS[unit] ?? 1));
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  const hours = ms / 3_600_000;
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

const GREEK_MAP: Record<string, string> = {
  α: 'a', ά: 'a', β: 'v', γ: 'g', δ: 'd', ε: 'e', έ: 'e', ζ: 'z', η: 'i', ή: 'i', θ: 'th',
  ι: 'i', ί: 'i', ϊ: 'i', ΐ: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', ό: 'o',
  π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'y', ύ: 'y', ϋ: 'y', ΰ: 'y', φ: 'f', χ: 'ch',
  ψ: 'ps', ω: 'o', ώ: 'o',
};

/** URL/file-safe identifier. Transliterates Greek so "Κατάστημα" becomes "katastima". */
export function slugify(input: string): string {
  const lower = input.toLowerCase();
  let out = '';
  for (const ch of lower) out += GREEK_MAP[ch] ?? ch;
  return (
    out
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'item'
  );
}

/** Replaces ${VAR} and ${VAR:-default} with environment values. */
export function interpolateEnv(value: string, env: NodeJS.ProcessEnv = process.env): string {
  return value.replace(/\$\{([A-Z0-9_]+)(?::-([^}]*))?\}/gi, (_m, name: string, fallback?: string) => {
    const v = env[name];
    if (v !== undefined && v !== '') return v;
    return fallback ?? '';
  });
}

/** Settings that are numbers, so `${RETRIES:-1}` becomes 1, not "1". */
const NUMERIC_KEYS = new Set(['retries', 'keepRuns', 'port', 'sslMinDays', 'width', 'height']);
const SINGLE_PLACEHOLDER = /^\$\{[A-Z0-9_]+(?::-[^}]*)?\}$/i;

export function deepInterpolate<T>(input: T, env: NodeJS.ProcessEnv = process.env, key?: string): T {
  if (typeof input === 'string') {
    const value = interpolateEnv(input, env);
    // A value that is only a placeholder takes the type it would have had in YAML.
    if (SINGLE_PLACEHOLDER.test(input.trim())) {
      if (value === 'true' || value === 'false') return (value === 'true') as T;
      if (key && NUMERIC_KEYS.has(key) && /^-?\d+$/.test(value)) return Number(value) as T;
    }
    return value as T;
  }
  if (Array.isArray(input)) return input.map((v) => deepInterpolate(v, env)) as T;
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) out[k] = deepInterpolate(v, env, k);
    return out as T;
  }
  return input;
}

/**
 * The folder a site lives in, from an address a person typed: https://x.gr/eshop → /eshop/,
 * https://x.gr/eshop/index.php → /eshop/, https://x.gr → /.
 */
export function siteFolder(url: string): string {
  const p = new URL(url).pathname;
  if (p.endsWith('/')) return p;
  const last = p.slice(p.lastIndexOf('/') + 1);
  return last.includes('.') ? p.slice(0, p.lastIndexOf('/') + 1) : `${p}/`;
}

/** The base address of a site: its origin plus the folder the person typed (never one a redirect added). */
export function siteBase(typedUrl: string, finalUrl = typedUrl): string {
  const folder = siteFolder(typedUrl);
  return folder === '/' ? new URL(finalUrl).origin : new URL(finalUrl).origin + folder;
}

export function resolveUrl(base: string, target: string): string {
  const root = new URL(base.endsWith('/') ? base : `${base}/`);
  const folder = root.pathname;
  // A site installed in a folder: "/cart/" means https://example.gr/eshop/cart/, not the domain's root.
  if (target.startsWith('/') && !target.startsWith('//') && folder !== '/' && target !== folder.slice(0, -1) && !target.startsWith(folder)) {
    return new URL(folder + target.slice(1), root).toString();
  }
  return new URL(target, root).toString();
}

export function originOf(url: string): string {
  return new URL(url).origin;
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Removes secrets such as bot tokens from URLs before they are logged. */
export function redact(text: string): string {
  return text
    .replace(/bot\d+:[A-Za-z0-9_-]{20,}/g, 'bot***')
    .replace(/(webhooks\/\d+\/)[A-Za-z0-9_-]+/g, '$1***')
    .replace(/(hooks\.slack\.com\/services\/)[^\s"']+/g, '$1***')
    .replace(/(smtps?:\/\/[^:\s]+:)[^@\s]+@/g, '$1***@');
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
