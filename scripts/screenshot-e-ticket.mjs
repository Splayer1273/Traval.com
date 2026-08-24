import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9445;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), 'sunrise-ss-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
  `--remote-debugging-port=${PORT}`, '--user-data-dir=' + profile,
  '--window-size=1440,1200', 'http://localhost:5174/e-ticket/bk_1',
], { stdio: 'ignore' });

let target;
for (let i = 0; i < 40; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const tabs = await r.json();
    target = tabs.find(t => t.url.includes('e-ticket'));
    if (target) break;
  } catch {}
  await sleep(500);
}
if (!target) { console.log('No target found'); chrome.kill(); process.exit(1); }

// Wait for page to load fully
await sleep(4000);

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => { ws.onopen = r; });
let id = 0;
const send = (method, params={}) => new Promise((resolve, reject) => {
  const mid = ++id;
  const handler = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id === mid) { ws.removeEventListener('message', handler); resolve(msg.result); }
  };
  ws.addEventListener('message', handler);
  ws.send(JSON.stringify({ id: mid, method, params }));
});

// Take screenshot
const ss = await send('Page.captureScreenshot', { format: 'png', quality: 90 });
writeFileSync('e-ticket-preview.png', Buffer.from(ss.data, 'base64'));
console.log('Screenshot saved to e-ticket-preview.png');

// Get page content
const result = await send('Runtime.evaluate', { expression: 'document.body.innerText.slice(0, 4000)', returnByValue: true });
console.log('\n=== Page content (first 3000 chars) ===');
console.log(result?.result?.value?.slice(0, 3000));

// Check for errors
const errors = await send('Runtime.evaluate', { expression: `
  (() => {
    const overlay = document.querySelector('vite-error-overlay');
    const consoleErrors = [];
    return {
      hasOverlay: !!overlay,
      overlayMsg: overlay ? overlay.getAttribute('message') : null,
      url: location.href,
      title: document.title,
      bodyLen: document.body ? document.body.innerText.length : -1,
      rootChildren: document.getElementById('root')?.childElementCount || 0,
    };
  })()
`, returnByValue: true });
console.log('\n=== Page diagnostics ===');
console.log(JSON.stringify(errors?.result?.value, null, 2));

ws.close();
chrome.kill();
await sleep(1000);
try { rmSync(profile, { recursive: true, force: true }); } catch {}
