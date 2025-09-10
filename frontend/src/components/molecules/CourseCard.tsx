"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { Clock, Users, Star, Play } from "lucide-react";
import { Course } from "@/types";
import { CustomBadge, LevelBadge } from "@/components/atoms/CustomBadge";
import { CustomAvatar } from "@/components/atoms/CustomAvatar";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { cn, formatDuration } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  progress?: number;
  showProgress?: boolean;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function CourseCard({
  course,
  progress,
  showProgress = false,
  variant = "default",
  className,
}: CourseCardProps) {
  const cardContent = (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
        variant === "featured" && "border-2 border-primary-200 dark:border-primary-800",
        className
      )}
      isPressable
    >
      {/* Course thumbnail */}
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="rounded-full bg-white/90 p-3">
              <Play className="h-6 w-6 text-primary-600" fill="currentColor" />
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2">
            <CustomBadge
              color="default"
              variant="solid"
              size="sm"
              className="bg-black/70 text-white"
              icon={Clock}
            >
              {formatDuration(course.duration)}
            </CustomBadge>
          </div>
          
          {/* Level badge */}
          <div className="absolute top-2 left-2">
            <LevelBadge level={course.level} />
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-3">
        {/* Course title */}
        <h3 className="font-semibold text-lg font-manrope line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {course.title}
        </h3>
        
        {/* Course description */}
        {variant !== "compact" && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}
        
        {/* Instructor */}
        <div className="flex items-center gap-2">
          <CustomAvatar
            name={course.instructor.name}
            src={course.instructor.avatar}
            size="sm"
          />
          <span className="text-sm font-medium">{course.instructor.name}</span>
        </div>
        
        {/* Progress bar */}
        {showProgress && progress !== undefined && (
          <ProgressBar
            value={progress}
            showPercentage
            animated
            className="mt-2"
          />
        )}
      </CardBody>

      <CardFooter className="flex items-center justify-between pt-0">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.enrollmentCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="text-right">
          {course.price === 0 ? (
            <span className="font-semibold text-green-600 dark:text-green-400">
              Free
            </span>
          ) : (
            <span className="font-semibold text-lg">
              ${course.price}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <Link href={`/courses/${course.id}`} className="block">
      {cardContent}
    </Link>
  );
}

// Compact variant for lists
export function CompactCourseCard({ course, progress, showProgress }: CourseCardProps) {
  return (
    <CourseCard
      course={course}
      progress={progress}
      showProgress={showProgress}
      variant="compact"
      className="h-auto"
    />
  );
}

// Featured variant for hero sections
export function FeaturedCourseCard({ course, progress, showProgress }: CourseCardProps) {
  return (
    <CourseCard
      course={course}
      progress={progress}
      showProgress={showProgress}
      variant="featured"
      className="border-primary-200 dark:border-primary-800"
    />
  );
}