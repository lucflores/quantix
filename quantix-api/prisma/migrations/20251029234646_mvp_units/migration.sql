/*
  Warnings:

  - Added the required column `step` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/

-- 1) Enum Unit (solo si no existía ya en tu historia)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Unit') THEN
    CREATE TYPE "Unit" AS ENUM ('UNIT','KG','LT','M');
  END IF;
END$$;

-- 2) Agregar columna unit con default temporal para poblar filas existentes
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "unit" "Unit" NOT NULL DEFAULT 'UNIT';

-- 3) Agregar step y updatedAt con defaults temporales para no fallar en tablas con datos
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "step" DECIMAL(10,3) NOT NULL DEFAULT 1.000,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW();

-- 4) Backfill de step según unit (ahora unit YA existe)
UPDATE "Product"
SET "step" = CASE "unit"
  WHEN 'UNIT' THEN 1.000
  WHEN 'KG'   THEN 0.001
  WHEN 'LT'   THEN 0.001
  WHEN 'M'    THEN 0.001
  ELSE 1.000
END;


