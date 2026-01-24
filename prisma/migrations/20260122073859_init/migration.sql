/*
  Warnings:

  - You are about to drop the column `employement_type` on the `experience` table. All the data in the column will be lost.
  - Added the required column `employment_type` to the `experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "experience" DROP COLUMN "employement_type",
ADD COLUMN     "employment_type" VARCHAR(9) NOT NULL;
