-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'designer');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('quoted', 'sourcing', 'preparing', 'arranging', 'ready', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('wedding', 'funeral', 'corporate', 'retail', 'subscription', 'seasonal');

-- CreateEnum
CREATE TYPE "InstrumentCondition" AS ENUM ('fresh', 'conditioning', 'arranged', 'wilted', 'discarded');

-- CreateEnum
CREATE TYPE "InstrumentStatus" AS ENUM ('in_stock', 'reserved', 'sold', 'expired');

-- CreateEnum
CREATE TYPE "HandoffStatus" AS ENUM ('scheduled', 'loading', 'en_route', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "HandoffType" AS ENUM ('wedding', 'event', 'wholesale', 'subscription', 'rush');

-- CreateEnum
CREATE TYPE "BenchStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'full');

-- CreateEnum
CREATE TYPE "PartCategory" AS ENUM ('rose', 'tropical', 'foliage', 'seasonal', 'dried', 'other');

-- CreateEnum
CREATE TYPE "PartStatus" AS ENUM ('active', 'seasonal', 'discontinued');

-- CreateTable
CREATE TABLE "firms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_cold_rooms" INTEGER NOT NULL DEFAULT 2,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Istanbul',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "firms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "firm_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_orders" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "order_type" "OrderType" NOT NULL DEFAULT 'wedding',
    "stem_count" INTEGER NOT NULL DEFAULT 1,
    "status" "OrderStatus" NOT NULL DEFAULT 'quoted',
    "due_date" DATE,
    "cold_room_name" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repair_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrument_items" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "order_id" TEXT,
    "lot_name" TEXT NOT NULL,
    "flower_type" TEXT,
    "condition" "InstrumentCondition" NOT NULL DEFAULT 'fresh',
    "status" "InstrumentStatus" NOT NULL DEFAULT 'in_stock',
    "bunch_count" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instrument_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "handoff_jobs" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "delivery_name" TEXT NOT NULL,
    "delivery_type" "HandoffType" NOT NULL DEFAULT 'wedding',
    "cold_room_name" TEXT,
    "route_km" INTEGER,
    "vehicle_load" DOUBLE PRECISION,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "HandoffStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "handoff_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_benches" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructor" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "max_students" INTEGER NOT NULL DEFAULT 8,
    "enrolled" INTEGER NOT NULL DEFAULT 0,
    "status" "BenchStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_benches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spare_parts" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "variety_category" "PartCategory" NOT NULL DEFAULT 'rose',
    "status" "PartStatus" NOT NULL DEFAULT 'active',
    "shelf_life_days" INTEGER,
    "price_per_bunch" DOUBLE PRECISION NOT NULL,
    "lead_days" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spare_parts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "repair_orders_firm_id_order_number_key" ON "repair_orders"("firm_id", "order_number");

-- CreateIndex
CREATE INDEX "repair_orders_firm_id_status_idx" ON "repair_orders"("firm_id", "status");

-- CreateIndex
CREATE INDEX "instrument_items_firm_id_condition_idx" ON "instrument_items"("firm_id", "condition");

-- CreateIndex
CREATE INDEX "handoff_jobs_firm_id_status_idx" ON "handoff_jobs"("firm_id", "status");

-- CreateIndex
CREATE INDEX "handoff_jobs_firm_id_scheduled_at_idx" ON "handoff_jobs"("firm_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "service_benches_firm_id_scheduled_at_idx" ON "service_benches"("firm_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "spare_parts_firm_id_variety_category_idx" ON "spare_parts"("firm_id", "variety_category");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_orders" ADD CONSTRAINT "repair_orders_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instrument_items" ADD CONSTRAINT "instrument_items_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instrument_items" ADD CONSTRAINT "instrument_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "repair_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handoff_jobs" ADD CONSTRAINT "handoff_jobs_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handoff_jobs" ADD CONSTRAINT "handoff_jobs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "repair_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_benches" ADD CONSTRAINT "service_benches_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_parts" ADD CONSTRAINT "spare_parts_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
