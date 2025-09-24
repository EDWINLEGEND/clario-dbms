"use client";

import { useState } from "react";
import { CheckCircle, Circle, PlayCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Lesson } from "@/types";
import { cn, formatDuration } from "@/lib/utils";

interface SyllabusSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  onLessonSelect: (lesson: Lesson) => void;
  courseTitle?: string;
  className?: string;
}

export function SyllabusSidebar({
  lessons,
  currentLessonId,
  onLessonSelect,
  courseTitle,
  className
}: SyllabusSidebarProps) {
  // Calculate progress
  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (lesson.id === currentLessonId) {
      return <PlayCircle className="h-4 w-4 text-blue-600" />;
    } else {
      return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLessonStatus = (lesson: Lesson) => {
    if (lesson.isCompleted) return "completed";
    if (lesson.id === currentLessonId) return "current";
    return "pending";
  };

  return (
    <div className={cn("sticky top-6 h-fit", className)}>
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {courseTitle ? `${courseTitle} - Syllabus` : "Course Syllabus"}
          </CardTitle>
          
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {completedLessons}/{totalLessons} lessons
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% complete
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-300px)] px-6 pb-6">
            <div className="space-y-2">
              {sortedLessons.map((lesson, index) => {
                const status = getLessonStatus(lesson);
                const isActive = lesson.id === currentLessonId;
                
                return (
                  <div
                    key={lesson.id}
                    onClick={() => onLessonSelect(lesson)}
                    className={cn(
                      "group relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm",
                      {
                        "bg-blue-50 border-blue-200 shadow-sm": isActive,
                        "bg-green-50 border-green-200": lesson.isCompleted && !isActive,
                        "border-gray-200 hover:border-gray-300 hover:bg-gray-50": !isActive && !lesson.isCompleted,
                      }
                    )}
                  >
                    {/* Lesson Number & Icon */}
                    <div className="flex flex-col items-center gap-1 mt-0.5">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border text-xs font-medium">
                        {lesson.order}
                      </div>
                      {getLessonIcon(lesson)}
                    </div>

                    {/* Lesson Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className={cn(
                        "font-medium text-sm leading-tight line-clamp-2",
                        {
                          "text-blue-900": isActive,
                          "text-green-900": lesson.isCompleted && !isActive,
                          "text-gray-900": !isActive && !lesson.isCompleted,
                        }
                      )}>
                        {lesson.title}
                      </h4>
                      
                      {/* Duration */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(lesson.duration)}</span>
                      </div>

                      {/* Description (truncated) */}
                      {lesson.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {lesson.description}
                        </p>
                      )}

                      {/* Resources indicator */}
                      {lesson.resources && lesson.resources.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span>{lesson.resources.length} resource{lesson.resources.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-1">
                      {lesson.isCompleted && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                          Done
                        </Badge>
                      )}
                      {isActive && !lesson.isCompleted && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>

                    {/* Active indicator line */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Course Stats */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
              <div className="text-xs text-muted-foreground">Total Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedLessons}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}