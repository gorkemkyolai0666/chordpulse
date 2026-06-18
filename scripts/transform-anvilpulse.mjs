#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const dirRenames = [
  ['printshop', 'firm'],
  ['jobs', 'projects'],
  ['paper-stock', 'materials'],
  ['proofs', 'site-visits'],
  ['maintenance', 'welding'],
  ['finishes', 'surface-finishes'],
];

const backendSrc = path.join(root, 'backend/src');
for (const [from, to] of dirRenames) {
  const src = path.join(backendSrc, from);
  const dest = path.join(backendSrc, to);
  if (fs.existsSync(src)) fs.renameSync(src, dest);
}

const fileRenames = [
  ['printshop', 'firm', 'printshop', 'firm'],
  ['jobs', 'projects', 'jobs', 'projects'],
  ['jobs', 'projects', 'job', 'project'],
  ['paper-stock', 'materials', 'paper-stock', 'materials'],
  ['paper-stock', 'materials', 'paper-stock', 'material'],
  ['proofs', 'site-visits', 'proofs', 'site-visits'],
  ['proofs', 'site-visits', 'proof', 'site-visit'],
  ['maintenance', 'welding', 'maintenance', 'welding'],
  ['finishes', 'surface-finishes', 'finishes', 'surface-finishes'],
  ['finishes', 'surface-finishes', 'finish', 'surface-finish'],
];

for (const [, targetDir, from, to] of fileRenames) {
  const dirPath = path.join(backendSrc, targetDir);
  if (!fs.existsSync(dirPath)) continue;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.includes(from)) {
        const next = path.join(d, entry.name.replace(new RegExp(from, 'g'), to));
        if (next !== full) fs.renameSync(full, next);
      }
    }
  };
  walk(dirPath);
}

const replacements = [
  ['RoofPulse', 'RoofPulse'],
  ['roofpulse', 'roofpulse'],
  ['FirmModule', 'FirmModule'],
  ['FirmService', 'FirmService'],
  ['FirmController', 'FirmController'],
  ['JobsModule', 'JobsModule'],
  ['JobsService', 'JobsService'],
  ['JobsController', 'JobsController'],
  ['MembranesModule', 'MembranesModule'],
  ['MembranesService', 'MembranesService'],
  ['MembranesController', 'MembranesController'],
  ['InspectionsModule', 'InspectionsModule'],
  ['InspectionsService', 'InspectionsService'],
  ['InspectionsController', 'InspectionsController'],
  ['CrewsModule', 'CrewsModule'],
  ['CrewsService', 'CrewsService'],
  ['CrewsController', 'CrewsController'],
  ['SystemsModule', 'SurfaceSystemsModule'],
  ['SystemsService', 'SurfaceSystemsService'],
  ['SystemsController', 'SurfaceSystemsController'],
  ['firm', 'firm'],
  ['firms', 'firms'],
  ['Firm', 'Firm'],
  ['firmId', 'firmId'],
  ['roofingJob', 'roofingJob'],
  ['roofingJobs', 'roofingJobs'],
  ['RoofingJob', 'RoofingJob'],
  ['membraneRoll', 'membraneRoll'],
  ['MembraneRoll', 'MembraneRoll'],
  ['roofInspection', 'roofInspection'],
  ['roofInspections', 'roofInspections'],
  ['RoofInspection', 'RoofInspection'],
  ['crewDispatch', 'crewDispatch'],
  ['CrewDispatch', 'CrewDispatch'],
  ['waterproofingSystem', 'waterproofingSystem'],
  ['waterproofingSystemes', 'waterproofingSystemes'],
  ['WaterproofingSystem', 'WaterproofingSystem'],
  ['RoofingJobStatus', 'JobStatus'],
  ['RoofingJobType', 'JobType'],
  ['MembraneRollStatus', 'MembraneStatus'],
  ['RoofInspectionStatus', 'RoofInspectionStatus'],
  ['InspectionQuality', 'InspectionQuality'],
  ['CrewStatus', 'CrewStatus'],
  ['CrewRole', 'CrewRole'],
  ['SystemCategory', 'SystemCategory'],
  ['SystemStatus', 'SystemStatus'],
  ['jobNumber', 'jobNumber'],
  ['clientName', 'clientName'],
  ['jobType', 'jobType'],
  ['crewName', 'crewName'],
  ['rollName', 'rollName'],
  ['membraneType', 'membraneType'],
  ['quantitySqm', 'quantitySqm'],
  ['membraneUnit', 'membraneUnit'],
  ['inspectedAt', 'inspectedAt'],
  ['inspectionQuality', 'inspectionQuality'],
  ['revisionNotes', 'revisionNotes'],
  ['pricePerSqm', 'pricePerSqm'],
  ['leadDays', 'leadDays'],
  ['systemCategory', 'systemCategory'],
  ['totalCrews', 'totalCrews'],
  ['totalMembraneRoll', 'totalMembraneRoll'],
  ['approvedVisits', 'approvedVisits'],
  ['pendingRevisions', 'pendingRevisions'],
  ['pendingWelding', 'pendingWelding'],
  ['seasonalFinishes', 'seasonalFinishes'],
  ['materialWeight', 'materialWeight'],
  ['recentVisits', 'recentVisits'],
  ['stations', 'stations'],
  ['projectThroughputRate', 'projectThroughputRate'],
  ['totalProjects', 'totalProjects'],
  ['activeProjects', 'activeProjects'],
  ['cancelledProjects', 'cancelledProjects'],
  ["@Controller('firm')", "@Controller('firm')"],
  ["@Controller('projects')", "@Controller('projects')"],
  ["@Controller('materials')", "@Controller('materials')"],
  ["@Controller('site-visits')", "@Controller('site-visits')"],
  ["@Controller('welding')", "@Controller('welding')"],
  ["@Controller('surface-finishes')", "@Controller('surface-finishes')"],
  ['4023', '4023'],
  ['3023', '3023'],
  ['demo@istanbulcatikaplama.com', 'demo@istanbulcatikaplama.com'],
  ['İstanbul Demir Atölyesi', 'İstanbul Demir Atölyesi'],
];

function walkFiles(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.next') {
      walkFiles(full, cb);
    } else if (entry.isFile() && /\.(ts|tsx|js|json|sh|md|css|yml|mjs|prisma|sql)$/.test(entry.name)) {
      cb(full);
    }
  }
}

walkFiles(root, (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(file, content);
});

// Frontend route renames
const frontendApp = path.join(root, 'frontend/src/app');
const routeRenames = [
  ['printshop', 'firm'],
  ['jobs', 'projects'],
  ['paper-stock', 'materials'],
  ['proofs', 'site-visits'],
  ['maintenance', 'welding'],
  ['finishes', 'surface-finishes'],
];
for (const [from, to] of routeRenames) {
  const src = path.join(frontendApp, from);
  const dest = path.join(frontendApp, to);
  if (fs.existsSync(src)) fs.renameSync(src, dest);
}

console.log('RoofPulse transform complete');
