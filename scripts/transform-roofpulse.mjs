#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const dirRenames = [
  ['workshop', 'firm'],
  ['projects', 'jobs'],
  ['materials', 'membranes'],
  ['site-visits', 'inspections'],
  ['welding', 'crews'],
  ['surface-finishes', 'systems'],
];

const backendSrc = path.join(root, 'backend/src');
for (const [from, to] of dirRenames) {
  const src = path.join(backendSrc, from);
  const dest = path.join(backendSrc, to);
  if (fs.existsSync(src)) fs.renameSync(src, dest);
}

const fileRenames = [
  ['firm', 'workshop', 'workshop'],
  ['firm', 'workshop', 'Workshop'],
  ['jobs', 'projects', 'project'],
  ['jobs', 'projects', 'projects'],
  ['membranes', 'materials', 'material'],
  ['membranes', 'materials', 'materials'],
  ['inspections', 'site-visits', 'site-visit'],
  ['inspections', 'site-visits', 'site-visits'],
  ['crews', 'welding', 'welding'],
  ['systems', 'surface-finishes', 'surface-finish'],
  ['systems', 'surface-finishes', 'surface-finishes'],
];

for (const [targetDir, from, to] of fileRenames) {
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

function walkAll(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      walkAll(full, cb);
    } else if (entry.isFile()) {
      cb(full);
    }
  }
}

const textReplacements = [
  ['AnvilPulse', 'RoofPulse'],
  ['anvilpulse', 'roofpulse'],
  ['4022', '4023'],
  ['3022', '3023'],
  ['demo@istanbuldemiratolyesi.com', 'demo@istanbulcatikaplama.com'],
  ['WorkshopModule', 'FirmModule'],
  ['WorkshopService', 'FirmService'],
  ['WorkshopController', 'FirmController'],
  ['UpdateBenchDto', 'UpdateFirmDto'],
  ['ProjectsModule', 'JobsModule'],
  ['ProjectsService', 'JobsService'],
  ['ProjectsController', 'JobsController'],
  ['CreateProjectDto', 'CreateJobDto'],
  ['UpdateProjectDto', 'UpdateJobDto'],
  ['MaterialsModule', 'MembranesModule'],
  ['MaterialsService', 'MembranesService'],
  ['MaterialsController', 'MembranesController'],
  ['CreateMaterialDto', 'CreateMembraneDto'],
  ['UpdateMaterialDto', 'UpdateMembraneDto'],
  ['SiteVisitsModule', 'InspectionsModule'],
  ['SiteVisitsService', 'InspectionsService'],
  ['SiteVisitsController', 'InspectionsController'],
  ['CreateSiteVisitDto', 'CreateInspectionDto'],
  ['UpdateSiteVisitDto', 'UpdateInspectionDto'],
  ['WeldingModule', 'CrewsModule'],
  ['WeldingService', 'CrewsService'],
  ['WeldingController', 'CrewsController'],
  ['CreateWeldingDto', 'CreateCrewDto'],
  ['UpdateWeldingDto', 'UpdateCrewDto'],
  ['SurfaceFinishesModule', 'SystemsModule'],
  ['SurfaceFinishesService', 'SystemsService'],
  ['SurfaceFinishesController', 'SystemsController'],
  ['CreateSurfaceFinishDto', 'CreateSystemDto'],
  ['UpdateSurfaceFinishDto', 'UpdateSystemDto'],
  ['workshop', 'firm'],
  ['workshops', 'firms'],
  ['Workshop', 'Firm'],
  ['workshopId', 'firmId'],
  ['fabricationProject', 'roofingJob'],
  ['fabricationProjects', 'roofingJobs'],
  ['FabricationProject', 'RoofingJob'],
  ['materialStock', 'membraneRoll'],
  ['MaterialStock', 'MembraneRoll'],
  ['siteVisit', 'roofInspection'],
  ['siteVisits', 'roofInspections'],
  ['SiteVisit', 'RoofInspection'],
  ['weldingTask', 'crewDispatch'],
  ['weldingTasks', 'crewDispatches'],
  ['WeldingTask', 'CrewDispatch'],
  ['surfaceFinish', 'waterproofingSystem'],
  ['surfaceFinishes', 'waterproofingSystems'],
  ['SurfaceFinish', 'WaterproofingSystem'],
  ['ProjectStatus', 'JobStatus'],
  ['ProjectType', 'JobType'],
  ['MaterialStatus', 'MembraneStatus'],
  ['MaterialUnit', 'MembraneUnit'],
  ['SiteVisitStatus', 'InspectionStatus'],
  ['MeasurementQuality', 'InspectionQuality'],
  ['WeldingStatus', 'CrewStatus'],
  ['WeldingCategory', 'CrewRole'],
  ['SurfaceCategory', 'SystemCategory'],
  ['SurfaceStatus', 'SystemStatus'],
  ['projectNumber', 'jobNumber'],
  ['clientName', 'clientName'],
  ['projectType', 'jobType'],
  ['stationName', 'crewName'],
  ['totalStations', 'totalCrews'],
  ['instrumentName', 'rollName'],
  ['materialGrade', 'membraneType'],
  ['quantityKg', 'quantitySqm'],
  ['materialUnit', 'membraneUnit'],
  ['measurementQuality', 'inspectionQuality'],
  ['revisionNotes', 'revisionNotes'],
  ['visitedAt', 'inspectedAt'],
  ['surfaceCategory', 'systemCategory'],
  ['pricePerSqm', 'pricePerSqm'],
  ['fabricator', 'technician'],
  ['/projects', '/jobs'],
  ['/materials', '/membranes'],
  ['/site-visits', '/inspections'],
  ['/welding', '/crews'],
  ['/surface-finishes', '/systems'],
  ['/workshop', '/firm'],
  ['projects/page', 'jobs/page'],
  ['materials/page', 'membranes/page'],
  ['site-visits/page', 'inspections/page'],
  ['welding/page', 'crews/page'],
  ['surface-finishes/page', 'systems/page'],
  ['workshop/page', 'firm/page'],
];

const skipExt = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2']);

walkAll(root, (file) => {
  const ext = path.extname(file);
  if (skipExt.has(ext)) return;
  if (file.includes('node_modules')) return;
  if (file.includes('transform-roofpulse.mjs')) return;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of textReplacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, content);
});

console.log('RoofPulse transform complete');
