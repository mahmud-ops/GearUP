/*
  Warnings:

  - Added the required column `orderId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSessionId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "stripeSessionId" TEXT NOT NULL,
ALTER COLUMN "transactionId" DROP NOT NULL,
ALTER COLUMN "paidAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Rental_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
