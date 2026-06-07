// Capture real screenshots of the running Verity app (dark mode) for the landing gallery.
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'assets', 'shots');
const BASE = 'http://localhost:5174';

const pages = [
  { slug: 'dashboard',    url: '/',                      wait: 1500 },
  { slug: 'theater',      url: '/theater',               wait: 3500 },
  { slug: 'controls',     url: '/controls',              wait: 1500 },
  { slug: 'findings',     url: '/findings',              wait: 1500 },
  { slug: 'verification', url: '/verification',          wait: 1500 },
  { slug: 'agent-ask',    url: '/agent/ask',             wait: 1500 },
  { slug: 'evidence',     url: '/evidence',              wait: 1500 },
  { slug: 'model-policy', url: '/settings/model-policy', wait: 1200 },
];

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1500, height: 940 },
    deviceScaleFactor: 2, // retina-crisp
  });
  // force dark theme before the app boots
  await ctx.addInitScript(() => localStorage.setItem('verity-theme', 'dark'));

  const page = await ctx.newPage();

  // --- sign in ---
  console.log('signing in...');
  await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' });
  await page.locator('form input[type="email"]').fill('admin@acme.test');
  await page.locator('form input[type="password"]').fill('verity-demo');
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL((u) => !u.pathname.includes('sign-in'), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // ensure dark applied on document too
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });

  for (const p of pages) {
    try {
      console.log(`capturing ${p.slug} (${p.url})`);
      await page.goto(`${BASE}${p.url}`, { waitUntil: 'networkidle', timeout: 25000 });
      await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
      await page.waitForTimeout(p.wait);
      // viewport shot (framed, consistent) — good for the gallery
      await page.screenshot({ path: path.join(OUT, `${p.slug}.png`) });
    } catch (e) {
      console.log(`  ! ${p.slug} failed: ${e.message}`);
    }
  }

  await browser.close();
  console.log('done →', OUT);
};

run().catch((e) => { console.error(e); process.exit(1); });
