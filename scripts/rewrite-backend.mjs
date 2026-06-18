#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const backendRoot = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'backend');

const dirRenames = [
  ['printshop', 'firm'],
  ['jobs', 'projects'],
  ['paper-stock', 'materials'],
  ['proofs', 'site-visits'],
  ['maintenance', 'welding'],
  ['finishes', 'surface-finishes'],
];

const srcDir = path.join(backendRoot, 'src');
for (const [from, to] of dirRenames) {
  const src = path.join(srcDir, from);
  const dest = path.join(srcDir, to);
  if (fs.existsSync(src)) {
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });
    fs.renameSync(src, dest);
  }
}

const fileRenames = [
  ['firm', 'printshop', 'firm'],
  ['firm', 'update-printshop', 'update-firm'],
  ['projects', 'jobs', 'projects'],
  ['projects', 'job', 'project'],
  ['materials', 'paper-stock', 'materials'],
  ['site-visits', 'proofs', 'site-visits'],
  ['site-visits', 'proof', 'site-visit'],
  ['welding', 'maintenance', 'welding'],
  ['surface-finishes', 'finishes', 'surface-finishes'],
  ['surface-finishes', 'finish', 'surface-finish'],
];

for (const [dir, from, to] of fileRenames) {
  const dirPath = path.join(srcDir, dir);
  if (!fs.existsSync(dirPath)) continue;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.includes(from)) {
        fs.renameSync(full, path.join(d, entry.name.replace(new RegExp(from, 'g'), to)));
      }
    }
  };
  walk(dirPath);
}

const replacements = [
  ['PressPulse', 'RoofPulse'],
  ['presspulse', 'roofpulse'],
  ['PrintshopModule', 'FirmModule'],
  ['PrintshopService', 'FirmService'],
  ['PrintshopController', 'FirmController'],
  ['UpdatePrintshopDto', 'UpdateFirmDto'],
  ['JobsModule', 'JobsModule'],
  ['JobsService', 'JobsService'],
  ['JobsController', 'JobsController'],
  ['CreateJobDto', 'CreateJobDto'],
  ['UpdateJobDto', 'UpdateJobDto'],
  ['PaperStockModule', 'MembranesModule'],
  ['PaperStockService', 'MembranesService'],
  ['PaperStockController', 'MembranesController'],
  ['CreatePaperStockDto', 'CreateMembraneDto'],
  ['UpdatePaperStockDto', 'UpdateMembraneDto'],
  ['ProofsModule', 'InspectionsModule'],
  ['ProofsService', 'InspectionsService'],
  ['ProofsController', 'InspectionsController'],
  ['CreateProofDto', 'CreateInspectionDto'],
  ['UpdateProofDto', 'UpdateInspectionDto'],
  ['MaintenanceModule', 'CrewsModule'],
  ['MaintenanceService', 'CrewsService'],
  ['MaintenanceController', 'CrewsController'],
  ['CreateMaintenanceDto', 'CreateCrewDto'],
  ['UpdateMaintenanceDto', 'UpdateCrewDto'],
  ['FinishesModule', 'SystemsModule'],
  ['FinishesService', 'SystemsService'],
  ['FinishesController', 'SystemsController'],
  ['CreateFinishDto', 'CreateSystemDto'],
  ['UpdateFinishDto', 'UpdateSystemDto'],
  ['printShop', 'firm'],
  ['printShops', 'firms'],
  ['PrintShop', 'Firm'],
  ['printShopId', 'firmId'],
  ['printShopName', 'firmName'],
  ['printJob', 'roofingJob'],
  ['printJobs', 'roofingJobs'],
  ['PrintJob', 'RoofingJob'],
  ['paperStock', 'membraneRoll'],
  ['PaperStock', 'MembraneRoll'],
  ['proofRound', 'roofInspection'],
  ['proofRounds', 'roofInspections'],
  ['ProofRound', 'RoofInspection'],
  ['machineMaintenance', 'crewDispatch'],
  ['MachineMaintenance', 'CrewDispatch'],
  ['printFinish', 'waterproofingSystem'],
  ['printFinishes', 'waterproofingSystemes'],
  ['PrintFinish', 'WaterproofingSystem'],
  ['PrintJobStatus', 'JobStatus'],
  ['PrintJobType', 'JobType'],
  ['PaperStockStatus', 'MembraneStatus'],
  ['ProofRoundStatus', 'RoofInspectionStatus'],
  ['ProofQuality', 'InspectionQuality'],
  ['MaintenanceStatus', 'CrewStatus'],
  ['MaintenanceCategory', 'CrewRole'],
  ['FinishCategory', 'SystemCategory'],
  ['FinishStatus', 'SystemStatus'],
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
  ['revisionCount', 'revisionNotes'],
  ['pricePerUnit', 'pricePerSqm'],
  ['setupMinutes', 'leadDays'],
  ['finishCategory', 'systemCategory'],
  ['totalMachines', 'totalCrews'],
  ['totalPaperStock', 'totalMembraneRoll'],
  ['approvedProofs', 'approvedVisits'],
  ['revisionProofs', 'pendingRevisions'],
  ['pendingMaintenance', 'pendingWelding'],
  ['stockWeight', 'materialWeight'],
  ['recentProofs', 'recentVisits'],
  ['machines', 'stations'],
  ['jobThroughputRate', 'projectThroughputRate'],
  ['totalJobs', 'totalProjects'],
  ['activeJobs', 'activeProjects'],
  ['cancelledJobs', 'cancelledProjects'],
  ['jobId', 'projectId'],
  ['StorageUnit', 'MembraneUnit'],
  ["@Controller('printshop')", "@Controller('firm')"],
  ["@Controller('jobs')", "@Controller('projects')"],
  ["@Controller('paper-stock')", "@Controller('materials')"],
  ["@Controller('proofs')", "@Controller('site-visits')"],
  ["@Controller('maintenance')", "@Controller('welding')"],
  ["@Controller('finishes')", "@Controller('surface-finishes')"],
  ['Print job not found', 'Fabrication project not found'],
  ['Paper stock not found', 'Material stock not found'],
  ['Proof round not found', 'Site visit not found'],
  ['Maintenance record not found', 'Welding task not found'],
  ['Print finish not found', 'Surface finish not found'],
  ['4021', '4023'],
  ['demo@istanbulprintstudio.com', 'demo@istanbulcatikaplama.com'],
  ['İstanbul Print Studio', 'İstanbul Demir Atölyesi'],
  ["'in_progress', 'printing', 'finishing'", "'designing', 'fabricating', 'welding', 'finishing'"],
  ["status: 'ready'", "status: 'installed'"],
  ['revision', 'revision'],
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', 'dist'].includes(entry.name)) walk(full, cb);
    else if (entry.isFile() && /\.(ts|json)$/.test(entry.name)) cb(full);
  }
}

walk(path.join(backendRoot, 'src'), (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) content = content.split(from).join(to);
  fs.writeFileSync(file, content);
});

walk(path.join(backendRoot, 'prisma'), (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) content = content.split(from).join(to);
  fs.writeFileSync(file, content);
});

console.log('Backend rewrite complete');
