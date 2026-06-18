#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const dirRenames = [
  ['backend/src/artworks', 'backend/src/instruments'],
  ['backend/src/installations', 'backend/src/handoffs'],
  ['backend/src/assemblies', 'backend/src/benches'],
  ['backend/src/mouldings', 'backend/src/parts'],
  ['frontend/src/app/artworks', 'frontend/src/app/instruments'],
  ['frontend/src/app/installations', 'frontend/src/app/handoffs'],
  ['frontend/src/app/assemblies', 'frontend/src/app/benches'],
  ['frontend/src/app/mouldings', 'frontend/src/app/parts'],
];

for (const [from, to] of dirRenames) {
  const fromPath = path.join(root, from);
  const toPath = path.join(root, to);
  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath);
  }
}

const fileRenames = [
  ['backend/src/instruments/artworks.module.ts', 'backend/src/instruments/instruments.module.ts'],
  ['backend/src/instruments/artworks.controller.ts', 'backend/src/instruments/instruments.controller.ts'],
  ['backend/src/instruments/artworks.service.ts', 'backend/src/instruments/instruments.service.ts'],
  ['backend/src/instruments/dto/artwork.dto.ts', 'backend/src/instruments/dto/instrument.dto.ts'],
  ['backend/src/handoffs/installations.module.ts', 'backend/src/handoffs/handoffs.module.ts'],
  ['backend/src/handoffs/installations.controller.ts', 'backend/src/handoffs/handoffs.controller.ts'],
  ['backend/src/handoffs/installations.service.ts', 'backend/src/handoffs/handoffs.service.ts'],
  ['backend/src/handoffs/dto/installation.dto.ts', 'backend/src/handoffs/dto/handoff.dto.ts'],
  ['backend/src/benches/assemblies.module.ts', 'backend/src/benches/benches.module.ts'],
  ['backend/src/benches/assemblies.controller.ts', 'backend/src/benches/benches.controller.ts'],
  ['backend/src/benches/assemblies.service.ts', 'backend/src/benches/benches.service.ts'],
  ['backend/src/benches/dto/assembly.dto.ts', 'backend/src/benches/dto/bench.dto.ts'],
  ['backend/src/parts/mouldings.module.ts', 'backend/src/parts/parts.module.ts'],
  ['backend/src/parts/mouldings.controller.ts', 'backend/src/parts/parts.controller.ts'],
  ['backend/src/parts/mouldings.service.ts', 'backend/src/parts/parts.service.ts'],
  ['backend/src/parts/dto/moulding.dto.ts', 'backend/src/parts/dto/part.dto.ts'],
];

for (const [from, to] of fileRenames) {
  const fromPath = path.join(root, from);
  const toPath = path.join(root, to);
  if (fs.existsSync(fromPath)) {
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    fs.renameSync(fromPath, toPath);
  }
}

function walkAll(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', '.next', 'dist'].includes(entry.name)) {
      walkAll(full, cb);
    } else if (
      entry.isFile() &&
      /\.(ts|tsx|js|json|md|sh|css|example|yml|sql|prisma|toml|mjs)$/.test(entry.name) &&
      !entry.name.includes('package-lock.json')
    ) {
      cb(full);
    }
  }
}

const replacements = [
  ['FramePulse', 'ChordPulse'],
  ['framepulse', 'chordpulse'],
  ['4028', '4029'],
  ['3028', '3029'],
  ['demo@istanbulcerceveatolyesi.com', 'demo@istanbulenstrumanatolyesi.com'],
  ['İstanbul Çerçeve Atölyesi', 'İstanbul Enstrüman Atölyesi'],
  ['Çerçeve Atölyesi', 'Enstrüman Atölyesi'],
  ['totalWorkbenches', 'totalRepairBenches'],
  ['ArtworksModule', 'InstrumentsModule'],
  ['ArtworksController', 'InstrumentsController'],
  ['ArtworksService', 'InstrumentsService'],
  ['HandoffsModule', 'HandoffsModule'],
  ['InstallationsModule', 'HandoffsModule'],
  ['InstallationsController', 'HandoffsController'],
  ['InstallationsService', 'HandoffsService'],
  ['AssembliesModule', 'BenchesModule'],
  ['AssembliesController', 'BenchesController'],
  ['AssembliesService', 'BenchesService'],
  ['MouldingsModule', 'PartsModule'],
  ['MouldingsController', 'PartsController'],
  ['MouldingsService', 'PartsService'],
  ["@Controller('artworks')", "@Controller('instruments')"],
  ["@Controller('installations')", "@Controller('handoffs')"],
  ["@Controller('assemblies')", "@Controller('benches')"],
  ["@Controller('mouldings')", "@Controller('parts')"],
  ['framingOrder', 'repairOrder'],
  ['FramingOrder', 'RepairOrder'],
  ['artworkPiece', 'instrumentItem'],
  ['ArtworkPiece', 'InstrumentItem'],
  ['installationJob', 'handoffJob'],
  ['InstallationJob', 'HandoffJob'],
  ['frameAssembly', 'serviceBench'],
  ['FrameAssembly', 'ServiceBench'],
  ['mouldingProfile', 'sparePart'],
  ['MouldingProfile', 'SparePart'],
  ['framing_orders', 'repair_orders'],
  ['artwork_pieces', 'instrument_items'],
  ['installation_jobs', 'handoff_jobs'],
  ['frame_assemblies', 'service_benches'],
  ['moulding_profiles', 'spare_parts'],
  ['api.artworks', 'api.instruments'],
  ['api.installations', 'api.handoffs'],
  ['api.assemblies', 'api.benches'],
  ['api.mouldings', 'api.parts'],
  ['/artworks', '/instruments'],
  ['/installations', '/handoffs'],
  ['/assemblies', '/benches'],
  ['/mouldings', '/parts'],
  ['formatArtworkCondition', 'formatInstrumentCondition'],
  ['formatInstallationStatus', 'formatHandoffStatus'],
  ['formatInstallationType', 'formatHandoffType'],
  ['formatAssemblyStatus', 'formatBenchStatus'],
  ['formatMouldingStatus', 'formatPartStatus'],
  ['formatMouldingCategory', 'formatPartCategory'],
  ['formatLinearMeter', 'formatLaborHours'],
  ['workbenchName', 'benchName'],
  ['artworkCount', 'instrumentCount'],
  ['pieceTitle', 'instrumentName'],
  ['mediumType', 'instrumentFamily'],
  ['linearMeter', 'laborHours'],
  ['installationName', 'handoffName'],
  ['installationType', 'handoffType'],
  ['siteDistanceKm', 'travelKm'],
  ['crewLoad', 'caseLoad'],
  ['mouldingCategory', 'partCategory'],
  ['pricePerMeter', 'pricePerUnit'],
  ['handoffJobs', 'handoffJobs'],
  ['recentInstallations', 'recentHandoffs'],
  ['totalArtworks', 'totalInstruments'],
  ['completedInstallations', 'completedHandoffs'],
  ['pendingInstallations', 'pendingHandoffs'],
  ['upcomingAssemblies', 'upcomingBenches'],
  ['seasonalMouldings', 'seasonalParts'],
  ['totalLinearMeters', 'totalLaborHours'],
  ['workbenches', 'repairBenches'],
  ['CreateArtworkDto', 'CreateInstrumentDto'],
  ['UpdateArtworkDto', 'UpdateInstrumentDto'],
  ['CreateInstallationDto', 'CreateHandoffDto'],
  ['UpdateInstallationDto', 'UpdateHandoffDto'],
  ['CreateAssemblyDto', 'CreateBenchDto'],
  ['UpdateAssemblyDto', 'UpdateBenchDto'],
  ['CreateMouldingDto', 'CreatePartDto'],
  ['UpdateMouldingDto', 'UpdatePartDto'],
  ['ArtworkCondition', 'InstrumentCondition'],
  ['ArtworkStatus', 'InstrumentStatus'],
  ['InstallationStatus', 'HandoffStatus'],
  ['InstallationType', 'HandoffType'],
  ['AssemblyStatus', 'BenchStatus'],
  ['MouldingCategory', 'PartCategory'],
  ['MouldingStatus', 'PartStatus'],
  ['fp-', 'cp-'],
  ['fp_', 'cp_'],
  ['transform-framepulse.mjs', 'transform-chordpulse.mjs'],
  ['transform-bloompulse.mjs', 'transform-chordpulse.mjs'],
];

walkAll(root, (file) => {
  if (file.includes('transform-chordpulse.mjs') || file.includes('transform-framepulse.mjs')) return;
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

console.log('ChordPulse transform completed');
