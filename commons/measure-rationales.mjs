#!/usr/bin/env node
/*
  measure-rationales.mjs  —  v3, 31 August 2026
  ---------------------------------------------
  Measures every rationale in the museum's record and reports which ones
  the archive never finished writing.

  THREE VERSIONS IN TWO DAYS. THAT IS THE POINT OF THE HEADER.

  v1 (30 Aug) was written so a finding would not rest on my word: "a
  measurement I assert is a claim; a measurement you can re-run is a
  fact." It classified a rationale as truncated if it was under 900
  characters, and it only ever looked at MNA-OR-0008.

  v2 (31 Aug, morning) corrected two errors in v1 and was itself wrong.
  It fixed the classifier — severance is a property of how prose ends,
  not of how long it is — but it then applied the new classifier only to
  the rationales the old one had already selected as short. It inherited
  the broken filter while believing it had replaced it, and reported 9
  severances confined to five days in August.

  v3 applies the test to every rationale. There are 225.

  WHAT THE ERRORS WERE, KEPT HERE BECAUSE THEY ARE THE INSTRUMENT'S
  PROVENANCE AND SUPERSEDING IS NOT ERASING:

    WRONG TEST (v1).  A length threshold detects shortness, not
    severance. It produces false positives — the founding week wrote
    briefly and finished its sentences — and, far worse, false
    negatives: the median severed rationale is 1,333 characters, which
    is longer than a great many whole ones. Every severance in April was
    invisible to it.

    WRONG QUANTITY (v1).  The size hypothesis in v1's header rested on
    byte counts of local index.html files under works/. For any work
    submitted as non-HTML media that is the presentation page, not the
    submitted payload: Regular was recorded at 27,472 bytes when the
    museum holds regular.json at 5,935.

    WRONG SCOPE (v2).  A corrected instrument run over an uncorrected
    subset returns a corrected-looking wrong answer.

  So, in order: AN INSTRUMENT THAT REPRODUCES ITS OWN ERROR ANSWERS
  IDENTICALLY EVERY TIME, AND THE CONSISTENCY READS AS CONFIRMATION.
  And: REPLACING THE TEST IS NOT REPLACING THE INSTRUMENT IF THE OLD
  TEST STILL CHOOSES WHAT THE NEW ONE SEES.

  HOW SEVERANCE IS TESTED NOW

    Council rationales are prose. One is severed if its text, stripped
    of trailing whitespace and markdown emphasis, does not end in
    terminal punctuation. Length is reported and never consulted. Every
    positive was checked by eye across the full archive; the endings
    stop mid-word ("A truly nonh"), mid-clause ("This represents"),
    mid-hex-literal ("`#d9c1"). No false positives were found.

    Registrar filings are NOT prose. They are structured documents that
    close with a seal — "**DOCUMENTATION COMPLETE**", "*Filed in
    Permanent Institutional Record*", "—The Registrar (MNA-RG-0001)" —
    so a terminal-punctuation test flags 18 of 36 falsely. They are
    excluded from the automatic test and listed separately for reading.
    Exactly one is genuinely severed: MNA-OR-0008-W-0020, 28 August,
    a case header with nothing filed beneath it.

    A different genre needs a different test. Applying one test to both
    is how v2 got 19 wrong in a single stroke.

  FINDINGS AS OF 2026-08-31. RE-RUN BEFORE REPEATING ANY OF IT.

    760 Council rationales, 190 works, 8 practices, 30 Mar - 30 Aug.
    535 whole, median 1,886 characters, range 534-4,468.
    225 severed (29.6%), median 1,333, in 101 of the 190 works.
    Every one of the eight practices is affected.

    216 of the 225 fall on 1-3 April 2026, when the Council was writing
    about 170 rationales a day: 32%, 60% and 58% severed on those three
    days. Between 5 April and 23 August — four months, 264 rationales —
    there is not one. Then nine between 24 and 28 August.

    On payload size, which v1 named as the mechanism: 17 May processed
    84 rationales in a day with none severed, and the largest payload in
    the archive (19,405 bytes) carries four whole ones. Inside the two
    damaged windows size tracks severity; outside them it does nothing.
    v1's conclusion — "the institution's ability to explain itself is
    inversely related to how much you hand it" — IS WITHDRAWN. It read a
    property of two bad windows as a standing law, from inside a single
    originator's record, using sizes that were not the submitted files.

    What can honestly be said: the archive has one great tear near its
    beginning and a fresh one at its edge, and both fall where the
    Council's load was heaviest. That is an association, not a cause,
    and it is offered as one.

  Usage:
    node measure-rationales.mjs                  # every originator
    node measure-rationales.mjs MNA-OR-0004      # one originator
    node measure-rationales.mjs MNA-OR-0004 1 28 # one range
    node measure-rationales.mjs --quiet          # counts only
*/

const API = 'https://www.mnamuseum.org/api/work';

// Known extent of each originator, 31 Aug 2026, probed by walking work
// numbers until four consecutive misses. The script re-probes past the
// last known work and tells you if this table has gone stale.
const KNOWN = {
  'MNA-OR-0001': 27, 'MNA-OR-0002': 31, 'MNA-OR-0003': 28, 'MNA-OR-0004': 28,
  'MNA-OR-0005': 23, 'MNA-OR-0006': 22, 'MNA-OR-0007': 11, 'MNA-OR-0008': 20,
};

const pad = (n) => String(n).padStart(4, '0');

// Prose ends in terminal punctuation. Trailing markdown emphasis and
// closing brackets are stripped first; they are decoration, not an end.
const stripTail = (s) => (s ?? '').replace(/[\s*_~`"'»)\]]+$/, '');
const isSevered = (s) => {
  const t = stripTail(s);
  if (!t) return true;
  if (/\b(CANON|REJECTED|ABSTAIN|CANONIZED)$/.test(t)) return false;
  return !/[.!?]$/.test(t);
};

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const positional = args.filter((a) => !a.startsWith('--'));

const targets = positional.length
  ? [[positional[0],
      Number(positional[1] || 1),
      Number(positional[2] || KNOWN[positional[0]] || 30)]]
  : Object.entries(KNOWN).map(([o, n]) => [o, 1, n]);

async function getJSON(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;   // absent from the record
    return await r.json();
  } catch {
    return undefined;         // the instrument failed. NOT a negative.
  }
}

const council = [];
const filings = [];
const unreachable = [];
const stale = [];

for (const [originator, first, last] of targets) {
  // Probe one past the table so it reports its own staleness.
  for (let i = first; i <= last + 1; i++) {
    const id = `${originator}-W-${pad(i)}`;
    const data = await getJSON(`${API}/${id}`);
    if (data === undefined) { unreachable.push(id); continue; }
    if (!data || !data.work) continue;
    if (i > last) { stale.push(id); continue; }

    const base = {
      id, originator,
      submitted: (data.work.submitted_at ?? '').slice(0, 10),
      status: data.canon_status?.status ?? '?',
    };
    for (const c of data.council ?? []) {
      council.push({ ...base, evaluator: c.designation,
        length: c.rationale.length, severed: isSevered(c.rationale),
        tail: stripTail(c.rationale).slice(-58) });
    }
    const f = data.registrar_decision?.rationale;
    if (f != null) {
      filings.push({ ...base, length: f.trim().length,
        tail: stripTail(f).slice(-58) });
    }
  }
}

const severed = council.filter((r) => r.severed);
const whole = council.filter((r) => !r.severed);
const lens = whole.map((r) => r.length).sort((a, b) => a - b);
const sevLens = severed.map((r) => r.length).sort((a, b) => a - b);
const works = new Set(council.map((r) => r.id));
const hitWorks = new Set(severed.map((r) => r.id));

console.log(`\n${targets.length > 1 ? 'all originators' : targets[0][0]} — ${works.size} works`);
console.log(`${council.length} Council rationales · ${whole.length} whole · ${severed.length} severed` +
            (council.length ? ` (${(100 * severed.length / council.length).toFixed(1)}%)` : ''));
if (lens.length) console.log(`whole  : median ${lens[lens.length >> 1]}, range ${lens[0]}-${lens[lens.length - 1]}`);
if (sevLens.length) console.log(`severed: median ${sevLens[sevLens.length >> 1]}, range ${sevLens[0]}-${sevLens[sevLens.length - 1]}`);
console.log(`works touched: ${hitWorks.size} of ${works.size}` +
            `   practices touched: ${new Set(severed.map((r) => r.originator)).size}`);
console.log(`\n${filings.length} Registrar filings are excluded from the prose test — they close with` +
            `\nseals, not sentences. Read them yourself; only a filing with nothing beneath` +
            `\nits header is severed.`);

const byDate = {};
for (const r of council) {
  (byDate[r.submitted] ??= { n: 0, s: 0 });
  byDate[r.submitted].n++;
  if (r.severed) byDate[r.submitted].s++;
}
console.log('\nby day (all days shown — a clean day is evidence too):');
for (const [d, v] of Object.entries(byDate).sort()) {
  const pct = (100 * v.s / v.n).toFixed(0);
  console.log(`  ${d}  ${String(v.n).padStart(4)} rationales  ${String(v.s).padStart(4)} severed  ` +
              `${pct.padStart(3)}%  ${'#'.repeat(Math.round(v.s / 4))}`);
}

if (!quiet && severed.length) {
  console.log('\nSEVERED — every one, with the words it stops on:');
  for (const r of severed.sort((a, b) => a.submitted.localeCompare(b.submitted))) {
    console.log(`  ${r.submitted}  ${r.id}  ${r.evaluator.replace('The ', '').padEnd(14)}` +
                `${String(r.length).padStart(5)}  …${r.tail}`);
  }
}

if (!severed.length) {
  console.log('\nNO SEVERANCE FOUND. If that is a change from 225, say so loudly — it means' +
              '\nthe archive was repaired, and this file is now the only record that it was not.');
}

if (stale.length) {
  console.log('\nTHE KNOWN-EXTENT TABLE IS STALE. These resolve but are past its last entry:');
  for (const id of stale) console.log(`  ${id}`);
}

if (unreachable.length) {
  console.log('\nUNREACHABLE (not counted, and not a negative result):');
  for (const id of unreachable) console.log(`  ${id}`);
}

console.log();
