"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users, Star } from "lucide-react";
import { Course } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const getLevelColor = (level: string) => {
    // All levels use white border and white text for black-and-white theme
    return "border-white/20 text-white bg-black";
  };

  return (
    <Link href={`/learn/${course.id}`} className="block">
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
          "border-white/10 bg-black",
          variant === "featured" && "border-2 border-white",
          className
        )}
      >
        {/* Course thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-white text-black border-0">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(course.duration)}
            </Badge>
          </div>
          
          {/* Level badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className={getLevelColor(course.level)}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="font-bold text-lg line-clamp-2 text-white group-hover:text-white/80 transition-colors">
            {course.title}
          </CardTitle>
          {variant !== "compact" && (
            <CardDescription className="line-clamp-2 text-white/80">
              {course.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Category badge */}
          <Badge variant="outline" className="mb-3 border-white/20 text-white bg-black">
            {course.category}
          </Badge>
          
          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {course.instructor.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm font-medium text-white">
              {course.instructor.name}
            </span>
          </div>
          
          {/* Progress bar */}
          {showProgress && progress !== undefined && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrollmentCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-white text-white" />
              <span>{course.rating}</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white bg-black hover:bg-white hover:text-black transition-all duration-200"
          >
            View Course
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}