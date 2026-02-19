/*
  Warnings:

  - You are about to drop the column `change` on the `StockMovement` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `StockMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('SALE', 'RESTOCK', 'DAMAGE', 'RETURN');

-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "change",
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "type" "MovementType" NOT NULL;
