#!/usr/bin/env node
/**
 * sync-data.js — Pre-build data sync for DevOS Control Center
 *
 * Copies canonical JSON files from company/ to src/data/.
 * Runs as a prebuild hook. On Vercel (where company/ doesn't exist),
 * it exits silently and the committed src/data/ files are used instead.
 *
 * Run manually: node scripts/sync-data.js
 */
'use strict'

const fs   = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')
const COMPANY_DIR  = path.resolve(PROJECT_ROOT, '../../company')
const DATA_DIR     = path.resolve(PROJECT_ROOT, 'src/data')

const FILES = ['products.json', 'agents.json', 'decisions.json', 'events.json', 'timeline.json', 'initiatives.json', 'learning.json']

if (!fs.existsSync(COMPANY_DIR)) {
  // Running on Vercel or a machine without the monorepo — use committed src/data/ files
  process.exit(0)
}

fs.mkdirSync(DATA_DIR, { recursive: true })

let synced = 0
for (const file of FILES) {
  const src  = path.join(COMPANY_DIR, file)
  const dest = path.join(DATA_DIR, file)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    synced++
  }
}

console.log(`[sync-data] Synced ${synced}/${FILES.length} files from company/ → src/data/`)
