/*
  Warnings:

  - You are about to alter the column `quantity` on the `InventoryMovement` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `cost` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `stock` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `minStock` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "InventoryMovement" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "cost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "stock" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "minStock" SET DATA TYPE DECIMAL(12,2);
