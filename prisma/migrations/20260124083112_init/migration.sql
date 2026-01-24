/*
  Warnings:

  - The primary key for the `notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `level` on the `skill` table. All the data in the column will be lost.
  - Added the required column `role` to the `company_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_email` to the `job_post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_user_id_fkey";

-- AlterTable
ALTER TABLE "company_member" ADD COLUMN     "role" VARCHAR(6) NOT NULL;

-- AlterTable
ALTER TABLE "job_post" ADD COLUMN     "contact_email" VARCHAR(65) NOT NULL;

-- AlterTable
ALTER TABLE "notification" DROP CONSTRAINT "notification_pkey",
ADD COLUMN     "company_id" INTEGER,
ADD COLUMN     "job_post_id" INTEGER,
ADD COLUMN     "sender_id" INTEGER,
ALTER COLUMN "notification_id" SET DATA TYPE SERIAL,
ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "message" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id");

-- AlterTable
ALTER TABLE "skill" DROP COLUMN "level";

-- CreateTable
CREATE TABLE "language" (
    "language_id" SMALLSERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "language" VARCHAR(20) NOT NULL,
    "proficiency" VARCHAR(6) NOT NULL,

    CONSTRAINT "language_pkey" PRIMARY KEY ("language_id")
);

-- CreateTable
CREATE TABLE "link" (
    "link_id" SMALLSERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "link_pkey" PRIMARY KEY ("link_id")
);

-- CreateIndex
CREATE INDEX "language_user_id_idx" ON "language"("user_id");

-- CreateIndex
CREATE INDEX "link_user_id_idx" ON "link"("user_id");

-- CreateIndex
CREATE INDEX "education_user_id_idx" ON "education"("user_id");

-- CreateIndex
CREATE INDEX "experience_user_id_idx" ON "experience"("user_id");

-- CreateIndex
CREATE INDEX "job_post_company_id_idx" ON "job_post"("company_id");

-- CreateIndex
CREATE INDEX "job_post_created_at_idx" ON "job_post"("created_at");

-- CreateIndex
CREATE INDEX "notification_user_id_idx" ON "notification"("user_id");

-- CreateIndex
CREATE INDEX "skill_user_id_idx" ON "skill"("user_id");

-- AddForeignKey
ALTER TABLE "language" ADD CONSTRAINT "language_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link" ADD CONSTRAINT "link_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_job_post_id_fkey" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("job_post_id") ON DELETE SET NULL ON UPDATE CASCADE;
