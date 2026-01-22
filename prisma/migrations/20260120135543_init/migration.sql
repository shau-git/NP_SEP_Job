/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user" (
    "user_id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "image" TEXT,
    "email" VARCHAR(65) NOT NULL,
    "password" VARCHAR(255),
    "summary" VARCHAR(500),

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "skill" (
    "skill_id" SMALLSERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "skill" VARCHAR(30) NOT NULL,
    "level" VARCHAR(12) NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("skill_id")
);

-- CreateTable
CREATE TABLE "experience" (
    "expereince_id" SMALLSERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "company" VARCHAR(30) NOT NULL,
    "role" VARCHAR(30) NOT NULL,
    "years" VARCHAR(3) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "description" VARCHAR(500) NOT NULL,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("expereince_id")
);

-- CreateTable
CREATE TABLE "education" (
    "education_id" SMALLSERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "institution" VARCHAR(30) NOT NULL,
    "fieldOfStudy" VARCHAR(30) NOT NULL,
    "qualification" VARCHAR(16) NOT NULL,
    "years" SMALLINT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "description" VARCHAR(500) NOT NULL,

    CONSTRAINT "education_pkey" PRIMARY KEY ("education_id")
);

-- CreateTable
CREATE TABLE "company" (
    "company_id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "image" TEXT,
    "industry" VARCHAR(30) NOT NULL,
    "location" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),

    CONSTRAINT "company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "company_member" (
    "company_member_id" SMALLSERIAL NOT NULL,
    "company_id" SMALLINT NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "role" VARCHAR(30) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "company_member_pkey" PRIMARY KEY ("company_member_id")
);

-- CreateTable
CREATE TABLE "job_post" (
    "job_post_id" SMALLSERIAL NOT NULL,
    "company_id" SMALLINT NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "requirments" TEXT[],
    "responsibilities" TEXT[],
    "employment_type" VARCHAR(9) NOT NULL,
    "experience" VARCHAR(3) NOT NULL,
    "created_at" DATE NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "job_post_pkey" PRIMARY KEY ("job_post_id")
);

-- CreateTable
CREATE TABLE "job_applicant" (
    "applicant_id" SMALLSERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "job_post_id" SMALLINT NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    "applied_date" DATE NOT NULL,
    "interview_date" DATE,
    "interview_time" VARCHAR(7),

    CONSTRAINT "job_applicant_pkey" PRIMARY KEY ("applicant_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "notification_id" SMALLSERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "type" VARCHAR(9) NOT NULL,
    "message" VARCHAR(100) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATE NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "experience_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_member" ADD CONSTRAINT "company_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_member" ADD CONSTRAINT "company_member_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applicant" ADD CONSTRAINT "job_applicant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applicant" ADD CONSTRAINT "job_applicant_job_post_id_fkey" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("job_post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
