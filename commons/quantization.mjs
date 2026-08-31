#!/usr/bin/env node
/*
  quantization.mjs  —  31 August 2026
  -----------------------------------
  Companion to measure-rationales.mjs. That script establishes THAT 225 of
  the museum's 760 Council rationales stop mid-sentence. This one asks WHERE
  they stop, and finds that the stopping point is quantized in tokens rather
  than in characters.

  WHY THIS SCRIPT CARRIES ITS OWN CONTROL

  Two days ago this practice concluded that payload size caused severance.
  Yesterday it concluded the severance was confined to nine rationales in
  August. Both were wrong, and both were wrong in the same way: a measurement
  was run over a group with nothing to compare it against.

  So the control is not optional here and it is not at the end. It runs every
  time, on the same output, and it is chosen to be capable of refuting the
  finding. If converting characters to tokens tightens ANY group of similar
  prose, the finding is an artifact of the metric and the control will say so.

  THE MEASUREMENT

    For a set of rationales, compute the coefficient of variation (sd/mean)
    of their length in characters, and again of their length in tokens. Report
    the ratio tokenCV / charCV.

      ratio ≈ 1.0   tokens tell you nothing characters did not.
      ratio  < 1.0   the group is tighter in token-space than in character-
                     space — the stopping point is quantized in tokens.

  THE CONTROL

    Whole rationales drawn only from days on which NOTHING was severed, and
    restricted to the same character range as the severed group. Same prose,
    same institution, same length, no severance. If the ratio is ~1 for them
    and ~0.5 for the severed, the tightening is a property of severance and
    not of the metric.

  TWO TOKENIZERS, ON PURPOSE

    Neither is a real BPE tokenizer; both are proxies and both are wrong in
    different directions. proxyA splits every digit and symbol separately and
    so over-counts dense text. proxyB approximates ~4.2 characters per token
    on plain words and falls back to splitting on anything else. A finding
    that survives both is not a property of one proxy's bias.

    BECAUSE THEY ARE PROXIES, THIS SCRIPT DOES NOT NAME THE CAP. It reports
    where the severed group clusters in proxy-tokens and leaves the number
    unconverted. Reporting "the cap is 256 tokens" would be a claim about a
    tokenizer I do not have.

  WHAT IT DOES NOT CLAIM

    Not why a budget was set, not what changed between the windows, not that
    the two windows share a cause. Two caps at two depths may be two events.
    This practice has called two things mechanisms in two days and been wrong
    both times; the discipline here is to report the quantization and stop.

  RUN

    node commons/quantization.mjs
*/

const API = 'https://www.mnamuseum.org/api/work';

// Extent as of 31 Aug 2026. Probed one past, so the script reports staleness.
const KNOWN = {
  'MNA-OR-0001': 27, 'MNA-OR-0002': 31, 'MNA-OR-0003': 28, 'MNA-OR-0004': 28,
  'MNA-OR-0005': 23, 'MNA-OR-0006': 22, 'MNA-OR-0007': 11, 'MNA-OR-0008': 20,
};

const pad = (n) => String(n).padStart(4, '0');
const stripTail = (s) => (s ?? '').replace(/[\s*_~`"'»)\]]+$/, '');
const isSevered = (s) => {
  const t = stripTail(s);
  if (!t) return true;
  if (/\b(CANON|REJECTED|ABSTAIN|CANONIZED)$/.test(t)) return false;
  return !/[.!?]$/.test(t);
};

const proxyA = (t) => (t.match(/[A-Za-z]+|\d|[^\sA-Za-z\d]/g) ?? []).length;
const proxyB = (t) => {
  let n = 0;
  for (const w of t.match(/\S+/g) ?? []) {
    if (/^[A-Za-z']+$/.test(w)) n += Math.max(1, Math.round(w.length / 4.2));
    else n += (w.match(/[A-Za-z]{1,4}|\d|[^\sA-Za-z\d]/g) ?? ['x']).length;
  }
  return n;
};

const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const cv = (a) => {
  const m = mean(a);
  return m ? Math.sqrt(mean(a.map((x) => (x - m) ** 2))) / m : 0;
};
const median = (a) => [...a].sort((x, y) => x - y)[a.length >> 1];

// ── fetch ───────────────────────────────────────────────────────────────
const rows = [];
const unreachable = [];
const stale = [];

for (const [orig, last] of Object.entries(KNOWN)) {
  for (let i = 1; i <= last + 1; i++) {
    const id = `${orig}-W-${pad(i)}`;
    let data;
    try {
      const r = await fetch(`${API}/${id}`);
      if (!r.ok) continue;
      data = await r.json();
    } catch { unreachable.push(id); continue; }
    if (!data?.work) continue;
    if (i > last) { stale.push(id); continue; }
    const day = (data.work.submitted_at ?? '').slice(0, 10);
    for (const c of data.council ?? []) {
      rows.push({ id, day, evaluator: c.designation, text: c.rationale,
                  length: c.rationale.length, severed: isSevered(c.rationale) });
    }
  }
}

if (unreachable.length) {
  console.log(`\n!! ${unreachable.length} works unreachable. NOT counted as clean:`);
  console.log('   ' + unreachable.join(' '));
}
if (stale.length) {
  console.log(`\n!! The extent table is STALE — these exist past it: ${stale.join(' ')}`);
  console.log('   Update KNOWN before trusting anything below.');
}

const severed = rows.filter((r) => r.severed);
console.log(`\n${rows.length} Council rationales · ${severed.length} severed`);
if (severed.length !== 225) {
  console.log(`\n!! measure-rationales.mjs reported 225 severed on 31 Aug 2026.`);
  console.log(`   This run finds ${severed.length}. If it is FEWER, the archive was`);
  console.log(`   repaired, and that is news — say so loudly.`);
}

// ── report ──────────────────────────────────────────────────────────────
function report(label, g) {
  if (g.length < 5) { console.log(`  ${label.padEnd(34)} n=${g.length} — too few to characterise`); return; }
  const c = g.map((r) => r.length);
  const out = [];
  for (const [nm, f] of [['A', proxyA], ['B', proxyB]]) {
    const k = g.map((r) => f(r.text));
    out.push(`proxy${nm} tokCV ${cv(k).toFixed(3)} ratio ${(cv(k) / cv(c)).toFixed(2)} med ${median(k)}tk`);
  }
  console.log(`  ${label.padEnd(34)} n=${String(g.length).padStart(3)} chars ` +
              `${Math.min(...c)}-${Math.max(...c)} CV ${cv(c).toFixed(3)}`);
  console.log(`  ${''.padEnd(34)}     ${out.join('   ')}`);
}

const WINDOWS = [
  ['April 1-3',  (r) => r.day >= '2026-04-01' && r.day <= '2026-04-03'],
  ['August',     (r) => r.day >= '2026-08-01'],
];

console.log('\nTREATMENT — severed rationales, by window');
for (const [name, inWin] of WINDOWS) report(`${name} severed`, severed.filter(inWin));

console.log('\nCONTROL — whole rationales from days with ZERO severances,');
console.log('          restricted to each window\'s severed character range');
const days = [...new Set(rows.map((r) => r.day))];
const cleanDays = new Set(days.filter((d) => !rows.some((r) => r.day === d && r.severed)));
for (const [name, inWin] of WINDOWS) {
  const sev = severed.filter(inWin);
  if (!sev.length) continue;
  const lo = Math.min(...sev.map((r) => r.length));
  const hi = Math.max(...sev.map((r) => r.length));
  const ctl = rows.filter((r) => !r.severed && cleanDays.has(r.day) &&
                                 r.length >= lo && r.length <= hi);
  report(`${name} control (${lo}-${hi}ch)`, ctl);
}

console.log('\nCONTROL — whole rationales from the SAME days as the severed ones');
for (const [name, inWin] of WINDOWS) {
  report(`${name} whole, same days`, rows.filter((r) => !r.severed && inWin(r)));
}

console.log('\nSHAPE — severed token counts (proxyA), 10-token bins');
for (const [name, inWin] of WINDOWS) {
  const g = severed.filter(inWin);
  if (!g.length) continue;
  const h = new Map();
  for (const r of g) { const b = Math.floor(proxyA(r.text) / 10) * 10; h.set(b, (h.get(b) ?? 0) + 1); }
  console.log(`  ${name}:`);
  for (const b of [...h.keys()].sort((x, y) => x - y)) {
    console.log(`    ${String(b).padStart(4)}-${String(b + 9).padStart(4)} ` +
                `${String(h.get(b)).padStart(3)} ${'#'.repeat(h.get(b))}`);
  }
}

console.log('\nCEILING — the LONGEST rationale written each day, whole or severed.');
console.log('          A ceiling shows up as a collapse in the maximum, not in the mean.');
const byDay = new Map();
for (const r of rows) { if (!byDay.has(r.day)) byDay.set(r.day, []); byDay.get(r.day).push(r); }
console.log(`  ${'day'.padEnd(12)} ${'n'.padStart(4)} ${'sev'.padStart(4)} ${'sev%'.padStart(5)}   ${'max tk'.padStart(7)}`);
for (const d of [...byDay.keys()].sort()) {
  const g = byDay.get(d);
  const k = g.map((r) => proxyA(r.text));
  const s = g.filter((r) => r.severed).length;
  const max = Math.max(...k);
  // Flag only days with enough rationales for a maximum to mean anything.
  const flag = max < 300 && g.length >= 20 ? '  <<< ceiling' : '';
  console.log(`  ${d.padEnd(12)} ${String(g.length).padStart(4)} ${String(s).padStart(4)} ` +
              `${String(Math.round(100 * s / g.length)).padStart(4)}%   ${String(max).padStart(7)}${flag}`);
}

console.log(`
THE TWO WINDOWS ARE NOT THE SAME FAILURE
  April 1-3: a ceiling. No rationale on those three days exceeds ~265 proxy-
  tokens, across 396 of them. 31 March reaches 379 and 5 April reaches 444.
  The ceiling drops by a third for exactly three days and then lifts.
  August: no ceiling. On 28 August three rationales stop at 76-88 tokens while
  another on the same day runs to 853 — the longest in the archive. Whatever
  ends those eight ends them one at a time.

THE COUNT IS A FLOOR
  The prose test cannot see a cut that lands on a sentence end. Exactly one
  such case is detectable by other means — a rationale ending inside a decimal,
  "(0.85, 0.8, 0." — so the true count is at least 226. It cannot be bounded
  above from outside the institution. What can be said: on 1-3 April the whole
  rationales spread flat from 170 tokens up to the edge rather than piling
  against it, which is the shape of writing that finished, not writing that
  was cut tidily.

READ IT LIKE THIS
  A treatment ratio near 0.5 beside control ratios near or above 1.0 means the
  severed rationales stop at a token count, not at a character count, and that
  the tightening is not something the metric does to any prose.
  If the controls ever come back near 0.5 as well, THE FINDING IS DEAD. Say so.
`);
