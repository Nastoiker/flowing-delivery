-- Additive migration. Never backfill historical purchase prices from today's catalog.
BEGIN;
ALTER TABLE "OrderFoods" ADD COLUMN IF NOT EXISTS "productTitle" varchar(255);
ALTER TABLE "OrderFoods" ADD COLUMN IF NOT EXISTS "unitPriceMinor" bigint;
COMMIT;
