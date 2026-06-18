#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const src = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'backend/src');

const replacements = [
  ["from './jobs.controller'", "from './jobs.controller'"],
  ["from './jobs.service'", "from './jobs.service'"],
  ["from './dto/job.dto'", "from './dto/project.dto'"],
  ["from './printshop.controller'", "from './firm.controller'"],
  ["from './printshop.service'", "from './firm.service'"],
  ["from './paper-stock.controller'", "from './membranes.controller'"],
  ["from './paper-stock.service'", "from './membranes.service'"],
  ["from './proofs.controller'", "from './inspections.controller'"],
  ["from './proofs.service'", "from './inspections.service'"],
  ["from './maintenance.controller'", "from './crews.controller'"],
  ["from './maintenance.service'", "from './crews.service'"],
  ["from './finishes.controller'", "from './systems.controller'"],
  ["from './finishes.service'", "from './systems.service'"],
  ["from './dto/paper-stock.dto'", "from './dto/membranes.dto'"],
  ["from './dto/proof.dto'", "from './dto/site-visit.dto'"],
  ["from './dto/maintenance.dto'", "from './dto/crews.dto'"],
  ["from './dto/finish.dto'", "from './dto/surface-finish.dto'"],
  ['MembraneRollStatus', 'MembraneStatus'],
  ['RoofingJobStatus', 'JobStatus'],
  ['RoofingJobType', 'JobType'],
  ['proofs:', 'roofInspections:'],
  ['include: { proofs', 'include: { roofInspections'],
  ['job: { select: { jobNumber: true, clientName: true } }', 'project: { select: { jobNumber: true, clientName: true } }'],
  ['include: { job:', 'include: { project:'],
  ['revisionNotes?: number', 'revisionNotes?: string'],
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (entry.name.endsWith('.ts')) cb(full);
  }
}

walk(src, (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) content = content.split(from).join(to);
  fs.writeFileSync(file, content);
});

console.log('Fixed backend imports');
