#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'frontend');

const routeRenames = [
  ['printshop', 'firm'],
  ['jobs', 'projects'],
  ['paper-stock', 'materials'],
  ['proofs', 'site-visits'],
  ['maintenance', 'welding'],
  ['finishes', 'surface-finishes'],
];

const appDir = path.join(root, 'src/app');
for (const [from, to] of routeRenames) {
  const src = path.join(appDir, from);
  const dest = path.join(appDir, to);
  if (fs.existsSync(src)) {
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });
    fs.renameSync(src, dest);
  }
}

const replacements = [
  ['PressPulse', 'RoofPulse'],
  ['presspulse', 'roofpulse'],
  ['Press<span', 'Anvil<span'],
  ['printShop', 'firm'],
  ['printShopName', 'firmName'],
  ['printshop', 'firm'],
  ['/jobs', '/jobs'],
  ['/paper-stock', '/membranes'],
  ['/proofs', '/inspections'],
  ['/maintenance', '/crews'],
  ['/finishes', '/systems'],
  ['/printshop', '/firm'],
  ["listRequest('/jobs'", "listRequest('/jobs'"],
  ["request('/jobs'", "request('/jobs'"],
  ["`/jobs/${", "`/jobs/${"],
  ["listRequest('/paper-stock'", "listRequest('/membranes'"],
  ["request('/paper-stock'", "request('/membranes'"],
  ["`/paper-stock/${", "`/membranes/${"],
  ["listRequest('/proofs'", "listRequest('/inspections'"],
  ["request('/proofs'", "request('/inspections'"],
  ["`/proofs/${", "`/inspections/${"],
  ["listRequest('/maintenance'", "listRequest('/crews'"],
  ["request('/maintenance'", "request('/crews'"],
  ["`/maintenance/${", "`/crews/${"],
  ["listRequest('/finishes'", "listRequest('/systems'"],
  ["request('/finishes'", "request('/systems'"],
  ["`/finishes/${", "`/systems/${"],
  ["request('/printshop'", "request('/firm'"],
  ['api.jobs', 'api.projects'],
  ['api.membraneRoll', 'api.materials'],
  ['api.proofs', 'api.roofInspections'],
  ['api.maintenance', 'api.welding'],
  ['api.finishes', 'api.waterproofingSystemes'],
  ['jobNumber', 'jobNumber'],
  ['customerName', 'clientName'],
  ['printType', 'jobType'],
  ['machineName', 'crewName'],
  ['batchName', 'rollName'],
  ['paperBrand', 'membraneType'],
  ['laborHours', 'quantitySqm'],
  ['storageUnit', 'membraneUnit'],
  ['sentAt', 'inspectedAt'],
  ['proofQuality', 'inspectionQuality'],
  ['finishCategory', 'systemCategory'],
  ['pricePerUnit', 'pricePerSqm'],
  ['setupMinutes', 'leadDays'],
  ['totalJobs', 'totalProjects'],
  ['activeJobs', 'activeProjects'],
  ['totalPaperStock', 'totalMembraneRoll'],
  ['stockWeight', 'materialWeight'],
  ['revisionProofs', 'pendingRevisions'],
  ['pendingMaintenance', 'pendingWelding'],
  ['recentProofs', 'recentVisits'],
  ['jobThroughputRate', 'projectThroughputRate'],
  ['4021', '4023'],
  ['3021', '3023'],
  ['demo@istanbulprintstudio.com', 'demo@istanbulcatikaplama.com'],
  ['İstanbul Print Studio', 'İstanbul Demir Atölyesi'],
  ['pp-nav-link', 'ap-nav-link'],
  ['pp-stat', 'ap-stat'],
  ['pp-card', 'ap-card'],
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.next'].includes(entry.name)) walk(full, cb);
    else if (/\.(ts|tsx|css|js|json)$/.test(entry.name)) cb(full);
  }
}

walk(path.join(root, 'src'), (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) content = content.split(from).join(to);
  fs.writeFileSync(file, content);
});

console.log('Frontend transform complete');
