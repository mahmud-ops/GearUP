/*
  Warnings:

  - Added the required column `providerId` to the `Rental_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rental_orders" ADD COLUMN     "providerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Rental_orders" ADD CONSTRAINT "Rental_orders_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
