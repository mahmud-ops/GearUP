-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CONFIRMED', 'PICKEDUP', 'RETURNED');

-- AlterTable
ALTER TABLE "Rental_orders" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'CONFIRMED';
