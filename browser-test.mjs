/**
 * Browser test: drives the employee → approver → admin flow in real headless
 * Chrome via the Chrome DevTools Protocol (Node >= 22 global WebSocket).
 *
 * Run: node browser-test.mjs
 * Requires: dev server on :5173, API on :5000 (already seeded).
 */
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9333
const BASE = 'http://localhost:5173'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }

/* ---------------- launch Chrome ---------------- */
const profile = mkdtempSync(join(tmpdir(), 'sunrise-test-'))
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--window-size=1440,1000', 'about:blank',
], { stdio: 'ignore' })

let target
for (let i = 0; i < 60; i++) {
  try {
    const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
    target = t
    break
  } catch {
    try {
      const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`)).json()
      target = t
      break
    } catch { await sleep(250) }
  }
}
if (!target) { console.error('FAIL Chrome did not start'); chrome.kill(); process.exit(1) }

/* ---------------- CDP client ---------------- */
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let msgId = 0
const pending = new Map()
const allErrors = []
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id) {
    const p = pending.get(msg.id)
    if (!p) return
    pending.delete(msg.id)
    if (msg.error) p.reject(new Error(msg.error.message))
    else p.resolve(msg.result)
  } else if (msg.method === 'Runtime.exceptionThrown') {
    const d = msg.params.exceptionDetails
    allErrors.push(`EXCEPTION: ${d.text} ${(d.exception && d.exception.description) || ''}`.slice(0, 400))
  } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    allErrors.push('CONSOLE: ' + msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 400))
  } else if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
    allErrors.push('LOG: ' + msg.params.entry.text.slice(0, 400))
  }
}
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++msgId
  pending.set(id, { resolve, reject })
  ws.send(JSON.stringify({ id, method, params }))
})
await send('Runtime.enable')
await send('Page.enable')
await send('Log.enable')
await send('Network.enable')

/* Track the page's default execution context so evaluate() never targets the
   stale about:blank context after a navigation. */
let pageContextId = null
const origOnMessage2 = ws.onmessage
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.method === 'Runtime.executionContextCreated' && msg.params.context.auxData?.isDefault === true) {
    pageContextId = msg.params.context.id
  }
  origOnMessage2(ev)
}

const failedReqs = []
const origOnMessage = ws.onmessage
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400) {
    failedReqs.push(`${msg.params.response.status} ${msg.params.response.url.slice(0, 140)}`)
  } else if (msg.method === 'Network.loadingFailed') {
    failedReqs.push(`load-fail(${msg.params.errorText}) ${msg.params.type}`)
  }
  origOnMessage(ev)
}

const evalJs = async (expression) => {
  const params = { expression, returnByValue: true, awaitPromise: true }
  if (pageContextId) params.contextId = pageContextId
  const r = await send('Runtime.evaluate', params)
  if (r.exceptionDetails) throw new Error('eval: ' + JSON.stringify(r.exceptionDetails).slice(0, 200))
  return r.result ? r.result.value : undefined
}
const navigate = async (url) => { await send('Page.navigate', { url }); await sleep(700) }
const waitFor = async (expr, timeout = 20000) => {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try { if (await evalJs(expr)) return true } catch { /* page mid-navigation */ }
    await sleep(350)
  }
  return false
}
// innerText reflects CSS transforms (e.g. text-uppercase renders "DEMO ACCOUNTS"),
// so compare case-insensitively.
const waitForText = (text, timeout = 20000) =>
  waitFor(`document.body && document.body.innerText.toLowerCase().includes(${JSON.stringify(text.toLowerCase())})`, timeout)

const bodySnippet = async (n = 2000) => {
  try {
    return await evalJs(`(() => {
      const b = document.body
      const root = document.getElementById('root')
      const overlay = document.querySelector('vite-error-overlay')
      return {
        ready: document.readyState,
        url: location.href,
        token: !!localStorage.getItem('sunrise_token'),
        text: b ? b.innerText.slice(0, ${n}).replace(/\\n+/g, ' | ') : 'NO BODY',
        textLen: b ? b.innerText.length : -1,
        rootChildren: root ? root.childElementCount : -1,
        overlay: overlay ? overlay.getAttribute('message') || 'present' : null,
      }
    })()`)
  } catch (e) {
    return { evalError: e.message }
  }
}
const clickText = (text) =>
  evalJs(`(() => {
    const t = ${JSON.stringify(text)}
    const els = [...document.querySelectorAll('button, a, [role="button"]')]
    const hit = els.filter((e) => (e.textContent || '').includes(t) && e.offsetParent !== null)
    if (hit.length) hit[0].click()
    return hit.length
  })()`)

// Exact textContent match — avoids substring collisions like 'Approve' hitting
// the 'Approver' demo button or the 'Approved' tab.
const clickExact = (text) =>
  evalJs(`(() => {
    const t = ${JSON.stringify(text)}
    const els = [...document.querySelectorAll('button, a, [role="button"]')]
    const hit = els.find((e) => (e.textContent || '').trim() === t && e.offsetParent !== null)
    if (hit) hit.click()
    return !!hit
  })()`)

// Click a demo-account button by role name, ignoring the emoji prefix.
const clickRole = (role) =>
  evalJs(`(() => {
    const els = [...document.querySelectorAll('button')]
    const hit = els.find((e) => {
      const t = (e.textContent || '').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u200D\u{1F3FB}-\u{1F3FF}]/gu, '').trim()
      return t === ${JSON.stringify(role)} && e.offsetParent !== null
    })
    if (hit) hit.click()
    return !!hit
  })()`)

// Click a button with exact text inside the first card whose text mentions cardText.
const clickCardAction = (cardText, btnText) =>
  evalJs(`(() => {
    const ct = ${JSON.stringify(cardText)}
    const bt = ${JSON.stringify(btnText)}
    const cards = [...document.querySelectorAll('[class*="shadow-card"]')]
    for (const card of cards) {
      if (!(card.textContent || '').includes(ct)) continue
      const btn = [...card.querySelectorAll('button')].find((b) => (b.textContent || '').trim() === bt && b.offsetParent !== null)
      if (btn) { btn.click(); return true }
    }
    return false
  })()`)

/* ---------------- runner ---------------- */
const results = []
const step = async (name, fn) => {
  const before = allErrors.length
  try {
    await fn()
    results.push({ name, pass: true, errors: allErrors.slice(before) })
    console.log(`  ✓ ${name}`)
  } catch (e) {
    const loc = await evalJs('location.href').catch(() => '?')
    results.push({ name, pass: false, errors: allErrors.slice(before) })
    console.log(`  ✗ ${name} — ${e.message} [url=${loc}]`)
    const snap = await bodySnippet(4000)
    console.log(`      ${JSON.stringify(snap).slice(0, 4200)}`)
  }
}

/* ================= flow ================= */
console.log('== Phase 0: Employee books a business trip ==')

await step('Employee login via demo button lands on dashboard', async () => {
  await navigate(`${BASE}/login`)
  if (!(await waitForText('Demo accounts'))) throw new Error('login page not rendered')
  if (!(await clickRole('Employee'))) throw new Error('employee demo button not found')
  if (!(await waitForText('What are you travelling for?'))) throw new Error('dashboard not shown after login')
})

await step('Flight search renders API results with policy badges', async () => {
  await navigate(`${BASE}/flights?trip=roundtrip&from=BOM&to=BLR&date=${iso(14)}&return=${iso(17)}&cabin=Economy&corp=1`)
  if (!(await waitForText('flights found'))) throw new Error('no flight results rendered')
  if (!(await waitForText('Within Policy'))) throw new Error('policy badges missing on flights')
})

await step('Select flight opens details page', async () => {
  if (!(await clickExact('Select'))) throw new Error('flight Select link not found')
  if (!(await waitForText('Your fare summary'))) throw new Error('flight details not rendered')
})

await step('Select this flight flows into hotel search', async () => {
  if (!(await clickExact('Select this flight'))) throw new Error('flight CTA not found')
  if (!(await waitForText('properties found'))) throw new Error('hotel results not rendered')
  if (!(await waitForText('Within Policy'))) throw new Error('policy badges missing on hotels')
})

await step('Select Room → details → attach hotel → review page', async () => {
  if (!(await clickExact('Select Room'))) throw new Error('hotel Select Room not found')
  if (!(await waitForText('Choose your room'))) throw new Error('hotel details not rendered')
  if (!(await clickExact('Select this hotel'))) throw new Error('hotel CTA not found')
  if (!(await waitForText('Submit for approval'))) throw new Error('review page not rendered')
})

let tripId = null
await step('Submit for approval creates request with timeline', async () => {
  if (!(await clickExact('Submit for approval'))) throw new Error('submit button not found')
  const ok = await waitFor(`location.pathname.startsWith('/trips/') && document.body && document.body.innerText.toLowerCase().includes('awaiting manager approval')`)
  if (!ok) throw new Error('did not land on request detail page')
  tripId = await evalJs('location.pathname.split("/")[2]')
  if (!tripId) throw new Error('could not read trip id')
  console.log(`      → created trip ${tripId}`)
})

console.log('== Phase 1: Approver approves + tickets ==')

await step('Approver login → queue shows new request', async () => {
  await navigate(`${BASE}/login`)
  if (!(await waitForText('Demo accounts'))) throw new Error('login page not rendered')
  if (!(await clickRole('Approver'))) throw new Error('approver demo button not found')
  if (!(await waitForText('Approver overview'))) throw new Error('approver home not rendered')
  await navigate(`${BASE}/approvals`)
  if (!(await waitForText('Rahul Sharma'))) throw new Error('new request missing from queue')
  if (!(await waitForText('Vivanta Bengaluru'))) throw new Error('newly created request missing from queue')
})

await step('Approve request clears it from pending queue', async () => {
  const countExpr = `[...document.querySelectorAll('button')].filter((b) => (b.textContent || '').trim() === 'Approve' && b.offsetParent !== null).length`
  const before = await evalJs(countExpr)
  if (before === 0) throw new Error('no Approve button found')
  if (!(await clickCardAction('Vivanta Bengaluru', 'Approve'))) throw new Error('approve click failed')
  const ok = await waitFor(`(${countExpr}) < ${before}`, 15000)
  if (!ok) throw new Error('pending queue did not update after approve')
})

await step('Ticket the approved request', async () => {
  await navigate(`${BASE}/trips/${tripId}`)
  if (!(await waitForText('Confirm & issue ticket'))) throw new Error('ticket CTA missing (request not approved?)')
  if (!(await clickExact('Confirm & issue ticket'))) throw new Error('ticket click failed')
  if (!(await waitForText('Ticketed'))) throw new Error('trip status not ticketed')
})

console.log('== Phase 2: Employee sees updates ==')

await step('Employee login → trip ticketed with claim option', async () => {
  await navigate(`${BASE}/login`)
  if (!(await waitForText('Demo accounts'))) throw new Error('login page not rendered')
  if (!(await clickRole('Employee'))) throw new Error('employee demo button not found')
  if (!(await waitForText('What are you travelling for?'))) throw new Error('dashboard not rendered')
  await navigate(`${BASE}/trips/${tripId}`)
  if (!(await waitForText('Ticketed'))) throw new Error('trip not ticketed for employee')
  if (!(await waitForText('File expense claim'))) throw new Error('claim CTA missing on ticketed trip')
})

await step('Employee claims page renders', async () => {
  await navigate(`${BASE}/claims`)
  if (!(await waitForText('My expense claims'))) throw new Error('claims page not rendered')
})

console.log('== Phase 3: Admin dashboards ==')

await step('Admin login → dashboard + KPIs', async () => {
  await navigate(`${BASE}/login`)
  if (!(await waitForText('Demo accounts'))) throw new Error('login page not rendered')
  if (!(await clickRole('Admin'))) throw new Error('admin demo button not found')
  if (!(await waitForText('Travel administration'))) throw new Error('admin home not rendered')
  await navigate(`${BASE}/admin`)
  if (!(await waitForText('Company travel dashboard'))) throw new Error('admin dashboard not rendered')
  if (!(await waitForText('Total travel spend'))) throw new Error('admin KPIs missing')
})

await step('Admin reports page renders charts + export buttons', async () => {
  await navigate(`${BASE}/admin/reports`)
  if (!(await waitForText('Spend reports'))) throw new Error('reports page not rendered')
  if (!(await waitForText('Export trips CSV'))) throw new Error('export buttons missing')
  if (!(await waitForText('Spend by month'))) throw new Error('spend chart missing')
})

await step('Admin claims queue renders employee claims', async () => {
  await navigate(`${BASE}/claims`)
  if (!(await waitForText('Claims to review'))) throw new Error('claims queue not rendered')
  if (!(await waitForText('Rahul Sharma'))) throw new Error('claim rows missing')
})

/* ================= summary ================= */
console.log('\n== RESULTS ==')
let failed = 0
for (const r of results) {
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.name}`)
  if (!r.pass) failed += 1
  if (r.errors.length) {
    console.log(`       browser errors in step: ${r.errors.length}`)
    ;[...new Set(r.errors)].slice(0, 4).forEach((e) => console.log(`         - ${e}`))
  }
}
if (allErrors.length) {
  console.log(`\n== ALL BROWSER ERRORS (${allErrors.length}, unique ${new Set(allErrors).size}) ==`)
  ;[...new Set(allErrors)].slice(0, 25).forEach((e) => console.log('  -', e))
}
if (failedReqs.length) {
  console.log(`\n== FAILED NETWORK REQUESTS (${failedReqs.length}) ==`)
  ;[...new Set(failedReqs)].slice(0, 10).forEach((e) => console.log('  -', e))
}

ws.close()
chrome.kill()
await sleep(1000)
try { rmSync(profile, { recursive: true, force: true }) } catch { /* locked by chrome teardown */ }
console.log(failed ? `\n${failed} step(s) FAILED` : '\nAll steps passed ✔')
process.exit(failed ? 1 : 0)
