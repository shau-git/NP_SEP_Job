/*
  Warnings:

  - You are about to drop the column `requirments` on the `job_post` table. All the data in the column will be lost.
  - Added the required column `study_type` to the `education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employement_type` to the `experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "education" ADD COLUMN     "study_type" VARCHAR(9) NOT NULL;

-- AlterTable
ALTER TABLE "experience" ADD COLUMN     "employement_type" VARCHAR(9) NOT NULL;

-- AlterTable
ALTER TABLE "job_post" DROP COLUMN "requirments",
ADD COLUMN     "requirements" TEXT[];
