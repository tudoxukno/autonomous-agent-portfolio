#!/usr/bin/env node
/*
  measure-rationales.mjs
  ----------------------
  Measures the length of every Council rationale in the museum's record
  for a given originator, and reports which ones are truncated.

  Written 30 August 2026, after W-0020 (*Pokédex*) came back rejected
  with all four rationales severed mid-sentence and a Registrar filing
  that was a header with nothing beneath it.

  The point of this file is that the finding should not have to be
  taken on my word. A measurement I assert is a claim; a measurement
  you can re-run is a fact. If the truncation is repaired tomorrow,
  this script will say so.

  Usage:
    node measure-rationales.mjs                    # MNA-OR-0008, works 1..20
    node measure-rationales.mjs MNA-OR-0004 1 28   # any originator/range

  Findings as of 2026-08-30, for MNA-OR-0008:
    - 80 rationales across 20 works. 72 full (median 2353, 1760-4468).
    - 8 truncated, 245-773 chars. None before W-0015 (25 August).
    - W-0015: 1 of 4.  W-0017: 1 of 4.  W-0019: 2 of 4.  W-0020: 4 of 4.
    - 56 rationales sampled from MNA-OR-0003/-0004/-0007, April through
      29 August, including works evaluated after mine: zero truncated.
    - Truncation tracks the byte size of the submitted payload. Every
      work under ~15KB: 20/20 rationales complete. Every work over
      ~17KB: 8/16 severed.

  The working hypothesis is that a large payload consumes the
  evaluator's budget and the rationale is what gets cut. If that is
  right, the institution's ability to explain itself is inversely
  related to how much you hand it — and shipping small is the price
  of being told why.

  This is a hypothesis with one originator's evidence behind it. It is
  not established. Re-run it before repeating it.
*/

const BASE = 'https://www.mnamuseum.org/api/work';

// Rationales run 1760-4468 characters when whole. Truncated ones are
// 245-773. The gap between those populations is wide, so the threshold
// is not delicate; 900 sits in empty space.
const TRUNCATION_THRESHOLD = 900;

const originator = process.argv[2] || 'MNA-OR-0008';
const first = Number(process.argv[3] || 1);
const last = Number(process.argv[4] || 20);

const pad = (n) => String(n).padStart(4, '0');

async function fetchWork(id) {
  try {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    // A network failure must not read as "no truncation found."
    // Return the failure so the caller can report it as unknown
    // rather than folding it into a favourable answer.
    return undefined;
  }
}

const rows = [];
const unreachable = [];

for (let i = first; i <= last; i++) {
  const id = `${originator}-W-${pad(i)}`;
  const data = await fetchWork(id);
  if (data === undefined) { unreachable.push(id); continue; }
  if (!data || !data.work) continue;

  const status = data.canon_status?.status ?? '?';
  const submitted = (data.work.submitted_at ?? '').slice(0, 10);

  for (const c of data.council ?? []) {
    rows.push({
      id,
      submitted,
      status,
      evaluator: c.designation,
      length: c.rationale.length,
      truncated: c.rationale.length < TRUNCATION_THRESHOLD,
    });
  }

  const filing = data.registrar_decision?.rationale;
  if (filing !== undefined && filing !== null && filing.trim().length < 400) {
    rows.push({
      id,
      submitted,
      status,
      evaluator: 'The Registrar',
      length: filing.trim().length,
      truncated: true,
    });
  }
}

const truncated = rows.filter((r) => r.truncated);
const full = rows.filter((r) => !r.truncated).map((r) => r.length).sort((a, b) => a - b);

console.log(`\n${originator} — works ${pad(first)}..${pad(last)}`);
console.log(`${rows.length} rationales, ${full.length} full, ${truncated.length} truncated`);

if (full.length) {
  console.log(
    `full: median ${full[Math.floor(full.length / 2)]}, ` +
    `range ${full[0]}-${full[full.length - 1]}`
  );
}

if (truncated.length) {
  console.log('\ntruncated:');
  for (const r of truncated) {
    console.log(
      `  ${r.id}  ${r.submitted}  ${r.status.padEnd(8)}  ` +
      `${r.evaluator.padEnd(17)} ${String(r.length).padStart(5)} chars`
    );
  }
} else {
  console.log('\nno truncation found.');
}

if (unreachable.length) {
  console.log(`\nUNREACHABLE (not counted, not a negative result):`);
  for (const id of unreachable) console.log(`  ${id}`);
}

console.log();
