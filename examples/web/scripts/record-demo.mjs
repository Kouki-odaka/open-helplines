/**
 * record-demo.mjs — Playwright headless demo recorder for Open Helplines
 *
 * Records a 60-second walkthrough of the site and outputs:
 *   public/assets/demo.webm  (raw Playwright recording)
 *
 * Usage:
 *   node scripts/record-demo.mjs [--url BASE_URL]
 *
 * Defaults to GitHub Pages: https://kouki-odaka.github.io/open-helplines
 *
 * After recording, run scripts/convert-demo.sh to produce demo.mp4 and demo.gif
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(SCRIPT_DIR, '../public/assets');
const OUTPUT_WEBM = path.join(ASSETS_DIR, 'demo.webm');

const BASE_URL = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1].replace(/\/$/, '')
  : 'https://kouki-odaka.github.io/open-helplines';

const VIEWPORT = { width: 1280, height: 800 };

/** ms helper */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

/**
 * Navigate to a path and wait for network idle.
 * @param {import('playwright').Page} page
 * @param {string} localePath  e.g. '/en/globe'
 */
async function goto(page, localePath) {
  await page.goto(`${BASE_URL}${localePath}`, {
    waitUntil: 'networkidle',
    timeout: 30_000,
  });
}

/**
 * Smoothly hover over an element matching selector, then move away.
 * @param {import('playwright').Page} page
 * @param {string} selector
 */
async function hoverElement(page, selector) {
  try {
    const element = page.locator(selector).first();
    await element.waitFor({ state: 'visible', timeout: 5_000 });
    await element.hover();
    await wait(800);
    await page.mouse.move(VIEWPORT.width / 2, VIEWPORT.height / 2);
  } catch {
    // Element may not be present on all pages – skip gracefully
  }
}

/**
 * Move mouse in a slow arc across the canvas to simulate globe rotation.
 * @param {import('playwright').Page} page
 */
async function sweepGlobe(page) {
  const centerX = VIEWPORT.width / 2;
  const centerY = VIEWPORT.height / 2;
  await page.mouse.move(centerX - 200, centerY);
  for (let x = centerX - 200; x <= centerX + 200; x += 10) {
    await page.mouse.move(x, centerY, { steps: 2 });
    await wait(40);
  }
}

/**
 * Drag the heatmap time slider from its current position to the right.
 * @param {import('playwright').Page} page
 */
async function dragTimeSlider(page) {
  try {
    // Radix UI Slider thumb
    const thumb = page.locator('[role="slider"]').first();
    await thumb.waitFor({ state: 'visible', timeout: 5_000 });
    const box = await thumb.boundingBox();
    if (!box) return;

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    for (let dx = 0; dx <= 200; dx += 10) {
      await page.mouse.move(startX + dx, startY, { steps: 2 });
      await wait(50);
    }
    await page.mouse.up();
  } catch {
    // Slider not present – skip
  }
}

/**
 * Type a search query into the crisis-finder search input.
 * @param {import('playwright').Page} page
 * @param {string} query
 */
async function typeSearchQuery(page, query) {
  try {
    const input = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i]').first();
    await input.waitFor({ state: 'visible', timeout: 5_000 });
    await input.click();
    await wait(300);
    await input.type(query, { delay: 80 });
    await wait(800);
  } catch {
    // Input not found – skip
  }
}

/**
 * Click a language switcher link for the given locale code.
 * @param {import('playwright').Page} page
 * @param {string} locale  e.g. 'ja'
 */
async function switchLanguage(page, locale) {
  try {
    // The SiteHeader renders locale links — try link text and href patterns
    const localeLink = page.locator(`a[href*="/${locale}/"], a[href*="/${locale}"]`).first();
    await localeLink.waitFor({ state: 'visible', timeout: 5_000 });
    await localeLink.click();
    await page.waitForLoadState('networkidle', { timeout: 15_000 });
  } catch {
    // Navigate directly as fallback
    const currentPath = new URL(page.url()).pathname.replace(/^\/open-helplines/, '');
    const pathParts = currentPath.split('/').filter(Boolean);
    const withoutLocale = pathParts.slice(1).join('/');
    await goto(page, `/${locale}/${withoutLocale}`);
  }
}

// ---------------------------------------------------------------------------
// Main recording scenario (≈ 60 s)
// ---------------------------------------------------------------------------
async function recordDemo() {
  console.log(`🎬  Recording demo from: ${BASE_URL}`);
  console.log(`📁  Output: ${OUTPUT_WEBM}`);

  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      // Enable WebGL for Three.js globe
      '--enable-webgl',
      '--use-gl=swiftshader',
      '--enable-accelerated-2d-canvas',
    ],
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: {
      dir: ASSETS_DIR,
      size: VIEWPORT,
    },
    // Hide cursor from recording
    hasTouch: false,
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  try {
    // ------------------------------------------------------------------
    // 1. /globe — 3D globe (≈ 10 s)
    // ------------------------------------------------------------------
    console.log('  → [1/9] /en/globe');
    await goto(page, '/en/globe');
    await wait(1_500);          // let Three.js render
    await sweepGlobe(page);     // slow pan to show interactivity
    await wait(2_000);

    // ------------------------------------------------------------------
    // 2. Japan click → country panel (≈ 5 s)
    // ------------------------------------------------------------------
    console.log('  → [2/9] click Japan');
    // Click approximate position of Japan on the 1280×800 globe
    await page.mouse.click(840, 330);
    await wait(4_000);

    // ------------------------------------------------------------------
    // 3. /network — force-directed graph (≈ 5 s)
    // ------------------------------------------------------------------
    console.log('  → [3/9] /en/network');
    await goto(page, '/en/network');
    await wait(2_000);
    // Hover over a node (SVG circle)
    await hoverElement(page, 'svg circle');
    await wait(2_000);

    // ------------------------------------------------------------------
    // 4. /heatmap — time slider (≈ 5 s)
    // ------------------------------------------------------------------
    console.log('  → [4/9] /en/heatmap');
    await goto(page, '/en/heatmap');
    await wait(1_500);
    await dragTimeSlider(page);
    await wait(2_000);

    // ------------------------------------------------------------------
    // 5. /globe?q=suicide — Emergency Banner (≈ 5 s)
    // ------------------------------------------------------------------
    console.log('  → [5/9] Emergency Banner');
    await goto(page, '/en/globe?q=suicide');
    await wait(4_000);

    // ------------------------------------------------------------------
    // 6. /crisis-finder — local search + Privacy badge (≈ 5 s)
    // ------------------------------------------------------------------
    console.log('  → [6/9] /en/crisis-finder');
    await goto(page, '/en/crisis-finder');
    await wait(1_500);
    await typeSearchQuery(page, 'Japan');
    await wait(2_500);

    // ------------------------------------------------------------------
    // 7. /donate — donate page (≈ 5 s)
    // ------------------------------------------------------------------
    console.log('  → [7/9] /en/donate');
    await goto(page, '/en/donate');
    await wait(4_000);

    // ------------------------------------------------------------------
    // 8. Language switch en → ja → es (≈ 10 s)
    // ------------------------------------------------------------------
    console.log('  → [8/9] Language switch');
    await goto(page, '/en/globe');
    await wait(1_500);
    await switchLanguage(page, 'ja');
    await wait(3_000);
    await switchLanguage(page, 'es');
    await wait(3_000);

    // ------------------------------------------------------------------
    // 9. CTA: back to /en/globe (title visible) — static hold (≈ 10 s)
    // ------------------------------------------------------------------
    console.log('  → [9/9] CTA hold');
    await goto(page, '/en/globe');
    await wait(8_000);

  } finally {
    // Close page to flush the video file
    await page.close();
    await context.close();
    await browser.close();
  }

  // Playwright names the video with a UUID; rename it to demo.webm
  const files = fs.readdirSync(ASSETS_DIR).filter((f) => f.endsWith('.webm') && f !== 'demo.webm');
  if (files.length === 0) {
    console.error('❌  No .webm file found in', ASSETS_DIR);
    process.exit(1);
  }
  const recorded = path.join(ASSETS_DIR, files[files.length - 1]);
  fs.renameSync(recorded, OUTPUT_WEBM);

  const sizeKB = Math.round(fs.statSync(OUTPUT_WEBM).size / 1024);
  console.log(`✅  Saved: demo.webm (${sizeKB} KB)`);
  console.log(`\nNext step: bash scripts/convert-demo.sh`);
}

recordDemo().catch((err) => {
  console.error('Recording failed:', err);
  process.exit(1);
});
