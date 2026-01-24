/*
  Warnings:

  - You are about to drop the column `name` on the `skill` table. All the data in the column will be lost.
  - Added the required column `skill` to the `skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "skill" DROP COLUMN "name",
ADD COLUMN     "skill" VARCHAR(30) NOT NULL;
