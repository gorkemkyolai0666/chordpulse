#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const dirRenames = [
  ['backend/src/batches', 'backend/src/orders'],
  ['backend/src/pieces', 'backend/src/stems'],
  ['backend/src/firings', 'backend/src/deliveries'],
  ['backend/src/classes', 'backend/src/workshops'],
  ['backend/src/glazes', 'backend/src/varieties'],
  ['frontend/src/app/batches', 'frontend/src/app/orders'],
  ['frontend/src/app/pieces', 'frontend/src/app/stems'],
  ['frontend/src/app/firings', 'frontend/src/app/deliveries'],
  ['frontend/src/app/classes', 'frontend/src/app/workshops'],
  ['frontend/src/app/glazes', 'frontend/src/app/varieties'],
];

for (const [from, to] of dirRenames) {
  const fromPath = path.join(root, from);
  const toPath = path.join(root, to);
  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath);
  }
}

const fileRenames = [
  ['backend/src/orders/batches.module.ts', 'backend/src/orders/orders.module.ts'],
  ['backend/src/orders/batches.controller.ts', 'backend/src/orders/orders.controller.ts'],
  ['backend/src/orders/batches.service.ts', 'backend/src/orders/orders.service.ts'],
  ['backend/src/orders/dto/batch.dto.ts', 'backend/src/orders/dto/order.dto.ts'],
  ['backend/src/stems/pieces.module.ts', 'backend/src/stems/stems.module.ts'],
  ['backend/src/stems/pieces.controller.ts', 'backend/src/stems/stems.controller.ts'],
  ['backend/src/stems/pieces.service.ts', 'backend/src/stems/stems.service.ts'],
  ['backend/src/stems/dto/piece.dto.ts', 'backend/src/stems/dto/stem.dto.ts'],
  ['backend/src/deliveries/firings.module.ts', 'backend/src/deliveries/deliveries.module.ts'],
  ['backend/src/deliveries/firings.controller.ts', 'backend/src/deliveries/deliveries.controller.ts'],
  ['backend/src/deliveries/firings.service.ts', 'backend/src/deliveries/deliveries.service.ts'],
  ['backend/src/deliveries/dto/firing.dto.ts', 'backend/src/deliveries/dto/delivery.dto.ts'],
  ['backend/src/workshops/classes.module.ts', 'backend/src/workshops/workshops.module.ts'],
  ['backend/src/workshops/classes.controller.ts', 'backend/src/workshops/workshops.controller.ts'],
  ['backend/src/workshops/classes.service.ts', 'backend/src/workshops/workshops.service.ts'],
  ['backend/src/workshops/dto/class.dto.ts', 'backend/src/workshops/dto/workshop.dto.ts'],
  ['backend/src/varieties/glazes.module.ts', 'backend/src/varieties/varieties.module.ts'],
  ['backend/src/varieties/glazes.controller.ts', 'backend/src/varieties/varieties.controller.ts'],
  ['backend/src/varieties/glazes.service.ts', 'backend/src/varieties/varieties.service.ts'],
  ['backend/src/varieties/dto/glaze.dto.ts', 'backend/src/varieties/dto/variety.dto.ts'],
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
    } else if (entry.isFile() && /\.(ts|tsx|js|json|md|sh|css|example|yml|sql|prisma|toml|mjs)$/.test(entry.name)) {
      cb(full);
    }
  }
}

const replacements = [
  ['KilnPulse', 'BloomPulse'],
  ['kilnpulse', 'bloompulse'],
  ['4025', '4026'],
  ['3025', '3026'],
  ['demo@istanbulseramikatolyesi.com', 'demo@istanbulcicekstudyo.com'],
  ['İstanbul Seramik Atölyesi', 'İstanbul Çiçek Stüdyosu'],
  ['Seramik Atölyesi', 'Çiçek Stüdyosu'],
  ['totalKilns', 'totalColdRooms'],
  ['BatchesModule', 'OrdersModule'],
  ['BatchesController', 'OrdersController'],
  ['BatchesService', 'OrdersService'],
  ['PiecesModule', 'StemsModule'],
  ['PiecesController', 'StemsController'],
  ['PiecesService', 'StemsService'],
  ['FiringsModule', 'DeliveriesModule'],
  ['FiringsController', 'DeliveriesController'],
  ['FiringsService', 'DeliveriesService'],
  ['ClassesModule', 'WorkshopsModule'],
  ['ClassesController', 'WorkshopsController'],
  ['ClassesService', 'WorkshopsService'],
  ['GlazesModule', 'VarietiesModule'],
  ['GlazesController', 'VarietiesController'],
  ['GlazesService', 'VarietiesService'],
  ['productionBatch', 'floralOrder'],
  ['ProductionBatch', 'FloralOrder'],
  ['ceramicPiece', 'stemLot'],
  ['CeramicPiece', 'StemLot'],
  ['kilnFiring', 'deliveryRun'],
  ['KilnFiring', 'DeliveryRun'],
  ['workshopClass', 'arrangementWorkshop'],
  ['WorkshopClass', 'ArrangementWorkshop'],
  ['glazeRecipe', 'flowerVariety'],
  ['GlazeRecipe', 'FlowerVariety'],
  ['production_batches', 'floral_orders'],
  ['ceramic_pieces', 'stem_lots'],
  ['kiln_firings', 'delivery_runs'],
  ['workshop_classes', 'arrangement_workshops'],
  ['glaze_recipes', 'flower_varieties'],
  ['api.batches', 'api.orders'],
  ['api.pieces', 'api.stems'],
  ['api.firings', 'api.deliveries'],
  ['api.classes', 'api.workshops'],
  ['api.glazes', 'api.varieties'],
  ['/batches', '/orders'],
  ['/pieces', '/stems'],
  ['/firings', '/deliveries'],
  ['/classes', '/workshops'],
  ['/glazes', '/varieties'],
  ['formatBatchStatus', 'formatOrderStatus'],
  ['formatBatchType', 'formatOrderType'],
  ['formatPieceStage', 'formatStemCondition'],
  ['formatFiringStatus', 'formatDeliveryStatus'],
  ['formatFiringType', 'formatDeliveryType'],
  ['formatClassStatus', 'formatWorkshopStatus'],
  ['formatGlazeStatus', 'formatVarietyStatus'],
  ['formatGlazeCategory', 'formatVarietyCategory'],
  ['formatWeightKg', 'formatBunchCount'],
  ['batchNumber', 'orderNumber'],
  ['batchType', 'orderType'],
  ['kilnName', 'coldRoomName'],
  ['pieceCount', 'stemCount'],
  ['pieceName', 'lotName'],
  ['clayType', 'flowerType'],
  ['weightKg', 'bunchCount'],
  ['firingName', 'deliveryName'],
  ['firingType', 'deliveryType'],
  ['targetTemp', 'routeKm'],
  ['loadPercent', 'vehicleLoad'],
  ['glazeCategory', 'varietyCategory'],
  ['pricePerPiece', 'pricePerBunch'],
  ['kilnFirings', 'deliveryRuns'],
  ['recentFirings', 'recentDeliveries'],
  ['totalBatches', 'totalOrders'],
  ['activeBatches', 'activeOrders'],
  ['batchThroughputRate', 'orderFulfillmentRate'],
  ['totalPieces', 'totalStems'],
  ['completedFirings', 'completedDeliveries'],
  ['pendingFirings', 'pendingDeliveries'],
  ['upcomingClasses', 'upcomingWorkshops'],
  ['seasonalGlazes', 'seasonalVarieties'],
  ['totalWeight', 'totalBunches'],
  ['kilns', 'coldRooms'],
  ['batchCount', 'orderCount'],
  ['CreateBatchDto', 'CreateOrderDto'],
  ['UpdateBatchDto', 'UpdateOrderDto'],
  ['CreatePieceDto', 'CreateStemDto'],
  ['UpdatePieceDto', 'UpdateStemDto'],
  ['CreateFiringDto', 'CreateDeliveryDto'],
  ['UpdateFiringDto', 'UpdateDeliveryDto'],
  ['CreateClassDto', 'CreateWorkshopDto'],
  ['UpdateClassDto', 'UpdateWorkshopDto'],
  ['CreateGlazeDto', 'CreateVarietyDto'],
  ['UpdateGlazeDto', 'UpdateVarietyDto'],
  ['BatchStatus', 'OrderStatus'],
  ['BatchType', 'OrderType'],
  ['PieceStage', 'StemCondition'],
  ['PieceStatus', 'StemStatus'],
  ['FiringStatus', 'DeliveryStatus'],
  ['FiringType', 'DeliveryType'],
  ['ClassStatus', 'WorkshopStatus'],
  ['GlazeCategory', 'VarietyCategory'],
  ['GlazeStatus', 'VarietyStatus'],
  ['kp-', 'bp-'],
  ['kp_', 'bp_'],
  ['transform-kilnpulse.mjs', 'transform-chordpulse.mjs'],
];

walkAll(root, (file) => {
  if (file.includes('transform-chordpulse.mjs') || file.includes('transform-kilnpulse.mjs')) return;
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

console.log('BloomPulse transform completed');
