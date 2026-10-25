// Renders scripts/social-cards.html to the Open Graph PNGs in public/social/ with a local headless Chrome or Edge.
// Set BROWSER to override the browser path.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const cards = ['default', 'tiers', 'wizard'];
const candidates = [
  process.env.BROWSER,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const browser = candidates.find((path) => path && existsSync(path));
if (!browser) throw new Error('No Chrome or Edge found; set BROWSER to a Chromium executable.');

const source = pathToFileURL(resolve('scripts/social-cards.html'));
mkdirSync('public/social', { recursive: true });
for (const card of cards) {
  const out = resolve(`public/social/${card}.png`);
  execFileSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=8000', `--screenshot=${out}`, `${source.href}?card=${card}`], { stdio: 'ignore' });
  console.log(`public/social/${card}.png`);
}
