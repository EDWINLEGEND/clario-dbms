-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "courseId" TEXT;

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "thumbnailUrl" VARCHAR(500),
    "category" VARCHAR(100) NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "totalDuration" INTEGER NOT NULL DEFAULT 0,
    "enrollmentCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackCourse" (
    "order" INTEGER NOT NULL,
    "trackId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "TrackCourse_pkey" PRIMARY KEY ("trackId","courseId")
);

-- CreateIndex
CREATE INDEX "Track_category_idx" ON "Track"("category");

-- CreateIndex
CREATE INDEX "Track_level_idx" ON "Track"("level");

-- CreateIndex
CREATE INDEX "Track_isPublished_idx" ON "Track"("isPublished");

-- CreateIndex
CREATE INDEX "TrackCourse_trackId_idx" ON "TrackCourse"("trackId");

-- CreateIndex
CREATE INDEX "TrackCourse_courseId_idx" ON "TrackCourse"("courseId");

-- CreateIndex
CREATE INDEX "Project_courseId_idx" ON "Project"("courseId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackCourse" ADD CONSTRAINT "TrackCourse_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackCourse" ADD CONSTRAINT "TrackCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
