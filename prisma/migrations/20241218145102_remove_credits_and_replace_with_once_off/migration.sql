/*
  Warnings:

  - The values [CREDITS] on the enum `PlanType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `credits` on the `Package` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlanType_new" AS ENUM ('ONCE_OFF', 'SUBSCRIPTION');
ALTER TABLE "Package" ALTER COLUMN "planType" TYPE "PlanType_new" USING ("planType"::text::"PlanType_new");
ALTER TYPE "PlanType" RENAME TO "PlanType_old";
ALTER TYPE "PlanType_new" RENAME TO "PlanType";
DROP TYPE "PlanType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "credits";
