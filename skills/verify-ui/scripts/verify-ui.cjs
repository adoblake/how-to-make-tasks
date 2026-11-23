#!/usr/bin/env node
// Browser check for a running site: every page × width × theme.
// Captures screenshots and reports console errors, failed requests, horizontal
// overflow and axe accessibility violations. Exits 1 if anything needs attention.
//
//   node verify-ui.cjs --url http://127.0.0.1:3000 --paths /,/about
//   options: --widths 390,768,1440  --themes light,dark  --out verify-ui-results
//            --ignore-hosts tile.openstreetmap.org,fonts.gstatic.com  --no-axe
//            --wait 500 (extra ms after load, for animations and fetches)

const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

function args(argv) {
  const a = { url: '', paths: '/', widths: '390,768,1440', themes: 'light,dark',
    out: 'verify-ui-results', ignoreHosts: '', axe: true, wait: '500' };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--no-axe') a.axe = false;
    else if (k.startsWith('--')) {
      const key = k.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      a[key] = argv[++i];
    }
  }
  if (!a.url) { console.error('Missing --url (the running site, e.g. http://127.0.0.1:3000)'); process.exit(2); }
  return a;
}

function load(name) {
  // Prefer the project's own copy, then whatever Node can find globally.
  try { return createRequire(path.join(process.cwd(), 'package.json'))(name); } catch {}
  try { return require(name); } catch {}
  return null;
}

async function axeSource() {
  const local = load('axe-core');
  if (local && local.source) return { src: local.source, from: 'project axe-core' };
  const version = '4.10.2';
  const cache = path.join(require('os').homedir(), '.cache', 'studio-kit', `axe-${version}.min.js`);
  if (fs.existsSync(cache)) return { src: fs.readFileSync(cache, 'utf8'), from: `cached axe-core ${version}` };
  const url = `https://cdnjs.cloudflare.com/ajax/libs/axe-core/${version}/axe.min.js`;
  try {
    // curl honours the environment's HTTPS proxy and CA bundle; Node's fetch may not.
    let src;
    try {
      src = require('child_process').execFileSync('curl', ['-fsSL', '--max-time', '30', url], { encoding: 'utf8', maxBuffer: 5e6 });
    } catch {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      src = await res.text();
    }
    fs.mkdirSync(path.dirname(cache), { recursive: true });
    fs.writeFileSync(cache, src);
    return { src, from: `axe-core ${version} (downloaded once, cached)` };
  } catch (e) {
    return { src: null, from: `unavailable (${String(e.message).split('\n')[0]}); install axe-core in the project or pass --no-axe` };
  }
}

const slug = s => s.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home';

(async () => {
  const a = args(process.argv.slice(2));
  const playwright = load('playwright');
  if (!playwright) { console.error('Playwright not found. In cloud sessions it is pre-installed; locally run: npm i -D playwright'); process.exit(2); }
  const paths = a.paths.split(',').map(s => s.trim()).filter(Boolean);
  const widths = a.widths.split(',').map(Number);
  const themes = a.themes.split(',').map(s => s.trim());
  const ignore = a.ignoreHosts.split(',').map(s => s.trim()).filter(Boolean);
  fs.mkdirSync(a.out, { recursive: true });
  const browser = await playwright.chromium.launch();
  const axe = a.axe ? await axeSource() : { src: null, from: 'skipped (--no-axe)' };
  const results = [];
  for (const p of paths) for (const theme of themes) for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme === 'dark' ? 'dark' : 'light', reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const r = { path: p, theme, width, consoleErrors: [], failedRequests: [], blockedHosts: [], overflowPx: 0, axe: [], screenshot: '' };
    const skip = u => { try { return ignore.includes(new URL(u).hostname); } catch { return false; } };
    page.on('console', m => { if (m.type() === 'error') r.consoleErrors.push(m.text().slice(0, 300)); });
    page.on('pageerror', e => r.consoleErrors.push(`Uncaught: ${String(e.message).slice(0, 300)}`));
    page.on('requestfailed', q => {
      if (skip(q.url())) return;
      const why = q.failure() ? q.failure().errorText : 'failed';
      // The cloud proxy refuses some hosts; report those separately, they are environment limits, not bugs.
      if (/ERR_TUNNEL_CONNECTION_FAILED|ERR_CERT|ERR_NAME_NOT_RESOLVED/.test(why)) r.blockedHosts.push(new URL(q.url()).hostname);
      else r.failedRequests.push(`${why} ${q.url().slice(0, 200)}`);
    });
    page.on('response', s => { if (s.status() >= 400 && !skip(s.url())) r.failedRequests.push(`HTTP ${s.status()} ${s.url().slice(0, 200)}`); });

    let status = 0;
    try {
      const resp = await page.goto(new URL(p, a.url).href, { waitUntil: 'load', timeout: 30000 });
      status = resp ? resp.status() : 0;
      await page.waitForTimeout(Number(a.wait));
      r.overflowPx = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
      r.screenshot = path.join(a.out, `${slug(p)}-${theme}-${width}.png`);
      await page.screenshot({ path: r.screenshot, fullPage: true });
      if (axe.src) {
        await page.addScriptTag({ content: axe.src });
        const v = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations
          .filter(x => x.impact === 'serious' || x.impact === 'critical')
          .map(x => ({ id: x.id, impact: x.impact, nodes: x.nodes.length, example: x.nodes[0] && x.nodes[0].target.join(' ') })));
        r.axe = v;
      }
    } catch (e) { r.consoleErrors.push(`Could not load page: ${e.message.split('\n')[0]}`); }
    r.status = status;
    r.blockedHosts = [...new Set(r.blockedHosts)];
    results.push(r);
    await ctx.close();
  }
  await browser.close();

  const problems = r => (r.status >= 400 || r.status === 0 ? 1 : 0) + r.consoleErrors.length + r.failedRequests.length + (r.overflowPx > 0 ? 1 : 0) + r.axe.length;
  const lines = [`# verify-ui: ${a.url}`, '', `axe: ${axe.from}`, '',
    '| page | theme | width | status | console | requests | overflow | axe serious+ |', '|---|---|---|---|---|---|---|---|'];
  for (const r of results) lines.push(`| ${r.path} | ${r.theme} | ${r.width} | ${r.status} | ${r.consoleErrors.length} | ${r.failedRequests.length} | ${r.overflowPx ? r.overflowPx + 'px' : 'ok'} | ${r.axe.length} |`);
  const details = results.filter(problems);
  if (details.length) {
    lines.push('', '## Details');
    for (const r of details) {
      lines.push('', `### ${r.path} · ${r.theme} · ${r.width}px`);
      r.consoleErrors.forEach(x => lines.push(`- console: ${x}`));
      r.failedRequests.forEach(x => lines.push(`- request: ${x}`));
      if (r.overflowPx) lines.push(`- horizontal overflow: ${r.overflowPx}px`);
      r.axe.forEach(x => lines.push(`- axe ${x.impact}: ${x.id} (${x.nodes} element${x.nodes > 1 ? 's' : ''}, e.g. \`${x.example}\`)`));
    }
  }
  const blocked = [...new Set(results.flatMap(r => r.blockedHosts))];
  if (blocked.length) lines.push('', `Not verifiable here (blocked by this environment, not counted as failures): ${blocked.join(', ')}`);
  lines.push('', `Screenshots: ${a.out}/ (look at them; this script can't judge design).`);
  const report = lines.join('\n');
  fs.writeFileSync(path.join(a.out, 'report.md'), report + '\n');
  fs.writeFileSync(path.join(a.out, 'report.json'), JSON.stringify({ url: a.url, axe: axe.from, results }, null, 2));
  console.log(report);
  process.exit(results.some(problems) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
