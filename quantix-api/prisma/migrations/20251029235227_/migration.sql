-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "stock" SET DATA TYPE DECIMAL(14,3),
ALTER COLUMN "minStock" SET DATA TYPE DECIMAL(14,3),
ALTER COLUMN "step" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Product_active_name_idx" ON "Product"("active", "name");
