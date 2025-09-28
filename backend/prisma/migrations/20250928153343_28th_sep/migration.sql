/*
  Warnings:

  - The `status` column on the `AccountabilityFee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `typeName` on the `LearningType` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `Milestone` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The `status` column on the `Milestone` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `title` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `channel` on the `Reminder` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - The `status` column on the `Reminder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.
  - You are about to alter the column `title` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `keyword` on the `VideoTag` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('SCHEDULED', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('LOCKED', 'REFUNDED', 'FORFEITED');

-- CreateEnum
CREATE TYPE "VideoHistoryStatus" AS ENUM ('STARTED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "AccountabilityFee" DROP CONSTRAINT "AccountabilityFee_projectId_fkey";

-- DropForeignKey
ALTER TABLE "AccountabilityFee" DROP CONSTRAINT "AccountabilityFee_userId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_milestoneId_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_userId_fkey";

-- DropForeignKey
ALTER TABLE "VideoTag" DROP CONSTRAINT "VideoTag_learningTypeId_fkey";

-- DropForeignKey
ALTER TABLE "VideoTag" DROP CONSTRAINT "VideoTag_videoId_fkey";

-- AlterTable
ALTER TABLE "AccountabilityFee" DROP COLUMN "status",
ADD COLUMN     "status" "FeeStatus" NOT NULL DEFAULT 'LOCKED';

-- AlterTable
ALTER TABLE "LearningType" ALTER COLUMN "typeName" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Milestone" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
DROP COLUMN "status",
ADD COLUMN     "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Reminder" ALTER COLUMN "channel" SET DATA TYPE VARCHAR(100),
DROP COLUMN "status",
ADD COLUMN     "status" "ReminderStatus" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(320);

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "VideoTag" ALTER COLUMN "keyword" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "UserVideoHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "videoId" INTEGER NOT NULL,
    "percentWatched" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "VideoHistoryStatus" NOT NULL DEFAULT 'STARTED',
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVideoHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserVideoHistory_userId_idx" ON "UserVideoHistory"("userId");

-- CreateIndex
CREATE INDEX "UserVideoHistory_videoId_idx" ON "UserVideoHistory"("videoId");

-- CreateIndex
CREATE INDEX "UserVideoHistory_status_idx" ON "UserVideoHistory"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserVideoHistory_userId_videoId_key" ON "UserVideoHistory"("userId", "videoId");

-- CreateIndex
CREATE INDEX "AccountabilityFee_userId_idx" ON "AccountabilityFee"("userId");

-- CreateIndex
CREATE INDEX "AccountabilityFee_projectId_idx" ON "AccountabilityFee"("projectId");

-- CreateIndex
CREATE INDEX "AccountabilityFee_status_idx" ON "AccountabilityFee"("status");

-- CreateIndex
CREATE INDEX "Milestone_projectId_idx" ON "Milestone"("projectId");

-- CreateIndex
CREATE INDEX "Milestone_status_idx" ON "Milestone"("status");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Reminder_userId_idx" ON "Reminder"("userId");

-- CreateIndex
CREATE INDEX "Reminder_milestoneId_idx" ON "Reminder"("milestoneId");

-- CreateIndex
CREATE INDEX "Reminder_status_idx" ON "Reminder"("status");

-- CreateIndex
CREATE INDEX "Reminder_sendDate_idx" ON "Reminder"("sendDate");

-- CreateIndex
CREATE INDEX "User_learningTypeId_idx" ON "User"("learningTypeId");

-- AddForeignKey
ALTER TABLE "VideoTag" ADD CONSTRAINT "VideoTag_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoTag" ADD CONSTRAINT "VideoTag_learningTypeId_fkey" FOREIGN KEY ("learningTypeId") REFERENCES "LearningType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountabilityFee" ADD CONSTRAINT "AccountabilityFee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountabilityFee" ADD CONSTRAINT "AccountabilityFee_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVideoHistory" ADD CONSTRAINT "UserVideoHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVideoHistory" ADD CONSTRAINT "UserVideoHistory_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
