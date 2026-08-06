// Re-capture a single screen. Usage: node capture-one.mjs <slug> <url>
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'assets', 'shots');
const BASE = 'http://localhost:5174';
const CREDS = { email: 'admin@northwind.test', password: 'northwind-demo-01' };

const slug = process.argv[2] || 'engagements';
const url = process.argv[3] || '/engagements';

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 940 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('verity-theme', 'dark'));
  const page = await ctx.newPage();

  await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' });
  await page.locator('form input[type="email"]').fill(CREDS.email);
  await page.locator('form input[type="password"]').fill(CREDS.password);
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL((u) => !u.pathname.includes('sign-in'), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1800);
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });

  console.log(`capturing ${slug} (${url})`);
  await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(OUT, `${slug}.png`) });

  await browser.close();
  console.log('done →', path.join(OUT, `${slug}.png`));
};
run().catch((e) => { console.error(e); process.exit(1); });
