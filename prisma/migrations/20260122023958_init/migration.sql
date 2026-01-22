/*
  Warnings:

  - The primary key for the `experience` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expereince_id` on the `experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "experience" DROP CONSTRAINT "experience_pkey",
DROP COLUMN "expereince_id",
ADD COLUMN     "experience_id" SMALLSERIAL NOT NULL,
ADD CONSTRAINT "experience_pkey" PRIMARY KEY ("experience_id");
