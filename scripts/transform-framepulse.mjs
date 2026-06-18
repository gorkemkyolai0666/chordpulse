#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const dirRenames = [
  ['backend/src/stems', 'backend/src/artworks'],
  ['backend/src/deliveries', 'backend/src/installations'],
  ['backend/src/workshops', 'backend/src/assemblies'],
  ['backend/src/varieties', 'backend/src/mouldings'],
  ['frontend/src/app/stems', 'frontend/src/app/artworks'],
  ['frontend/src/app/deliveries', 'frontend/src/app/installations'],
  ['frontend/src/app/workshops', 'frontend/src/app/assemblies'],
  ['frontend/src/app/varieties', 'frontend/src/app/mouldings'],
];

for (const [from, to] of dirRenames) {
  const fromPath = path.join(root, from);
  const toPath = path.join(root, to);
  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath);
  }
}

const fileRenames = [
  ['backend/src/artworks/stems.module.ts', 'backend/src/artworks/artworks.module.ts'],
  ['backend/src/artworks/stems.controller.ts', 'backend/src/artworks/artworks.controller.ts'],
  ['backend/src/artworks/stems.service.ts', 'backend/src/artworks/artworks.service.ts'],
  ['backend/src/artworks/dto/stem.dto.ts', 'backend/src/artworks/dto/artwork.dto.ts'],
  ['backend/src/installations/deliveries.module.ts', 'backend/src/installations/installations.module.ts'],
  ['backend/src/installations/deliveries.controller.ts', 'backend/src/installations/installations.controller.ts'],
  ['backend/src/installations/deliveries.service.ts', 'backend/src/installations/installations.service.ts'],
  ['backend/src/installations/dto/delivery.dto.ts', 'backend/src/installations/dto/installation.dto.ts'],
  ['backend/src/assemblies/workshops.module.ts', 'backend/src/assemblies/assemblies.module.ts'],
  ['backend/src/assemblies/workshops.controller.ts', 'backend/src/assemblies/assemblies.controller.ts'],
  ['backend/src/assemblies/workshops.service.ts', 'backend/src/assemblies/assemblies.service.ts'],
  ['backend/src/assemblies/dto/workshop.dto.ts', 'backend/src/assemblies/dto/assembly.dto.ts'],
  ['backend/src/mouldings/varieties.module.ts', 'backend/src/mouldings/mouldings.module.ts'],
  ['backend/src/mouldings/varieties.controller.ts', 'backend/src/mouldings/mouldings.controller.ts'],
  ['backend/src/mouldings/varieties.service.ts', 'backend/src/mouldings/mouldings.service.ts'],
  ['backend/src/mouldings/dto/variety.dto.ts', 'backend/src/mouldings/dto/moulding.dto.ts'],
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
  ['BloomPulse', 'FramePulse'],
  ['bloompulse', 'framepulse'],
  ['4026', '4028'],
  ['3026', '3028'],
  ['demo@istanbulcicekstudyo.com', 'demo@istanbulcerceveatolyesi.com'],
  ['İstanbul Çiçek Stüdyosu', 'İstanbul Çerçeve Atölyesi'],
  ['Çiçek Stüdyosu', 'Çerçeve Atölyesi'],
  ['totalColdRooms', 'totalWorkbenches'],
  ['StemsModule', 'ArtworksModule'],
  ['StemsController', 'ArtworksController'],
  ['StemsService', 'ArtworksService'],
  ['DeliveriesModule', 'InstallationsModule'],
  ['DeliveriesController', 'InstallationsController'],
  ['DeliveriesService', 'InstallationsService'],
  ['WorkshopsModule', 'AssembliesModule'],
  ['WorkshopsController', 'AssembliesController'],
  ['WorkshopsService', 'AssembliesService'],
  ['VarietiesModule', 'MouldingsModule'],
  ['VarietiesController', 'MouldingsController'],
  ['VarietiesService', 'MouldingsService'],
  ["@Controller('stems')", "@Controller('artworks')"],
  ["@Controller('deliveries')", "@Controller('installations')"],
  ["@Controller('workshops')", "@Controller('assemblies')"],
  ["@Controller('varieties')", "@Controller('mouldings')"],
  ['floralOrder', 'framingOrder'],
  ['FloralOrder', 'FramingOrder'],
  ['stemLot', 'artworkPiece'],
  ['StemLot', 'ArtworkPiece'],
  ['deliveryRun', 'installationJob'],
  ['DeliveryRun', 'InstallationJob'],
  ['arrangementWorkshop', 'frameAssembly'],
  ['ArrangementWorkshop', 'FrameAssembly'],
  ['flowerVariety', 'mouldingProfile'],
  ['FlowerVariety', 'MouldingProfile'],
  ['floral_orders', 'framing_orders'],
  ['stem_lots', 'artwork_pieces'],
  ['delivery_runs', 'installation_jobs'],
  ['arrangement_workshops', 'frame_assemblies'],
  ['flower_varieties', 'moulding_profiles'],
  ['api.stems', 'api.artworks'],
  ['api.deliveries', 'api.installations'],
  ['api.workshops', 'api.assemblies'],
  ['api.varieties', 'api.mouldings'],
  ['/stems', '/artworks'],
  ['/deliveries', '/installations'],
  ['/workshops', '/assemblies'],
  ['/varieties', '/mouldings'],
  ['formatStemCondition', 'formatArtworkCondition'],
  ['formatDeliveryStatus', 'formatInstallationStatus'],
  ['formatDeliveryType', 'formatInstallationType'],
  ['formatWorkshopStatus', 'formatAssemblyStatus'],
  ['formatVarietyStatus', 'formatMouldingStatus'],
  ['formatVarietyCategory', 'formatMouldingCategory'],
  ['formatBunchCount', 'formatLinearMeter'],
  ['coldRoomName', 'workbenchName'],
  ['stemCount', 'artworkCount'],
  ['lotName', 'pieceTitle'],
  ['flowerType', 'mediumType'],
  ['bunchCount', 'linearMeter'],
  ['deliveryName', 'installationName'],
  ['deliveryType', 'installationType'],
  ['routeKm', 'siteDistanceKm'],
  ['vehicleLoad', 'crewLoad'],
  ['varietyCategory', 'mouldingCategory'],
  ['pricePerBunch', 'pricePerMeter'],
  ['deliveryRuns', 'installationJobs'],
  ['recentDeliveries', 'recentInstallations'],
  ['totalStems', 'totalArtworks'],
  ['completedDeliveries', 'completedInstallations'],
  ['pendingDeliveries', 'pendingInstallations'],
  ['upcomingWorkshops', 'upcomingAssemblies'],
  ['seasonalVarieties', 'seasonalMouldings'],
  ['totalBunches', 'totalLinearMeters'],
  ['coldRooms', 'workbenches'],
  ['CreateStemDto', 'CreateArtworkDto'],
  ['UpdateStemDto', 'UpdateArtworkDto'],
  ['CreateDeliveryDto', 'CreateInstallationDto'],
  ['UpdateDeliveryDto', 'UpdateInstallationDto'],
  ['CreateWorkshopDto', 'CreateAssemblyDto'],
  ['UpdateWorkshopDto', 'UpdateAssemblyDto'],
  ['CreateVarietyDto', 'CreateMouldingDto'],
  ['UpdateVarietyDto', 'UpdateMouldingDto'],
  ['StemCondition', 'ArtworkCondition'],
  ['StemStatus', 'ArtworkStatus'],
  ['DeliveryStatus', 'InstallationStatus'],
  ['DeliveryType', 'InstallationType'],
  ['WorkshopStatus', 'AssemblyStatus'],
  ['VarietyCategory', 'MouldingCategory'],
  ['VarietyStatus', 'MouldingStatus'],
  ['bp-', 'fp-'],
  ['bp_', 'fp_'],
  ['transform-bloompulse.mjs', 'transform-framepulse.mjs'],
];

walkAll(root, (file) => {
  if (file.includes('transform-framepulse.mjs') || file.includes('transform-bloompulse.mjs')) return;
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

console.log('FramePulse transform completed');
