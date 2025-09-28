"use client";

import React from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  X,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | null;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructor: {
    id: number;
    name: string;
    learningType?: {
      typeName: string;
    };
  };
  lessons: Array<{
    id: string;
    order: number;
    video: {
      id: string;
      title: string;
      duration: number;
      tags: Array<{
        tag: string;
        compatibilityScore: number;
      }>;
    };
  }>;
  metadata: {
    totalLessons: number;
    estimatedDuration: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<CourseData> => {
  const response = await fetch(`http://localhost:4000${url}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch course: ${response.statusText}`);
  }
  return response.json();
};

export function CourseDetailModal({ isOpen, onClose, courseId }: CourseDetailModalProps) {
  const { accessToken } = useAuth();

  // Fetch course data using SWR
  const { data: course, error, isLoading } = useSWR(
    courseId ? `/courses/${courseId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const handleStartCourse = () => {
    if (course) {
      // Navigate to the course detail page
      window.location.href = `/learn/${course.id}`;
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-gradient-to-br from-black via-gray-900 to-black border border-white/20 shadow-2xl shadow-black/50 backdrop-blur-sm">
        {/* Loading State */}
        {isLoading && (
          <>
            <DialogHeader>
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4 bg-gradient-to-r from-white/10 to-white/5 animate-pulse" />
                <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-white/10 to-white/5 animate-pulse" />
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full bg-gradient-to-r from-white/10 to-white/5 animate-pulse" />
              <Skeleton className="h-4 w-full bg-gradient-to-r from-white/10 to-white/5 animate-pulse" />
              <Skeleton className="h-32 w-full bg-gradient-to-r from-white/10 to-white/5 animate-pulse" />
            </div>
          </>
        )}

        {/* Error State */}
        {error && (
          <>
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                Error Loading Course
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Failed to load course details. Please try again.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
              >
                Close
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Course Data */}
        {course && (
          <>
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {course.title}
              </DialogTitle>
              <DialogDescription className="text-white/80 text-base">
                Instructor: <span className="font-medium bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">{course.instructor.name}</span>
                {course.instructor.learningType && (
                  <Badge variant="outline" className="ml-2 border-white/30 text-white bg-white/5 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                    {course.instructor.learningType.typeName} Learning
                  </Badge>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Course Description */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-white/90 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Course Metadata */}
              <div className="flex items-center gap-6 text-sm text-white/70 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.metadata.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                  <Clock className="h-4 w-4" />
                  <span>{course.metadata.estimatedDuration}</span>
                </div>
              </div>

              {/* Lessons List */}
              <div>
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Course Lessons</h3>
                <ScrollArea className="h-64 w-full rounded-lg border border-white/20 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm shadow-inner">
                  <div className="p-4 space-y-2">
                    {course.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => (
                        <div
                          key={lesson.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                            "hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 cursor-pointer group",
                            "border border-transparent hover:border-white/30",
                            "hover:shadow-lg hover:shadow-white/5 hover:scale-[1.02]",
                            "backdrop-blur-sm"
                          )}
                        >
                          {/* Lesson Number */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center group-hover:from-white/30 group-hover:to-white/20 transition-all duration-300 shadow-sm">
                            <span className="text-sm font-medium text-white">
                              {lesson.order}
                            </span>
                          </div>

                          {/* Play Icon */}
                          <div className="flex-shrink-0">
                            <Play className="h-4 w-4 text-white/60 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                          </div>

                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white group-hover:text-white/90 transition-colors duration-300 truncate">
                              {lesson.video.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-200">
                                {formatDuration(lesson.video.duration)}
                              </span>
                              {lesson.video.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {lesson.video.tags.slice(0, 2).map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs border-white/20 text-white/70 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
                                    >
                                      {tag.tag}
                                    </Badge>
                                  ))}
                                  {lesson.video.tags.length > 2 && (
                                    <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-200">
                                      +{lesson.video.tags.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <DialogFooter className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 backdrop-blur-sm"
              >
                Close
              </Button>
              <Button
                onClick={handleStartCourse}
                className={cn(
                  "bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-100 hover:to-white transition-all duration-300",
                  "hover:shadow-xl hover:shadow-white/30 hover:scale-105",
                  "font-medium backdrop-blur-sm border border-white/20"
                )}
              >
                Start Course
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}