"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Users, Star, Sparkles, Play, BookOpen } from "lucide-react";
import { Course } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatDuration } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  progress?: number;
  showProgress?: boolean;
  variant?: "default" | "compact" | "featured";
  className?: string;
  onCourseClick?: (courseId: string) => void;
}

// Animation variants for staggered entrance
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
};

// Circular progress indicator component
function CircularProgress({ value, size = 48 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-white/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-white transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{Math.round(value)}%</span>
      </div>
    </div>
  );
}

export function CourseCard({
  course,
  progress,
  showProgress = false,
  variant = "default",
  className,
  onCourseClick,
}: CourseCardProps) {
  const getLevelColor = (level: string) => {
    // All levels use white border and white text for black-and-white theme
    return "border-white/20 text-white bg-black";
  };

  const handleCardClick = () => {
    if (onCourseClick) {
      onCourseClick(course.id);
    }
  };

  const compatibilityScore = (course as any).compatibilityScore;

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-300",
          "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl",
          "hover:border-white/20 hover:from-white/10 hover:to-white/5",
          "shadow-xl hover:shadow-2xl",
          variant === "featured" && "border-2 border-white/30",
          className
        )}
        onClick={handleCardClick}
      >
        {/* Course thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-black" fill="currentColor" />
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-black border-0 shadow-lg">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(course.duration)}
            </Badge>
          </div>
          
          {/* Level badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="border-white/30 bg-black/50 backdrop-blur-sm text-white">
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </Badge>
          </div>

          {/* Compatibility Score - Circular */}
          {compatibilityScore !== undefined && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute top-3 right-3">
                    <CircularProgress value={compatibilityScore} size={52} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-black/90 backdrop-blur-sm border-white/20 text-white">
                  <p className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Personalized for your learning style
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-lg line-clamp-2 text-white group-hover:text-white/90 transition-colors">
            {course.title}
          </CardTitle>
          {variant !== "compact" && (
            <CardDescription className="line-clamp-2 text-white/70 text-sm mt-2">
              {course.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Category badge */}
          <Badge variant="outline" className="border-white/20 text-white bg-white/5">
            {course.category}
          </Badge>
          
          {/* Instructor with tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center ring-2 ring-white/5">
                    <span className="text-xs font-bold text-white">
                      {course.instructor.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-white truncate block">
                      {course.instructor.name}
                    </span>
                    <span className="text-xs text-white/60">Instructor</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/90 backdrop-blur-sm border-white/20 text-white">
                <p className="font-medium">{course.instructor.name}</p>
                <p className="text-xs text-white/70">{course.instructor.email}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Lesson count */}
          {course.lessons && course.lessons.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <BookOpen className="w-4 h-4" />
              <span>{course.lessons.length} lessons</span>
            </div>
          )}
          
          {/* Progress bar */}
          {showProgress && progress !== undefined && (
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-2">
                <span className="font-medium">Your Progress</span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-white h-2.5 rounded-full shadow-lg"
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between border-t border-white/10 pt-4">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="font-medium">{course.enrollmentCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-white text-white" />
              <span className="font-medium">{course.rating.toFixed(1)}</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white bg-white/5 hover:bg-white hover:text-black transition-all duration-200 font-medium"
          >
            View Course
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}