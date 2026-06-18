#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'frontend/src');

const replacements = [
  ['api.projects', 'api.jobs'],
  ['api.materials', 'api.membranes'],
  ['api.roofInspections', 'api.inspections'],
  ['api.welding', 'api.crews'],
  ['api.waterproofingSystemes', 'api.systems'],
  ['ap-card', 'rp-glass-card'],
  ['ap-stat', 'rp-stat'],
  ['Anvil<span className="text-primary">Pulse</span>', 'Roof<span className="text-primary">Pulse</span>'],
  ['formatLaborHours', 'formatAreaSqm'],
  ['formatPrintType', 'formatJobType'],
  ['Atölye Profili', 'Firma Profili'],
  ['Atölye Bilgileri', 'Firma Bilgileri'],
  ['Atölye Adı', 'Firma Adı'],
  ['Atölye Paneli', 'Operasyon Paneli'],
  ['Atölye operasyonlarınızı', 'Çatı işlerinizi'],
  ['Yeni baskı atölyesi', 'Yeni çatı kaplama firması'],
  ['baskı atölyesi', 'çatı kaplama firması'],
  ['visit.project', 'visit.job'],
  ['project?:', 'job?:'],
  ['projectCount', 'jobCount'],
  ['totalProjects', 'totalJobs'],
  ['activeProjects', 'activeJobs'],
  ['projectThroughputRate', 'jobThroughputRate'],
  ['pendingWelding', 'pendingCrews'],
  ['seasonalFinishes', 'seasonalSystems'],
  ['materialWeight', 'membraneArea'],
  ['totalMembraneRoll', 'totalMembraneRolls'],
  ['Proje Verimi', 'İş Verimi'],
  ['proje aktif', 'iş aktif'],
  ['Malzeme Stok', 'Membran Stok'],
  ['Saha & Kaynak', 'Keşif & Ekip'],
  ['bekleyen kaynak görevi', 'bekleyen ekip görevi'],
  ['Son Saha Ziyaretleri', 'Son Çatı Keşifleri'],
  ['İstasyon Dağılımı', 'Ekip Dağılımı'],
  ['İstasyon', 'Ekip'],
  ['Proje Sayısı', 'İş Sayısı'],
  [' proje', ' iş'],
  ['Aylık Saha Trendi', 'Aylık Keşif Trendi'],
  ['Ziyaret', 'Keşif'],
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (/\.(tsx|ts)$/.test(entry.name)) cb(full);
  }
}

walk(root, (file) => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, content);
});

console.log('Frontend bulk fixes applied');
