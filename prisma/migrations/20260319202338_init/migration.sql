/*
  Warnings:

  - You are about to drop the column `manufacture` on the `Console` table. All the data in the column will be lost.
  - Added the required column `manufacturer` to the `Console` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Console" DROP COLUMN "manufacture",
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ALTER COLUMN "releasedate" SET DATA TYPE TIMESTAMP(0);

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "cover" TEXT NOT NULL DEFAULT 'no-image.png',
ALTER COLUMN "releasedate" SET DATA TYPE TIMESTAMP(0);
