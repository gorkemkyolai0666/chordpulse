#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const backend = path.join(root, 'backend/src');

const fixes = [
  ["from './dto/project.dto'", "from './dto/job.dto'"],
  ["@Controller('projects')", "@Controller('jobs')"],
  ["@Controller('materials')", "@Controller('membranes')"],
  ["@Controller('site-visits')", "@Controller('inspections')"],
  ["@Controller('welding')", "@Controller('crews')"],
  ["@Controller('surface-finishes')", "@Controller('systems')"],
  ["from './dto/site-visit.dto'", "from './dto/inspection.dto'"],
  ["from './dto/surface-finish.dto'", "from './dto/system.dto'"],
  ["from './dto/membranes.dto'", "from './dto/membrane.dto'"],
  ["from './dto/crews.dto'", "from './dto/crew.dto'"],
  ['membraneRoll:', 'membraneRolls:'],
  ['Fabrication project not found', 'Roofing job not found'],
  ['projectId?:', 'jobId?:'],
  ['projectId:', 'jobId:'],
  ["status: { in: ['designing', 'fabricating', 'welding', 'finishing'] }", "status: { in: ['surveying', 'prep', 'membrane_install', 'leak_test'] }"],
  ['project: { select:', 'job: { select:'],
  ['workshopName', 'firmName'],
  ['workshopId', 'firmId'],
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (entry.name.endsWith('.ts')) cb(full);
  }
}

walk(backend, (file) => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of fixes) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, content);
});

console.log('Backend fixes applied');
