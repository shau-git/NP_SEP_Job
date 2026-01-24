/*
  Warnings:

  - You are about to drop the column `skill` on the `skill` table. All the data in the column will be lost.
  - Added the required column `name` to the `skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "skill" DROP COLUMN "skill",
ADD COLUMN     "name" VARCHAR(30) NOT NULL;
