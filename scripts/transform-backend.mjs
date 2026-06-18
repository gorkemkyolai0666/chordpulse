#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = new URL('../backend/src', import.meta.url).pathname;

const renames = [
  ['beer-styles', 'honey-varieties'],
  ['line-cleanings', 'treatments'],
  ['tap-assignments', 'inspections'],
  ['kegs', 'harvests'],
  ['taps', 'hives'],
  ['brewery', 'apiary'],
];

for (const [from, to] of renames) {
  const src = path.join(root, from);
  const dest = path.join(root, to);
  if (fs.existsSync(src)) fs.renameSync(src, dest);
}

const fileRenames = [
  ['beer-styles', 'honey-varieties', 'beer-styles', 'honey-varieties'],
  ['beer-styles', 'honey-varieties', 'beer-style', 'honey-variety'],
  ['line-cleanings', 'treatments', 'line-cleanings', 'treatments'],
  ['line-cleanings', 'treatments', 'line-cleaning', 'treatment'],
  ['tap-assignments', 'inspections', 'tap-assignments', 'inspections'],
  ['tap-assignments', 'inspections', 'tap-assignment', 'inspection'],
  ['kegs', 'harvests', 'kegs', 'harvests'],
  ['kegs', 'harvests', 'keg', 'harvest'],
  ['taps', 'hives', 'taps', 'hives'],
  ['taps', 'hives', 'tap', 'hive'],
  ['brewery', 'apiary', 'brewery', 'apiary'],
];

for (const [dir, , from, to] of fileRenames) {
  const dirPath = path.join(root, dir === 'beer-styles' ? 'honey-varieties' : dir === 'line-cleanings' ? 'treatments' : dir === 'tap-assignments' ? 'inspections' : dir === 'kegs' ? 'harvests' : dir === 'taps' ? 'hives' : 'apiary');
  for (const file of fs.readdirSync(dirPath, { recursive: true })) {
    if (typeof file !== 'string') continue;
    const full = path.join(dirPath, file);
    if (!fs.statSync(full).isFile()) continue;
    const next = full.replace(new RegExp(from, 'g'), to);
    if (next !== full) fs.renameSync(full, next);
  }
}

const replacements = [
  ['BeerStylesModule', 'HoneyPartsModule'],
  ['BeerStyleModule', 'HoneyPartsModule'],
  ['LineCleaningsModule', 'TreatmentsModule'],
  ['LineCleaningModule', 'TreatmentsModule'],
  ['TapAssignmentsModule', 'InspectionsModule'],
  ['TapAssignmentModule', 'InspectionsModule'],
  ['KegsModule', 'HarvestsModule'],
  ['TapsModule', 'HivesModule'],
  ['BreweryModule', 'ApiaryModule'],
  ['BeerStylesService', 'HoneyPartsService'],
  ['BeerStylesController', 'HoneyPartsController'],
  ['LineCleaningsService', 'TreatmentsService'],
  ['LineCleaningsController', 'TreatmentsController'],
  ['TapAssignmentsService', 'InspectionsService'],
  ['TapAssignmentsController', 'InspectionsController'],
  ['KegsService', 'HarvestsService'],
  ['KegsController', 'HarvestsController'],
  ['TapsService', 'HivesService'],
  ['TapsController', 'HivesController'],
  ['BreweryService', 'ApiaryService'],
  ['BreweryController', 'ApiaryController'],
  ['beerStyles', 'honeyVarieties'],
  ['beerStyle', 'honeyVariety'],
  ['BeerStyle', 'HoneyVariety'],
  ['lineCleanings', 'treatments'],
  ['lineCleaning', 'treatment'],
  ['LineCleaning', 'Treatment'],
  ['tapAssignments', 'inspections'],
  ['tapAssignment', 'inspection'],
  ['TapAssignment', 'Inspection'],
  ['kegs', 'harvests'],
  ['keg', 'harvest'],
  ['Keg', 'Harvest'],
  ['taps', 'hives'],
  ['tap', 'hive'],
  ['Tap', 'Hive'],
  ['breweryId', 'apiaryId'],
  ['breweryName', 'apiaryName'],
  ['brewery', 'apiary'],
  ['Brewery', 'Apiary'],
  ['totalTaps', 'totalHives'],
  ['tapUtilizationRate', 'hiveActivityRate'],
  ['pourRevenue', 'harvestValue'],
  ['pourPrice', 'estimatedValue'],
  ['pendingLineCleanings', 'pendingTreatments'],
  ['upcomingBeerStyles', 'upcomingHoneyVarieties'],
  ['recentTapAssignments', 'recentInspections'],
  ['emptyingSoonAssignments', 'followUpInspections'],
  ['activeTapAssignments', 'completedInspections'],
  ['pouringTaps', 'activeHives'],
  ['availableTaps', 'inactiveHives'],
  ['totalKegs', 'totalHarvests'],
  ['BrewTrack', 'HivePulse'],
  ['brewtrack', 'hivepulse'],
  ["@Controller('taps')", "@Controller('hives')"],
  ["@Controller('kegs')", "@Controller('harvests')"],
  ["@Controller('tap-assignments')", "@Controller('inspections')"],
  ["@Controller('line-cleanings')", "@Controller('treatments')"],
  ["@Controller('beer-styles')", "@Controller('honey-varieties')"],
  ["@Controller('brewery')", "@Controller('apiary')"],
  ['4008', '4020'],
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (entry.name.endsWith('.ts')) cb(full);
  }
}

walk(root, (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(file, content);
});

console.log('Backend transform complete');
