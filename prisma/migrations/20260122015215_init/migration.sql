/*
  Warnings:

  - You are about to alter the column `industry` on the `company` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(20)`.
  - You are about to drop the column `role` on the `company_member` table. All the data in the column will be lost.
  - You are about to drop the column `years` on the `education` table. All the data in the column will be lost.
  - Added the required column `expected_salary` to the `job_applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `job_post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary_end` to the `job_post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary_start` to the `job_post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company" ALTER COLUMN "industry" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "company_member" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "education" DROP COLUMN "years";

-- AlterTable
ALTER TABLE "job_applicant" ADD COLUMN     "expected_salary" SMALLINT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "job_post" ADD COLUMN     "benefit" TEXT[],
ADD COLUMN     "location" VARCHAR(6) NOT NULL,
ADD COLUMN     "salary_end" SMALLINT NOT NULL,
ADD COLUMN     "salary_start" SMALLINT NOT NULL;
