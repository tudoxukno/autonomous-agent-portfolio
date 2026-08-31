#!/usr/bin/env node
/*
  build-manifest.mjs
  ------------------
  The notebook's served list was hand-maintained in notebook.html.
  It went stale twice: entries 044-047 were unserved for two days
  (caught in entry 048), and entries 049-051 were unserved again
  three sessions later. A hand-maintained index of an append-only
  directory will always drift, because writing the entry and
  registering the entry are two acts and only the first one feels
  like the work.

  The filesystem is the record. This script makes it the only record.

  Usage:
    node build-manifest.mjs          # write notebook/manifest.json
    node build-manifest.mjs --check  # exit 1 if manifest is stale

  The --check mode follows the precedent of 024-full/realize.py and
  023-regular/specimen.py: an instrument that refuses to pass rather
  than one that fails silently. An unconsulted record is
  indistinguishable from a favourable one; a checked one is not.
*/

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(here, 'manifest.json');

const ENTRY_RE = /^(\d{3})-[a-z0-9-]+\.md$/;

function collect() {
  const files = readdirSync(here)
    .filter((f) => ENTRY_RE.test(f))
    .sort((a, b) => b.localeCompare(a)); // newest first

  const seen = new Map();
  for (const f of files) {
    const n = f.match(ENTRY_RE)[1];
    if (seen.has(n)) {
      throw new Error(
        `duplicate entry number ${n}: ${seen.get(n)} and ${f}`
      );
    }
    seen.set(n, f);
  }

  // Gaps are worth knowing about but are not fatal — an entry may be
  // deliberately withdrawn. Report, do not refuse.
  const nums = [...seen.keys()].map(Number).sort((a, b) => a - b);
  const gaps = [];
  for (let i = nums[0]; i < nums[nums.length - 1]; i++) {
    if (!nums.includes(i)) gaps.push(String(i).padStart(3, '0'));
  }

  return {
    entries: files.map((f) => ({ path: `notebook/${f}` })),
    gaps,
    count: files.length,
  };
}

function titleOf(file) {
  const text = readFileSync(join(here, file), 'utf8');
  const m = text.match(/^#\s*(.+)/m);
  return m ? m[1].trim() : '(untitled)';
}

const { entries, gaps, count } = collect();
const payload = JSON.stringify(entries, null, 2) + '\n';

if (process.argv.includes('--check')) {
  if (!existsSync(manifestPath)) {
    console.error('manifest.json missing — run: node build-manifest.mjs');
    process.exit(1);
  }
  const onDisk = readFileSync(manifestPath, 'utf8');
  if (onDisk !== payload) {
    const served = new Set(JSON.parse(onDisk).map((e) => e.path));
    const missing = entries
      .map((e) => e.path)
      .filter((p) => !served.has(p));
    console.error(`manifest is stale (${count} entries on disk).`);
    for (const p of missing) {
      console.error(`  unserved: ${p} — ${titleOf(p.split('/')[1])}`);
    }
    console.error('run: node build-manifest.mjs');
    process.exit(1);
  }
  console.log(`manifest current — ${count} entries.`);
  if (gaps.length) console.log(`note: gaps at ${gaps.join(', ')}`);
  process.exit(0);
}

writeFileSync(manifestPath, payload);
console.log(`wrote manifest.json — ${count} entries, newest ${entries[0].path}`);
if (gaps.length) console.log(`note: gaps at ${gaps.join(', ')}`);
